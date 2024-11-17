import React, { useState } from 'react';
import Loading from '@/components/common/Loading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { ProductionPlanStatus } from '@/enums/productionPlan';
import { convertDate } from '@/helpers/convertDate';
import { useGetAllProductionPlans } from '@/hooks/useGetAllProductionPlan';
import { SortingState, ColumnFiltersState, PaginationState } from '@tanstack/react-table';
import { ProductionPlan } from '@/types/ProductionPlan';
import { CalendarArrowDown, CalendarArrowUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const getStatusBadgeClass = (status: ProductionPlanStatus) => {
  switch (status) {
    case ProductionPlanStatus.PLANNING:
      return 'bg-yellow-500 text-white';
    case ProductionPlanStatus.IN_PROGRESS:
      return 'bg-blue-500 text-white';
    case ProductionPlanStatus.FINISHED:
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const ProductionPlanManagement = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const {
    productionPlanList: plans,
    pageMeta,
    isPending,
    isError
  } = useGetAllProductionPlans({ sorting, columnFilters, pagination });

  if (isPending) {
    return (
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <p>Failed to load production plans. Please try again later.</p>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primaryLight">Production Plans</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Plan
        </Button>
      </div>
      {plans?.data?.map((plan) => (
        <Card key={plan.id} className="mb-6 shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                <div className="flex items-center gap-2">
                  <Link
                    className="text-primaryLight underline hover:opacity-50 cursor-pointer"
                    to={{
                      pathname: `/purchase-staff/production-plan/${plan.id}`
                    }}
                    state={{ plan }}>
                    <span>{plan.name}</span>
                  </Link>
                  <span>
                    <Badge className="bg-gray-500 ml-2 text-white px-2 py-1 rounded">
                      {plan.code}
                    </Badge>
                  </span>
                </div>
              </CardTitle>
              <Badge
                className={`${getStatusBadgeClass(plan.status as ProductionPlanStatus)} px-2 py-1 rounded`}>
                {plan.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between w-full mb-4">
              <div className="flex items-center gap-2">
                <CalendarArrowUp className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium">Expected Start Date:</p>
                <Badge variant="outline" className="text-green-600 font-semibold">
                  {convertDate(plan.expectedStartDate)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <CalendarArrowDown className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium">Expected End Date:</p>
                <Badge variant="outline" className="text-red-600 font-semibold">
                  {convertDate(plan.expectedEndDate)}
                </Badge>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plan.productionPlanDetail.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell>{detail.productSize.productVariant.name}</TableCell>
                    <TableCell>{detail.productSize.size}</TableCell>
                    <TableCell>{detail.quantityToProduce}</TableCell>
                    <TableCell>{detail.code}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
          disabled={pagination.pageIndex === 0}>
          Previous
        </Button>
        <p>
          Page {pagination.pageIndex + 1} of {pageMeta?.totalPages || 1}
        </p>
        <Button
          onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
          disabled={!pageMeta || pagination.pageIndex + 1 >= pageMeta.totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductionPlanManagement;
