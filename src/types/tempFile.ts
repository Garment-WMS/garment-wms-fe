import { PODelivery } from './PurchaseOrder';
import { Supplier } from './SupplierTypes';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  quarterlyProductionPlanId: string | null;
  purchasingStaffId: string | null;
  totalAmount: number;
  currency: string;
  taxAmount: number;
  orderDate: string;
  expectedFinishDate: string;
  status: string;
  finishDate: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  supplierId: string;
  supplier: Supplier;
  poDelivery: PODelivery[];
}

export enum PoDeliveryStatus {
  PENDING = 'PENDING',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED'
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
