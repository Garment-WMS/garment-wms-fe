import { getAllImportRequestFn, getMyImportRequestFn } from '@/api/purchase-staff/importRequestApi';
import { UseImportRequestsInput, UseImportRequestsResponse } from '@/types/ImportRequestType';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetImportRequests = ({
  sorting,
  columnFilters,
  pagination
}: UseImportRequestsInput) => {
  const {
    data,
    isLoading: isimportRequestLoading,
    isFetching
  } = useQuery<UseImportRequestsResponse, AxiosError>({
    queryKey: ['ImportRequest', sorting, columnFilters, pagination],
    queryFn: () =>
      getAllImportRequestFn({
        sorting,
        columnFilters,
        pagination
      })
  });
  const importRequestData = data?.data;
  const pageMeta = data?.pageMeta;

  return { pageMeta, importRequestData, isFetching, isimportRequestLoading };
};



export const useGetMyImportRequests = ({
  sorting,
  columnFilters,
  pagination
}: UseImportRequestsInput) => {
  const {
    data,
    isLoading: isimportRequestLoading,
    isFetching
  } = useQuery<UseImportRequestsResponse, AxiosError>({
    queryKey: ['MyImportRequest', sorting, columnFilters, pagination],
    queryFn: () =>
      getMyImportRequestFn({
        sorting,
        columnFilters,
        pagination
      })
  });
  const importRequestData = data?.data;
  const pageMeta = data?.pageMeta;

  return { pageMeta, importRequestData, isFetching, isimportRequestLoading };
};
