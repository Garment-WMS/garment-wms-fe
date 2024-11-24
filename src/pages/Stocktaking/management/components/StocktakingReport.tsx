import TanStackBasicTable from '@/components/common/CompositeTable';
import { useDebounce } from '@/hooks/useDebouce';
import { useGetAllInventoryReport } from '@/hooks/useGetAllInventoryReport';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import React, { useState } from 'react'
import { badgeVariants } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { formatDateTimeToDDMMYYYYHHMM } from "@/helpers/convertDate";
import { getStatusBadgeVariant } from "@/helpers/getStatusBadgeVariant";
import { CustomColumnDef } from "@/types/CompositeTable";
import { InventoryReport, InventoryReportPlanStatus, InventoryReportStatus } from "@/types/InventoryReport";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/Label';
import capitalizeFirstLetter from '@/helpers/capitalizeFirstLetter';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
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
 const StocktakingColumn: CustomColumnDef<InventoryReport>[] = [
    {
      header: 'Inventory report code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row.original.code}</div>
          </div>
        );
      }
    },
    {
        header: 'Inventory report plan code',
        accessorKey: 'code',
        enableColumnFilter: false,
        cell: ({ row }) => {
          const code = row.original?.inventoryReportPlanDetail[0]?.inventoryReportPlan?.code;
          return (
            <div>
              <div>{code ? code : 'N/A' }</div>
            </div>
          );
        }
      },
    {
        header: 'Reported By',
        accessorKey: 'warehouseStaff.account.firstName',
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={row.original.warehouseStaff?.account?.avatarUrl}
                    alt="avatar"
                  />
                  <AvatarFallback>
                    {row.original.warehouseStaff?.account?.firstName}
                  </AvatarFallback>
                </Avatar>
                <Label className="text-md">
                  {row.original.warehouseStaff?.account.firstName}{' '}
                  {row.original.warehouseStaff?.account.lastName}
                </Label>
              </div>
          );
    }
},
{
    header: 'Balanced By',
    accessorKey: 'warehouseManager.account.firstName',
    enableColumnFilter: false,
    enableSorting: false,

    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={row.original.warehouseManager?.account?.avatarUrl}
                alt="avatar"
              />
              <AvatarFallback>
                {row.original.warehouseManager?.account?.firstName}
              </AvatarFallback>
            </Avatar>
            <Label className="text-md">
              {row.original.warehouseManager?.account.firstName}{' '}
              {row.original.warehouseManager?.account.lastName}
            </Label>
          </div>
      );
}
},
    {
      header: 'Time started',
      accessorKey: 'from',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const dateString = row.original.from;
        if (!dateString) {
          return <div>N/A</div>;
        }
     
        return (
          <div>
            <div>{formatDateTimeToDDMMYYYYHHMM(dateString)}</div>
          </div>
        );
      }
    },
    {
      header: 'Time Ended',
      accessorKey: 'to',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const dateString = row.original.to;
        if (!dateString) {
          return <div>N/A</div>;
        }
     
        return (
          <div>
            <div>{formatDateTimeToDDMMYYYYHHMM(dateString)}</div>
          </div>
        );
      }
    },
    // {
    //     header: 'Expected Quantity',
    //     accessorKey: 'totalExpectedQuantity',
    //     enableColumnFilter: false,
    //     enableSorting: false,
    //     cell: ({ row }) => {
    //       return (
    //         <div>
    //           <div>{row.original.totalExpectedQuantity}</div>
    //         </div>
    //       );
    //     }
    //   },
    //   {
    //     header: 'Actual Quantity',
    //     accessorKey: 'totalActualQuantity',
    //     enableColumnFilter: false,
    //     enableSorting: false,
    //     cell: ({ row }) => {
    //       return (
    //         <div>
    //           <div>{row.original.totalActualQuantity}</div>
    //         </div>
    //       );
    //     }
    //   },
    //   {
    //     header: 'Manager Confirm Quantity',
    //     accessorKey: 'totalManagerQuantityConfirm',
    //     enableColumnFilter: false,
    //     enableSorting: false,
    //     cell: ({ row }) => {
    //       return (
    //         <div>
    //           <div>{row.original.totalManagerQuantityConfirm}</div>
    //         </div>
    //       );
    //     }
    //   },
    {
      header: 'Status',
      accessorKey: 'status',
      enableColumnFilter: true,
      cell: ({ row }) => (
        <div
          className={badgeVariants({ variant: getStatusBadgeVariant(row.original.status ?? '', InventoryReportStatus) })}>
          {(convertTitleToTitleCase(row.original.status ) ?? 'N/A')}
        </div>
      ),
      filterOptions: InventoryReportPlanStatus.map((status) => ({ label: status.label, value: status.value }))
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const request = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {
                                const url = `/stocktaking/${row.original.id}`;
                                window.open(url, '_blank', 'noopener,noreferrer');
                              }}>View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];
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
  const { pageMeta, reportList,isFetching, isLoading } = useGetAllInventoryReport({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination: pagination
  });

  const dataWithPage = reportList && pageMeta && {
    data: reportList,
    limit: pageMeta?.limit || 0,
    page: pageMeta?.page || 0,
    total: pageMeta?.total || 0,
    totalFiltered: pageMeta?.total || 0
  }
  return (
    <div className='bg-white rounded-xl shadow-sm border-2'>
        <TanStackBasicTable
            searchColumnId='code'
            searchPlaceholder='Search by code'
            columns={StocktakingColumn}
            paginatedTableData={dataWithPage}
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