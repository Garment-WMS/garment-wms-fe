import { TableProps } from '@/types/CompositeTable';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useEffect } from 'react';
import { DataTableToolbar } from './DataTableToolbar';
import TanStackBasicTableTableComponent from './TableComponent';
import TanStackBasicTablePaginationNavigationComponent from './TablePagnationNavigation';
import TableSkeleton from '../TableSekeleton';

interface TanStackBasicTableProps<TData, TValue> extends TableProps<TData, TValue> {
  showToolbar?: boolean;
  totalPages?: number;
  searchColumnId?: string;
  searchPlaceholder?: string;
}

export default function TanStackBasicTable<TData, TValue>({
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
  setColumnFilters,
  showToolbar = true,
  totalPages,
  searchColumnId,
  searchPlaceholder = 'Search'
}: TanStackBasicTableProps<TData, TValue>) {
  const table = useReactTable<TData>({
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
    onPaginationChange: (updater) => {
      if (setPagination) {
        setPagination((prevPagination) => {
          const newPagination = typeof updater === 'function' ? updater(prevPagination) : updater;
          return {
            ...newPagination,
            pageIndex: newPagination.pageIndex
          };
        });
      } else {
        console.warn('setPagination is undefined');
      }
    },

    rowCount: paginatedTableData?.totalFiltered,
    pageCount: totalPages,
    manualPagination: true,
    state: {
      sorting,
      pagination,
      columnFilters
    }
  });

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
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-evenly gap-4"></div>
      {showToolbar && (
        <DataTableToolbar
          table={table}
          searchColumnId={searchColumnId}
          searchPlaceholder={searchPlaceholder}
        />
      )}
      {isTableDataLoading ? (
        <TableSkeleton />
      ) : (
        <>
          <div className="rounded-md border mb-8">
            <TanStackBasicTableTableComponent table={table} columns={columns} />
          </div>
          {totalPages && totalPages > 1 && (
            <TanStackBasicTablePaginationNavigationComponent table={table} />
          )}
        </>
      )}
    </div>
  );
}
