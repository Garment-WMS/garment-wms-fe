import { InputType } from "@/types/Shared";
import { get, patch } from "../ApiCaller"
import { InventoryReportResponse } from "@/types/InventoryReport";
import { FilterBuilder, FilterOperationType } from "@chax-at/prisma-filter-common";
import privateCall from "../PrivateCaller";

const inventoryReportApiPath = '/inventory-report';
export const inventoryReportApi = {
   getAll(queryString: string){
    return get(`${inventoryReportApiPath}/${queryString}`);
   },
   getAllForWarehouseStaff(queryString: string){
    return get(`${inventoryReportApiPath}/warehouse-staff/${queryString}`);
   },
   getOneInventoryReport(id: string){
    return get(`${inventoryReportApiPath}/${id}`);
   },
   approveInventoryReport(id: string, body: any){
    return patch(`${inventoryReportApiPath}/${id}/approve`,body);
   },
   recordInventoryReport(id: string, body: any){
    return patch(`${inventoryReportApiPath}/${id}/record`,body);
   }
}
export const getAllInventoryReportFn = async ({
    sorting,
    columnFilters,
    pagination,
  }: InputType): Promise<InventoryReportResponse> => {
    const limit = pagination.pageSize;
    const offset = pagination.pageIndex * pagination.pageSize;
  
    // Initialize filter and order arrays
    const filter: any[] = [];
    const order: any[] = [];
    const filters = columnFilters.map(filter => {
      // Replace dots with underscores only if there are any dots in the id
      const fieldKey = filter.id.includes('_') ? filter.id.replace('_', '.') : filter.id;

      return {
          id: fieldKey,
          value: filter.value,
      };
  });
  const sorts = sorting.map(sort => {
    // Replace dots with underscores only if there are any dots in the id
    const fieldKey = sort.id.includes('_') ? sort.id.replace('_', '.') : sort.id;

    return {
        id: fieldKey,
        desc: sort.desc,
    };
});
  
    // Build filter array from columnFilters
    filters.forEach((filterItem) => {
      const { id, value } = filterItem;
    
      let type: FilterOperationType;
      if (id === 'name' || id === 'code') {
        type = FilterOperationType.Ilike;
      } else {
        type = FilterOperationType.In;
      }
      // Handle FilterOperationType.In as an array
    if (type === FilterOperationType.In && Array.isArray(value)) {
      // Push a single filter object with `value` as an array
      filter.push({ field: id, type, value });
    } else if (Array.isArray(value)) {
      value.forEach((val) => {
        filter.push({ field: id, type, value: val });
      });
    } else {
      filter.push({ field: id, type, value });
    }
  });
    sorts.forEach((sort) => {
      const direction = sort.desc ? 'desc' : 'asc';
      order.push({ field: sort.id, dir: direction });
    });
    // Construct the query string
    let queryString = FilterBuilder.buildFilterQueryString({
      limit,
      offset,
      filter,
      order,
    });
    // Make the API request
    const res = await privateCall(inventoryReportApi.getAll(queryString));
    return res.data;
  };

  export const getAllInventoryReportForWarehouseStaffFn = async ({
    sorting,
    columnFilters,
    pagination,
  }: InputType): Promise<InventoryReportResponse> => {
    const limit = pagination.pageSize;
    const offset = pagination.pageIndex * pagination.pageSize;
  
    // Initialize filter and order arrays
    const filter: any[] = [];
    const order: any[] = [];
    const filters = columnFilters.map(filter => {
      // Replace dots with underscores only if there are any dots in the id
      const fieldKey = filter.id.includes('_') ? filter.id.replace('_', '.') : filter.id;

      return {
          id: fieldKey,
          value: filter.value,
      };
  });
  const sorts = sorting.map(sort => {
    // Replace dots with underscores only if there are any dots in the id
    const fieldKey = sort.id.includes('_') ? sort.id.replace('_', '.') : sort.id;

    return {
        id: fieldKey,
        desc: sort.desc,
    };
});
  
    // Build filter array from columnFilters
    filters.forEach((filterItem) => {
      const { id, value } = filterItem;
    
      let type: FilterOperationType;
      if (id === 'name' || id === 'code') {
        type = FilterOperationType.Ilike;
      } else {
        type = FilterOperationType.In;
      }
      // Handle FilterOperationType.In as an array
    if (type === FilterOperationType.In && Array.isArray(value)) {
      // Push a single filter object with `value` as an array
      filter.push({ field: id, type, value });
    } else if (Array.isArray(value)) {
      value.forEach((val) => {
        filter.push({ field: id, type, value: val });
      });
    } else {
      filter.push({ field: id, type, value });
    }
  });
    sorts.forEach((sort) => {
      const direction = sort.desc ? 'desc' : 'asc';
      order.push({ field: sort.id, dir: direction });
    });
    // Construct the query string
    let queryString = FilterBuilder.buildFilterQueryString({
      limit,
      offset,
      filter,
      order,
    });
    // Make the API request
    const res = await privateCall(inventoryReportApi.getAllForWarehouseStaff(queryString));
    return res.data;
  };