import { getAllExportReceiptFn } from "@/api/services/exportReceiptApi";
import { UseExportReceiptResponse } from "@/types/ExportReceipt";
import { InputType } from "@/types/Shared";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetAllExportReceipt = ({
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<UseExportReceiptResponse, AxiosError>({
      queryKey: ['MaterialExportReceipt', sorting, columnFilters, pagination],
      queryFn: () =>
        getAllExportReceiptFn({
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let exportReceiptsList = data?.data.data;
    const pageMeta = data?.data.pageMeta; // Assuming the correct property is 'meta'

    // if(AxiosError.){
    //     materialList = [];

    // }

    return {pageMeta, exportReceiptsList,isFetching, isLoading };
  };
  