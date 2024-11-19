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
import { useGetImportRequests } from '@/hooks/useGetImportRequest';
import { CustomColumnDef } from '@/types/CompositeTable';
import { DeliveryType, ImportRequest, Status } from '@/types/ImportRequestType';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getStatusBadgeVariant } from '../helper';
import { useGetImportReceipts } from '@/hooks/useGetImportReceipts';
import { ImportReceipt } from '@/types/ImportReceipt';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
type Props = {};

const ImportReceiptTable = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleViewClick = (requestId: string) => {
    const basePath = location.pathname.split('/')[0];

    // Navigate to the new route
    navigate(`${basePath}/import-receipt/${requestId}`);
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

  const { pageMeta, importReceiptData, isimportRequestLoading, isFetching } = useGetImportReceipts({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination
  });

  const paginatedTableData =
    importReceiptData && pageMeta
      ? {
          data: importReceiptData,
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

  const getLabelOfImportType = (type: string) => {
    const typeObj = DeliveryType.find((s) => s.value === type);
    return typeObj ? typeObj.label : 'N/A'; // Default variant if no match is found
  };

  const importRequestColumn: CustomColumnDef<ImportReceipt>[] = [
    {
      header: 'Import request code',
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
      header: 'Import Receipt Type',
      accessorKey: 'type',
      enableColumnFilter: true,
      filterOptions: DeliveryType.map((delivery) => ({
        label: delivery.label,
        value: delivery.value
      })),
      cell: ({ row }) => <div>{row.original.type}</div>
    },
    {
      header: 'Assigned to',
      accessorKey: 'creator',
      enableColumnFilter: true,
      filterOptions: DeliveryType.map((delivery) => ({
        label: delivery.label,
        value: delivery.value
      })),
      cell: ({ row }) => (
        <Link className="flex text-blue-500 underline" to="">
          <Avatar className="mr-2 ">
            <AvatarImage
              src={row?.original?.warehouseStaff?.account?.avatarUrl as string | undefined}
            />
            <AvatarFallback className="w-full h-full text-center">
              {row?.original?.warehouseStaff?.account?.lastName.slice(0, 1) +
                row?.original?.warehouseStaff?.account?.firstName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <h4>
            {row?.original?.warehouseStaff?.account?.lastName +
              ' ' +
              row?.original?.warehouseStaff?.account?.firstName}
          </h4>
        </Link>
      )
    },
    {
      header: 'Approved by',
      accessorKey: 'creator',
      enableColumnFilter: true,
      filterOptions: DeliveryType.map((delivery) => ({
        label: delivery.label,
        value: delivery.value
      })),
      cell: ({ row }) => (
        <Link className="flex text-blue-500 underline" to="">
          <Avatar className="mr-2 ">
            <AvatarImage
              src={row?.original?.warehouseManager?.account?.avatarUrl as string | undefined}
            />
            <AvatarFallback className="w-full h-full text-center">
              {row?.original?.warehouseManager?.account?.lastName.slice(0, 1) +
                row?.original?.warehouseManager?.account?.firstName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <h4>
            {row?.original?.warehouseManager?.account?.lastName +
              ' ' +
              row?.original?.warehouseManager?.account?.firstName}
          </h4>
        </Link>
      )
    },
    {
      header: 'Create date',
      accessorKey: 'createdAt',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const dateString = row.original.createdAt;
        if (!dateString) {
          return <div>N/A</div>;
        }
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        return (
          <div>
            <div>{formattedDate}</div>
          </div>
        );
      }
    },
    {
      header: 'Inspection report',
      accessorKey: 'inspectionReport',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div>
            <Link
              to={`inspection/${row.original.inspectionReportId}`}
              className={row.original?.inspectionReport?.code ? 'text-blue-500 underline' : ''}>
              {row.original?.inspectionReport?.code || 'None'}
            </Link>
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      enableColumnFilter: true,
      cell: ({ row }) => (
        <div
          className={badgeVariants({ variant: getStatusBadgeVariant(row.original.status ?? '') })}>
          {formatString(row.original.status ?? 'N/A')}
        </div>
      ),
      filterOptions: Status.map((status) => ({ label: status.label, value: status.value }))
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
              <DropdownMenuItem onClick={() => handleViewClick(request.id)}>View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  return (
    <div className="pb-4">
      <div className="mb-4 w-auto bg-white rounded-xl shadow-sm border">
        <TanStackBasicTable
          isTableDataLoading={isimportRequestLoading && isFetching} // Use the persistent loading state
          paginatedTableData={paginatedTableData ?? undefined}
          columns={importRequestColumn}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          searchColumnId="code"
          searchPlaceholder="Search import receipt by code"
        />
      </div>
    </div>
  );
};

export default ImportReceiptTable;