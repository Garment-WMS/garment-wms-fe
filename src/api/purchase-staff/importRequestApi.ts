import { UseUsersInput } from "@/types/DemoUser";
import { UseImportRequestsResponse } from "@/types/ImportRequestType";
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import axios from "axios";
import { get } from "../ApiCaller";

let importRequestUrl = "/import-request";

export const importRequestApi = {
  getOne: (id: string) => get(`${importRequestUrl}/${id}`),
  getAll: (queryString: string) => get(`${importRequestUrl}?${queryString}`),
};

export const getAllImportRequestFn = async ({
  sorting,
  columnFilters,
  pagination,
}: UseUsersInput): Promise<UseImportRequestsResponse> => {
  const limit = pagination.pageSize;
  const offset = pagination.pageIndex;

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
    order,
  });

  // Make the API request
  const res = await axios(importRequestApi.getAll(queryString));
  return res.data.data;
};
