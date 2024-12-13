'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/Label';
import { ProductionProgressChart } from './ProductionProgressChart';
import { SelectProductionPlan } from './SelectProductionPlan';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@/hooks/useDebouce';
import { useEffect, useState } from 'react';
import { useGetAllProductionPlans } from '@/hooks/useGetAllProductionPlan';
import { useGetProductionPlanById } from '@/hooks/useGetProductionPlanById';
import { getProductionPlanById, getProductionPlanDetailsById } from '@/api/services/productionPlan';
import { ProductionPlan } from '@/types/ProductionPlan';
import Loading from '@/components/common/Loading';
import { MaterialSummaryTable } from './MaterialSummaryTable';
import { PurchaseOrderSummary } from './PurchaseOrderSummary';
import { ProductionPlanDetails } from './ProductionPlanDetails';
import { ChartNoAxesColumnIncreasing, Factory, Package } from 'lucide-react';
import { TbPackages, TbShirt } from 'react-icons/tb';
import { BiErrorCircle } from 'react-icons/bi';

export function renderUi(planDetails: ProductionPlan) {
  const completionPercentage =
    (planDetails?.totalProducedQuantity / planDetails?.totalQuantityToProduce) * 100;

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
          <ChartNoAxesColumnIncreasing className='w-4 h-4'/>
            <CardTitle className="text-sm font-medium">Overall Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              {planDetails?.totalProducedQuantity} of {planDetails?.totalQuantityToProduce} items
              produced
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
<Package className='w-4 h-4'/>
            <CardTitle className="text-sm font-medium">Total to Produce</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planDetails.totalQuantityToProduce}</div>
            <p className="text-xs text-muted-foreground">This is total quantity to produce</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
          <TbShirt className='h-4 w-4' />

            <CardTitle className="text-sm font-medium">Produced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planDetails.totalProducedQuantity}</div>
            <p className="text-xs text-muted-foreground">This is actual quantity had produced</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
          <Factory className='w-4 h-4'/>
            <CardTitle className="text-sm font-medium">In Manufacturing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planDetails.totalManufacturingQuantity}</div>
            <p className="text-xs text-muted-foreground">
              This is total quantity that are producing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
          <BiErrorCircle className='w-4 h-4' />

            <CardTitle className="text-sm font-medium">Defects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planDetails.totalDefectQuantity}</div>
            <p className="text-xs text-muted-foreground">This is total quantity defects</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 py-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="details">Plan Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <ProductionProgressChart productionPlanDetails={planDetails.productionPlanDetail}/>
        </TabsContent>
        <TabsContent value="materials"><MaterialSummaryTable materialVariantSummary={planDetails?.materialVariantSummary} /></TabsContent>
        <TabsContent value="orders"><PurchaseOrderSummary purchaseOrder={planDetails?.purchaseOrder}/></TabsContent>
        <TabsContent value="details"><ProductionPlanDetails planDetails={planDetails?.productionPlanDetail}/></TabsContent>
      </Tabs>
    </div>
  );
}

export function ProductionPlanDashboard() {
  // In a real application, you would fetch this data from an API
  const productionPlan = {
    name: 'Production Plan For 2024-2025',
    code: 'PRO-PLA-000001',
    status: 'IN_PROGRESS',
    expectedStartDate: '2024-12-11',
    expectedEndDate: '2025-12-05',
    totalQuantityToProduce: 385,
    totalProducedQuantity: 50,
    totalDefectQuantity: 0,
    totalManufacturingQuantity: 0
  };

  // fake data above

  // const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [planDetails, setPlanDetails] = useState<ProductionPlan>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);

  const debouncedSorting: SortingState = useDebounce(sorting, 1000);
  const [containerLoading, setContainerLoading] = useState(false);

  const { productionPlanList, pageMeta, isPending } = useGetAllProductionPlans({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters
  });
  // if(containerLoading){
  //     return(
  //       <div className="flex justify-center items-center">
  //         <Loading/>
  //       </div>
  //     )
  //   }
  const handlePlanSelect = async (planId: string) => {
    try {
      setContainerLoading(true);
      const data = await getProductionPlanDetailsById(planId); // Fetch details
      // setPlanDetails(data); // Store fetched details
      if (data.statusCode === 200) {
        setPlanDetails(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch plan details:', error);
    } finally {
      setContainerLoading(false);
    }
  };
  const formatList = productionPlanList?.data;
  //
  const completionPercentage =
    (planDetails?.totalProducedQuantity / planDetails?.totalQuantityToProduce) * 100 ? 0 : 0;
  return (
    <>
      <SelectProductionPlan
        isLoading={isPending}
        onPlanSelect={handlePlanSelect}
        productionPlanList={formatList || []}
      />
      {containerLoading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <Loading />
        </div>
      ) : (
        <div>
          {planDetails ? (
            renderUi(planDetails)
          ) : (
            <div className="flex justify-center items-center h-[80vh]">
               <p>Select a production plan to see the details.</p>
            </div>
           
          )}
        </div>
      )}
    </>
  );
}
