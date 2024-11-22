import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

export interface InputType {
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    pagination: PaginationState;
  }

  export interface PageMetaData{
    total?: number;
    offset?: number;
    limit?: number;
    page?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  }
  export interface filterType {
    label: string;
    value: string;
  }