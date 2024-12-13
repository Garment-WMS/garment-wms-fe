import { UseImportRequestsInput, UseImportRequestsResponse } from '@/types/ImportRequestType';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { get, post } from '../ApiCaller';
import privateCall from '../PrivateCaller';
import { replaceAll } from '@/helpers/replaceAll';

let importRequestUrl = '/import-request';

export const importRequestApi = {
  getOne: (id: string) => get(`${importRequestUrl}/${id}`),
  getAll: (queryString: string) => get(`${importRequestUrl}${queryString}`),
  getReturn: () =>
    get(
      `/material-export-request?filter[0][field]=status&filter[0][value]=PRODUCTION_REJECTED&filter[0][type]==`
    ),
  returnMaterial: (id: string) =>
    post('/import-request/material-return', { materialExportRequestId: id }),
  getMyImportRequests: (queryString: string) => get(`${importRequestUrl}/my${queryString}`),
  approveRequest: (
    action: string,
    managerNote: string,
    id: string,
    inspectionDepartmentId?: string,
    warehouseStaffId?: string,
    inspectExpectedStartedAt?: string,
    inspectExpectedFinishedAt?: string,
    importExpectedStartedAt?: string,
    importExpectedFinishedAt?: string
  ) => {
    if (inspectionDepartmentId && warehouseStaffId) {
      return post(`/import-request/${id}/manager-process`, {
        action,
        managerNote: managerNote != '' ? managerNote : undefined,
        inspectionDepartmentId,
        warehouseStaffId,
        inspectExpectedStartedAt,
        inspectExpectedFinishedAt,
        importExpectedStartedAt,
        importExpectedFinishedAt
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
  postChat: (id: string, message: string) => post(`/chat`, { discussionId: id, message }),
  reassignWarehouseStaff: (
    importRequestId: string,
    warehouseStaffId: string,
    importExpectedStartedAt: string,
    importExpectedFinishedAt: string
  ) =>
    post(`/import-request/reassign`, {
      importRequestId,
      warehouseStaffId,
      importExpectedStartedAt,
      importExpectedFinishedAt
    }),
  reassignInspectionStaff: (
    importRequestId: string,
    inspectionStaffId: string,
    inspectExpectedStartedAt: string,
    inspectExpectedFinishedAt: string
  ) =>
    post(`/import-request/reassign`, {
      importRequestId,
      inspectionStaffId,
      inspectExpectedStartedAt,
      inspectExpectedFinishedAt
    })
};

export const reassignStaffFn = async (
  type: string,
  importRequestId: string,
  warehouseStaffId?: string,
  importExpectedStartedAt?: string,
  importExpectedFinishedAt?: string,
  inspectionStaffId?: string,
  inspectExpectedStartedAt?: string,
  inspectExpectedFinishedAt?: string
) => {
  if (type == 'warehouse-staff') {
    const res = await privateCall(
      importRequestApi.reassignWarehouseStaff(
        importRequestId,
        warehouseStaffId as string,
        importExpectedStartedAt as string,
        importExpectedFinishedAt as string
      )
    );
    return res.data;
  } else {
    const res = await privateCall(
      importRequestApi.reassignInspectionStaff(
        importRequestId,
        inspectionStaffId as string,
        inspectExpectedStartedAt as string,
        inspectExpectedFinishedAt as string
      )
    );
    return res.data;
  }
};
export const returnMaterialFn = async (id: string) => {
  const res = await privateCall(importRequestApi.returnMaterial(id));
  return res.data;
};
export const getReturnImportRequest = async () => {
  const res = await privateCall(importRequestApi.getReturn());
  return res.data.data;
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
    // Replace all dots in the id with underscores
    const fieldKey = replaceAll(filter.id, '_', '.'); // Alternatively, `.replace(/\./g, '_')` works the same
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

export const getMyImportRequestFn = async ({
  sorting,
  columnFilters,
  pagination
}: UseImportRequestsInput): Promise<UseImportRequestsResponse> => {
  const limit = pagination.pageSize;
  const offset = pagination.pageIndex * pagination.pageSize;

  // Initialize filter and order arrays
  const filter: any[] = [];
  const order: any[] = [];
  // const filters = columnFilters.map((filter) => {
  //   const fieldKey = filter.id.includes('_') ? filter.id.replace('_', '.') : filter.id;

  //   return {
  //     id: fieldKey,
  //     value: filter.value
  //   };
  // });
  const filters = columnFilters.map((filter) => {
    // Replace all dots in the id with underscores
    const fieldKey = replaceAll(filter.id, '_', '.'); // Alternatively, `.replace(/\./g, '_')` works the same
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
  const res = await privateCall(importRequestApi.getMyImportRequests(queryString));
  return res.data.data;
};

export const importRequestApprovalFn = async (
  action: string,
  managerNote: string,
  id: string,
  inspectionDepartmentId?: string,
  warehouseStaffId?: string,
  inspectExpectedStartedAt?: string,
  inspectExpectedFinishedAt?: string,
  importExpectedStartedAt?: string,
  importExpectedFinishedAt?: string
) => {
  const res = await privateCall(
    importRequestApi.approveRequest(
      action,
      managerNote,
      id,
      inspectionDepartmentId,
      warehouseStaffId,
      inspectExpectedStartedAt,
      inspectExpectedFinishedAt,
      importExpectedStartedAt,
      importExpectedFinishedAt
    )
  );
  return res.data;
};
export const getImportReceiptFn = async (id: string) => {
  const res = await privateCall(importRequestApi.getImportReceipt(id));
  return res.data;
};
