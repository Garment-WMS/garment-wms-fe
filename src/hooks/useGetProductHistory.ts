import { getOneProductHistory, getOneProductHistoryDisposed } from "@/api/services/productApi";
import { ProductHistoryResponse, ProductReceiptResponse } from "@/types/ProductType";
import { InputType } from "@/types/Shared";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetProductHistory = (id: string,{
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<ProductHistoryResponse, AxiosError>({
      queryKey: ['ProductVariantHistory', sorting, columnFilters, pagination],
      queryFn: () =>
        getOneProductHistory(id,{
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

  export const useGetProductHistoryDisposed = (id: string,{
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<ProductHistoryResponse, AxiosError>({
      queryKey: ['ProductVariantHistoryDisposed', sorting, columnFilters, pagination],
      queryFn: () =>
        getOneProductHistoryDisposed(id,{
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