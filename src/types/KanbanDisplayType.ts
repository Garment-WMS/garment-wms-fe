import { ColumnFiltersState, PaginationState } from '@tanstack/react-table';
import { UseGetTableResponseType } from './CompositeTable';
import { Dispatch, SetStateAction } from 'react';
import { PageMeta } from './purchaseOrder';
import { PageMetaData } from './ImportRequestType';

export interface KanbanDisplayProps<TData> {
  isLoading: boolean;
  paginatedData: UseGetTableResponseType<TData>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  pageMeta?: PageMetaData;
}
