import { getInspectionRequestById } from '@/api/services/inspectionRequest';
import { ApiResponse } from '@/types/ApiResponse';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetInspectionRequestById = (id: string) => {
  const {
    data: data,
    status: status,
    isPending,
    isError,
    isSuccess
  } = useQuery<ApiResponse, AxiosError>({
    queryKey: ['inspectionRequest', id],
    queryFn: () => getInspectionRequestById(id),
    enabled: !!id
  });
  return { data, status, isPending, isError, isSuccess };
};
