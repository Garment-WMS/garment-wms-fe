import { UseExportRequestsInput, UseExportRequestsResponse } from '@/types/ImportRequestType';
import { get, post } from '../ApiCaller';
import privateCall from '../PrivateCaller';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';

let url = '/material-export-request';

export const exportRequestApi = {
  createExportRequestWithFormula: (id: string, description: string, productFormulaId: string) =>
    post(`${url}`, { productionBatchId: id, description, productFormulaId }),
  createExportRequestWithOutFormula: (
    id: string,
    description: string,
    materialExportRequestDetail: any
  ) => post(`${url}`, { productionBatchId: id, description, materialExportRequestDetail }),
  getAll: (queryString: string) => get(`${url}${queryString}`),
  getMy: (queryString: string) => get(`${url}/my${queryString}`),

  getOne: (id: string) => get(`${url}/${id}`),
  getRecommend: (id: string, type: string) =>
    post(`/material-export-receipt/recommend`, { materialExportRequestId: id, algorithm: type }),
  approveRequest: (
    id: string,
    action: string,
    managerNote: string,
    warehouseStaffId: string,
    data: any,
    exportExpectedStartedAt?: string,
    exportExpectedFinishedAt?: string
  ) => {
    if (action == 'REJECTED') {
      return post(`/material-export-request/${id}/manager-approve`, {
        action,
        managerNote: managerNote != '' ? managerNote : undefined
      });
    } else {
      return post(`/material-export-request/${id}/manager-approve`, {
        action,
        managerNote: managerNote != '' ? managerNote : undefined,
        warehouseStaffId,
        materialExportReceipt: data,
        exportExpectedStartedAt,
        exportExpectedFinishedAt
      });
    }
  },
  checkQuantity: (id: string) => get(`${url}/check-quantity/${id}`),
  checkQuantityByVariant: (materialVariantId: string, quantityByUom: number) =>
    post(`${url}/check-quantity-variant`, { materialVariantId, quantityByUom })
};
export const approveExportRequestFn = async (
  id: string,
  action: string,
  managerNote: string,
  warehouseStaffId: string,
  data: any,
  exportExpectedStartedAt?: string,
  exportExpectedFinishedAt?: string
) => {
  const res = await privateCall(
    exportRequestApi.approveRequest(
      id,
      action,
      managerNote,
      warehouseStaffId,
      data,
      exportExpectedStartedAt,
      exportExpectedFinishedAt
    )
  );
  return res.data;
};
export const getRecommendedMaterialReceiptFn = async (id: string, type: string) => {
  const res = await privateCall(exportRequestApi.getRecommend(id, type));
  return res.data;
};
export const getExportRequestDetailFn = async (id: string) => {
  const res = await privateCall(exportRequestApi.getOne(id));
  return res.data;
};
export const createMaterialExportRequest = async (
  id: string,
  description: string,
  item: any,
  type: string
): Promise<any> => {
  // Make the API request
  if (type == 'formula') {
    const res = await privateCall(
      exportRequestApi.createExportRequestWithFormula(id, description, item)
    );
    return res.data;
  } else {
    const res = await privateCall(
      exportRequestApi.createExportRequestWithOutFormula(id, description, item)
    );
    return res.data;
  }
};
export const checkExportRequestQuantityFn = async (id: string) => {
  const res = await privateCall(exportRequestApi.checkQuantity(id));
  return res.data;
};
export const checkQuantityByVariantFn = async (
  materialVariantId: string,
  quantityByUom: number
) => {
  const res = await privateCall(
    exportRequestApi.checkQuantityByVariant(materialVariantId, quantityByUom)
  );
  return res.data;
};
export const getAllExportRequestFn = async ({
  sorting,
  columnFilters,
  pagination
}: UseExportRequestsInput): Promise<UseExportRequestsResponse> => {
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
  const res = await privateCall(exportRequestApi.getAll(queryString));
  return res.data.data;
};

export const getMyExportRequestFn = async ({
  sorting,
  columnFilters,
  pagination
}: UseExportRequestsInput): Promise<UseExportRequestsResponse> => {
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
  const res = await privateCall(exportRequestApi.getMy(queryString));
  return res.data.data;
};
