import TanStackBasicTable from '@/components/common/CompositeTable';
import { Badge } from '@/components/ui/Badge';
import { useDebounce } from '@/hooks/useDebouce';
import { CustomColumnDef } from '@/types/CompositeTable';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { convertDate } from '@/helpers/convertDate';
import { ProductionBatchStatus, ProductionBatchStatusLabels } from '@/enums/productionBatch';
import { useGetAllProductionBatch } from '@/hooks/useGetAllProductionBatch';
import { ProductionBatch } from '@/types/ProductionBatch';

const ProductionBatchList: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);
  const debouncedSorting: SortingState = useDebounce(sorting, 1000);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

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

  const mockCode = (code: string | null | undefined, id: string) =>
    code || `MOCK-CODE-${id.slice(0, 8)}`;
  const mockDate = (date: string | null | undefined) =>
    date ? convertDate(date) : convertDate(new Date().toISOString());

  const productionBatchColumns: CustomColumnDef<ProductionBatch>[] = [
    {
      header: 'Batch Code',
      accessorKey: 'code',
      cell: ({ row }) => (
        <Link
          to={`/production-batch/${row.original.id}`}
          className="ml-2 font-semibold text-primary underline hover:opacity-50">
          {mockCode(row.original.code, row.original.id)}
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
        let colorVariant;
        switch (status) {
          case ProductionBatchStatus.EXECUTING:
            colorVariant = 'bg-yellow-500 text-white';
            break;
          case ProductionBatchStatus.IMPORTING:
            colorVariant = 'bg-blue-500 text-white';
            break;
          case ProductionBatchStatus.IMPORTED:
            colorVariant = 'bg-teal-500 text-white';
            break;
          case ProductionBatchStatus.FINISHED:
            colorVariant = 'bg-green-500 text-white';
            break;
          case ProductionBatchStatus.CANCELED:
            colorVariant = 'bg-red-500 text-white';
            break;
          default:
            colorVariant = 'bg-gray-200 text-black';
        }
        return <Badge className={`mr-6 ${colorVariant}`}>{statusLabel}</Badge>;
      }
    },
    {
      header: 'Start Date',
      accessorKey: 'startDate',
      cell: ({ row }) => <div className="ml-2">{mockDate(row.original.startDate)}</div>,
      enableColumnFilter: false
    },
    {
      header: 'Expected Finish Date',
      accessorKey: 'expectedFinishDate',
      cell: ({ row }) => <div className="ml-2">{mockDate(row.original.expectedFinishDate)}</div>,
      enableColumnFilter: false
    },
    {
      header: 'Finished Date',
      accessorKey: 'finishedDate',
      cell: ({ row }) => <div className="ml-2">{mockDate(row.original.finishedDate)}</div>,
      enableColumnFilter: false
    },
    {
      header: 'Quantity to Produce',
      accessorKey: 'quantityToProduce',
      cell: ({ row }) => (
        <div className="ml-2 font-semibold text-center mr-9 ">
          {row.original.quantityToProduce?.toLocaleString() || '0'}
        </div>
      ),
      enableColumnFilter: false
    }
  ];

  return (
    <div className="flex flex-col px-3 pt-3 pb-4 w-auto bg-white rounded-xl shadow-sm border">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primaryLight">Production Batch List</h1>
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
