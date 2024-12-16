import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { ClipboardListIcon, PackageIcon, Loader2Icon, CheckCircleIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';

interface ProductionBatchSummaryProps {
  productionBatchSummary: any;
  productionBatchList: any[];
}

const ProductionBatchSummary: React.FC<ProductionBatchSummaryProps> = ({
  productionBatchSummary,
  productionBatchList
}) => {
  const { productionBatchStatistic, totalProductVariantProduced } = productionBatchSummary;
  console.log(productionBatchList);
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
          <CardTitle>Production Batch List</CardTitle>
          <CardDescription>Details of all production batches</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productionBatchList?.productionBatchOfProductionPlan?.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-semibold">{batch.code}</TableCell>
                  <TableCell className="font-semibold">{batch.name}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        batch.status === 'FINISHED'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}>
                      {batch.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{convertDateWithTime(batch.createdAt)}</TableCell>
                  <TableCell className="text-center font-semibold">
                    {batch.quantityToProduce}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionBatchSummary;
