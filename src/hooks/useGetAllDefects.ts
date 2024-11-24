import { getInspectionReportDefects } from '@/api/services/inspectionReport';
import { ApiResponse } from '@/types/ApiResponse';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetAllDefects = () => {
  const {
    data: data,
    status: status,
    isPending,
    isError,
    isSuccess,
    isFetching
  } = useQuery<ApiResponse, AxiosError>({
    queryKey: ['purchaseOrderStatistic'],
    queryFn: () => getInspectionReportDefects()
  });
  return { data, status, isPending, isError, isSuccess, isFetching };
};
