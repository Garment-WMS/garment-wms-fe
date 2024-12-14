
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeliveryProgressChart } from "./DeliveryProgressChart"
import { MaterialSummaryTable } from "./MaterialSummaryTable"
import { PurchaseOrderSummary } from "./PurchaseOrderSummary"
import { convertTitleToTitleCase } from "@/helpers/convertTitleToCaseTitle"
import { useState } from "react"
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table"
import { useDebounce } from "@/hooks/useDebouce"
import { useGetAllPurchaseOrder } from "@/hooks/useGetAllPurchaseOrder"
import SelectPurchaseOrder from "./SelectPurchaseOrder"
import { getPurchaseOrderById } from "@/api/services/purchaseOrder"
import { PurchaseOrder } from "@/types/PurchaseOrder"
import Loading from "@/components/common/Loading"
import { MdOutlineReceiptLong } from "react-icons/md"
import { Package } from "lucide-react"
import { BiErrorCircle } from "react-icons/bi"
import { IoIosInformationCircleOutline } from "react-icons/io"
import { PurchaseOrderDeliveryTable } from "./PurchaseOrderDeliveryTable"

 const renderUi=(purchaseOrder: PurchaseOrder)=> {
  const deliveryProgress = {
    total: purchaseOrder?.totalPoDelivery,
    finished: purchaseOrder?.totalFinishedPoDelivery,
    inProgress: purchaseOrder?.totalInProgressPoDelivery,
    pending: purchaseOrder?.totalPendingPoDelivery,
    cancelled: purchaseOrder?.totalCancelledPoDelivery
  }
  return(
    <>
     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
          <MdOutlineReceiptLong className='w-4 h-4'/>

            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrder?.subTotalAmount.toLocaleString()} {purchaseOrder?.currency}</div>
            <p className="text-xs text-muted-foreground">This is total money company paid</p>

          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
          <Package className='w-4 h-4'/>
            <CardTitle className="text-sm font-medium">Import Items Quantity Progress</CardTitle>
            
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrder?.totalImportQuantity} / {purchaseOrder?.totalQuantityToImport} items</div>
            <p className="text-xs text-muted-foreground">
              {((purchaseOrder?.totalImportQuantity / purchaseOrder?.totalQuantityToImport) * 100).toFixed(2)}% Complete
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <BiErrorCircle className="w-4 h-4" />
            <CardTitle className="text-sm font-medium">Failed Import Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrder?.totalFailImportQuantity} items</div>
            <p className="text-xs text-muted-foreground">This is total quantity that is failed the inspection</p>

          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <IoIosInformationCircleOutline className="w-4 h-4" />
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{convertTitleToTitleCase(purchaseOrder?.status)}</div>
            <p className="text-xs text-muted-foreground">This is the status of purchase order</p>

          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 py-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="details">Order Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DeliveryProgressChart deliveryProgress={deliveryProgress} />
          <PurchaseOrderDeliveryTable poDeliveries={purchaseOrder?.poDelivery ?? []} />
        </TabsContent>
        <TabsContent value="materials">
          <MaterialSummaryTable materials={purchaseOrder?.poMaterialSummary}/>
        </TabsContent>
        <TabsContent value="details">
          <PurchaseOrderSummary purchaseOrder={purchaseOrder} />
        </TabsContent>
      </Tabs>
    </>
  )
}
export function PurchaseOrderDashboard() {


  const [containerLoading, setContainerLoading] = useState(false);
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder>();
  const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 300
  });
    const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);
    const debouncedSorting: SortingState = useDebounce(sorting, 1000);
    const { isPending, purchaseOrderList, pageMeta } = useGetAllPurchaseOrder({
      sorting: debouncedSorting,
      columnFilters: debouncedColumnFilters,
      pagination
    });
    const onPOSelect = async(planId: string) => {
      try {
        setContainerLoading(true);
        const data = await getPurchaseOrderById(planId); 
        if (data.statusCode === 200) {
          setPurchaseOrder(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch plan details:', error);

      }
      finally {
        setContainerLoading(false);
      }
    }
  return (
    <div className="space-y-4">
      <div className="mb-6">
          <h1 className="text-3xl font-bold text-primaryLight">Purchase Order Details</h1>
        </div>
      <SelectPurchaseOrder
      purchaseOrderList={purchaseOrderList ?? []}
      isLoading={isPending}
      onPOSelect={onPOSelect}
      />
     {containerLoading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <Loading />
        </div>
      ) : (
        <div>
          {purchaseOrder ? (
            renderUi(purchaseOrder)
          ) : (
            <div className="flex justify-center items-center h-[80vh]">
               <p>Select a purchase order to see the details.</p>
            </div>
           
          )}
        </div>
      )}
    </div>
  )
}

