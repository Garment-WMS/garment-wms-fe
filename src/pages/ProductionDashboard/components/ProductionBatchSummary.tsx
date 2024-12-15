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

interface ProductVariant {
  id: string;
  name: string;
  code: string;
  image: string;
}

interface ProductVariantProduction {
  productVariant: ProductVariant;
  producedQuantity: number;
  defectQuantity: number;
}

interface ProductionBatchStatistic {
  total: number;
  totalPending: number;
  totalExecuting: number;
  totalManufacturing: number;
  totalImporting: number;
  totalFinished: number;
  totalCancelled: number;
}

interface ProductionBatchSummaryProps {
  productionBatchSummary: {
    productionBatchStatistic: ProductionBatchStatistic;
    qualityRate: number;
    totalDefectProduct: number;
    totalProducedProduct: number;
    totalProductVariantProduced: ProductVariantProduction[];
  };
}

const ProductionBatchSummary: React.FC<ProductionBatchSummaryProps> = ({
  productionBatchSummary
}) => {
  const {
    productionBatchStatistic,
    qualityRate,
    totalDefectProduct,
    totalProducedProduct,
    totalProductVariantProduced
  } = productionBatchSummary;

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

      <Card>
        <CardHeader>
          <CardTitle>Product Variant Production Details</CardTitle>
          <CardDescription>
            Detailed information about each product variant&apos;s production
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Produced</TableHead>
                <TableHead>Defects</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {totalProductVariantProduced.map((variant) => (
                <TableRow key={variant.productVariant.id}>
                  <TableCell>
                    <img
                      src={variant.productVariant.image}
                      alt={variant.productVariant.name}
                      width={40}
                      height={40}
                      className="object-cover rounded-full"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{variant.productVariant.name}</TableCell>
                  <TableCell>{variant.productVariant.code}</TableCell>
                  <TableCell className="font-semibold text-green-600 text-lg ml-8">
                    {variant.producedQuantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-semibold text-red-600 text-lg ml-8">
                    {variant.defectQuantity.toLocaleString()}
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
