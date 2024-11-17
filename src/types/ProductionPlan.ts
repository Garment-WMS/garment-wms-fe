import { ProductionPlanStatus } from '@/enums/ProductionPlan';
import { PurchaseOrder } from './purchaseOrder';
import { Account } from './Account';

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

// Define the ProductionBatch type
export interface ProductionBatch {
  id: string;
  // Add more properties of ProductionBatch as per your schema
}

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
  purchaseOrder: PurchaseOrder[];
  productionPlanDetail: ProductionPlanDetail[];
  factoryDirector: FactoryDirector;
}
