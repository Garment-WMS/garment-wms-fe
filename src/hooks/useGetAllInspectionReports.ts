import { getAllInspectionReports } from '@/api/services/inspectionReport';
import { InspectionReportListResponse } from '@/types/InspectionReportListResponse';
import { useQuery } from '@tanstack/react-query';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { AxiosError } from 'axios';

interface UseGetAllPurchaseOrderParams {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export const useGetAllInspectionReport = ({
  sorting,
  columnFilters,
  pagination
}: UseGetAllPurchaseOrderParams) => {
  const {
    data,
    status,
    isLoading: isPending,
    isError,
    isSuccess,
    isFetching
  } = useQuery<InspectionReportListResponse, AxiosError>({
    queryKey: [
      'inspectionReportList',
      sorting,
      columnFilters,
      pagination.pageIndex,
      pagination.pageSize
    ],
    queryFn: () => getAllInspectionReports({ sorting, columnFilters, pagination })
  });
  const inspectionReportList = data?.data;
  const pageMeta = data?.pageMeta;
  return {
    data,
    status,
    isPending,
    isFetching,
    isError,
    isSuccess,
    pageMeta,
    inspectionReportList
  };
};
