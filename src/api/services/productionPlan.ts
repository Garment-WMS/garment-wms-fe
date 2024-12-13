import { ApiResponse } from '@/types/ApiResponse';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { ProductionPlanListResponse } from '@/types/ProductionPlanListResponse';
import { get, patch, post } from '../ApiCaller';
import Cookies from 'js-cookie';
import privateCall from '../PrivateCaller';

export const productionPlanApi = {
  getAll: () => get('/production-plan'),
  getById: (id: string) => get(`/production-plan/${id}`),
  start: (id: string) => patch(`/production-plan/${id}/start`),
  import: () => post('/production-plan')
};

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

  const config = productionPlanApi.getAll();
  config.url += queryString;

  const response = await privateCall(config);
  return response.data as ProductionPlanListResponse;
};

export const startProductionPlan = async ({
  id
}: StartProductionPlanInput): Promise<ApiResponse> => {
  const config = productionPlanApi.start(id);

  const response = await privateCall(config);
  return response.data as ApiResponse;
};

export const getProductionPlanById = async ({
  id
}: GetProductionPlanByIdInput): Promise<ApiResponse> => {
  const config = productionPlanApi.getById(id);

  const response = await privateCall(config);
  return response.data as ApiResponse;
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

  const config = productionPlanApi.import();
  config.data = formData;
  config.headers = {
    'Content-Type': 'multipart/form-data'
  };

  const response = await privateCall(config);
  return response.data as ApiResponse;
};
