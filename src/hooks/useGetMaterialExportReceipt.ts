import { getOneMaterialExportReceiptFn } from "@/api/services/materialApi";
import { MaterialExportReceiptResponse } from "@/types/MaterialTypes";
import { InputType } from "@/types/Shared";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetMaterialExportReceipt = (id:string,{
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<MaterialExportReceiptResponse, AxiosError>({
      queryKey: ['tMaterialExportReceipt', sorting, columnFilters, pagination],
      queryFn: () =>
        getOneMaterialExportReceiptFn(id,{
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let exportReceiptData = data?.data.data;
    const pageMeta = data?.data.pageMeta;

    return {pageMeta, exportReceiptData,isFetching, isLoading };
  };