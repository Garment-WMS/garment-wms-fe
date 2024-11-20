import { getAllInspectionRequests } from '@/api/services/inspectionRequest';
import { InspectionRequestListResponse } from '@/types/InspectionRequestListResponse';
import { useQuery } from '@tanstack/react-query';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { AxiosError } from 'axios';

interface UseGetAllInspectionRequestParams {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export const useGetAllInspectionRequest = ({
  sorting,
  columnFilters,
  pagination
}: UseGetAllInspectionRequestParams) => {
  const {
    data,
    status,
    isLoading: isPending,
    isError,
    isSuccess,
    isFetching
  } = useQuery<InspectionRequestListResponse, AxiosError>({
    queryKey: [
      'inspectionRequestList',
      sorting,
      columnFilters,
      pagination.pageIndex,
      pagination.pageSize
    ],
    queryFn: () => getAllInspectionRequests({ sorting, columnFilters, pagination })
  });
  const inspectionRequestList = data?.data;
  const pageMeta = data?.pageMeta;
  return {
    data,
    status,
    isPending,
    isFetching,
    isError,
    isSuccess,
    pageMeta,
    inspectionRequestList
  };
};
