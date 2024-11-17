import { ApiResponse } from '@/types/ApiResponse';
import { get } from './ApiCaller';
import axios from 'axios';

export const getAllProductionPlans = async (): Promise<ApiResponse> => {
  try {
    const config = get('/production-plan');
    const response = await axios(config);
    return response.data as Promise<ApiResponse>;
  } catch (error: any) {
    console.error('Failed to fetch production plans:', error);
    throw new Error('Failed to fetch production plans');
  }
};
