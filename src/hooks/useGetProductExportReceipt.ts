
import { getOneProductExportReceiptFn,  } from "@/api/services/productApi";
import { ProductExportReceiptResponse,  } from "@/types/ProductType";
import { InputType } from "@/types/Shared";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetProductExportReceipt = (id:string,{
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<ProductExportReceiptResponse, AxiosError>({
      queryKey: ['ProductExportReceipt', sorting, columnFilters, pagination],
      queryFn: () =>
        getOneProductExportReceiptFn(id,{
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let exportReceiptData = data?.data.data;
    const pageMeta = data?.data.pageMeta;

    return {pageMeta, exportReceiptData,isFetching, isLoading };
  };