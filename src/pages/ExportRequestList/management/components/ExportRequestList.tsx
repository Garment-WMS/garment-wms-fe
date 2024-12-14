import TanStackBasicTable from '@/components/common/CompositeTable';
import { Badge } from '@/components/ui/Badge';
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
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetMaterialExportRequest } from '@/hooks/useGetMaterialExportRequest';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { ProductionDepartmentGuardDiv } from '@/components/authentication/createRoleGuard';
import { ExportRequestStatus } from '@/types/exportRequest';
import { Filter } from '@/pages/ImportRequests/management/components/ImportRequestList';
import { getProductionBatchFn } from '@/api/services/productionBatchApi';
import { checkExportRequestQuantityFn } from '@/api/services/exportRequestApi';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { MdOutlineWarningAmber } from 'react-icons/md';
import Colors from '@/constants/color';
type Props = {};

const ExportRequestTable = (props: Props) => {
  const [fulfillmentStatuses, setFulfillmentStatuses] = useState<Record<string, boolean | null>>(
    {}
  );
  const [loadingStatuses, setLoadingStatuses] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const location = useLocation();
  const [productionBatchFilter, setProductionBatchFilter] = useState<Filter[]>([]);

  const fetchProductionBatch = async () => {
    try {
      const res = await getProductionBatchFn();
      const data = res.data;
      const uniqueCodes = new Set();
      const mappedArray = data.reduce((acc: any, item: any) => {
        if (item.code && !uniqueCodes.has(item.code)) {
          uniqueCodes.add(item.code);
          acc.push({ label: item.code, value: item.code });
        }
        return acc;
      }, []);
      setProductionBatchFilter(mappedArray);
    } catch (error) {
      console.error('Failed to fetch production batch data', error);
    }
  };

  const fetchFulfillmentStatuses = async (exportRequests: any[]) => {
    setLoading(true);
    const statuses: Record<string, boolean | null> = {};

    exportRequests.forEach((request) => {
      statuses[request.id] = null;
    });

    try {
      await Promise.all(
        exportRequests.map(async (request) => {
          try {
            const response = await checkExportRequestQuantityFn(request.id);
            statuses[request.id] = response.isFullFilled;
          } catch (error) {
            console.error(`Failed to fetch status for request ${request.id}:`, error);
            statuses[request.id] = false;
          }
        })
      );
      setFulfillmentStatuses((prev) => ({ ...prev, ...statuses }));
    } catch (error) {
      console.error('Failed to fetch fulfillment statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductionBatch();
  }, []);

  const handleViewClick = (requestId: string) => {
    const basePath = location.pathname.split('/')[0];
    navigate(`${basePath}/export-request/${requestId}`);
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);
  const debouncedSorting: SortingState = useDebounce(sorting, 1000);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const { pageMeta, exportRequestData, isFetching } = useGetMaterialExportRequest({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination
  });

  useEffect(() => {
    if (exportRequestData) {
      fetchFulfillmentStatuses(exportRequestData);
    }
  }, [exportRequestData]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AWAIT_TO_EXPORT':
      case 'PENDING':
        return 'bg-yellow-500';
      case 'PRODUCTION_REJECTED':
      case 'CANCELLED':
        return 'bg-red-500';
      case 'PRODUCTION_APPROVED':
        return 'bg-green-500';
      case 'EXPORTING':
      case 'EXPORTED':
        return 'bg-blue-500';
    }
  };

  const exportRequestColumns: CustomColumnDef<any>[] = [
    {
      header: 'Code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div>
          <Link to={`/export-request/${row.original.id}`} className="text-blue-500 hover:underline">
            {row.original.code}
          </Link>
        </div>
      )
    },

    {
      header: 'Production Batch',
      accessorKey: 'productionBatch.code',
      enableColumnFilter: true,
      filterOptions: productionBatchFilter.map((delivery) => ({
        label: delivery.label,
        value: delivery.value
      })),
      cell: ({ row }) => {
        const id = row.original.productionBatch?.id;
        return (
          <Link to={`/production-batch/${id}`} className="hover:underline text-bluePrimary">
            <div>{row.original?.productionBatch?.code}</div>
          </Link>
        );
      }
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
          <div className="text-center align-middle">
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
      cell: ({ row }) => (
        <div>
          {new Date(row.original.createdAt).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }) || 'Not yet'}
        </div>
      )
    },
    {
      header: 'Last updated at',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div>
          {new Date(row.original.updatedAt).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }) || 'Not yet'}
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      filterOptions: ExportRequestStatus.map((delivery) => ({
        label: delivery.label,
        value: delivery.value
      })),
      cell: ({ row }) => (
        <Badge
          variant={
            ExportRequestStatus.find((status) => status.value === row.original.status)?.variant
          }
          className="w-[140px] flex items-center justify-center pr-0 pl-0">
          {convertTitleToTitleCase(row.original.status)}
        </Badge>
      )
    },
    {
      header: 'Is Fulfilled',
      accessorKey: 'id',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const requestId = row.original.id;
        const status = row.original.status; // Extract the status from the row data
        const isFulfilled = fulfillmentStatuses[requestId];

        if (isFulfilled === null || isFetching) {
          return <span>Loading...</span>;
        }

        if (status === 'PENDING') {
          return (
            <div
              className={`mr-3 flex items-center justify-center pr-0 pl-0 font-bold ${
                isFulfilled ? 'text-green-700' : 'text-yellow-700'
              }`}>
              {isFulfilled ? (
                <AiOutlineCheckCircle className="w-7 h-7" color={Colors.green[700]} />
              ) : (
                <MdOutlineWarningAmber className="w-7 h-7" color={Colors.yellow[700]} />
              )}
            </div>
          );
        }
        return <div className="text-center text-xl mr-2">-</div>;
      }
    },
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
          isTableDataLoading={isFetching || loading} // Use the persistent loading state
          paginatedTableData={paginatedTableData ?? undefined}
          columns={exportRequestColumns}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          searchColumnId="code"
          searchWidth="w-[200px]"
          searchPlaceholder="Search export request code"
        />
        <ProductionDepartmentGuardDiv className="flex items-center flex-row justify-center mb-9">
          <Button className="w-[60%]" onClick={() => navigate('create')}>
            Create new Export Request
          </Button>
        </ProductionDepartmentGuardDiv>
      </div>
    </div>
  );
};

export default ExportRequestTable;
