import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VariantTable from './components/VariantTable';
import ImportRequestTable from './components/ImportRequestTable';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { materialApi } from '@/api/services/materialApi';
import Loading from '@/components/common/Loading';
import { MaterialReceipt, MaterialVariant } from '@/types/MaterialTypes';
import placeHolder from '@/assets/images/null_placeholder.jpg';
import General from './components/General';
import { useDispatch } from 'react-redux';
import { actions } from '../slice';

const MaterialDetails = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [material, setMaterial] = useState<MaterialVariant>();
  const [materialReceipt, setMaterialReceipt] = useState<MaterialReceipt>();
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  const fetchMaterial = async (id: string) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await axios(materialApi.getOne(id));
      console.log('res', res);
      if (res.status === 200) {
        setMaterial(res.data.data);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to fetch material',
        title: 'Error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const fetchMaterialReceipt = async (id: string) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await axios(materialApi.getOneReceipt(id));
      if (res.status === 200) {
        setMaterial(res.data.data);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to fetch material receipt',
        title: 'Error'
      });
    } finally {
      setIsLoading(false);
    }
  }
  const fetchMaterialAndReceipt = async (id: string) => {
    if (!id) return;
    setIsLoading(true);
  
    try {
      // Use Promise.all to fetch both material and material receipt in parallel
      const [materialRes, materialReceiptRes] = await Promise.all([
        axios(materialApi.getOne(id)),
        axios(materialApi.getOneReceipt(id)),
      ]);
  
      // Check both responses
      if (materialRes.status === 200 && materialReceiptRes.status === 200) {
        // Assuming you want to set both material and receipt data separately
        setMaterial(materialRes.data.data);
        dispatch(actions.setMaterialVariants(materialRes.data.data));
        setMaterialReceipt(materialReceiptRes.data.data); // Assuming you have a state for receipt
        console.log('materialRes', materialReceipt);
        console.log('material', material)
      } else {
        // Handle failure cases for individual requests
        toast({
          variant: 'destructive',
          description: 'Failed to fetch material or material receipt',
          title: 'Error',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to fetch material and receipt',
        title: 'Error',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (id) {
      fetchMaterialAndReceipt(id);
    }
  }, [id]);
  const handleUpdateMaterial = () => {
    navigate(`/material-variant/update/${id}`);
  }
  return (
    <>
    {isLoading ? (
      <div className="w-full flex justify-center items-center">
        <Loading />
      </div>
    ) : material ? (
      <div className="container mx-auto p-6 w-full bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Material Variant Details</h1>
          <div className="space-x-2">
            <Button
            onClick={handleUpdateMaterial}
            variant="secondary">Update material</Button>
            {/* <Button variant="secondary">Replenish</Button>
            <Button variant="secondary">Print Labels</Button> */}
          </div>
        </div>
  
        <div className="">
          <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">{material?.name || 'No name available'}</h2>
          <div className="w-20 h-20">
              {material?.image ? (
                <img src={material?.image} alt="" />
              ) : (
                <img src={placeHolder} alt="Placeholder" />
              )}
            </div>
          </div>
  
          <Tabs value={activeTab} onValueChange={setActiveTab} className="">
            <TabsList className="gap-4">
              <TabsTrigger value="general">General Information</TabsTrigger>
              <TabsTrigger value="attributes">Attributes & Variants</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-4">
              <General materialVariant={material} />
            </TabsContent>
            <TabsContent value="attributes">
              <VariantTable materialPackage={material?.materialPackage} />
            </TabsContent>
            <TabsContent value="inventory">
              <ImportRequestTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    ) : (
      <div className="w-full flex justify-center items-center">
        <p className="text-lg font-semibold">Nothing to display</p>
      </div>
    )}
  </>
  
  );
};

export default MaterialDetails;
