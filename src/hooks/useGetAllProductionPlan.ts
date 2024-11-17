import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { getAllProductionPlans } from '@/api/services/productionPlan';

export const useGetAllProductionPlans = () => {
  const {
    data: data,
    status: status,
    isPending,
    isError,
    isSuccess
  } = useQuery<ApiResponse, AxiosError>({
    queryKey: ['productionPlans'],
    queryFn: getAllProductionPlans
  });
  return { data, status, isPending, isError, isSuccess };
};
