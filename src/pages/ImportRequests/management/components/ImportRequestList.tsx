import TanStackBasicTable from '@/components/common/CompositeTable';
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
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getStatusBadgeVariant } from '../helper';
import { PurchaseOrder } from '@/types/PurchaseOrder';
import { ProductionBatch } from '@/types/ProductionBatch';
import { getProductionBatchFn } from '@/api/services/productionBatchApi';
import { getAllPurchaseOrdersNoPage } from '@/api/services/purchaseOrder';
import {
  PurchasingStaffGuardAndProductionDepartmentDiv,
  PurchasingStaffGuardDiv
} from '@/components/authentication/createRoleGuard';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/Textarea';
import { cancelImportRequest } from '@/api/services/importRequestApi';
type Props = {};
export interface Filter {
  label: string;
  value: string;
}
const ImportRequestList = (props: Props) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<{ id: string; code: string } | null>(null);
  const [productionBatchFilter, setProductionBatchFilter] = useState<Filter[]>([]);
  const [purchaseOrderFilter, setPurchaseOrderFilter] = useState<Filter[]>([]);
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
  const fetchPurchaseOrder = async () => {
    try {
      const res = await getAllPurchaseOrdersNoPage();
      const uniqueCodes = new Set();
      const mappedArray = res.reduce((acc: any, item: any) => {
        if (item.code && !uniqueCodes.has(item.code)) {
          uniqueCodes.add(item.code);
          acc.push({ label: item.code, value: item.code });
        }
        return acc;
      }, []);
      setPurchaseOrderFilter(mappedArray);
    } catch (error) {
      console.error('Failed to fetch purchase order data', error);
    }
  };
  useEffect(() => {
    fetchPurchaseOrder();
    fetchProductionBatch();
  }, []);

  const handleCancelClick = (id: string, code: string) => {
    setSelectedRequest({ id, code });
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedRequest) {
      try {
        const response = await cancelImportRequest(
          selectedRequest.id,
          cancelReason || 'No reason provided'
        );
        if (response?.statusCode === 200) {
          toast({
            variant: 'success',
            title: 'Import Request Cancelled',
            description: `Import Request ${selectedRequest.code} has been successfully cancelled.`
          });
          navigate(`/import-request/${selectedRequest?.id}`);
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: response.message || 'An unexpected error occurred.'
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An unexpected error occurred while cancelling the import request.'
        });
      } finally {
        setIsModalOpen(false);
        setCancelReason('');
        setSelectedRequest(null);
      }
    }
  };

  const handleViewClick = (requestId: string) => {
    const basePath = location.pathname.split('/import-request')[0]; // Get base path (either manager or purchase-staff)

    // Navigate to the new route
    navigate(`${basePath}/import-request/${requestId}`);
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

  const { pageMeta, importRequestData, isimportRequestLoading, isFetching } = useGetImportRequests({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination
  });

  const paginatedTableData =
    importRequestData && pageMeta
      ? {
          data: importRequestData,
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

  const importRequestColumn: CustomColumnDef<ImportRequest>[] = [
    {
      header: 'Code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div>
          <Link to={`/import-request/${row.original.id}`} className="text-blue-500 hover:underline">
            {row.original.code || 'N/A'}
          </Link>
        </div>
      )
    },

    {
      header: 'Type',
      accessorKey: 'type',
      enableColumnFilter: true,
      filterOptions: DeliveryType.map((delivery) => ({
        label: delivery.label,
        value: delivery.value
      })),
      cell: ({ row }) => <div>{getLabelOfImportType(row.original.type)}</div>
    },
    {
      header: 'Purchase Order',
      accessorKey: 'poDelivery.purchaseOrder.code',
      enableColumnFilter: true,
      filterOptions: purchaseOrderFilter.map((delivery) => ({
        label: delivery.label,
        value: delivery.value
      })),
      cell: ({ row }) => <div>{row.original?.poDelivery?.purchaseOrder?.code || 'N/A'}</div>
    },
    {
      header: 'Production Batch',
      accessorKey: 'productionBatch.code',
      enableColumnFilter: true,
      filterOptions: productionBatchFilter.map((delivery) => ({
        label: delivery.label,
        value: delivery.value
      })),
      cell: ({ row }) => <div>{row.original?.productionBatch?.code || 'N/A'}</div>
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
        const formattedDate = date.toLocaleString('en-GB', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false // Use 24-hour format
        });
        return (
          <div>
            <div>{formattedDate}</div>
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
          className={`${badgeVariants({ variant: getStatusBadgeVariant(row.original.status ?? '') })} w-[110px] flex justify-center`}>
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
              <PurchasingStaffGuardDiv>
                {request.status === 'ARRIVED' && (
                  <DropdownMenuItem
                    onClick={() => handleCancelClick(request.id, request?.code)}
                    className="text-red-500 hover:text-red-600">
                    Cancel
                  </DropdownMenuItem>
                )}
              </PurchasingStaffGuardDiv>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  return (
    <div className="pb-4 ">
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
          searchPlaceholder="Input request code"
          searchWidth="w-[150px]"
        />

        <PurchasingStaffGuardAndProductionDepartmentDiv className="flex items-center flex-row justify-center mb-9">
          <Button className="w-[60%]" onClick={() => navigate('create')}>
            Create new Import Request
          </Button>
        </PurchasingStaffGuardAndProductionDepartmentDiv>

        {/* Cancel Confirmation Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-500">Cancel Import Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel Import Request{' '}
                <span className="font-semibold text-primaryLight">{selectedRequest?.code}</span>?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="Enter reason for cancellation"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmCancel} disabled={!cancelReason.trim()}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ImportRequestList;
