import { InspectionReportListResponse } from '@/types/InspectionReportListResponse';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { get } from '../ApiCaller';
import privateCall from '../PrivateCaller';
import { ApiResponse } from '@/types/ApiResponse';

export const inspectionReportApi = {
  getAll: () => get('/inspection-report'),
  getDefects: () => get('/defect')
};

interface GetAllInspectionReportsInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export const getAllInspectionReports = async ({
  sorting,
  columnFilters,
  pagination
}: GetAllInspectionReportsInput): Promise<InspectionReportListResponse> => {
  const limit = pagination.pageSize;
  const offset = pagination.pageIndex * pagination.pageSize;

  const filter: any[] = [];
  const order: any[] = [];

  columnFilters.forEach((filterItem) => {
    const { id, value } = filterItem;

    let type: FilterOperationType;
    if (Array.isArray(value)) {
      type = FilterOperationType.InStrings;
    } else if (value === null) {
      type = FilterOperationType.NeNull;
    } else {
      type = FilterOperationType.Eq;
    }

    filter.push({ field: id, type, value });
  });

  sorting.forEach((sort) => {
    const direction = sort.desc ? 'desc' : 'asc';
    order.push({ field: sort.id, dir: direction });
  });

  const queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });

  const config = inspectionReportApi.getAll();
  config.url += queryString;

  const response = await privateCall(config);
  return response.data.data as InspectionReportListResponse;
};

export const getInspectionReportDefects = async (): Promise<ApiResponse> => {
  const config = inspectionReportApi.getDefects();
  const response = await privateCall(config);

  return response.data as ApiResponse;
};
