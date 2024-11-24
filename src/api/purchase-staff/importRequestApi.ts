import { UseImportRequestsInput, UseImportRequestsResponse } from '@/types/ImportRequestType';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { get, post } from '../ApiCaller';
import privateCall from '../PrivateCaller';

let importRequestUrl = '/import-request';

export const importRequestApi = {
  getOne: (id: string) => get(`${importRequestUrl}/${id}`),
  getAll: (queryString: string) => get(`${importRequestUrl}${queryString}`),
  approveRequest: (
    action: string,
    managerNote: string,
    id: string,
    inspectionDepartmentId?: string,
    warehouseStaffId?: string
  ) => {
    if (inspectionDepartmentId && warehouseStaffId) {
      return post(`/import-request/${id}/manager-process`, {
        action,
        managerNote: managerNote != '' ? managerNote : undefined,
        inspectionDepartmentId,
        warehouseStaffId
      });
    } else {
      return post(`/import-request/${id}/manager-process`, {
        action,
        managerNote: managerNote != '' ? managerNote : undefined
      });
    }
  },
  getImportReceipt: (id: string) => get(`/import-receipt/by-import-request/${id}`),
  getStatistic: () => get(`/import-request/statistic`),
  postChat: (id: string, message: string) => post(`/chat`, { discussionId: id, message })
};
export const postChatFn = async (id: string, message: string) => {
  const res = await privateCall(importRequestApi.postChat(id, message));
  return res.data;
};
export const getImportStatistic = async () => {
  const res = await privateCall(importRequestApi.getStatistic());
  return res.data;
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
  const filters = columnFilters.map((filter) => {
    // Replace dots with underscores only if there are any dots in the id
    const fieldKey = filter.id.includes('_') ? filter.id.replace('_', '.') : filter.id;

    return {
      id: fieldKey,
      value: filter.value
    };
  });
  const sorts = sorting.map((sort) => {
    // Replace dots with underscores only if there are any dots in the id
    const fieldKey = sort.id.includes('_') ? sort.id.replace('_', '.') : sort.id;

    return {
      id: fieldKey,
      desc: sort.desc
    };
  });

  // Build filter array from columnFilters
  filters.forEach((filterItem) => {
    const { id, value } = filterItem;

    let type: FilterOperationType;
    if (id === 'name' || id === 'code') {
      type = FilterOperationType.Ilike;
    } else {
      type = FilterOperationType.In;
    }
    // Handle FilterOperationType.In as an array
    if (type === FilterOperationType.In && Array.isArray(value)) {
      // Push a single filter object with `value` as an array
      filter.push({ field: id, type, value });
    } else if (Array.isArray(value)) {
      value.forEach((val) => {
        filter.push({ field: id, type, value: val });
      });
    } else {
      filter.push({ field: id, type, value });
    }
  });
  sorts.forEach((sort) => {
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

export const importRequestApprovalFn = async (
  action: string,
  managerNote: string,
  id: string,
  inspectionDepartmentId?: string,
  warehouseStaffId?: string
) => {
  const res = await privateCall(
    importRequestApi.approveRequest(
      action,
      managerNote,
      id,
      inspectionDepartmentId,
      warehouseStaffId
    )
  );
  return res.data;
};
export const getImportReceiptFn = async (id: string) => {
  const res = await privateCall(importRequestApi.getImportReceipt(id));
  return res.data;
};
