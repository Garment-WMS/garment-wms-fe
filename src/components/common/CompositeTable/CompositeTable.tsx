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
  searchWidth?: string;
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
  searchPlaceholder = 'Search',
  searchWidth = 'lg:w-[350px]'
}: TanStackBasicTableProps<TData, TValue>) {
  // Calculate total pages based on totalFiltered and pageSize
  const calculatedTotalPages = Math.ceil((paginatedTableData?.total || 0) / pagination.pageSize);

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

    // Use totalFiltered for rowCount, calculate pageCount from totalFiltered
    rowCount: paginatedTableData?.total || 0,
    pageCount: calculatedTotalPages,
    manualPagination: true,
    state: {
      sorting,
      pagination,
      columnFilters
    }
  });

  // Reset page index to first page on column filter change
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
          searchWidth={searchWidth}
        />
      )}
      {isTableDataLoading ? (
        <TableSkeleton />
      ) : (
        <>
          <div className="rounded-md border mb-8">
            <TanStackBasicTableTableComponent table={table} columns={columns} />
          </div>
          {/* Ensure pagination component displays correctly */}
          {(paginatedTableData?.total || 0) > pagination.pageSize && (
            <TanStackBasicTablePaginationNavigationComponent table={table} />
          )}
        </>
      )}
    </div>
  );
}
