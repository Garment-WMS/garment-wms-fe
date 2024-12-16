import { getAllMaterialFn, getAllMaterialHasReceiptFn, getOneMaterialDisposedHistoryFn, getOneMaterialHistoryFn, getOneMaterialReceiptFn } from '@/api/services/materialApi';
import { MaterialHistoryResponse, MaterialReceiptResponse, MaterialVariantResponse } from '@/types/MaterialTypes';
import { InputType } from '@/types/Shared';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';


export const useGetMaterialHistory = (id: string,{
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<MaterialHistoryResponse, AxiosError>({
      queryKey: ['MaterialVariantHistory', sorting, columnFilters, pagination],
      queryFn: () =>
        getOneMaterialHistoryFn(id,{
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let historyReceiptList = data?.data.data;
    const pageMeta = data?.data.pageMeta;

    // if(AxiosError.){
    //     materialList = [];

    // }

    return {pageMeta, historyReceiptList,isFetching, isLoading };
  };

  export const useGetMaterialDisposedHistory = (id: string,{
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<MaterialHistoryResponse, AxiosError>({
      queryKey: ['MaterialVariantHistory', sorting, columnFilters, pagination],
      queryFn: () =>
        getOneMaterialDisposedHistoryFn(id,{
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let historyReceiptList = data?.data.data;
    const pageMeta = data?.data.pageMeta;

    // if(AxiosError.){
    //     materialList = [];

    // }

    return {pageMeta, historyReceiptList,isFetching, isLoading };
  };
//   export const useGetMaterialWithReceipt = ({
//     sorting,
//     columnFilters,
//     pagination,
//   }: InputType) => {
        
//     const {
//       data,
//       isLoading,
//       isFetching
//     } = useQuery<MaterialVariantResponse, AxiosError>({
//       queryKey: ['MaterialVariantWithReceipt', sorting, columnFilters, pagination],
//       queryFn: () =>
//         getAllMaterialHasReceiptFn({
//           sorting,
//           columnFilters,
//           pagination,
//         }),

//     });
//     let materialList = data?.data.data;
//     const pageMeta = data?.data.pageMeta;

//     // if(AxiosError.){
//     //     materialList = [];

//     // }

//     return {pageMeta, materialList,isFetching, isLoading };
//   };

//   export const useGetMaterialReceipt = (id:string,{
//     sorting,
//     columnFilters,
//     pagination,
//   }: InputType) => {
        
//     const {
//       data,
//       isLoading,
//       isFetching
//     } = useQuery<MaterialReceiptResponse, AxiosError>({
//       queryKey: ['MaterialReceipt', sorting, columnFilters, pagination],
//       queryFn: () =>
//         getOneMaterialReceiptFn(id,{
//           sorting,
//           columnFilters,
//           pagination,
//         }),

//     });
//     let receiptData = data?.data.data;
//     const pageMeta = data?.data.pageMeta;

//     return {pageMeta, receiptData,isFetching, isLoading };
//   };