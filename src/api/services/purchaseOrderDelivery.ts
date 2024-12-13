import { ApiResponse } from '@/types/ApiResponse';
import privateCall from '../PrivateCaller';
import { get } from '../ApiCaller';

export const purchaseOrderDeliveryApi = {
  getByPoId: (id: string) => get(`/po-delivery/po/${id}`)
};

export const getPurchaseOrderDeliveryByPoId = async (id: string): Promise<ApiResponse> => {
  const config = purchaseOrderDeliveryApi.getByPoId(id);
  const response = await privateCall(config);
  return response.data as ApiResponse;
};
