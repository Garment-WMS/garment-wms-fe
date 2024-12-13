import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { PurchaseOrderListResponse } from '@/types/PurchaseOrderListResponse';
import privateCall from '../PrivateCaller';
import Cookies from 'js-cookie';
import { get, patch, post } from '../ApiCaller';
export const purchaseOrderApi = {
  getOne: (id: string) => get(`/purchase-order/${id}`),
  getAll: () => get('/purchase-order/all'),
  cancel: (id: string) => patch(`/purchase-order/${id}/cancel`)
};

export const getAllPurchaseOrdersNoPage = async (): Promise<any> => {
  // Make the API request
  const res = await privateCall(purchaseOrderApi.getAll());
  return res.data.data;
};
interface GetAllPurchaseOrdersInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export const getAllPurchaseOrders = async ({
  sorting,
  columnFilters,
  pagination
}: GetAllPurchaseOrdersInput): Promise<PurchaseOrderListResponse> => {
  const limit = pagination.pageSize;
  const offset = pagination.pageIndex * pagination.pageSize;

  // Initialize filter and order arrays
  const filter: any[] = [];
  const order: any[] = [];

  // Build filter array from columnFilters
  columnFilters.forEach((filterItem) => {
    const { id, value } = filterItem;

    // Determine operation type based on the filter value
    let type: FilterOperationType;
    if (Array.isArray(value)) {
      type = FilterOperationType.InStrings; // Example for array values
    } else if (value === null) {
      type = FilterOperationType.NeNull; // Example for null values
    } else {
      type = FilterOperationType.Eq; // Default to equality for single values
    }

    filter.push({ field: id, type, value });
  });

  // Build order array from sorting
  sorting.forEach((sort) => {
    const direction = sort.desc ? 'desc' : 'asc';
    order.push({ field: sort.id, dir: direction });
  });

  // Construct the query string using FilterBuilder
  const queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });
  const fullUrl = `/purchase-order${queryString}`;
  try {
    const config = get(fullUrl);
    const response = await axios(config);
    return response.data.data as PurchaseOrderListResponse;
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    throw new Error('Failed to fetch purchase orders');
  }
};
export const getAllPurchaseOrderNoQuerry = async (): Promise<PurchaseOrderListResponse> => {
  const fullUrl = `/purchase-order`;

  try {
    const config = get(fullUrl);
    const response = await privateCall(config);
    return response.data.data as PurchaseOrderListResponse;
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    throw new Error('Failed to fetch purchase orders');
  }
};

export const getPurchaseOrderById = async (id: string): Promise<ApiResponse> => {
  try {
    const config = get(`/purchase-order/${id}`);
    const response = await privateCall(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Failed to fetch purchase order by ID:', error);
    throw new Error('Failed to fetch purchase order');
  }
};

export const importPurchaseOrder = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  console.log('FormData contents:');
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  const accessToken = Cookies.get('accessToken');
  // Prepare the API caller configuration
  const config = post(
    '/purchase-order',
    formData,
    {}, // No additional params needed
    {
      'Content-Type': 'multipart/form-data',
      Authorization: accessToken ? `Bearer ${accessToken}` : ''
    }
  );

  try {
    // Make the API call
    const response = await axios(config);
    // Return the successful response data
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Error uploading purchase order:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response data:', error.response.data); // Return an error response in the expected format
      return {
        statusCode: error.response.status,
        data: null,
        message: error.response.data.message || 'An error occurred during file upload.',
        errors: error.response.data.errors || null
      } as ApiResponse;
    }
    // Throw for unexpected errors
    throw new Error('An unexpected error occurred during file upload.');
  }
};

// export const importPurchaseOrder = async (file: File): Promise<ApiResponse> => {
//   const formData = new FormData();
//   formData.append('file', file);
//   console.log('FormData contents:');
//   for (const [key, value] of formData.entries()) {
//     console.log(`${key}:`, value);
//   }
//   const config = post('/purchase-order', formData, {}, { 'Content-Type': 'multipart/form-data' });
//   try {
//     const response = await privateCall(config);
//     return response.data as ApiResponse;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       return {
//         statusCode: error.response.status,
//         data: null,
//         message: error.response.data.message || 'An error occurred during file upload.',
//         errors: error.response.data.errors || null
//       } as ApiResponse;
//     }
//     throw new Error('An unexpected error occurred during file upload.');
//   }
// };

export const getPurchaseOrderStatistic = async (): Promise<ApiResponse> => {
  try {
    const config = get(`/purchase-order/statistic`);
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Failed to fetch purchase order by ID:', error);
    throw new Error('Failed to fetch purchase order');
  }
};

export const cancelPurchaseOrder = async (
  id: string,
  cancelledReason: string
): Promise<ApiResponse> => {
  try {
    const endpoint = `/purchase-order/${id}/cancel`;
    const body = { cancelledReason };
    const accessToken = Cookies.get('accessToken');

    const config = patch(
      endpoint,
      body,
      {}, // No additional query params
      {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : ''
      }
    );

    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Failed to cancel purchase order:', error);
    if (axios.isAxiosError(error) && error.response) {
      return {
        statusCode: error.response.status,
        data: null,
        message: error.response.data.message || 'Failed to cancel purchase order.',
        errors: error.response.data.errors || null
      } as ApiResponse;
    }
    throw new Error('An unexpected error occurred while canceling the purchase order.');
  }
};
