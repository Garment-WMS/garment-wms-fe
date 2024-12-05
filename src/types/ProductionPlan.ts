import { Account } from './Account';
import { ProductionPlanStatus } from '@/enums/productionPlan';
import { ProductionBatch } from './ProductionBatch';
import { PurchaseOrder } from './PurchaseOrder';

export interface ProductSize {
  id: string;
  productVariantId: string;
  name: string;
  code: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  size: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  productVariant: any; // Placeholder for ProductVariant type
  productFormula: any[]; // Placeholder for ProductFormula type
  importRequestDetail: any[]; // Placeholder for ImportRequestDetail type
  inspectionReportDetail: any[]; // Placeholder for InspectionReportDetail type
  productReceipt: any[]; // Placeholder for ProductReceipt type
  productionPlanDetail: any[]; // Placeholder for ProductionPlanDetail type
  inventoryStock?: any; // Placeholder for InventoryStock type
  InventoryReportPlanDetail: any[]; // Placeholder for InventoryReportPlanDetail type
}
export interface ImportRequestDetailForProduct {}

// Define the ProductionPlanDetail type
export interface ProductionPlanDetail {
  id: string;
  productionPlanId: string;
  productSizeId: string;
  quantityToProduce: number;
  code?: string;
  note?: string;
  startDate?: Date;
  finishDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  productSize: ProductSize;
  productionPlan: ProductionPlan;
  productionBatch: ProductionBatch[];
  productPlanDetailDefectQuantity?: number;
  productPlanDetailProducedQuantity?: number;
}

export interface FactoryDirector {
  id: string;
  accountId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  account: Account;
  productionPlan: ProductionPlan[];
}
// Define the ProductionPlan type
export interface ProductionPlan {
  id: string;
  factoryDirectorId: string;
  name: string;
  code: string;
  note?: string;
  status: ProductionPlanStatus;
  expectedStartDate: Date;
  expectedEndDate: Date;
  startDate?: Date;
  finishDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  purchaseOrder: PurchaseOrder[]; // Association with PurchaseOrder
  productionPlanDetail: ProductionPlanDetail[]; // Association with ProductionPlanDetail
  factoryDirector: FactoryDirector; // Reference to the FactoryDirector
}
