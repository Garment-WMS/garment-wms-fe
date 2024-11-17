import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getAllProductionPlans } from '@/api/services/productionPlan';
import { SortingState, ColumnFiltersState, PaginationState } from '@tanstack/react-table';
import { ProductionPlanListResponse } from '@/types/ProductionPlanListResponse';

interface UseGetAllProductionPlansParams {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export const useGetAllProductionPlans = ({
  sorting,
  columnFilters,
  pagination
}: UseGetAllProductionPlansParams) => {
  const {
    data,
    status,
    isLoading: isPending,
    isError,
    isSuccess,
    isFetching
  } = useQuery<ProductionPlanListResponse, AxiosError>({
    queryKey: [
      'productionPlans',
      sorting,
      columnFilters,
      pagination.pageIndex,
      pagination.pageSize
    ],
    queryFn: () => getAllProductionPlans({ sorting, columnFilters, pagination })
  });

  const productionPlanList = data?.data;
  const pageMeta = data?.pageMeta;

  return { data, status, isPending, isFetching, isError, isSuccess, pageMeta, productionPlanList };
};
