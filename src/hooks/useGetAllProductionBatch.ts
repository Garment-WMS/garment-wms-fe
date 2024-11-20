import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getAllProductionBatch } from '@/api/services/productionBatch';
import { SortingState, ColumnFiltersState, PaginationState } from '@tanstack/react-table';
import { ProductionBatchListResponse } from '@/types/ProductionBatchListResponse';

interface UseGetAllProductionBatchParams {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export const useGetAllProductionBatch = ({
  sorting,
  columnFilters,
  pagination
}: UseGetAllProductionBatchParams) => {
  const { data, status, isPending, isError, isSuccess, isFetching } = useQuery<
    ProductionBatchListResponse,
    AxiosError
  >({
    queryKey: [
      'productionBatchList',
      sorting,
      columnFilters,
      pagination.pageIndex,
      pagination.pageSize
    ],
    queryFn: () => getAllProductionBatch({ sorting, columnFilters, pagination })
  });

  const productionBatchList = data?.data;
  const pageMeta = data?.pageMeta;

  return {
    data,
    status,
    isPending,
    isFetching,
    isError,
    isSuccess,
    pageMeta,
    productionBatchList
  };
};
