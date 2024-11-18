import { getPurchaseOrderDeliveryByPoId } from '@/api/services/purchaseOrderDelivery';
import { ApiResponse } from '@/types/ApiResponse';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetPurchaseOrderDeliveryByPoId = (id: string) => {
  const {
    data: data,
    status: status,
    isPending,
    isError,
    isSuccess
  } = useQuery<ApiResponse, AxiosError>({
    queryKey: ['purchaseOrderDelivery', id],
    queryFn: () => getPurchaseOrderDeliveryByPoId(id),
    enabled: !!id
  });
  return { data, status, isPending, isError, isSuccess };
};
