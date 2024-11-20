import { MaterialPackage, MaterialReceipt, MaterialVariant } from "./MaterialTypes";
import { ProductReceipt, ProductSize, ProductVariant } from "./ProductType";
import { PageMetaData } from "./Shared";
import { User } from "./User";

export const InventoryReportPlanStatus = [
    {value: 'NOT_YET', label: 'Not yet', variant: 'destructive'},
    {value: 'IN_PROGRESS', label: 'In Progress', variant: 'warning'},
    {value: 'FINISHED', label: 'Finished', variant: 'success'},
]

export const InventoryReportStatus = [
    {value: 'IN_PROGRESS', label: 'In Progress', variant: 'warning'},
    {value: 'CANCELLED', label: 'Cancelled', variant: 'destructive'},
    {value: 'FINISHED', label: 'Finished', variant: 'success'},
    {value: 'REPORTED, label: Reported', variant: 'default'},
]


export interface InventoryReportToRender{
    id: string,
    code: string,
    status: string,
    note : string,
    warehouseManager: User,
    warehouseStaff: User,
    from: string,
    to: string,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
    inventoryReportDetail: InventoryReportDetailsToRender[],
    totalExpectedQuantity: number,
    totalActualQuantity: number,
    totalManagerQuantityConfirm: number
}

export interface InventoryReportDetailsToRender{
    materialVariant: MaterialVariant,
    materialPackages: MaterialPackageOfInventoryReport[],
    productVariant: ProductVariant,
    productSizes: ProductSizeOfInventoryReport[],
    totalExpectedQuantity: number,
    totalActualQuantity: number,
    totalManagerQuantityConfirm: number

}
export interface MaterialDetailsToRender{
    materialVariant: MaterialVariant,
    materialPackages: MaterialPackageOfInventoryReport[],
    totalExpectedQuantity: number,
    totalActualQuantity: number,
    totalManagerQuantityConfirm: number
}
export interface ProductDetailsToRender{
    productVariant: ProductVariant,
    productSizes: ProductSizeOfInventoryReport[],
    totalExpectedQuantity: number,
    totalActualQuantity: number,
    totalManagerQuantityConfirm: number
}
export interface ProductVariantOfInventoryReport{
    id: string;
    productId: string;
    name: string;
    code: string;
    reorderLevel: number;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;

    image: string | null;
    onHand: number;
    numberOfMaterialPackage: number;
    totalExpectedQuantity: number,
    totalActualQuantity: number,
    totalManagerQuantityConfirm: number
}

export interface ProductSizeOfInventoryReport{
    productSize: ProductSize,   
    inventoryReportDetails: ProductReceiptReportDetails[],
    totalExpectedQuantity: number,
    totalActualQuantity: number,
    totalManagerQuantityConfirm: number
    
}
export interface MaterialVariantOfInventoryReport{
    id: string;
  materialId: string;
  materialUomId: string;
  name: string;
  code: string;
  reorderLevel: number;
  image: string

  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  totalExpectedQuantity: number,
    totalActualQuantity: number,
    totalManagerQuantityConfirm: number
}
export interface MaterialPackageOfInventoryReport{
    materialPackage: MaterialPackage,
    inventoryReportDetails: MaterialReceiptReportDetails[],
    totalExpectedQuantity: number,
    totalActualQuantity: number,
    totalManagerQuantityConfirm: number
    
    
}
export interface ProductReceiptReportDetails{
    id: string;
    expectedQuantity: number;
    actualQuantity: number;
    managerQuantityConfirm: number;
    productReceipt: ProductReceipt
}
export interface MaterialReceiptReportDetails{
    id: string;
    expectedQuantity: number;
    actualQuantity: number;
    managerQuantityConfirm: number;
    materialReceipt: MaterialReceipt
}
export interface InventoryReportPlanToCreate{
    from: string;
    to: string;
    title: string;
    inventoryReportPlanDetails : Array<InventoryReportPlanDetailsMaterial | InventoryReportPlanDetailsProduct>;
}

export interface InventoryReportPlanDetailsMaterial{
    materialVariantId: string;
    warehouseStaffId: string;
}

export interface InventoryReportPlanDetailsProduct{
    warehouseStaffId: string;
    productVariantId: string;
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
    type: string,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
    inventoryReportPlanDetail: InventoryReportPlanDetail[]
}

export interface InventoryReportPlanToRenderResponse {
    statusCode: number;
    data: InventoryReportPlanToRender[];
    message: string;
    errors: any | null;
  }

export interface InventoryReportPlanToRender{
    id: string,
    warehouseManagerId: string,
    title: string,
    code: string,
    status: string,
    type: string,
    note:string,
    from: string,
    to: string,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
    inventoryReportPlanDetail: InventoryReportPlanDetailsToRender[]
}

export interface InventoryReportPlanDetailsToRender{
    warehouseStaff: User,
    inventoryReport: InventoryReport,
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
    inventoryReportPlan: InventoryReportPlan,   
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
    warehouseManager: User
    warehouseStaffId: string,
    warehouseStaff: User,
    status: string,
    from: string,
    to: string,
    totalExpectedQuantity: number;
    totalActualQuantity: number;
    totalManagerQuantityConfirm: number;
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
    inventoryReportDetails: InventoryReportDetail[]
    inventoryReportPlanDetail: InventoryReportPlanDetail[]
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

