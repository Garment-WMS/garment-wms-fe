import { getOneMaterialImportReceiptFn } from "@/api/services/materialApi";
import { MaterialImportReceiptResponse } from "@/types/MaterialTypes";
import { InputType } from "@/types/Shared";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetMaterialImportReceipt = (id:string,{
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<MaterialImportReceiptResponse, AxiosError>({
      queryKey: ['MaterialVariant', sorting, columnFilters, pagination],
      queryFn: () =>
        getOneMaterialImportReceiptFn(id,{
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let importReceiptData = data?.data.data;
    const pageMeta = data?.data.pageMeta;

    return {pageMeta, importReceiptData,isFetching, isLoading };
  };