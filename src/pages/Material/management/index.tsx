import React, { useEffect, useState } from 'react'
import MaterialManagementData from './components/MaterialManagementData'
import MaterialStatistics from './components/MaterialStatistics'
import axios from 'axios';
import { materialTypeApi } from '@/api/services/materialApi';
import { Material } from '@/types/MaterialTypes';
import { toast } from '@/hooks/use-toast';
import privateCall from '@/api/PrivateCaller';

type Props = {}
interface filterType {
    label: string;
    value: string;
  }
const MaterialManagement = (props: Props) => {
    const [materialType, setMaterialType] = useState<Material[]>([]);
    const [materialTypesToRender, setMaterialTypesToRender] = useState<filterType[]>([]); // Correct initialization
    const fetchMaterialTypes = async () => {
        try {
          const materialTypeResponse = await privateCall(materialTypeApi.getAll());
          const materialTypes = materialTypeResponse.data.data.map((item: Material) => ({
            label: item.name, // This will be used as the label (e.g., "Farbic", "Button")
            value: item.name // This will be used as the value (e.g., the id of the material type)
          }));
          setMaterialTypesToRender(materialTypes);
          setMaterialType(materialTypeResponse.data.data);
        } catch (error) {
          toast({
            variant: 'destructive',
            description: 'Failed to fetch material types',
            title: 'Error'
          });
          console.error('Failed to fetch material types:', error);
        }
      };
    
      useEffect(() => {
        fetchMaterialTypes();
      }, []);
  return (
    <div className='h-full w-full px-4 flex flex-col gap-4'>
        <MaterialStatistics materialTypeList={materialType}/>
        <MaterialManagementData materialTypes={materialTypesToRender}/>
    </div>
  )
}

export default MaterialManagement