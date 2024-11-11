export interface InventoryReportPlan{
    from: string;
    to: string;
    title: string;
    inventoryReportPlanDetails : Array<InventoryReportPlanDetailsMaterial | InventoryReportPlanDetailsProduct>;
}

export interface InventoryReportPlanDetailsMaterial{
    materialPackageId: string;
    warehouseStaffId: string;
}

export interface InventoryReportPlanDetailsProduct{
    warehouseStaffId: string;
    productSizeId: string;
}

