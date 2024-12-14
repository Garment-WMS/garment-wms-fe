import { InputType } from '@/types/Shared';
import { get, post } from '../ApiCaller';
import {
  ProductExportReceiptResponse,
  ProductHistoryResponse,
  ProductImportReceiptResponse,
  ProductReceiptResponse,
  ProductVariantResponse
} from '@/types/ProductType';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import privateCall from '../PrivateCaller';

const productPath = '/product';
const productVariantPath = '/product-variant';
const productReceiptPath = '/product-receipt';
export const productVariantApi = {
  getAllProductVariant(queryString: string) {
    return get(`${productVariantPath}${queryString}`);
  },
  getAllProductVariantWithReceipt(queryString: string) {
    return get(`${productVariantPath}/has-receipt${queryString}`);
  },
  getOneProductVariant(id: string) {
    return get(`${productVariantPath}/${id}`);
  },
  getOneProductReceipt(id: string, queryString: string) {
    return get(`${productVariantPath}/${id}/product-receipt${queryString}`);
  },
  getOneProductReceiptDetails(id: string) {
    return get(`${productReceiptPath}/${id}`);
  },
  uploadImage: (id: string, data: FormData, config: any) =>
    post(`${productVariantPath}/${id}/image`, data, undefined, config),
  getOneProductImportReceipt: (id: string, queryString: string) =>
    get(`${productVariantPath}/${id}/import-receipt/${queryString}`),
  getOneProductExportReceipt: (id: string, queryString: string) =>
    get(`${productVariantPath}/${id}/export-receipt/${queryString}`),
  getReceiptStatistics: (data: any) => post(`${productVariantPath}/chart`, data),
  createProductFormula: (
    productId: string,
    name: string,
    quantityRangeStart: number,
    quantityRangeEnd: number,
    productFormulaMaterials: any[]
  ) =>
    post(`/product-formula`, {
      productSizeId: productId,
      name,
      quantityRangeStart,
      quantityRangeEnd,
      productFormulaMaterials
    }),
  createProductVariant(data: FormData, config: any) {
    return post(`${productVariantPath}/form-data`, data, undefined, config);
  },
  getOneHistory: (id: string, queryString: string) =>
    get(`${productVariantPath}/${id}/history${queryString}`),
  disposeProduct: (productReceiptId: string, quantityByPack: number) =>
    post('/product-receipt/dispose', { productReceipts: [{ productReceiptId, quantityByPack }] })
};
export const disposeProductFn = async (productReceiptId: string, quantityByPack: number) => {
  const res = await privateCall(productVariantApi.disposeProduct(productReceiptId, quantityByPack));
  return res.data;
};

export const productApi = {
  getAllProduct() {
    return get(`${productPath}`);
  },
  getOneProduct(id: string) {
    return get(`${productPath}/${id}`);
  }
};

export const getAllProductVariantFn = async ({
  sorting,
  columnFilters,
  pagination
}: InputType): Promise<ProductVariantResponse> => {
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
  const res = await privateCall(productVariantApi.getAllProductVariant(queryString));
  return res.data;
};
export const getAllProductVariantHasReceiptFn = async ({
  sorting,
  columnFilters,
  pagination
}: InputType): Promise<ProductVariantResponse> => {
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
  const res = await privateCall(productVariantApi.getAllProductVariantWithReceipt(queryString));
  return res.data;
};
export const getOneProductReceiptFn = async (
  id: string,
  { sorting, columnFilters, pagination }: InputType
): Promise<ProductReceiptResponse> => {
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
  const res = await privateCall(productVariantApi.getOneProductReceipt(id, queryString));
  return res.data;
};
export const getOneProductImportReceiptFn = async (
  id: string,
  { sorting, columnFilters, pagination }: InputType
): Promise<ProductImportReceiptResponse> => {
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
  const res = await privateCall(productVariantApi.getOneProductImportReceipt(id, queryString));
  return res.data;
};

export const getOneProductExportReceiptFn = async (
  id: string,
  { sorting, columnFilters, pagination }: InputType
): Promise<ProductExportReceiptResponse> => {
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
  const res = await privateCall(productVariantApi.getOneProductExportReceipt(id, queryString));
  return res.data;
};

export const createProductFormula: {
  (
    productId: string,
    name: string,
    quantityRangeStart: number,
    quantityRangeEnd: number,
    productFormulaMaterials: any[]
  ): Promise<any>;
} = async (
  productId: string,
  name: string,
  quantityRangeStart: number,
  quantityRangeEnd: number,
  productFormulaMaterials: any[]
) => {
  const res = await privateCall(
    productVariantApi.createProductFormula(
      productId,
      name,
      quantityRangeStart,
      quantityRangeEnd,
      productFormulaMaterials
    )
  );

  return res.data;
};
export const getOneProductHistory = async (
  id: string,
  { sorting, columnFilters, pagination }: InputType
): Promise<ProductHistoryResponse> => {
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
  const res = await privateCall(productVariantApi.getOneHistory(id, queryString));
  return res.data;
};
