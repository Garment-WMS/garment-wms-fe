import { getInspectionRequestStatistic } from '@/api/services/inspectionRequest';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import { ApiResponse } from '@/types/ApiResponse';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetInspectionRequestByType = (type: InspectionRequestType) => {
  const {
    data,
    status,
    isFetching: isPending,
    isError,
    isSuccess
  } = useQuery<ApiResponse, AxiosError>({
    queryKey: ['inspectionRequestStatistic', type],
    queryFn: () => getInspectionRequestStatistic({ type }),
    enabled: !!type
  });

  return { data, status, isPending, isError, isSuccess };
};
