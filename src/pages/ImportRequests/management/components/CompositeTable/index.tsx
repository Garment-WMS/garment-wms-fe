import TanStackBasicTableTableComponent from '@/components/common/CompositeTable/TableComponent';
import TanStackBasicTablePaginationNavigationComponent from '@/components/common/CompositeTable/TablePagnationNavigation';
import { TableProps } from '@/types/CompositeTable';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useEffect } from 'react';
import { DataTableToolbar } from './DataTableToolBar';
import TableSkeleton from '@/components/common/TableSekeleton';

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
  setColumnFilters
}: TableProps<TData, TValue>) {
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

  // to reset page index to first page
  useEffect(() => {
    if (setPagination) {
      setPagination((pagination) => ({
        pageIndex: 0,
        pageSize: pagination.pageSize
      }));
    }
  }, [columnFilters, setPagination, isTableDataLoading]);

  return (
    <div className="p-8 ">
      <div className="flex flex-col md:flex-row justify-evenly gap-4"></div>
      <>
        <h1 className="text-2xl font-bold mb-4">Import Request Lists</h1>
        <DataTableToolbar table={table} />
        <div className="rounded-md border mb-8">
          {isTableDataLoading ? (
            <TableSkeleton />
          ) : (
            <TanStackBasicTableTableComponent table={table} columns={columns} />
          )}
        </div>
        <TanStackBasicTablePaginationNavigationComponent table={table} />
      </>
    </div>
  );
}
