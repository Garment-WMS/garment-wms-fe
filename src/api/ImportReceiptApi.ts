import { UseImportRequestsInput, UseImportRequestsResponse } from '@/types/ImportRequestType';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { get } from './ApiCaller';
import privateCall from './PrivateCaller';
import { patch } from './services/ApiCaller';
import { replaceAll } from '@/helpers/replaceAll';

let importRequestUrl = '/import-receipt';

export const importReceiptApi = {
  getOne: (id: string) => get(`${importRequestUrl}/${id}`),
  getAll: (queryString: string) => get(`/import-receipt${queryString}`),
  getMy: (queryString: string) => get(`/import-receipt/my${queryString}`),

  finish: (id: string) => patch(`${importRequestUrl}/${id}/finish`),
  getImportRequest: (id: string) => get(`/import-request/by-import-receipt/${id}`),
  startImporting: (id: string) => patch(`${importRequestUrl}/${id}/importing`)
};
export const getImportRequestFn = async (id: string) => {
  const res = await privateCall(importReceiptApi.getImportRequest(id));
  return res.data;
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
  const res = await privateCall(importReceiptApi.getAll(queryString));
  return res.data.data;
};

export const getMyImportReceiptFn = async ({
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
    const fieldKey = replaceAll(filter.id, '_', '.'); 
    return {
      id: fieldKey,
      value: filter.value
    };
  });
  console.log(filters)
  const sorts = sorting.map((sort) => {
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
  const res = await privateCall(importReceiptApi.getMy(queryString));
  return res.data.data;
};

export const finishImportReceiptFn = async (id: string): Promise<any> => {
  // Make the API request
  const res = await privateCall(importReceiptApi.finish(id));
  return res;
};
export const startImportReceiptFn = async (id: string): Promise<any> => {
  // Make the API request
  const res = await privateCall(importReceiptApi.startImporting(id));
  return res.data;
};
