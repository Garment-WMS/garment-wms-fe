import privateCall from '../PrivateCaller';
import { ApiResponse } from '@/types/ApiResponse';
import Cookies from 'js-cookie';
import axios from 'axios';
import { post } from '../ApiCaller';
const importRequestPath = '/import-request';
export const importRequestApi = {
  createImportProduct: (body: any) => post(`${importRequestPath}/product`, body),
  create: async (
    poDeliveryId: string,
    description: string,
    importRequestDetails: any[],
    type: string
  ): Promise<any> => {
    // Example API call
    return privateCall(
      post('/import-request', {
        poDeliveryId,
        description,
        importRequestDetails,
        type
      })
    );
  }
};

export const cancelImportRequest = async (
  id: string,
  cancelReason: string
): Promise<ApiResponse> => {
  try {
    const endpoint = `/import-request/${id}/purchasing-staff-process`;
    const body = {
      action: 'CANCELLED',
      cancelReason
    };
    const accessToken = Cookies.get('accessToken');
    const config = post(
      endpoint,
      body,
      {},
      {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : ''
      }
    );
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Failed to cancel import request:', error);
    if (axios.isAxiosError(error) && error.response) {
      return {
        statusCode: error.response.status,
        data: null,
        message: error.response.data.message || 'Failed to cancel import request.',
        errors: error.response.data.errors || null
      } as ApiResponse;
    }
    throw new Error('An unexpected error occurred while canceling the import request.');
  }
};
