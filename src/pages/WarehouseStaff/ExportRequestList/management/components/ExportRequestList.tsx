import TanStackBasicTable from '@/components/common/CompositeTable';
import { Badge } from '@/components/ui/Badge';
import { badgeVariants } from '@/components/ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebouce';
import { CustomColumnDef } from '@/types/CompositeTable';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { useGetMaterialExportRequest, useGetMyMaterialExportRequest } from '@/hooks/useGetMaterialExportRequest';
type Props = {};

const ExportRequestTable = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleViewClick = (requestId: string) => {
    const basePath = location.pathname.split('/')[0];

    // Navigate to the new route
    navigate(`${basePath}/export-request/${requestId}`);
  };

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

  const { pageMeta, exportRequestData, isFetching } = useGetMyMaterialExportRequest({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination
  });
  console.log(exportRequestData);

  const paginatedTableData =
    exportRequestData && pageMeta
      ? {
          data: exportRequestData,
          limit: pageMeta.limit,
          page: pageMeta.page,
          total: pageMeta.total,
          totalFiltered: pageMeta.totalPages
        }
      : undefined;

  function formatString(input: string): string {
    return input
      .toLowerCase() // Convert the entire string to lowercase first
      .split('_') // Split by underscores
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(' '); // Join the words back with spaces
  }

  const exportRequestColumns: CustomColumnDef<any>[] = [
    {
      header: 'Code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => <div>{row.original.code}</div>
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'PENDING' ? 'warning' : 'success'}>
          {row.original.status}
        </Badge>
      )
    },
    {
      header: 'Production Batch',
      accessorKey: 'productionBatch.name',
      enableColumnFilter: false,
      cell: ({ row }) => <div>{row.original.productionBatch?.name || 'N/A'}</div>
    },
    {
      header: 'Created By',
      enableColumnFilter: false,
      accessorKey: 'productionDepartment.account',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Avatar className="mr-2">
            <AvatarImage src={row.original.productionDepartment?.account?.avatarUrl || ''} />
            <AvatarFallback className="flex items-center">
              {row.original.productionDepartment?.account?.firstName?.charAt(0)}
              {row.original.productionDepartment?.account?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            {row.original.productionDepartment?.account?.firstName}{' '}
            {row.original.productionDepartment?.account?.lastName}
          </div>
        </div>
      )
    },
    {
      header: 'Assigned By',
      enableColumnFilter: false,
      accessorKey: 'productionDepartment.account',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Avatar className="mr-2">
            <AvatarImage src={row.original.productionDepartment?.account?.avatarUrl || ''} />
            <AvatarFallback className="flex items-center">
              {row.original.productionDepartment?.account?.firstName?.charAt(0)}
              {row.original.productionDepartment?.account?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            {row.original.productionDepartment?.account?.firstName}{' '}
            {row.original.productionDepartment?.account?.lastName}
          </div>
        </div>
      )
    },
    {
      header: 'Created At',
      enableColumnFilter: false,
      accessorKey: 'createdAt',
      cell: ({ row }) => <div>{new Date(row.original.createdAt).toDateString()}</div>
    },
    {
      header: 'Code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => <div>{row.original.productFormula?.code || 'N/A'}</div>
    },
    // {
    //   header: 'Description',
    //   enableColumnFilter: false,
    //   accessorKey: 'description',
    //   cell: ({ row }) => <div className='truncate'>{row.original.description || 'N/A'}</div>
    // },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleViewClick(row.original.id)}>
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="pb-4">
      <div className="mb-4 w-auto bg-white rounded-xl shadow-sm border">
        <TanStackBasicTable
          isTableDataLoading={isFetching} // Use the persistent loading state
          paginatedTableData={paginatedTableData ?? undefined}
          columns={exportRequestColumns}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          searchColumnId="code"
          searchPlaceholder="Search import receipt by code"
        />
        <div className="flex items-center flex-row justify-center mb-9">
          <Button className="w-[60%]" onClick={() => navigate('create')}>
            Create new Export Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportRequestTable;
