import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import MaterialVariantSelector from '../slice/selector';
import Loading from '@/components/common/Loading';
import axios from 'axios';
import { materialApi } from '@/api/services/materialApi';
import { toast } from '@/hooks/use-toast';
import { actions } from '../slice';
import placeHolder from '@/assets/images/null_placeholder.jpg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaterialVariant } from '@/types/MaterialTypes';
import EditGeneral from './components/EditGeneral';

type Props = {};

const MaterialVariantUpdate = (props: Props) => {
  const [activeTab, setActiveTab] = useState('general');
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const materialVariants: MaterialVariant = useSelector(MaterialVariantSelector.materialVariant);
  console.log('materialVariants', materialVariants);
  const fetchMaterial = async (id: string) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await axios(materialApi.getOne(id));
      if (res.status === 200) {
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
  useEffect(() => {
    if (materialVariants === null && id) {
      fetchMaterial(id);
    }
  }, []);

  function onSubmit() {
    return null;
  }
  return (
    <>
      {isLoading ? (
        <div className="w-full flex justify-center items-center">
          <Loading />
        </div>
      ) : materialVariants ? (
        <div className="container mx-auto p-6 w-full bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Update Material Variant Details</h1>
          </div>

          <div className="">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">
                {materialVariants?.name || 'No name available'}
              </h2>
              <div className="w-20 h-20">
                {materialVariants?.image ? (
                  <img src={materialVariants?.image} alt="" />
                ) : (
                  <img src={placeHolder} alt="Placeholder" />
                )}
              </div>
            </div>

            <EditGeneral onSubmit={onSubmit} materialVariant={materialVariants} />
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

export default MaterialVariantUpdate;
