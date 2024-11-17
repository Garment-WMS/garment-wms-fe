import { MaterialPackage, MaterialVariant } from "./MaterialTypes";
import { ProductSize, ProductVariant } from "./ProductType";
import { PageMetaData } from "./Shared";

export const InventoryReportStatus = [
    {value: 'NOT_YET', label: 'Not yet', variant: 'destructive'},
    {value: 'IN_PROGRESS', label: 'In Progress', variant: 'warning'},
    {value: 'FINISHED', label: 'Finished', variant: 'success'},
]

export interface InventoryReportPlanToCreate{
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


export interface InventoryReportPlan{
    id: string,
    warehouseManagerId: string,
    title: string,
    code: string,
    status: string,
    note:string,
    from: string,
    to: string,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
    inventoryReportPlanDetail: InventoryReportPlanDetail[]
}

export interface InventoryReportPlanToRender{
    id: string,
    warehouseManagerId: string,
    title: string,
    code: string,
    status: string,
    note:string,
    from: string,
    to: string,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
    inventoryReportPlanDetail: InventoryReportPlanDetailsToRender[]
}

export interface InventoryReportPlanDetailsToRender{
    warehouseStaff: any,
    inventoryReport: any,
    staffInventoryReportPlanDetails: StaffInventoryReportPlanDetails[],
}

export interface StaffInventoryReportPlanDetails{
    materialVariant?: MaterialVariant,
    packagePlanDetails?: MaterialPackage[],
    productVariant?: ProductVariant,
    productPlanDetails?: ProductSize[],

}

export interface InventoryReportPlanDetail{
    id: string,
    code: string,
    inventoryReportPlanId: string,
    inventoryReportId: string,
    warehouseStaffId: string,
    materialPackageId: string,
    productSizeId: string,
    note: string,
    materialPackage:MaterialPackage,
    productSize:ProductSize,
    inventoryReport: any,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
}
export interface InventoryReportPlanResponse{
    data: InventoryReportPlan[];
    pageMeta: PageMetaData;
}

export interface InventoryReport{
    id: string,
    code: string,
    note: string,
    warehouseManagerId: string,
    warehouseStaffId: string,
    status: string,
    from: string,
    to: string,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
    inventoryReportDetails: InventoryReportDetail[]
}

export interface InventoryReportResponse {
    statusCode: number;
    data: {
      data: InventoryReport[];
      pageMeta: PageMetaData;
    };
    message: string;
    errors: any | null;
  }

export interface InventoryReportDetail{
    id: string,
    inventoryReportId: string,
    materialReceiptId: string,
    productReceiptId: string,
    note: string,
    expectedQuantity: number,
    actualQuantity: number,
    managerQuantityConfirm: number,
    recoredAt: string,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
}

