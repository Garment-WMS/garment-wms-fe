import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ArrowUpIcon, ArrowDownIcon, BarChart2Icon, PackageIcon } from 'lucide-react';

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

interface ProductionBatchSummaryProps {
  productionBatchSummary: {
    monthlyData: Array<{
      month: number;
      data: {
        numberOfProducedProduct: number;
        numberOfBatch: number;
      };
    }>;
    qualityRate: number;
    totalDefectProduct: number;
    totalProducedProduct: number;
    totalProductVariantProduced: ProductVariantProduction[];
  };
}

const ProductionBatchSummary: React.FC<ProductionBatchSummaryProps> = ({
  productionBatchSummary
}) => {
  const { qualityRate, totalDefectProduct, totalProducedProduct, totalProductVariantProduced } =
    productionBatchSummary;

  const StatCard = ({
    title,
    value,
    icon,
    trend,
    color
  }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: 'up' | 'down';
    color?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Production Overview</CardTitle>
          <CardDescription>Summary of production performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Produced"
              value={totalProducedProduct.toLocaleString()}
              icon={<PackageIcon className="h-4 w-4 text-muted-foreground" />}
              trend="up"
              color="text-green-700"
            />
            <StatCard
              title="Total Defects"
              value={totalDefectProduct.toLocaleString()}
              icon={<BarChart2Icon className="h-4 w-4 text-muted-foreground" />}
              trend="down"
              color="text-red-700"
            />
            <StatCard
              title="Quality Rate"
              value={`${(qualityRate * 100).toFixed(2)}%`}
              icon={<ArrowUpIcon className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Total Product"
              value={totalProductVariantProduced.length.toString()}
              icon={<PackageIcon className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Variant Production Details</CardTitle>
          <CardDescription>
            Detailed information about each product varian&apos;s production
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
                      className="w-10 h-10 object-cover rounded-full"
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
