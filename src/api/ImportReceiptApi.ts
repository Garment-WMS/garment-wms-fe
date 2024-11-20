import { UseImportRequestsInput, UseImportRequestsResponse } from '@/types/ImportRequestType';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { get } from './ApiCaller';
import privateCall from './PrivateCaller';
import { patch } from './services/ApiCaller';

let importRequestUrl = '/import-receipt';

export const importReceiptApi = {
  getOne: (id: string) => get(`${importRequestUrl}/${id}`),
  getAll: (queryString: string) => get(`/import-receipt${queryString}`),
  finish: (id: string) => patch(`${importRequestUrl}/${id}/finish`)
};

export const getAllImportReceiptFn = async ({
  sorting,
  columnFilters,
  pagination
}: UseImportRequestsInput): Promise<UseImportRequestsResponse> => {
  const limit = pagination.pageSize;
  const offset = pagination.pageIndex * pagination.pageSize;

  // Initialize filter and order arrays
  const filter: any[] = [];
  const order: any[] = [];

  // Build filter array from columnFilters
  columnFilters.forEach((filterItem) => {
    const { id, value } = filterItem;

    // Check the type of operation based on your requirement
    let type: FilterOperationType;
    if (Array.isArray(value)) {
      type = FilterOperationType.InStrings; // Example operation type
    } else if (value === null) {
      type = FilterOperationType.NeNull; // Example operation type
    } else {
      type = FilterOperationType.Eq; // Default operation type
    }

    filter.push({ field: id, type, value });
  });

  // Build order array from sorting
  sorting.forEach((sort) => {
    const direction = sort.desc ? 'desc' : 'asc';
    order.push({ field: sort.id, dir: direction });
  });

  // Construct the query string
  const queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });

  // Make the API request
  const res = await privateCall(importReceiptApi.getAll(queryString));
  return res.data.data;
};

export const finishImportReceiptFn = async (id: string): Promise<any> => {
  // Make the API request
  const res = await privateCall(importReceiptApi.finish(id));
  return res.data.data;
};
