import TanStackBasicTable from '@/components/common/CompositeTable';
import { Badge } from '@/components/ui/Badge';
import { useDebounce } from '@/hooks/useDebouce';
import { CustomColumnDef } from '@/types/CompositeTable';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import UploadExcel from './UploadExcel';
import { useNavigate } from 'react-router-dom';
import { convertDate } from '@/helpers/convertDate';
import { PurchaseOrder } from '@/types/PurchaseOrder';
import { PurchaseOrderStatus, PurchaseOrderStatusLabels } from '@/enums/purchaseOrderStatus';
import { useGetAllPurchaseOrder } from '@/hooks/useGetAllPurchaseOrder';
import { useGetAllSupplier } from '@/hooks/useGetAllSupplier';
import { Supplier } from '@/types/SupplierTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useGetAllProductionPlans } from '@/hooks/useGetAllProductionPlan';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { PurchasingStaffGuardDiv } from '@/components/authentication/createRoleGuard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog';
import { cancelPurchaseOrder } from '@/api/services/purchaseOrder';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PurchaseOrderDeliveryStatus } from '@/enums/purchaseOrderDeliveryStatus';

const PurchaseOrderList: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);
  const debouncedSorting: SortingState = useDebounce(sorting, 1000);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedPO, setSelectedPO] = useState<{ id: string; poNumber: string } | null>(null);

  const handleConfirmCancel = async () => {
    if (selectedPO) {
      const validCancelReason =
        cancelReason && cancelReason.trim() ? cancelReason.trim() : 'No reason provided';
      try {
        const response = await cancelPurchaseOrder(selectedPO.id, validCancelReason);
        console.log(response);
        if (response?.statusCode === 200) {
          toast({
            variant: 'success',
            title: 'Purchase Order Cancelled',
            description: `Purchase Order ${selectedPO.poNumber} has been successfully cancelled.`
          });
          navigate(0);
        } else {
          handleBackendErrors(response);
        }
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          handleBackendErrors(error.response.data);
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: `An unexpected error occurred while cancelling Purchase Order ${selectedPO.poNumber}.`
          });
        }
      } finally {
        setIsModalOpen(false);
        setCancelReason('');
        setSelectedPO(null);
      }
    }
  };

  // Helper function to handle backend errors
  const handleBackendErrors = (response: any) => {
    if (response?.errors?.length > 0) {
      const backendError = response.errors[0];
      if (backendError.property === 'cancelledReason' && backendError.constraints) {
        toast({
          variant: 'destructive',
          title: 'Invalid Cancellation Reason',
          description: backendError.constraints.isString || response.message || 'Invalid input.'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Cancellation Failed',
          description: response.message || 'An unexpected error occurred.'
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Cancellation Failed',
        description: response.message || 'An unexpected error occurred.'
      });
    }
  };

  const { isFetching, purchaseOrderList, pageMeta } = useGetAllPurchaseOrder({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination
  });
  const { data: supplierData, isFetching: isFetchingSuppliers } = useGetAllSupplier();
  const {
    data,
    pageMeta: productionPlanPageMeta,
    isPending: isFetchingProductionPlan,
    isError
  } = useGetAllProductionPlans({});
  const handleViewClick = (requestId: string) => {
    navigate(`/purchase-order/${requestId}`);
  };
  const handleCancelClick = (id: string, poNumber: string) => {
    setSelectedPO({ id, poNumber });
    setIsModalOpen(true);
  };

  const paginatedTableData =
    purchaseOrderList && pageMeta
      ? {
          data: purchaseOrderList,
          limit: pageMeta.limit,
          page: pageMeta.page,
          total: pageMeta.total,
          totalFiltered: pageMeta.totalPages
        }
      : undefined;

  const purchaseOrderColumns: CustomColumnDef<PurchaseOrder>[] = [
    {
      header: 'PO Number',
      accessorKey: 'poNumber',
      cell: ({ row }) => <span className="font-bold ">{row.original.poNumber}</span>,
      enableColumnFilter: false
    },
    {
      header: 'Supplier',
      accessorKey: 'supplierId',
      enableColumnFilter: true,
      filterOptions: supplierData?.data.map((supplier: Supplier) => ({
        label: supplier.supplierName,
        value: supplier.id
      })),
      cell: ({ row }) => <div className="mr-5">{row.original.supplier?.supplierName}</div>
    },
    {
      header: 'Order Date',
      accessorKey: 'orderDate',
      enableColumnFilter: false,
      cell: ({ getValue }) => {
        const isoDate = getValue<string>();
        return <div className="ml-2">{convertDate(isoDate)}</div>;
      }
    },
    {
      header: 'Finished Date',
      accessorKey: 'finishDate',
      enableColumnFilter: false,
      cell: ({ getValue }) => {
        const isoDate = getValue<string>();
        return (
          <div>
            {isoDate ? (
              <div className="ml-5">{convertDate(isoDate)}</div>
            ) : (
              <div className="ml-9 text-xl font-semibold">-</div>
            )}
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      enableColumnFilter: true,
      filterOptions: Object.keys(PurchaseOrderStatus).map((key) => ({
        label:
          PurchaseOrderStatusLabels[PurchaseOrderStatus[key as keyof typeof PurchaseOrderStatus]],
        value: PurchaseOrderStatus[key as keyof typeof PurchaseOrderStatus]
      })),
      cell: ({ row }) => {
        const status = row.original.status as PurchaseOrderStatus;
        const statusLabel = PurchaseOrderStatusLabels[status];
        let colorVariant;
        switch (status) {
          case PurchaseOrderStatus.IN_PROGRESS:
            colorVariant = 'bg-blue-500 text-white';
            break;
          case PurchaseOrderStatus.CANCELLED:
            colorVariant = 'bg-red-500 text-white';
            break;
          case PurchaseOrderStatus.FINISHED:
            colorVariant = 'bg-green-500 text-white';
            break;
          default:
            colorVariant = 'bg-gray-200 text-black';
        }
        return <Badge className={`mr-6 ${colorVariant}`}>{statusLabel}</Badge>;
      }
    },
    {
      header: 'No of Delivery',
      accessorKey: 'totalPoDelivery',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const statuses = [
          {
            value: row.original.totalFinishedPoDelivery,
            color: 'bg-green-600 text-white'
          },
          {
            value: row.original.totalInProgressPoDelivery,
            color: 'bg-blue-600 text-white'
          },
          {
            value: row.original.totalPendingPoDelivery,
            color: 'bg-yellow-600 text-white'
          },
          {
            value: row.original.totalCancelledPoDelivery,
            color: 'bg-red-600 text-white'
          }
        ];

        const visibleStatuses = statuses.filter((status) => status.value > 0);

        return (
          <div className="flex flex-wrap gap-2">
            {visibleStatuses.length > 0 ? (
              visibleStatuses.map((status, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${status.color}`}>
                  <span className="font-bold text-sm">{status.value}</span>
                </div>
              ))
            ) : (
              <span className="text-gray-500 text-sm font-medium">-</span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Material Import Progress',
      accessorKey: 'progress',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const totalImportQuantity = row.original.totalImportQuantity || 0;
        const totalQuantityToImport = row.original.totalQuantityToImport || 1; // Avoid division by zero
        const progress = (totalImportQuantity / totalQuantityToImport) * 100;
        return (
          <TooltipProvider>
            <Tooltip>
              <div className="flex items-center gap-1 flex-row">
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 w-full cursor-pointer">
                    {/* Progress Bar Container */}
                    <div className="w-36 bg-gray-200 rounded-full h-4 flex-shrink-0">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width: `${progress}%` }}></div>
                    </div>
                    {/* Progress Text */}
                    <span className="text-sm text-gray-600 font-medium">
                      {`${progress.toFixed(0)}%`}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{`${totalImportQuantity} / ${totalQuantityToImport}`}</p>
                </TooltipContent>
              </div>
            </Tooltip>
          </TooltipProvider>
        );
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const request = row.original;
        const deliveries = request.poDelivery || [];
        const allPending = deliveries.every(
          (delivery) => delivery.status === PurchaseOrderDeliveryStatus.PENDING
        );
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
                {row.original?.status === PurchaseOrderStatus.IN_PROGRESS && allPending && (
                  <DropdownMenuItem
                    onClick={() => handleCancelClick(request.id, request.poNumber)}
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
    <div className="flex flex-col px-3 pt-3 pb-4 w-auto bg-white rounded-xl shadow-sm border">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-3xl font-bold text-primaryLight">Purchase Order Lists</h1>
        <PurchasingStaffGuardDiv>
          <UploadExcel />
        </PurchasingStaffGuardDiv>
      </div>
      <div className="flex flex-row justify-center">
        <Card className="mt-4 max-w-[50%]">
          <CardHeader>
            <CardTitle className="font-semibold text-gray-800 text-sm">
              Purchase Delivery Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-600"></div>
              <span className="text-sm font-medium text-gray-700">Finished</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600"></div>
              <span className="text-sm font-medium text-gray-700">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-yellow-600"></div>
              <span className="text-sm font-medium text-gray-700">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-600"></div>
              <span className="text-sm font-medium text-gray-700">Cancelled</span>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Set fixed height for the table */}
      <div className="overflow-auto h-[700px]">
        <TanStackBasicTable
          isTableDataLoading={isFetching || isFetchingSuppliers || isFetchingProductionPlan}
          paginatedTableData={paginatedTableData}
          columns={purchaseOrderColumns}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          totalPages={paginatedTableData?.totalFiltered}
          searchColumnId="status"
        />
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-500">Cancel Purchase Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel Purchase Order{' '}
              <span className="font-semibold text-primaryLight">{selectedPO?.poNumber}</span>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              className="h-40"
              id="cancelReason"
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
  );
};

export default PurchaseOrderList;
