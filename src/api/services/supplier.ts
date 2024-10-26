import axios from 'axios';
import { get } from './ApiCaller';
import { ApiResponse } from '@/types/ApiResponse';

export const getAllSuppliers = async (): Promise<ApiResponse> => {
  try {
    const config = get('/supplier');
    const response = await axios(config);
    console.log(response);
    return response.data as ApiResponse;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw new Error('Failed to fetch suppliers');
  }
};
