import TanStackBasicTable from '@/components/common/CompositeTable';
import { useDebounce } from '@/hooks/useDebouce';
import { CustomColumnDef } from '@/types/CompositeTable'
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import React, { useState } from 'react'

type Props = {}
interface StocktakingReportProps {
    code: string;
    started: string;
    dateBalance: string;
    totaldifference: number;
    totalPositive: number;
    totalNegative: number;
    note: string;
    status: string;
}
const stocktakingData: any = {
    data: [
        {
            code: 'STK-001',
            started: '2024-10-01',
            dateBalance: '2024-10-15',
            totaldifference: -5,
            totalPositive: 10,
            totalNegative: 15,
            note: 'Checked by Supervisor',
            status: 'Completed',
        },
        {
            code: 'STK-002',
            started: '2024-10-05',
            dateBalance: '2024-10-20',
            totaldifference: 0,
            totalPositive: 8,
            totalNegative: 8,
            note: 'Rechecked',
            status: 'Pending',
        },
        {
            code: 'STK-003',
            started: '2024-10-10',
            dateBalance: '2024-10-25',
            totaldifference: 3,
            totalPositive: 5,
            totalNegative: 2,
            note: 'New stock included',
            status: 'Completed',
        },
        {
            code: 'STK-004',
            started: '2024-10-15',
            dateBalance: '2024-10-26',
            totaldifference: -2,
            totalPositive: 6,
            totalNegative: 8,
            note: 'Adjustment needed',
            status: 'In Progress',
        },
        {
            code: 'STK-005',
            started: '2024-10-18',
            dateBalance: '2024-10-27',
            totaldifference: 1,
            totalPositive: 9,
            totalNegative: 8,
            note: 'Minor discrepancies',
            status: 'Pending',
        },
    ],
    limit: 10,
    page: 1,
    total: 1,
    totalFiltered: 1,
}
const StocktakingColumn: CustomColumnDef<StocktakingReportProps>[] = [
    {
        header: 'Code',
        accessorKey: 'code',
        enableColumnFilter: false,
    },
    {
        header: 'Started',
        accessorKey: 'started',
        enableColumnFilter: false,
    },
    {
        header: 'Date Balance',
        accessorKey: 'dateBalance',
        enableColumnFilter: false,
    },
    {
        header: 'Total Difference',
        accessorKey: 'totaldifference',
        enableColumnFilter: false,
    },
    {
        header: 'Total Positive',
        accessorKey: 'totalPositive',
        enableColumnFilter: false,
    },
    {
        header: 'Total Negative',
        accessorKey: 'totalNegative',
        enableColumnFilter: false,
    },
    {
        header: 'Note',
        accessorKey: 'note',
        enableColumnFilter: false,
    },
    {
        header: 'Status',
        accessorKey: 'status',
        enableColumnFilter: false,
    }
]
const StocktakingReport = (props: Props) => {
     // sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([]);

  // column filters state of the table
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);

  const debouncedSorting: SortingState = useDebounce(sorting, 1000);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 10 //default page size
  });
  return (
    <div className='bg-white rounded-xl shadow-sm border-2'>
        <TanStackBasicTable
            columns={StocktakingColumn}
            paginatedTableData={stocktakingData}
            isTableDataLoading={false}
            pagination={pagination}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            />

    </div>
  )
}

export default StocktakingReport