import { PurchaseOrderStatus } from '@/enums/purchaseOrderStatus';
import { MaterialPackage } from './MaterialTypes';
import { Supplier } from './SupplierTypes';
import { PurchaseOrderDeliveryStatus } from '@/enums/purchaseOrderDeliveryStatus';
import { ImportRequest } from './ImportRequestType';
import { ProductionPlan } from './ProductionPlan';

// PO Delivery Detail
export interface PODeliveryDetail {
  id: string;
  poDeliveryId: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  quantityByPack: number;
  materialPackageId: string;
  expiredDate: string | null;
  actualImportQuantity: number;
  totalAmount: number;
  materialPackage: MaterialPackage;
}

// PO Delivery
export interface PODelivery {
  id: string;
  purchaseOrderId: string;
  taxAmount: number | null;
  expectedDeliverDate: string;
  deliverDate: string | null;
  code: string;
  status: PurchaseOrderDeliveryStatus;
  isExtra: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  poDeliveryDetail: PODeliveryDetail[];
  importRequest?: ImportRequest[];
}

// Purchase Order
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  quarterlyProductionPlanId: string | null;
  productionPlanId: string | null;
  purchasingStaffId: string | null;
  currency: string;
  subTotalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  otherAmount: number;
  orderDate: string;
  expectedFinishDate: string;
  finishDate: string | null;
  status: PurchaseOrderStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  supplierId: string;
  supplier: Supplier;
  poDelivery: PODelivery[];
  totalImportQuantity: number;
  totalFailImportQuantity: number;
  totalQuantityToImport: number;
  totalPoDelivery: number; // Added field
  totalFinishedPoDelivery: number; // Added field
  totalInProgressPoDelivery: number; // Added field
  totalPendingPoDelivery: number; // Added field
  totalCancelledPoDelivery: number; // Added field
  productionPlan: ProductionPlan | null;
}

// Pagination Meta
export interface PageMeta {
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Purchase Order Response
export interface PurchaseOrderResponse {
  statusCode: number;
  data: {
    data: PurchaseOrder[] | null;
    pageMeta: PageMeta | null;
  };
  message: string;
  errors: any;
}

// Purchase Order Response for Single Order
export interface PurchaseOrderSingleResponse {
  statusCode: number;
  data: PurchaseOrder | null;
  message: string;
  errors: any;
}

// Purchase Order Response
export interface PurchaseOrderResponse {
  statusCode: number;
  data: {
    data: PurchaseOrder[] | null;
    pageMeta: PageMeta | null;
  };
  message: string;
  errors: any;
}

// Purchase Order Response for Single Order
export interface PurchaseOrderSingleResponse {
  statusCode: number;
  data: PurchaseOrder | null;
  message: string;
  errors: any;
}
