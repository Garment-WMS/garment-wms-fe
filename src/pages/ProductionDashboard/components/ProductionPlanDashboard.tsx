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
import { ChartNoAxesColumnIncreasing, Factory, LucideCirclePercent, Package } from 'lucide-react';
import { TbPackages, TbShirt } from 'react-icons/tb';
import { BiErrorCircle } from 'react-icons/bi';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { MdOutlinePercent } from 'react-icons/md';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { ProductionBatchListResponse } from '@/types/ProductionBatchListResponse';
import { ProductionBatch } from '@/types/ProductionBatch';
import { getProductionBatchByPlan, getProductionBatchChart } from '@/api/services/productionBatch';
import ProductionBatchSummary from './ProductionBatchSummary';

function renderUi(
  planDetails: ProductionPlan,
  productionBatches: any[] | null,
  productionBatchList: any[] | null
) {
  const completionPercentage =
    (planDetails?.totalProducedQuantity / planDetails?.totalQuantityToProduce) * 100;

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="col-span-5">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <MdOutlinePercent className="w-4 h-4" />
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
            <Package className="w-4 h-4" />
            <CardTitle className="text-sm font-medium">Total to Produce</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planDetails.totalQuantityToProduce}</div>
            <p className="text-xs text-muted-foreground">This is total quantity to produce</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <TbShirt className="h-4 w-4" />

            <CardTitle className="text-sm font-medium">Produced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planDetails.totalProducedQuantity}</div>
            <p className="text-xs text-muted-foreground">This is actual quantity had produced</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <Factory className="w-4 h-4" />
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
            <BiErrorCircle className="w-4 h-4" />

            <CardTitle className="text-sm font-medium">Defects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planDetails.totalDefectQuantity}</div>
            <p className="text-xs text-muted-foreground">This is total quantity defects</p>
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <IoIosInformationCircleOutline className="w-4 h-4" />
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{convertTitleToTitleCase(planDetails?.status)}</div>
            <p className="text-xs text-muted-foreground">
              This is the status of the production plan
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 py-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          {/* <TabsTrigger value="orders">Purchase Orders</TabsTrigger> */}
          <TabsTrigger value="details">Plan Details</TabsTrigger>
          <TabsTrigger value="batch">Production Batch</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <ProductionProgressChart productionPlanDetails={planDetails.productionPlanDetail} />
        </TabsContent>
        <TabsContent value="materials">
          <MaterialSummaryTable materialVariantSummary={planDetails?.materialVariantSummary} />
        </TabsContent>
        {/* <TabsContent value="orders">
          <PurchaseOrderSummary purchaseOrder={planDetails?.purchaseOrder} />
        </TabsContent> */}
        <TabsContent value="details">
          <ProductionPlanDetails planDetails={planDetails?.productionPlanDetail} />
        </TabsContent>
        <TabsContent value="batch">
          {productionBatches && productionBatchList ? (
            <ProductionBatchSummary
              productionBatchSummary={productionBatches}
              productionBatchList={productionBatchList}
            />
          ) : (
            <p>No production batches available for this plan.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ProductionPlanDashboard() {
  // const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [planDetails, setPlanDetails] = useState<ProductionPlan>();
  const [productionBatches, setProductionBatches] = useState<any[] | null>(null);
  const [productionBatchList, setProductionBatchList] = useState<any[] | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination] = useState<PaginationState>({ pageSize: 10, pageIndex: 0 });
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
      const chartData = await getProductionBatchChart(planId);
      const batchList = await getProductionBatchByPlan(planId, pagination, sorting);
      // setPlanDetails(data); // Store fetched details
      if (data.statusCode === 200) {
        setPlanDetails(data.data);
      }
      if (chartData.statusCode === 200) {
        setProductionBatches(chartData.data);
      }
      if (batchList?.data) {
        setProductionBatchList(batchList);
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
            renderUi(planDetails, productionBatches, productionBatchList)
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
