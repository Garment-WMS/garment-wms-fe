import Loading from '@/components/common/Loading';
import { TableProps, UseGetTableResponseType } from '@/types/CompositeTable';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DataTableToolbar } from './DataTableToolbar';
import TanStackBasicTablePaginationNavigationComponent from '@/components/common/CompositeTable/TablePagnationNavigation';
import TanStackBasicTableTableComponent from '@/components/common/CompositeTable/TableComponent';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';
import KanbanDisplayList from './KanbanDisplayList/KanbanDisplayList';
export interface CustomTableProps<TData, TValue> {
  selectedItems?: any;
  setSelectedItems?: any;
  isTableDataLoading: boolean;
  paginatedTableData?: UseGetTableResponseType<TData>;
  columns: ColumnDef<TData, TValue>[];
  pagination?: PaginationState;
  setPagination?: Dispatch<SetStateAction<PaginationState>>;
  sorting?: SortingState;
  setSorting?: Dispatch<SetStateAction<SortingState>>;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
}
type DisplayState = 'grid' | 'list';
export default function KanbanList<TData, TValue>({
  selectedItems,
  setSelectedItems,
  isTableDataLoading,
  paginatedTableData,
  columns,
  pagination = {
    pageIndex: 0,
    pageSize: 20
  },
  sorting = [],
  setSorting,
  setPagination,
  columnFilters = [],
  setColumnFilters
}: CustomTableProps<TData, TValue>) {
  const table = useReactTable({
    data: paginatedTableData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),

    // sort config
    onSortingChange: setSorting,
    enableMultiSort: true,
    manualSorting: true,
    sortDescFirst: true,

    // filter config
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    manualFiltering: true,

    // pagination config
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    rowCount: paginatedTableData?.totalFiltered,
    pageCount: Math.ceil(
      (paginatedTableData?.totalFiltered || 0) / (paginatedTableData?.limit || 1)
    ),
    manualPagination: true,
    state: {
      sorting,
      pagination,
      columnFilters
    }
  });
  const [displayState, setDisplayState] = useState<DisplayState>('grid');
  const handleDisplayChange = (state: string) => {
    setDisplayState(state as DisplayState);
  };
  // to reset page index to first page
  useEffect(() => {
    if (setPagination) {
      setPagination((pagination) => ({
        pageIndex: 0,
        pageSize: pagination.pageSize
      }));
    }
  }, [columnFilters, setPagination]);

  return (
    <div className="px-8">
      {isTableDataLoading ? (
        <Loading />
      ) : (
        <>
          <DataTableToolbar displayState={displayState} table={table} />

          <KanbanDisplayList selectedItems={selectedItems} setSelectedItems={setSelectedItems} paginatedData={paginatedTableData} isLoading={isTableDataLoading} />

          {(paginatedTableData?.total || 0) > pagination.pageSize && (
            <TanStackBasicTablePaginationNavigationComponent table={table} />
          )}
        </>
      )}
    </div>
  );
}
