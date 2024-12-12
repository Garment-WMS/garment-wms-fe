import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { ProductionPlanListResponse } from '@/types/ProductionPlanListResponse';
import { get, patch, post } from '../ApiCaller';
import Cookies from 'js-cookie';
import privateCall from '../PrivateCaller';

interface StartProductionPlanInput {
  id: string;
}

interface GetProductionPlanByIdInput {
  id: string;
}

interface GetAllProductionPlansInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export const getAllProductionPlans = async ({
  sorting,
  columnFilters,
  pagination
}: GetAllProductionPlansInput): Promise<ProductionPlanListResponse> => {
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

  const fullUrl = `/production-plan${queryString}`;

  try {
    const config = get(fullUrl);
    const response = await axios(config);
    return response.data as ProductionPlanListResponse;
  } catch (error) {
    console.error('Error fetching production plans:', error);
    throw new Error('Failed to fetch production plans');
  }
};

export const startProductionPlan = async ({
  id
}: StartProductionPlanInput): Promise<ApiResponse> => {
  const fullUrl = `/production-plan/${id}/start`;
  try {
    const config = patch(fullUrl, {});
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error) {
    console.error(`Error starting production plan with ID ${id}:`, error);
    throw new Error('Failed to start production plan');
  }
};

export const getProductionPlanById = async ({
  id
}: GetProductionPlanByIdInput): Promise<ApiResponse> => {
  const fullUrl = `/production-plan/${id}`;
  try {
    const config = get(fullUrl);
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error) {
    console.error(`Error fetching production plan with ID ${id}:`, error);
    throw new Error('Failed to fetch production plan');
  }
};

export const getProductionPlanDetailsById = async (id: string): Promise<ApiResponse> => {
  const fullUrl = `/production-plan/${id}`;
  try {
    const config = get(fullUrl);
    const response = await privateCall(config);
    return response.data as ApiResponse;
  } catch (error) {
    console.error(`Error fetching production plan with ID ${id}:`, error);
    throw new Error('Failed to fetch production plan');
  }
};

export const importProductionPlan = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  console.log('FormData contents:');
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  const accessToken = Cookies.get('accessToken');
  const config = post(
    '/production-plan',
    formData,
    {},
    {
      'Content-Type': 'multipart/form-data',
      Authorization: accessToken ? `Bearer ${accessToken}` : ''
    }
  );

  try {
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Error uploading production plan:', error);
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
