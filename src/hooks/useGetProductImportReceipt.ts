
import { getOneProductImportReceiptFn } from "@/api/services/productApi";
import { ProductImportReceiptResponse } from "@/types/ProductType";
import { InputType } from "@/types/Shared";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetProductImportReceipt = (id:string,{
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<ProductImportReceiptResponse, AxiosError>({
      queryKey: ['ProductImportReceipt', sorting, columnFilters, pagination],
      queryFn: () =>
        getOneProductImportReceiptFn(id,{
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let importReceiptData = data?.data.data;
    const pageMeta = data?.data.pageMeta;

    return {pageMeta, importReceiptData,isFetching, isLoading };
  };