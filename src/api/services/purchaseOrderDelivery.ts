import { ApiResponse } from '@/types/ApiResponse';
import { get, post } from './ApiCaller';
import axios from 'axios';

export const getPurchaseOrderDeliveryByPoId = async (id: string): Promise<ApiResponse> => {
  try {
    const config = get(`/po-delivery/po/${id}`);
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Failed to fetch purchase order delivery by PO ID:', error);
    throw new Error('Failed to fetch purchase order delivery');
  }
};
