import { getAllProductVariantDisposeFn, getAllProductVariantFn, getAllProductVariantHasReceiptFn } from "@/api/services/productApi";
import { ProductVariantResponse } from "@/types/ProductType";
import { InputType } from "@/types/Shared";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetProductVariants = ({
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<ProductVariantResponse, AxiosError>({
      queryKey: ['ProductVariant', sorting, columnFilters, pagination],
      queryFn: () =>
        getAllProductVariantFn({
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let productList = data?.data.data;
    const pageMeta = data?.data.pageMeta;

    // if(AxiosError.){
    //     materialList = [];

    // }

    return {pageMeta, productList,isFetching, isLoading };
  };
  export const useGetProductVariantsDispose = ({
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<ProductVariantResponse, AxiosError>({
      queryKey: ['ProductVariantDispose', sorting, columnFilters, pagination],
      queryFn: () =>
        getAllProductVariantDisposeFn({
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let productList = data?.data.data;
    const pageMeta = data?.data.pageMeta;

    // if(AxiosError.){
    //     materialList = [];

    // }

    return {pageMeta, productList,isFetching, isLoading };
  };

  export const useGetProductVariantsWithReceipt = ({
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<ProductVariantResponse, AxiosError>({
      queryKey: ['ProductVariant', sorting, columnFilters, pagination],
      queryFn: () =>
        getAllProductVariantHasReceiptFn({
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let productList = data?.data.data;
    const pageMeta = data?.data.pageMeta;

    // if(AxiosError.){
    //     materialList = [];

    // }

    return {pageMeta, productList,isFetching, isLoading };
  };