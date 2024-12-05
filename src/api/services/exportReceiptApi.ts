import { InputType } from '@/types/Shared';
import { get, post } from '../ApiCaller';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import privateCall from '../PrivateCaller';
import { UseExportReceiptResponse } from '@/types/ExportReceipt';
import { act } from 'react';
import { MaterialExportReceiptResponse } from '@/types/MaterialTypes';

const exportReceiptPath = '/material-export-receipt';
export const exportReceiptApi = {
  getAllWithQueryStrings: (queryString: string) => get(`${exportReceiptPath}${queryString}`),
  getOne: (id: string) => get(`${exportReceiptPath}/${id}`),
  getOneByRequestId: (id: string) => get(`${exportReceiptPath}/by-material-export-request/${id}`),
  changeStatus: (id: string, action: string) =>
    post('/material-export-receipt/warehouse-staff-process', {
      action,
      materialExportRequestId: id
    }),
  changeStatusProduction: (id: string, action: string) =>
    post('/material-export-request/production-department-process', {
      action,
      materialExportRequestId: id
    }),
  getAllMyExportReceipt: (queryString: string) => get(`${exportReceiptPath}/my${queryString}`)
};
export const changeStatusFn = async (id: string, action: string, type: string) => {
  if (type == 'staff') {
    const res = await privateCall(exportReceiptApi.changeStatus(id, action));
    return res.data;
  } else {
    const res = await privateCall(exportReceiptApi.changeStatusProduction(id, action));
    return res.data;
  }
};
export const getAllExportReceiptFn = async ({
  sorting,
  columnFilters,
  pagination
}: InputType): Promise<UseExportReceiptResponse> => {
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
  const res = await privateCall(exportReceiptApi.getAllWithQueryStrings(queryString));
  return res.data;
};

export const getMyExportReceipt = async ({
  sorting,
  columnFilters,
  pagination
}: InputType): Promise<UseExportReceiptResponse> => {
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
  const res = await privateCall(exportReceiptApi.getAllMyExportReceipt(queryString));
  return res.data;
};
