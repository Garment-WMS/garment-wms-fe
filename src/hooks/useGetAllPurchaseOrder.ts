import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getAllPurchaseOrders } from '@/api/services/purchaseOrder';
import { SortingState, ColumnFiltersState, PaginationState } from '@tanstack/react-table';
import { PurchaseOrderListResponse } from '@/types/PurchaseOrderListResponse';

interface UseGetAllPurchaseOrderParams {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export const useGetAllPurchaseOrder = ({
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
  } = useQuery<PurchaseOrderListResponse, AxiosError>({
    queryKey: [
      'purchaseOrdersList',
      sorting,
      columnFilters,
      pagination.pageIndex,
      pagination.pageSize
    ],
    queryFn: () => getAllPurchaseOrders({ sorting, columnFilters, pagination })
  });

  const purchaseOrderList = data?.data;
  const pageMeta = data?.pageMeta;

  return { data, status, isPending, isFetching, isError, isSuccess, pageMeta, purchaseOrderList };
};
