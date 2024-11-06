import { UseImportRequestsInput, UseImportRequestsResponse } from '@/types/ImportRequestType';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { get, post } from '../ApiCaller';
import privateCall from '../PrivateCaller';

let importRequestUrl = '/import-request';

export const importRequestApi = {
  getOne: (id: string) => get(`${importRequestUrl}/${id}`),
  getAll: (queryString: string) => get(`${importRequestUrl}${queryString}`),
  approveRequest: (action: string, note: string, id: string) =>
    post(`/import-request/${id}/manager-process`, { action, note })
};

export const getAllImportRequestFn = async ({
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
  const res = await privateCall(importRequestApi.getAll(queryString));
  return res.data.data;
};

export const importRequestApprovalFn = async (action: string, note: string, id: string) => {
  const res = await privateCall(importRequestApi.approveRequest(action, note, id));
  return res.data;
};
