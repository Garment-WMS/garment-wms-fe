import { getAllSuppliers } from '@/api/services/supplier';
import { ApiResponse } from '@/types/ApiResponse';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetAllSupplier = () => {
  const {
    data: data,
    status: status,
    isPending,
    isFetching,
    isError,
    isSuccess
  } = useQuery<ApiResponse, AxiosError>({
    queryKey: ['suppliersList'],
    queryFn: () => getAllSuppliers()
  });
  return { data, status, isPending, isFetching, isError, isSuccess };
};
