import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { CustomColumnDef } from '@/types/CompositeTable';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';
import {
  ProductionBatchStatus,
  ProductionBatchStatusColors,
  ProductionBatchStatusLabels
} from '@/enums/productionBatch';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, ClipboardListIcon, Loader2Icon, PackageIcon } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';

interface ProductionBatchSummaryProps {
  productionBatchSummary: any;
  productionBatchList: any[];
}

const ProductionBatchSummary: React.FC<ProductionBatchSummaryProps> = ({
  productionBatchSummary,
  productionBatchList
}) => {
  const { productionBatchStatistic } = productionBatchSummary;

  const productionBatchColumns: CustomColumnDef<any>[] = [
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
        <Link to={`/production-batch/${row.original.id}`} className="text-blue-500 underline">
          {row.original.code}
        </Link>
      ),
      enableColumnFilter: false
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="font-semibold text-gray-800">{row.original.name || 'Unknown'}</div>
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
      cell: ({ row }) => <div>{convertDateWithTime(row.original.createdAt || '')}</div>,
      enableColumnFilter: false
    },
    {
      header: 'Quantity To Produce',
      accessorKey: 'quantityToProduce',
      cell: ({ row }) => (
        <div className="ml-16 font-semibold">{row.original.quantityToProduce || '0'}</div>
      ),
      enableColumnFilter: false
    }
  ];

  const StatCard = ({
    title,
    value,
    icon,
    color
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Batches Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Batches Overview</CardTitle>
          <CardDescription>Summary of production batch statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Batches"
              value={productionBatchStatistic.total}
              icon={<ClipboardListIcon className="h-4 w-4 text-muted-foreground" />}
              color="text-blue-700"
            />
            <StatCard
              title="Pending"
              value={productionBatchStatistic.totalPending}
              icon={<PackageIcon className="h-4 w-4 text-muted-foreground" />}
              color="text-yellow-600"
            />
            <StatCard
              title="Manufacturing"
              value={
                productionBatchStatistic.totalManufacturing +
                productionBatchStatistic.totalExecuting +
                productionBatchStatistic.totalImporting
              }
              icon={<Loader2Icon className="h-4 w-4 text-muted-foreground" />}
              color="text-purple-600"
            />
            <StatCard
              title="Finished"
              value={productionBatchStatistic.totalFinished}
              icon={<CheckCircleIcon className="h-4 w-4 text-muted-foreground" />}
              color="text-green-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Production Batch List Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Batches List</CardTitle>
          <CardDescription>Details of all production batches</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={productionBatchColumns} data={productionBatchList?.data || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionBatchSummary;
