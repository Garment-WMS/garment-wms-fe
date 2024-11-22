import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getProductionPlanById } from '@/api/services/productionPlan';
import { ApiResponse } from '@/types/ApiResponse';

export const useGetProductionPlanById = (id: string) => {
  const { data, status, isPending, isError, isSuccess } = useQuery<ApiResponse, AxiosError>({
    queryKey: ['productionPlan', id],
    queryFn: () => getProductionPlanById({ id }),
    enabled: !!id
  });

  return { data, status, isPending, isError, isSuccess };
};
