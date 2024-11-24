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

  const totalPages = pageMeta ? Math.ceil((pageMeta.totalPages || 0) / pagination.pageSize) : 0;

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
        <div
          className="ml-2 font-semibold cursor-pointer text-primary underline hover:opacity-50"
          onClick={() => navigate(`/purchase-staff/purchase-order/${row.original.id}`)}>
          {row.original.poNumber}
        </div>
      ),
      enableColumnFilter: false
    },
    {
      header: 'Production Plan ID',
      accessorKey: 'quarterlyProductionPlanId',
      enableColumnFilter: false,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return <div className="ml-9 font-semibold">{value ? value : 'PL123'}</div>;
      }
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
        totalPages={totalPages}
      />
    </div>
  );
};

export default DialogStatusTable;
