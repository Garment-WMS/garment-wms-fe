import { getAllInventoryReportFn, getAllInventoryReportForWarehouseStaffFn } from '@/api/services/inventoryReportApi,';
import { getAllMaterialFn } from '@/api/services/materialApi';
import { InventoryReportResponse } from '@/types/InventoryReport';
import { MaterialVariantResponse } from '@/types/MaterialTypes';
import { InputType } from '@/types/Shared';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';


export const useGetAllInventoryReport = ({
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<InventoryReportResponse, AxiosError>({
      queryKey: ['InventoryReport', sorting, columnFilters, pagination],
      queryFn: () =>
        getAllInventoryReportFn({
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let reportList = data?.data.data;
    const pageMeta = data?.data.pageMeta;

    // if(AxiosError.){
    //     materialList = [];

    // }

    return {pageMeta, reportList,isFetching, isLoading };
  };

  export const useGetAllStaffInventoryReport = ({
    sorting,
    columnFilters,
    pagination,
  }: InputType) => {
        
    const {
      data,
      isLoading,
      isFetching
    } = useQuery<InventoryReportResponse, AxiosError>({
      queryKey: ['StaffInventoryReport', sorting, columnFilters, pagination],
      queryFn: () =>
        getAllInventoryReportForWarehouseStaffFn({
          sorting,
          columnFilters,
          pagination,
        }),

    });
    let reportList = data?.data.data;
    const pageMeta = data?.data.pageMeta;

    // if(AxiosError.){
    //     materialList = [];

    // }

    return {pageMeta, reportList,isFetching, isLoading };
  };