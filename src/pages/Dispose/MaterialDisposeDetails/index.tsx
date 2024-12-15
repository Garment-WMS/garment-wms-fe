import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImportRequestTable from './components/ImportRequestTable';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { materialApi } from '@/api/services/materialApi';
import Loading from '@/components/common/Loading';
import {
  MaterialExportReceipt,
  MaterialImportReceipt,
  MaterialReceipt,
  MaterialVariant
} from '@/types/MaterialTypes';
import placeHolder from '@/assets/images/null_placeholder.jpg';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Label } from '@/components/ui/Label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

import privateCall from '@/api/PrivateCaller';
import { actions } from './slice';
import ImageUploadWithDialog from './components/ImageUpload';
import General from './components/General';
import VariantTable from './components/VariantTable';
import Attributes from './components/Attributes';
import HistoryTable from './components/HistoryTable';
import ReceiptTable from './components/ReceiptTable';


const MaterialDisposeDetails = () => {
  const { id, receiptId } = useParams<{ id: string; receiptId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [material, setMaterial] = useState<MaterialVariant>();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchMaterial = async (id: string) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await privateCall(materialApi.getOneDispose(id));
      if (res.status === 200) {
        setMaterial(res.data.data);
        dispatch(actions.setMaterialVariants(res.data.data));
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

  if (!id) {
    return (
      <div className="w-full flex justify-center items-center">
        <p className="text-lg font-semibold">Nothing to display</p>
      </div>
    );
  }
  // const fetchMaterialReceipt = async (id: string) => {
  //   if (!id) return;
  //   setIsLoading(true);
  //   try {
  //     const res = await axios(materialApi.getOneReceipt(id));
  //     if (res.status === 200) {
  //       setMaterial(res.data.data);
  //     }
  //   } catch (error) {
  //     toast({
  //       variant: 'destructive',
  //       description: 'Failed to fetch material receipt',
  //       title: 'Error'
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const fetchMaterialAndReceipt = async (id: string) => {
  //   if (!id) return;
  //   setIsLoading(true);

  //   try {
  //     // Use Promise.all to fetch both material and material receipt in parallel
  //     const [materialRes, materialImportReceiptRes, materialExportReceiptRes] = await Promise.all([
  //       axios(materialApi.getOne(id)),
  //       axios(materialApi.getOneImportReceipt(id)),
  //       axios(materialApi.getOneExportReceipt(id))

  //     ]);

  //     // Check both responses
  //     if (materialRes.status === 200 && materialImportReceiptRes.status === 200 && materialExportReceiptRes.status === 200) {
  //       setMaterial(materialRes.data.data);
  //       dispatch(actions.setMaterialVariants(materialRes.data.data));
  //       setMaterialImportReceipt(materialImportReceiptRes.data.data);
  //       setMaterialImportReceipt(materialImportReceiptRes.data.data)
  //     } else {
  //       // Handle failure cases for individual requests
  //       toast({
  //         variant: 'destructive',
  //         description: 'Failed to fetch material or material receipt',
  //         title: 'Error'
  //       });
  //     }
  //   } catch (error) {
  //     toast({
  //       variant: 'destructive',
  //       description: 'Failed to fetch material and receipt',
  //       title: 'Error'
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    if (id) {
      fetchMaterial(id);
    }
  }, [id]);

  const handleUploadPhoto = async (file: File) => {
    if (!id) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const config = {
        'Content-Type': 'multipart/form-data'
      };
      await privateCall(materialApi.addImage(id, formData, config));
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to upload image',
        title: 'Error'
      });
    }
  };

  const getMaterialPackage = () => {
    if (!material) {
      return [];
    }
    const materialPackage = material.materialPackage || [];
    const formatMaterialPackage = materialPackage.map((item) => ({
      ...item,
      uom: material.material.materialUom
    }));
    return formatMaterialPackage;
  };
  const formatMaterialPackage = getMaterialPackage();

  const attribute = material?.materialAttribute;
  return (
    <>
      {isLoading ? (
        <div className="w-full flex justify-center items-center">
          <Loading />
        </div>
      ) : material ? (
        <div className="container mx-auto p-6 w-full bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Disposed Material Variant Details</h1>
          </div>

          <div className="">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-primary font-semibold">
                {material?.name || 'No name available'}
              </h2>
              {/* <div className="w-28 h-28">
              {material?.image ? (
                <img src={material?.image} alt="" />
              ) : (
                <img src={placeHolder} alt="Placeholder" />
              )}
            </div> */}
              <ImageUploadWithDialog
                initialImage={material.image || undefined}
                onImageUpload={handleUploadPhoto}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Accordion
                type="multiple"
                defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5']}
                className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <Label className="text-xl">General Information</Label>
                  </AccordionTrigger>
                  <AccordionContent>
                    <General materialVariant={material} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    <Label className="text-xl">Packages</Label>
                  </AccordionTrigger>
                  <AccordionContent>
                    <VariantTable materialPackage={formatMaterialPackage} />
                  </AccordionContent>
                </AccordionItem>
                {/* <AccordionItem value="item-3">
                  <AccordionTrigger>
                    <Label className="text-xl">Attributes</Label>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Attributes attributes={attribute} />
                  </AccordionContent>
                </AccordionItem> */}
                {/* <AccordionItem value="item-4">
                <AccordionTrigger>
                    <Label className="text-xl">History</Label>
                  </AccordionTrigger>
                  <AccordionContent>
                    <HistoryTable id={id} />
                  </AccordionContent>
                </AccordionItem> */}
                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    <Label className="text-xl">Receipt</Label>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ReceiptTable receiptId={receiptId || null} id={id} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
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

export default MaterialDisposeDetails;
