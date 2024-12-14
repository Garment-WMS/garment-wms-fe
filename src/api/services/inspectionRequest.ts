import { InspectionRequestListResponse } from '@/types/InspectionRequestListResponse';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { get } from '../ApiCaller';
import privateCall from '../PrivateCaller';
import { ApiResponse } from '@/types/ApiResponse';
import { InspectionRequestType } from '@/enums/inspectionRequestType';

export const inspectionRequestApi = {
  getAll: () => get('/inspection-request'),
  getById: (id: string) => get(`/inspection-request/${id}`),
  getStatistic: (type: InspectionRequestType) => get(`/inspection-request/statistic`, { type })
};

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

  const config = inspectionRequestApi.getAll();
  config.url += queryString;

  const response = await privateCall(config);
  return response.data.data as InspectionRequestListResponse;
};

export const getInspectionRequestById = async (id: string): Promise<ApiResponse> => {
  const config = inspectionRequestApi.getById(id);
  const response = await privateCall(config);

  return response.data as ApiResponse;
};

export const getInspectionRequestStatistic = async ({
  type
}: GetInspectionRequestStatisticInput): Promise<ApiResponse> => {
  const config = inspectionRequestApi.getStatistic(type);
  const response = await privateCall(config);
  return response.data as ApiResponse;
};
