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

const PurchaseOrderList: React.FC = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);
  const debouncedSorting: SortingState = useDebounce(sorting, 1000);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8
  });

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
      header: 'Total Amount',
      accessorKey: 'totalAmount',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const totalAmount = row.original.subTotalAmount;
        const currency = row.original.currency;
        return (
          <div className="ml-1 flex items-center gap-2">
            <span>{totalAmount.toLocaleString()}</span>
            <span className="text-slate-500">{currency}</span>
          </div>
        );
      }
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
      header: 'No of delivery',
      accessorKey: 'totalPoDelivery',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div className="text-center text-xl">
            <Badge className="bg-blue-700">{row.original.totalPoDelivery || 0}</Badge>
          </div>
        );
      }
    },
    {
      header: 'Progress',
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
    <div className="flex flex-col px-3 pt-3 pb-4 w-auto bg-white rounded-xl shadow-sm border">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primaryLight">Purchase Order Lists</h1>
        <UploadExcel fileName="purchase order" triggerButtonLabel="Import" />
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
    </div>
  );
};

export default PurchaseOrderList;
