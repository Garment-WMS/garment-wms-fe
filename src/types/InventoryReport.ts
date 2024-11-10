export interface InventoryReportPlan{
    from: string;
    to: string;
    title: string;
    note: string;
    inventoryReportPlanDetails : InventoryReportPlanDetailsMaterial[] | InventoryReportPlanDetailsProduct[];
}

export interface InventoryReportPlanDetailsMaterial{
    materialPackageId: string;
    warehouseStaffId: string;
}

export interface InventoryReportPlanDetailsProduct{
    warehouseStaffId: string;
    productSizeId: string;
}