import { getAllMaterialFn } from '@/api/services/materialApi';
import { MaterialVariantResponse } from '@/types/MaterialTypes';
import { InputType } from '@/types/Shared';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';


export const useGetMaterial = ({
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<MaterialVariantResponse, AxiosError>({
      queryKey: ['MaterialVariant', sorting, columnFilters, pagination],
      queryFn: () =>
        getAllMaterialFn({
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let materialList = data?.data.data;
    const pageMeta = data?.data.pageMeta;

    // if(AxiosError.){
    //     materialList = [];

    // }

    return {pageMeta, materialList,isFetching, isLoading };
  };