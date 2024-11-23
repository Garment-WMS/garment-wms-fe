import { getAllExportRequestFn } from '@/api/services/exportRequestApi';

import { InputType } from '@/types/Shared';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetMaterialExportRequest = ({ sorting, columnFilters, pagination }: InputType) => {
  const { data, isLoading, isFetching } = useQuery<any, AxiosError>({
    queryKey: ['materialExportRequest', sorting, columnFilters, pagination],
    queryFn: () =>
      getAllExportRequestFn({
        sorting,
        columnFilters,
        pagination
      })
  });

  let exportRequestData = data?.data;
  const pageMeta = data?.pageMeta;

  return { pageMeta, exportRequestData, isFetching, isLoading };
};
