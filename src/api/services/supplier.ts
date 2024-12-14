import privateCall from '../PrivateCaller';
import { get } from './ApiCaller';
import { ApiResponse } from '@/types/ApiResponse';

export const supplierApi = {
  getAll: () => get('/supplier')
};

export const getAllSuppliers = async (): Promise<ApiResponse> => {
  const config = supplierApi.getAll();
  const response = await privateCall(config);
  return response.data as ApiResponse;
};
