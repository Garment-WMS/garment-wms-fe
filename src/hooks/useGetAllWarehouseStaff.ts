import { getWarehouseStaff } from '@/api/services/userApi';
import { ApiResponse } from '@/types/ApiResponse';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetAllWarehouseStaff = () => {
  const {
    data,
    status,
    isLoading: isPending,
    isFetching,
    isError,
    isSuccess
  } = useQuery<ApiResponse, AxiosError>({
    queryKey: ['warehouseStaffList'],
    queryFn: async () => {
      const response = await getWarehouseStaff();
      return response.data;
    }
  });

  return { data, status, isPending, isFetching, isError, isSuccess };
};
