import { ProductionBatchListResponse } from '@/types/ProductionBatchListResponse';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { ApiResponse } from '@/types/ApiResponse';
import privateCall from '../PrivateCaller';
import { get, patch, post } from '../ApiCaller';
import axios from 'axios';
import Cookies from 'js-cookie';

export const productionBatchApi = {
  getAll: () => get('/production-batch'),
  getById: (id: string) => get(`/production-batch/${id}`),
  import: () => post('/production-batch'),
  cancel: (id: string) => patch(`/production-batch/${id}/cancel`),
  getChart: (productionPlanId: string) => get('/production-batch/chart', { productionPlanId })
};

interface GetAllProductionBatchInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export const getAllProductionBatch = async ({
  sorting,
  columnFilters,
  pagination
}: GetAllProductionBatchInput): Promise<ProductionBatchListResponse> => {
  const limit = pagination.pageSize;
  const offset = pagination.pageIndex * pagination.pageSize;

  const filter: any[] = [];
  const order: any[] = [];

  columnFilters.forEach((filterItem) => {
    const { id, value } = filterItem;

    let type: FilterOperationType;
    if (Array.isArray(value)) {
      type = FilterOperationType.InStrings;
    } else if (value === null) {
      type = FilterOperationType.NeNull;
    } else {
      type = FilterOperationType.Eq;
    }

    filter.push({ field: id, type, value });
  });

  sorting.forEach((sort) => {
    const direction = sort.desc ? 'desc' : 'asc';
    order.push({ field: sort.id, dir: direction });
  });

  const queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });

  const config = productionBatchApi.getAll();
  config.url += queryString;

  const response = await privateCall(config);
  return response.data.data as ProductionBatchListResponse;
};

export const getOneProductionBatchById = async (id: string): Promise<ApiResponse> => {
  const config = productionBatchApi.getById(id);
  const response = await privateCall(config);

  return response.data as ApiResponse;
};

// export const importProductionBatch = async (file: File): Promise<ApiResponse> => {
//   const formData = new FormData();
//   formData.append('file', file);

//   const config = productionBatchApi.import();
//   config.data = formData;
//   config.headers = {
//     'Content-Type': 'multipart/form-data'
//   };

//   const response = await privateCall(config);
//   return response.data as ApiResponse;
// };
export const importProductionBatch = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  console.log('FormData contents:');
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  const accessToken = Cookies.get('accessToken');
  // Prepare the API caller configuration
  const config = post(
    '/production-batch',
    formData,
    {}, // No additional params needed
    {
      'Content-Type': 'multipart/form-data',
      Authorization: accessToken ? `Bearer ${accessToken}` : ''
    }
  );

  try {
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Error uploading production batch:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response data:', error.response.data);
      return {
        statusCode: error.response.status,
        data: null,
        message: error.response.data.message || 'An error occurred during file upload.',
        errors: error.response.data.errors || null
      } as ApiResponse;
    }
    throw new Error('An unexpected error occurred during file upload.');
  }
};

export const cancelProductionBatch = async (
  id: string,
  cancelledReason: string
): Promise<ApiResponse> => {
  const config = productionBatchApi.cancel(id);
  config.data = { cancelledReason };
  config.headers = {
    'Content-Type': 'application/json'
  };

  const response = await privateCall(config);
  return response.data as ApiResponse;
};

export const getProductionBatchChart = async (productionPlanId: string): Promise<ApiResponse> => {
  try {
    const config = productionBatchApi.getChart(productionPlanId);
    const response = await privateCall(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Error fetching production batch chart data:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response data:', error.response.data);
      return {
        statusCode: error.response.status,
        data: null,
        message: error.response.data.message || 'An error occurred while fetching chart data.',
        errors: error.response.data.errors || null
      } as ApiResponse;
    }
    throw new Error('An unexpected error occurred while fetching chart data.');
  }
};

export const getProductionBatchByPlan = async (
  productionPlanId: string,
  pagination: PaginationState,
  sorting: SortingState
): Promise<ProductionBatchListResponse> => {
  const limit = pagination.pageSize;
  const offset = pagination.pageIndex * pagination.pageSize;

  const filter = [
    {
      field: 'productionPlanDetail.productionPlanId',
      type: FilterOperationType.Eq,
      value: productionPlanId
    }
  ];

  const order: any[] = [];

  sorting.forEach((sort) => {
    const direction = sort.desc ? 'desc' : 'asc';
    order.push({ field: sort.id, dir: direction });
  });

  const queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });

  const config = productionBatchApi.getAll();
  config.url += queryString;

  const response = await privateCall(config);
  return response.data.data as ProductionBatchListResponse;
};
