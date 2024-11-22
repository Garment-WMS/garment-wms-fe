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
  getAll: (queryString: string) => get(`${url}${queryString}`)
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
