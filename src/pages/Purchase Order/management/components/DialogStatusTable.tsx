import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TanStackBasicTable from '@/components/common/CompositeTable';
import { Badge } from '@/components/ui/Badge';
import { useDebounce } from '@/hooks/useDebouce';
import { CustomColumnDef } from '@/types/CompositeTable';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { convertDate } from '@/helpers/convertDate';
import { PurchaseOrder } from '@/types/PurchaseOrder';
import { PurchaseOrderStatus, PurchaseOrderStatusLabels } from '@/enums/purchaseOrderStatus';
import { useGetAllPurchaseOrder } from '@/hooks/useGetAllPurchaseOrder';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DialogStatusTableProps {
  selectedStatus: string;
}

const DialogStatusTable: React.FC<DialogStatusTableProps> = ({ selectedStatus }) => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: 'status',
      value: selectedStatus ? [selectedStatus] : []
    }
  ]);
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

  const getColorVariant = (status: PurchaseOrderStatus) => {
    switch (status) {
      case PurchaseOrderStatus.IN_PROGRESS:
        return 'bg-blue-500 text-white';
      case PurchaseOrderStatus.CANCELLED:
        return 'bg-red-500 text-white';
      case PurchaseOrderStatus.FINISHED:
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-200 text-black';
    }
  };

  const purchaseOrderColumns: CustomColumnDef<PurchaseOrder>[] = [
    {
      header: 'PO Number',
      accessorKey: 'poNumber',
      cell: ({ row }) => (
        <span
          className="font-bold cursor-pointer text-primary underline hover:opacity-70"
          onClick={() => navigate(`/purchase-order/${row.original.id}`)}>
          {row.original.poNumber}
        </span>
      ),
      enableColumnFilter: false
    },
    {
      header: 'Supplier',
      accessorKey: 'supplierId',
      enableColumnFilter: false,
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
      enableColumnFilter: false,
      cell: ({ row }) => {
        const status = row.original.status as PurchaseOrderStatus;
        const statusLabel = PurchaseOrderStatusLabels[status];
        const colorVariant = getColorVariant(status);
        return <Badge className={`mr-6 ${colorVariant}`}>{statusLabel}</Badge>;
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
                    <div className="w-36 bg-gray-200 rounded-full h-4 flex-shrink-0">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width: `${progress}%` }}></div>
                    </div>
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
    }
  ];

  useEffect(() => {
    setColumnFilters([
      {
        id: 'status',
        value: selectedStatus ? [selectedStatus] : []
      }
    ]);
  }, [selectedStatus]);

  return (
    <div>
      <TanStackBasicTable
        isTableDataLoading={isFetching}
        paginatedTableData={paginatedTableData}
        columns={purchaseOrderColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        showToolbar={false}
        totalPages={pageMeta?.totalPages || 0}
      />
    </div>
  );
};

export default DialogStatusTable;
