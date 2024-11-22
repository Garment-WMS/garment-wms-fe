import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getOneProductionBatchById } from '@/api/services/productionBatch';
import { ApiResponse } from '@/types/ApiResponse';

export const useGetProductionBatchById = (id: string) => {
  const { data, status, isPending, isError, isSuccess } = useQuery<ApiResponse, AxiosError>({
    queryKey: ['productionBatch', id],
    queryFn: () => getOneProductionBatchById(id),
    enabled: !!id
  });

  return { data, status, isPending, isError, isSuccess };
};
