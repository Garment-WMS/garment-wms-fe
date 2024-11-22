import { get, patch } from './ApiCaller';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { ProductionPlanListResponse } from '@/types/ProductionPlanListResponse';

interface StartProductionPlanInput {
  id: string;
}

interface GetAllProductionPlansInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export const getAllProductionPlans = async ({
  sorting,
  columnFilters,
  pagination
}: GetAllProductionPlansInput): Promise<ProductionPlanListResponse> => {
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

  const fullUrl = `/production-plan${queryString}`;

  try {
    const config = get(fullUrl);
    const response = await axios(config);
    return response.data as ProductionPlanListResponse;
  } catch (error) {
    console.error('Error fetching production plans:', error);
    throw new Error('Failed to fetch production plans');
  }
};

export const startProductionPlan = async ({
  id
}: StartProductionPlanInput): Promise<ApiResponse> => {
  const fullUrl = `/production-plan/${id}/start`;
  try {
    const config = patch(fullUrl, {});
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error) {
    console.error(`Error starting production plan with ID ${id}:`, error);
    throw new Error('Failed to start production plan');
  }
};
