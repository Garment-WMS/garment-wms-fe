import { getAllImportRequestFn } from '@/api/purchase-staff/importRequestApi';
import { UseUsersInput } from '@/types/DemoUser';
import { UseImportRequestsInput, UseImportRequestsResponse } from '@/types/ImportRequestType';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import usePrivateCall from './usePrivateCall';

export const useGetImportRequests = ({
  sorting,
  columnFilters,
  pagination
}: UseImportRequestsInput) => {
  const axios = usePrivateCall();
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
