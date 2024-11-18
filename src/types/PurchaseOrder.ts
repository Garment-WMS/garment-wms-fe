import { PurchaseOrderStatus } from '@/enums/purchaseOrderStatus';
import { MaterialVariant } from './MaterialTypes';
import { Supplier } from './SupplierTypes';
import { PurchaseOrderDeliveryStatus } from '@/enums/purchaseOrderDeliveryStatus';

// PO Delivery Detail
export interface PODeliveryDetail {
  id: string;
  poDeliveryId: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  quantityByPack: number;
  materialVariantId: string;
  expiredDate: string | null;
  totalAmount: number;
  materialVariant: MaterialVariant;
  plannedQuantity?: number;
  actualQuantity?: number;
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
}

// Purchase Order
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  quarterlyProductionPlanId: string | null;
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
