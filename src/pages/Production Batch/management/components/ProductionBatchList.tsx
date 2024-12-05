import TanStackBasicTable from '@/components/common/CompositeTable';
import { Badge } from '@/components/ui/Badge';
import { useDebounce } from '@/hooks/useDebouce';
import { CustomColumnDef } from '@/types/CompositeTable';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { convertDate } from '@/helpers/convertDate';
import {
  ProductionBatchStatus,
  ProductionBatchStatusColors,
  ProductionBatchStatusLabels
} from '@/enums/productionBatch';
import { useGetAllProductionBatch } from '@/hooks/useGetAllProductionBatch';
import { ProductionBatch } from '@/types/ProductionBatch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import UploadExcelProductionBatch from './UploadExcel';
import { ProductionDepartmentGuardDiv } from '@/components/authentication/createRoleGuard';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';

const ProductionBatchList: React.FC = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);
  const debouncedSorting: SortingState = useDebounce(sorting, 1000);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6
  });
  const handleViewClick = (requestId: string) => {
    navigate(`/production-batch/${requestId}`);
  };

  const { isFetching, productionBatchList, pageMeta } = useGetAllProductionBatch({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination
  });

  const paginatedTableData =
    productionBatchList && pageMeta
      ? {
          data: productionBatchList as ProductionBatch[],
          limit: pageMeta.limit,
          page: pageMeta.page,
          total: pageMeta.total,
          totalFiltered: pageMeta.totalPages
        }
      : undefined;

  const productionBatchColumns: CustomColumnDef<ProductionBatch>[] = [
    {
      header: 'Product',
      id: 'product',
      cell: ({ row }) => {
        const productSize = row.original.productionPlanDetail?.productSize;
        return (
          <div className="flex items-center gap-4">
            <img
              src={productSize?.productVariant?.image || 'https://via.placeholder.com/50'}
              alt={productSize?.productVariant?.name || 'Unknown Product'}
              className="w-12 h-12 rounded-md object-cover"
            />
            <span className="font-semibold text-gray-800">
              {productSize?.productVariant?.name || 'Unknown Product'} -{' '}
              {productSize?.size || 'N/A'}
            </span>
          </div>
        );
      },
      enableColumnFilter: false
    },
    {
      header: 'Batch Code',
      accessorKey: 'code',
      cell: ({ row }) => (
        <span className="font-semibold">{row?.original?.code || 'View Details'}</span>
      ),
      enableColumnFilter: false
    },
    {
      header: 'Plan Code',
      accessorKey: 'code',
      cell: ({ row }) => (
        <Link
          to={`/production-plan/${row?.original?.productionPlanDetail?.productionPlanId}`}
          className="text-blue-500 underline">
          {row?.original?.productionPlanDetail?.code || 'View Details'}
        </Link>
      ),
      enableColumnFilter: false
    },
    {
      header: 'Batch Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="ml-2 font-semibold text-gray-800">
          {row.original.name || 'Unknown Name'}
        </div>
      ),
      enableColumnFilter: false
    },
    {
      header: 'Status',
      accessorKey: 'status',
      enableColumnFilter: true,
      filterOptions: Object.keys(ProductionBatchStatus).map((key) => ({
        label:
          ProductionBatchStatusLabels[
            ProductionBatchStatus[key as keyof typeof ProductionBatchStatus]
          ],
        value: ProductionBatchStatus[key as keyof typeof ProductionBatchStatus]
      })),
      cell: ({ row }) => {
        const status = row.original.status as ProductionBatchStatus;
        const statusLabel = ProductionBatchStatusLabels[status];
        const colorVariant = ProductionBatchStatusColors[status] || 'bg-gray-200 text-black';
        return <Badge className={`mr-6 ${colorVariant}`}>{statusLabel}</Badge>;
      }
    },
    {
      header: 'Created Date',
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <div className="ml-2">{convertDateWithTime(row.original.createdAt || '')}</div>
      ),
      enableColumnFilter: false
    },
    {
      header: 'Batch Quantity',
      accessorKey: 'quantityToProduce',
      cell: ({ row }) => (
        <div className="text-center mr-5 font-semibold">
          {row.original?.quantityToProduce || '0'}
        </div>
      ),
      enableColumnFilter: false
    },
    {
      header: 'Planning Quantity',
      accessorKey: 'quantityToProduce',
      cell: ({ row }) => (
        <div className="text-center font-semibold mr-5">
          {row.original.productionPlanDetail?.quantityToProduce || '0'}
        </div>
      ),
      enableColumnFilter: false
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
        <h1 className="text-3xl font-bold text-primaryLight">Production Batch List</h1>
        <ProductionDepartmentGuardDiv>
          <UploadExcelProductionBatch />
        </ProductionDepartmentGuardDiv>
      </div>
      <div className="overflow-auto h-[700px] mt-4">
        <TanStackBasicTable
          isTableDataLoading={isFetching}
          paginatedTableData={paginatedTableData}
          columns={productionBatchColumns}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          totalPages={paginatedTableData?.totalFiltered || 0}
          searchColumnId="code"
        />
      </div>
    </div>
  );
};

export default ProductionBatchList;
