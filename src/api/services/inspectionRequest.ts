import { InspectionRequestListResponse } from '@/types/InspectionRequestListResponse';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { get } from './ApiCaller';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { InspectionRequestType } from '@/enums/inspectionRequestType';

interface GetAllInspectionRequestsInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

interface GetInspectionRequestStatisticInput {
  type: InspectionRequestType;
}

export const getAllInspectionRequests = async ({
  sorting,
  columnFilters,
  pagination
}: GetAllInspectionRequestsInput): Promise<InspectionRequestListResponse> => {
  const limit = pagination.pageSize;
  const offset = pagination.pageIndex * pagination.pageSize;

  // Initialize filter and order arrays
  const filter: any[] = [];
  const order: any[] = [];

  // Build filter array from columnFilters
  columnFilters.forEach((filterItem) => {
    const { id, value } = filterItem;

    // Determine operation type based on the filter value
    let type: FilterOperationType;
    if (Array.isArray(value)) {
      type = FilterOperationType.InStrings; // Example for array values
    } else if (value === null) {
      type = FilterOperationType.NeNull; // Example for null values
    } else {
      type = FilterOperationType.Eq; // Default to equality for single values
    }

    filter.push({ field: id, type, value });
  });

  // Build order array from sorting
  sorting.forEach((sort) => {
    const direction = sort.desc ? 'desc' : 'asc';
    order.push({ field: sort.id, dir: direction });
  });

  // Construct the query string using FilterBuilder
  const queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });

  const fullUrl = `/inspection-request${queryString}`;

  try {
    const config = get(fullUrl);
    const response = await axios(config);
    return response.data.data as InspectionRequestListResponse;
  } catch (error) {
    console.error('Error fetching inspection reports:', error);
    throw new Error('Failed to fetch inspection reports');
  }
};

export const getInspectionRequestById = async (id: string): Promise<ApiResponse> => {
  try {
    const config = get(`/inspection-request/${id}`);
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Failed to fetch inspection request by ID:', error);
    throw new Error('Failed to fetch inspection request');
  }
};

export const getInspectionRequestStatistic = async ({
  type
}: GetInspectionRequestStatisticInput): Promise<ApiResponse> => {
  try {
    const queryString = `?type=${type}`;
    const fullUrl = `/inspection-request/statistic${queryString}`;
    const config = get(fullUrl);
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Failed to fetch inspection request statistic:', error);
    throw new Error('Failed to fetch inspection request statistic');
  }
};
