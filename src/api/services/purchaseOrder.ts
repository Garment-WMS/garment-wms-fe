import { ApiResponse } from '@/types/ApiResponse';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { PurchaseOrderListResponse } from '@/types/PurchaseOrderListResponse';
import privateCall from '../PrivateCaller';
import { get, patch, post } from '../ApiCaller';

interface GetAllPurchaseOrdersInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export const purchaseOrderApi = {
  getOne: (id: string) => get(`/purchase-order/${id}`),
  getAll: () => get('/purchase-order/all'),
  cancel: (id: string) => patch(`/purchase-order/${id}/cancel`),
  import: () => post('/purchase-order'),
  getStatistic: () => get('/purchase-order/statistic')
};

export const getAllPurchaseOrdersNoPage = async (): Promise<any> => {
  const response = await privateCall(purchaseOrderApi.getAll());
  return response.data.data;
};

export const getAllPurchaseOrders = async ({
  sorting,
  columnFilters,
  pagination
}: GetAllPurchaseOrdersInput): Promise<PurchaseOrderListResponse> => {
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
  const fullUrl = `/purchase-order${queryString}`;
  const config = get(fullUrl);

  const response = await privateCall(config);
  return response.data.data as PurchaseOrderListResponse;
};

export const getAllPurchaseOrderNoQuery = async (): Promise<PurchaseOrderListResponse> => {
  const fullUrl = `/purchase-order`;
  const config = get(fullUrl);

  const response = await privateCall(config);
  return response.data.data as PurchaseOrderListResponse;
};

export const getPurchaseOrderById = async (id: string): Promise<ApiResponse> => {
  const config = purchaseOrderApi.getOne(id);
  const response = await privateCall(config);
  return response.data as ApiResponse;
};

export const importPurchaseOrder = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const config = purchaseOrderApi.import();
  config.data = formData;
  config.headers = {
    'Content-Type': 'multipart/form-data'
  };

  const response = await privateCall(config);
  return response.data as ApiResponse;
};

export const getPurchaseOrderStatistic = async (): Promise<ApiResponse> => {
  const config = purchaseOrderApi.getStatistic();
  const response = await privateCall(config);
  return response.data as ApiResponse;
};

export const cancelPurchaseOrder = async (
  id: string,
  cancelledReason: string
): Promise<ApiResponse> => {
  const body = { cancelledReason };
  const config = purchaseOrderApi.cancel(id);
  config.data = body;
  config.headers = { 'Content-Type': 'application/json' };

  const response = await privateCall(config);
  return response.data as ApiResponse;
};
