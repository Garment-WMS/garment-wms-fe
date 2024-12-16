import {
  MaterialExportReceiptResponse,
  MaterialHistoryResponse,
  MaterialImportReceiptResponse,
  MaterialReceiptResponse,
  MaterialVariantResponse,
  UseMaterialsInput
} from '@/types/MaterialTypes';
import { get, post } from '../ApiCaller';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import privateCall from '../PrivateCaller';
import { InputType } from '@/types/Shared';

let materialVariant = '/material-variant';
let materialReceipt = '/material-receipt';
let materialType = '/material';
export const materialApi = {
  getOne: (id: string) => get(`${materialVariant}/${id}`),
  getAll: (queryString: string) => get(`${materialVariant}${queryString}`),
  getAllWithReceipt: (queryString: string) => get(`${materialVariant}/has-receipt${queryString}`),
  getAllWithoutFilter: () => get(`${materialVariant}/all`),
  getOneDetailMaterialReceipt: (id: string) => get(`${materialReceipt}/${id}`),
  getOneReceipt: (id: string, queryString: string) =>
    get(`${materialVariant}/${id}/material-receipt${queryString}`),
  getOneImportReceipt: (id: string, queryString: string) =>
    get(`${materialVariant}/${id}/import-receipt/${queryString}`),
  getOneExportReceipt: (id: string, queryString: string) =>
    get(`${materialVariant}/${id}/export-receipt/${queryString}`),
  getAllNoArgument: () => get(`${materialVariant}`),
  getReceiptStatistics: (data: any) => post(`${materialVariant}/chart`, data),
  addImage: (id: string, data: FormData, config: any) =>
    post(`${materialVariant}/${id}/image`, data, undefined, config),
  getAllUom() {
    return get(`/uom`);
  },
  createMaterialVariant(data: FormData, config: any) {
    return post(`${materialVariant}/form-data`, data, undefined, config);
  },
  getOneHistory: (id: string, queryString: string) =>
    get(`${materialVariant}/${id}/history${queryString}`),
  disposeMaterialReceipt: (type: string, note: string, materialReceiptId: any, quantity: any) => {
    return post(`/material-export-receipt`, {
      type,
      note,
      materialExportReceiptDetail: [{ materialReceiptId, quantityByPack: quantity }]
    });
  },
  getAllDisposeMaterialVariant: (queryString: string) => get(`${materialVariant}/disposed${queryString}`),
  getOneDispose: (id: string) => get(`${materialVariant}/disposed/${id}`),
  getOneDisposeReceipt: (id: string, queryString: string) =>
    get(`${materialVariant}/${id}/material-receipt/disposed${queryString}`),
  getOneDisposedHistory: (id: string, queryString: string) =>
    get(`${materialVariant}/${id}/history/disposed${queryString}`)

};
export const disposeMaterialReceipt = async (
  type: string,
  note: string,
  materialReceiptId: any,
  quantity: any
) => {
  const res = await privateCall(
    materialApi.disposeMaterialReceipt(type, note, materialReceiptId, quantity)
  );
  return res.data;
};
export const materialTypeApi = {
  getAll: () => get(`${materialType}`)
};
export const getAllMaterialFn = async ({
  sorting,
  columnFilters,
  pagination
}: UseMaterialsInput): Promise<MaterialVariantResponse> => {
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
  let queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });
  // Make the API request
  const res = await axios(materialApi.getAll(queryString));
  return res.data;
};

export const getAllMaterialDispose = async ({
  sorting,
  columnFilters,
  pagination
}: UseMaterialsInput): Promise<MaterialVariantResponse> => {
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
  let queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });
  // Make the API request
  const res = await privateCall(materialApi.getAllDisposeMaterialVariant(queryString));
  return res.data;
};
export const getAllMaterialHasReceiptFn = async ({
  sorting,
  columnFilters,
  pagination
}: UseMaterialsInput): Promise<MaterialVariantResponse> => {
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
  let queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });
  // Make the API request
  const res = await axios(materialApi.getAllWithReceipt(queryString));
  return res.data;
};

export const getAllMaterialNoArgumentFn = async (): Promise<any> => {
  // Make the API request
  const res = await axios(materialApi.getAllNoArgument());
  return res.data;
};

export const getOneMaterial = async (id: string): Promise<MaterialVariantResponse> => {
  const res = await privateCall(materialApi.getOne(id));
  return res.data.data;
};

export const getOneMaterialReceiptFn = async (
  id: string,
  { sorting, columnFilters, pagination }: UseMaterialsInput
): Promise<MaterialReceiptResponse> => {
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
  let queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });
  // Make the API request
  const res = await privateCall(materialApi.getOneReceipt(id, queryString));
  return res.data;
};

export const getOneMaterialDisposeReceiptFn = async (
  id: string,
  { sorting, columnFilters, pagination }: UseMaterialsInput
): Promise<MaterialReceiptResponse> => {
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
  let queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });
  // Make the API request
  const res = await privateCall(materialApi.getOneDisposeReceipt(id, queryString));
  return res.data;
};

export const getOneMaterialImportReceiptFn = async (
  id: string,
  { sorting, columnFilters, pagination }: UseMaterialsInput
): Promise<MaterialImportReceiptResponse> => {
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
  let queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });
  // Make the API request
  const res = await privateCall(materialApi.getOneImportReceipt(id, queryString));
  return res.data;
};

export const getOneMaterialExportReceiptFn = async (
  id: string,
  { sorting, columnFilters, pagination }: UseMaterialsInput
): Promise<MaterialExportReceiptResponse> => {
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
  let queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });
  // Make the API request
  const res = await privateCall(materialApi.getOneExportReceipt(id, queryString));
  return res.data;
};

export const getOneMaterialHistoryFn = async (
  id: string,
  { sorting, columnFilters, pagination }: InputType
): Promise<MaterialHistoryResponse> => {
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
  let queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });
  // Make the API request
  const res = await privateCall(materialApi.getOneHistory(id, queryString));
  return res.data;
};

export const getOneMaterialDisposedHistoryFn = async (
  id: string,
  { sorting, columnFilters, pagination }: InputType
): Promise<MaterialHistoryResponse> => {
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
  let queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });
  // Make the API request
  const res = await privateCall(materialApi.getOneDisposedHistory(id, queryString));
  return res.data;
};
