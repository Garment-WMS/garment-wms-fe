import Loading from '@/components/common/Loading';
import { TableProps } from '@/types/CompositeTable';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import TanStackBasicTablePaginationNavigationComponent from '@/components/common/CompositeTable/TablePagnationNavigation';
import TanStackBasicTableTableComponent from '@/components/common/CompositeTable/TableComponent';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';
import KanbanDisplayList from '@/components/common/KanbanDisplayList/KanbanDisplayList';
import { DataTableToolbar } from '@/components/common/CompositeTable/DataTableToolbar';

type DisplayState = 'grid' | 'list';
export default function CompositeTableWithGrid<TData, TValue>({
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
    <div className="px-8 pb-4">
      {isTableDataLoading ? (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={() => handleDisplayChange('grid')} variant="outline" size="icon">
              <Grid size={20} />
            </Button>
            <Button onClick={() => handleDisplayChange('list')} variant="outline" size="icon">
              <List size={20} />
            </Button>
          </div>
          <DataTableToolbar searchColumnId='code'  table={table} />
          <>
            {displayState === 'grid' ? (
              <KanbanDisplayList
                paginatedData={paginatedTableData}
                isLoading={isTableDataLoading}
              />
            ) : (
              <div className="rounded-md border mb-8">
                <TanStackBasicTableTableComponent table={table} columns={columns} />
              </div>
            )}
          </>

          {(paginatedTableData?.total || 0) > pagination.pageSize && (
            <TanStackBasicTablePaginationNavigationComponent table={table} />
          )}
        </>
      )}
    </div>
  );
}
