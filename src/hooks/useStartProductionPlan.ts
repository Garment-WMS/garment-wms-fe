import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { startProductionPlan } from '@/api/services/productionPlan';

export const useStartProductionPlan = () => {
  const {
    mutate: startPlan,
    data,
    status,
    isPending,
    isError,
    isSuccess
  } = useMutation<ApiResponse, AxiosError, { id: string }>({
    mutationKey: ['startProductionPlan'],
    mutationFn: ({ id }) => startProductionPlan({ id })
  });
  return { startPlan, data, status, isPending, isError, isSuccess };
};
