import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getProductionBatchByPlan } from '@/api/services/productionBatch';
import { SortingState, PaginationState } from '@tanstack/react-table';
import { ProductionBatchListResponse } from '@/types/ProductionBatchListResponse';

interface UseGetProductionBatchByPlanParams {
  productionPlanId: string;
  sorting: SortingState;
  pagination: PaginationState;
}

export const useGetProductionBatchByPlan = ({
  productionPlanId,
  sorting,
  pagination
}: UseGetProductionBatchByPlanParams) => {
  const { data, status, isPending, isError, isSuccess, isFetching } = useQuery<
    ProductionBatchListResponse,
    AxiosError
  >({
    queryKey: [
      'productionBatchByPlan',
      productionPlanId,
      sorting,
      pagination.pageIndex,
      pagination.pageSize
    ],
    queryFn: () => getProductionBatchByPlan(productionPlanId, pagination, sorting)
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
