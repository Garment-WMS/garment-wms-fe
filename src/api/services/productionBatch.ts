import { ProductionBatchListResponse } from '@/types/ProductionBatchListResponse';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { ApiResponse } from '@/types/ApiResponse';
import privateCall from '../PrivateCaller';
import { get, patch, post } from '../ApiCaller';

export const productionBatchApi = {
  getAll: () => get('/production-batch'),
  getById: (id: string) => get(`/production-batch/${id}`),
  import: () => post('/production-batch'),
  cancel: (id: string) => patch(`/production-batch/${id}/cancel`)
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

export const importProductionBatch = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const config = productionBatchApi.import();
  config.data = formData;
  config.headers = {
    'Content-Type': 'multipart/form-data'
  };

  const response = await privateCall(config);
  return response.data as ApiResponse;
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
