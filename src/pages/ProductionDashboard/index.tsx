"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductionProgressChart } from "./components/ProductionProgressChart"
import { Label } from "@/components/ui/Label"
import { SelectProductionPlan } from "./components/SelectProductionPlan"

export function ProductionPlanDashboard() {
  // In a real application, you would fetch this data from an API
  const productionPlan = {
    name: "Production Plan For 2024-2025",
    code: "PRO-PLA-000001",
    status: "IN_PROGRESS",
    expectedStartDate: "2024-12-11",
    expectedEndDate: "2025-12-05",
    totalQuantityToProduce: 385,
    totalProducedQuantity: 50,
    totalDefectQuantity: 0,
    totalManufacturingQuantity: 0,
  }

  const completionPercentage = (productionPlan.totalProducedQuantity / productionPlan.totalQuantityToProduce) * 100

  return (
    <div className="space-y-4 bg-white p-4">
      <Label className="text-2xl font-bold">Dashboard</Label>
      <SelectProductionPlan/>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              {productionPlan.totalProducedQuantity} of {productionPlan.totalQuantityToProduce} items produced
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total to Produce</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionPlan.totalQuantityToProduce}</div>
            <p className="text-xs text-muted-foreground">
              This is total quantity to produce
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionPlan.totalProducedQuantity}</div>
            <p className="text-xs text-muted-foreground">
              This is actual quantity had produced
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Manufacturing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionPlan.totalManufacturingQuantity}</div>
            <p className="text-xs text-muted-foreground">
              This is total quantity that are producing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Defects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionPlan.totalDefectQuantity}</div>
            <p className="text-xs text-muted-foreground">
              This is total quantity defects
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="details">Plan Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <ProductionProgressChart />
        </TabsContent>
        <TabsContent value="materials">
          {/* <MaterialSummaryTable /> */}
        </TabsContent>
        <TabsContent value="orders">
          {/* <PurchaseOrderSummary /> */}
        </TabsContent>
        <TabsContent value="details">
          {/* <ProductionPlanDetails /> */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

