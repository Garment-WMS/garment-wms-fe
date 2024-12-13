
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


export function PurchaseOrderDashboard() {
  // In a real application, you would fetch this data from an API
  const purchaseOrder = {
    poNumber: "PUR-ORD-000009",
    status: "IN_PROGRESS",
    orderDate: "2024-10-13",
    expectedFinishDate: "2025-11-28",
    totalQuantityToImport: 30,
    totalImportQuantity: 26,
    totalFailImportQuantity: 4,
    totalAmount: 122500000, // subTotalAmount + taxAmount + shippingAmount + otherAmount
    currency: "VND",
  }

  const deliveryProgress = {
    total: 2,
    finished: 1,
    inProgress: 0,
    pending: 1,
    cancelled: 0,
  }



  const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>([]);
    const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);
    const debouncedSorting: SortingState = useDebounce(sorting, 1000);
  const { } = useGetAllPurchaseOrder({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination
  })

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrder.totalAmount.toLocaleString()} {purchaseOrder.currency}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Import Items Quantity Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrder.totalImportQuantity} / {purchaseOrder.totalQuantityToImport} items</div>
            <p className="text-xs text-muted-foreground">
              {((purchaseOrder.totalImportQuantity / purchaseOrder.totalQuantityToImport) * 100).toFixed(2)}% Complete
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Import Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrder.totalFailImportQuantity} items</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{convertTitleToTitleCase(purchaseOrder.status)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="details">Order Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DeliveryProgressChart deliveryProgress={deliveryProgress} />
        </TabsContent>
        <TabsContent value="materials">
          <MaterialSummaryTable />
        </TabsContent>
        <TabsContent value="details">
          <PurchaseOrderSummary purchaseOrder={purchaseOrder} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

