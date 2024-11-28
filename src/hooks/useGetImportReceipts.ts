import { getAllImportReceiptFn, getMyImportReceiptFn } from '@/api/ImportReceiptApi';
import { UseImportReceiptInput, UseImportReceiptResponse } from '@/types/ImportReceipt';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetImportReceipts = ({
  sorting,
  columnFilters,
  pagination
}: UseImportReceiptInput) => {
  const {
    data,
    isLoading: isimportRequestLoading,
    isFetching
  } = useQuery<any, AxiosError>({
    queryKey: ['ImportReceipt', sorting, columnFilters, pagination],
    queryFn: () =>
      getAllImportReceiptFn({
        sorting,
        columnFilters,
        pagination
      })
  });
  const importReceiptData = data?.data;
  const pageMeta = data?.pageMeta;
  return { pageMeta, importReceiptData, isFetching, isimportRequestLoading };
};


export const useGetMyImportReceipts = ({
  sorting,
  columnFilters,
  pagination
}: UseImportReceiptInput) => {
  const {
    data,
    isLoading: isimportRequestLoading,
    isFetching
  } = useQuery<any, AxiosError>({
    queryKey: ['MyImportReceipt', sorting, columnFilters, pagination],
    queryFn: () =>
      getMyImportReceiptFn({
        sorting,
        columnFilters,
        pagination
      })
  });
  const importReceiptData = data?.data;
  const pageMeta = data?.pageMeta;
  return { pageMeta, importReceiptData, isFetching, isimportRequestLoading };
};
