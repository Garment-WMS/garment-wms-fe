import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';

interface GetAllInspectioNReportsInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}
