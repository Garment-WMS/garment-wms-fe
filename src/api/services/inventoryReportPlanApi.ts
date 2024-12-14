import { InventoryReportPlan, InventoryReportPlanResponse, InventoryReportPlanToCreate, InventoryReportPlanToRender, InventoryReportPlanToRenderResponse, OverallInventoryReportPlanToCreate } from '@/types/InventoryReport';
import { get, patch, post } from '../ApiCaller';
import { InputType } from '@/types/Shared';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import privateCall from '../PrivateCaller';
import { ColumnFiltersState } from '@tanstack/react-table';

const inventoryReportPlanApiPath = '/inventory-report-plan';
export const inventoryReportPlanApi = {
  createInventoryReportPlan(data: InventoryReportPlanToCreate) {
    return post(inventoryReportPlanApiPath, data);
  },
  createOverallInventoryReportPlan(data: OverallInventoryReportPlanToCreate) {
    return post(`${inventoryReportPlanApiPath}/overall`, data);
  },
  getAllForWarehouseStaff(queryString: string){
    return get(`${inventoryReportPlanApiPath}/warehouse-staff/${queryString}`);
   },
  getOne(id: string) {
    return get(`${inventoryReportPlanApiPath}/${id}`);
  },
  getAllInTimeRange: (queryString: string) => {
    return get(`${inventoryReportPlanApiPath}/${queryString}`);
  },
  receiveInventoryReport:(id:string)=> {
    return patch(`${inventoryReportPlanApiPath}/${id}/process`);
  },
  startInventoryReportPlan : (id:string) => {
    return patch(`${inventoryReportPlanApiPath}/${id}/start`);
  },
  awaitInventoryReportPlan : (id:string) => {
    return patch(`${inventoryReportPlanApiPath}/${id}/await`);
  },
  cancelInventoryReportPlan : (id:string) => {
    return patch(`${inventoryReportPlanApiPath}/${id}/cancel`);
  }
};
export const getAllInventoryReportPlanFn = async ({
  sorting,
  columnFilters,
  pagination
}: InputType): Promise<InventoryReportPlanToRender[]> => {
  const limit = pagination.pageSize;
  const offset = pagination.pageIndex * pagination.pageSize;

  // Initialize filter and order arrays
  const filter: any[] = [];
  const order: any[] = [];
  //     const filters = columnFilters.map(filter => {
  //       // Replace dots with underscores only if there are any dots in the id
  //       const fieldKey = filter.id.includes('_') ? filter.id.replace('_', '.') : filter.id;

  //       return {
  //           id: fieldKey,
  //           value: filter.value,
  //       };
  //   });
  const sorts = sorting.map((sort) => {
    // Replace dots with underscores only if there are any dots in the id
    const fieldKey = sort.id.includes('_') ? sort.id.replace('_', '.') : sort.id;

    return {
      id: fieldKey,
      desc: sort.desc
    };
  });

  // Build filter array from columnFilters
  columnFilters.forEach((filterItem) => {
    const { id, value } = filterItem;
    // Check the type of operation based on your requirement
    let type: FilterOperationType;
    // Check the type of operation based on filter `id`
    if (id === 'from') {
      type = FilterOperationType.Gte; // Greater than or equal to
    } else if (id === 'to') {
      type = FilterOperationType.Lte; // Less than or equal to
    } else {

      type = FilterOperationType.In; // Default to "equals" for other fields
    }

    filter.push({ field: id, type, value });
  });
  sorts.forEach((sort) => {
    const direction = sort.desc ? 'desc' : 'asc';
    order.push({ field: sort.id, dir: direction });
  });

  // Construct the query string
  const queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });

  // Make the API request
  const res = await privateCall(inventoryReportPlanApi.getAllInTimeRange(queryString));
  return res.data.data;
};

export const getAllInventoryReportPlanForWarehouseStaffFn = async ({
  sorting,
  columnFilters,
  pagination
}: InputType): Promise<InventoryReportPlanToRenderResponse> => {
  const limit = pagination.pageSize;
  const offset = pagination.pageIndex * pagination.pageSize;

  // Initialize filter and order arrays
  const filter: any[] = [];
  const order: any[] = [];

  const sorts = sorting.map((sort) => {
    // Replace dots with underscores only if there are any dots in the id
    const fieldKey = sort.id.includes('_') ? sort.id.replace('_', '.') : sort.id;

    return {
      id: fieldKey,
      desc: sort.desc
    };
  });

  // Build filter array from columnFilters
  columnFilters.forEach((filterItem) => {
    const { id, value } = filterItem;
    // Check the type of operation based on your requirement
    let type: FilterOperationType;
    // Check the type of operation based on filter `id`
    if (id === 'from') {
      type = FilterOperationType.Gte; // Greater than or equal to
    } else if (id === 'to') {
      type = FilterOperationType.Lte; // Less than or equal to
    } else {

      type = FilterOperationType.In; // Default to "equals" for other fields
    }

    filter.push({ field: id, type, value });
  });
  sorts.forEach((sort) => {
    const direction = sort.desc ? 'desc' : 'asc';
    order.push({ field: sort.id, dir: direction });
  });

  // Construct the query string
  const queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order
  });

  // Make the API request
  const res = await privateCall(inventoryReportPlanApi.getAllForWarehouseStaff(queryString));
  return res.data.data;
};

// function buildFilterQueryString(columnFilters: ColumnFiltersState): string {
//     const queryParams: string[] = [];

//     columnFilters.forEach((filter, index) => {
//       const { id, value } = filter;

//       let type = ''; // Determine the operation type based on `id`
//       if (id === 'from') {
//         type = '>=';
//       } else if (id === 'to') {
//         type = '<=';
//       } else {
//         type = 'in'; // Default to 'in' if no specific type is given
//       }

//       // Add filter parameters in the specified format
//       queryParams.push(`filter[${index}][value]=${encodeURIComponent(value)}`);
//       queryParams.push(`filter[${index}][type]=${encodeURIComponent(type)}`);
//       queryParams.push(`filter[${index}][field]=${encodeURIComponent(id)}`);
//     });

//     // Combine the base URL with the query parameters
//     return `?${queryParams.join('&')}`;
//   }
//   export const getAllInventoryReportPlanFn = async (

//     columnFilters

//   : ColumnFiltersState): Promise<InventoryReportPlanResponse> => {

//     const queryString = buildFilterQueryString(columnFilters);
//     console.log('queryS', queryString)
//     // Make the API request
//     const res = await privateCall(inventoryReportPlanApi.getAllInTimeRange(queryString));
//     return res.data.data;
//   };
