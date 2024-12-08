import { useGetAllProductionPlans } from '@/hooks/useGetAllProductionPlan';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductionPlanSummary from '../Production Plan/management/components/ProductionPlanSummary';
import { Button } from '@/components/ui/button';
import Loading from '@/components/common/Loading';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductionChart } from './components/PlanChart';
import { Label } from '@/components/ui/Label';

type Props = {};

const ProductionDashboard = (props: Props) => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });

  const { productionPlanList, pageMeta, isPending, isError } = useGetAllProductionPlans({
    sorting,
    columnFilters,
    pagination
  });
  const plans = productionPlanList?.data || [];
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
    <div className=" w-full gap-4 px-4 py-3 flex flex-col space-y-3 bg-white rounded-md">
      <Label className='text-2xl font-bold mt-2'>Dashboard</Label>
       <main className="flex-1 p-4">
          <div className="grid gap-4 grid-cols-2 ">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Production</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234 units</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.9/5</div>
                <p className="text-xs text-muted-foreground">+0.2 from last quarter</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Production Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductionChart />
              </CardContent>
            </Card>
          </div>
        </main>
        {/* <div className='flex justify-center'>
            <ProductionPlanSummary productionPlanList={plans} />
        </div>
      
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
          disabled={pagination.pageIndex === 0}>
          Previous
        </Button>
        <p>
          Page {pagination.pageIndex + 1} of {productionPlanList?.pageMeta?.totalPages || 1}
        </p>
        <Button
          onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
          disabled={
            !productionPlanList?.pageMeta ||
            pagination.pageIndex + 1 >= productionPlanList?.pageMeta?.totalPages
          }>
          Next
        </Button>
      </div> */}
    </div>
  );
};

export default ProductionDashboard;
