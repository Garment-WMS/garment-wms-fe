import { getAllMaterialDispose, getAllMaterialFn, getAllMaterialHasReceiptFn, getOneMaterialDisposeReceiptFn, getOneMaterialReceiptFn } from '@/api/services/materialApi';
import { MaterialReceiptResponse, MaterialVariantResponse } from '@/types/MaterialTypes';
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

  export const useGetMaterialWithReceipt = ({
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<MaterialVariantResponse, AxiosError>({
      queryKey: ['MaterialVariantWithReceipt', sorting, columnFilters, pagination],
      queryFn: () =>
        getAllMaterialHasReceiptFn({
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

  export const useGetMaterialReceipt = (id:string,{
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<MaterialReceiptResponse, AxiosError>({
      queryKey: ['MaterialReceipt', sorting, columnFilters, pagination],
      queryFn: () =>
        getOneMaterialReceiptFn(id,{
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let receiptData = data?.data.data;
    const pageMeta = data?.data.pageMeta;

    return {pageMeta, receiptData,isFetching, isLoading };
  };

  export const useGetMaterialDisposeReceipt = (id:string,{
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<MaterialReceiptResponse, AxiosError>({
      queryKey: ['MaterialDisposeReceipt', sorting, columnFilters, pagination],
      queryFn: () =>
        getOneMaterialDisposeReceiptFn(id,{
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let receiptData = data?.data.data;
    const pageMeta = data?.data.pageMeta;

    return {pageMeta, receiptData,isFetching, isLoading };
  };
  

  export const useGetMaterialDispose = ({
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<MaterialVariantResponse, AxiosError>({
      queryKey: ['MaterialVariantDispose', sorting, columnFilters, pagination],
      queryFn: () =>
        getAllMaterialDispose({
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