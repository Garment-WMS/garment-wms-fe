import { ProductionBatchListResponse } from '@/types/ProductionBatchListResponse';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import Cookies from 'js-cookie';
import { get, post } from '../ApiCaller';

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

  const fullUrl = `/production-batch${queryString}`;

  try {
    const config = get(fullUrl);
    const response = await axios(config);
    return response.data.data as ProductionBatchListResponse;
  } catch (error) {
    console.error('Error fetching production batches:', error);
    throw new Error('Failed to fetch production batches');
  }
};

export const getOneProductionBatchById = async (id: string): Promise<ApiResponse> => {
  try {
    const config = get(`/production-batch/${id}`);
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Failed to fetch production batch by ID:', error);
    throw new Error('Failed to fetch production batch');
  }
};

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
    // Make the API call
    const response = await axios(config);
    // Return the successful response data
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Error uploading production batch:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response data:', error.response.data);
      // Return an error response in the expected format
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
