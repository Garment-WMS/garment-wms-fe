import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { ProductionBatch } from './ProductionBatch';
import { ProductSize } from './ProductType';

export interface ImportRequest {
  managerNote: string;
  id: string;
  warehouseStaffId: string | null;
  status:
    | 'ARRIVED'
    | 'PENDING'
    | 'CANCELLED'
    | 'REJECTED'
    | 'APPROVED'
    | 'EXPORTED'
    | 'EXPORTING'
    | 'PRODUCTION_REJECTED'
    | 'PRODUCTION_APPROVED'; // Expanded statuses
  type: 'MATERIAL_BY_PO' | 'OTHER_TYPES'; // Extended as needed
  startAt: string | null;
  finishAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  cancelAt: string | null;
  cancelReason: string | null;
  description: string;
  poDeliveryId: string;
  purchasingStaffId: string;
  productionBatch: ProductionBatch | null;
  rejectAt: string | null;
  rejectReason: string | null;
  warehouseManagerId: string | null;
  importRequestDetail: ImportRequestDetail[];
  warehouseManager: WarehouseManager | null;
  purchasingStaff: PurchasingStaff;
  warehouseStaff: WarehouseStaff | null;
  poDelivery: PODelivery;
}

export interface ImportRequest {
  code: string;
  id: string;
  warehouseStaffId: string | null;
  status:
    | 'ARRIVED'
    | 'PENDING'
    | 'CANCELLED'
    | 'REJECTED'
    | 'APPROVED'
    | 'INSPECTING'
    | 'INSPECTED'
    | 'IMPORTING'
    | 'IMPORTED'; // Expanded statuses
  type: 'MATERIAL_BY_PO' | 'OTHER_TYPES';
  startAt: string | null;
  finishAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  cancelAt: string | null;
  cancelReason: string | null;
  description: string;
  poDeliveryId: string;
  purchasingStaffId: string;
  rejectAt: string | null;
  rejectReason: string | null;
  warehouseManagerId: string | null;
  importRequestDetail: ImportRequestDetail[];
  warehouseManager: WarehouseManager | null;
  purchasingStaff: PurchasingStaff;
  productionDepartment: WarehouseStaff;
  warehouseStaff: WarehouseStaff | null;
  poDelivery: PODelivery;
  inspectionRequest: any;
}

export type ImportRequestDetail = {
  id: string;
  importRequestId: string;
  materialVariantId: string;
  productVariantId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  quantityByPack: number;
  materialPackage: MaterialPackage;
  productSize: ProductSize;
};

export type MaterialPackage = {
  id: string;
  materialVariantId: string;
  name: string;
  code: string;
  packUnit: string;
  uomPerPack: number;
  packedWidth: number;
  packedLength: number;
  packedHeight: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  packedWeight: number;
  materialVariant: MaterialVariant;
};

export type MaterialVariant = {
  id: string;
  materialId: string;
  image: string | null;
  name: string;
  code: string;
  reorderLevel: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  material: Material;
  materialAttribute: MaterialAttribute[];
  materialInspectionCriteria: MaterialInspectionCriterion[];
};

export type Material = {
  id: string;
  materialUomId: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  materialUom: MaterialUom;
};

export type MaterialUom = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type MaterialAttribute = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type MaterialInspectionCriterion = {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  avatarUrl: string;
  cidId: string | null;
  dateOfBirth: string;
  firstName: string;
  gender: 'MALE' | 'FEMALE'; // Adjust if needed
  isDeleted: boolean;
  isVerified: boolean;
  lastName: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
type PurchasingStaff = {
  id: string;
  userId: string;
  users: User;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  account: any;
};

type WarehouseManager = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  account: any;
} | null;

type WarehouseStaff = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  account: any;
} | null;

type PODelivery = {
  id: string;
  purchaseOrderId: string;
  expectedDeliverDate: string;
  deliverDate: string | null;
  status: 'IMPORTING' | 'DELIVERED'; // Add more statuses if needed
  isExtra: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  purchaseOrder: PurchaseOrder;
};

type PurchaseOrder = {
  id: string;
  poNumber: string;
  quarterlyProductionPlanId: string | null;
  purchasingStaffId: string;
  currency: string;
  subTotalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  otherAmount: number;
  orderDate: string;
  expectedFinishDate: string;
  finishDate: string | null;
  cancelledAt: string | null;
  cancelledReason: string | null;
  status: 'FINISHED' | 'PENDING'; // Add more statuses if needed
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  supplierId: string;
  purchasingStaff: PurchasingStaff;
  supplier: Supplier;
};

export interface poDelivery {
  id: string;
  purchaseOrderId: string;
  expectedDeliverDate: string;
  deliverDate: string;
  purchaseOrder: PurchaseOrder;
}

export interface Supplier {
  supplierName: string;
  address: string;
  email: string;
  phoneNumber: string;
  fax: string;
}
export interface ImportRequestDetails {
  id: string;
  materialPackage?: MaterialPackage;
  quantityByPack?: number;
}

export const Status: { label: string; value: string; variant: StatusVariant }[] = [
  { label: 'Pending', value: 'PENDING', variant: 'info' },
  { label: 'Rejected', value: 'REJECTED', variant: 'danger' },
  { label: 'Approved', value: 'APPROVED', variant: 'success' },
  { label: 'Exporting', value: 'EXPORTING', variant: 'warning' },
  { label: 'Exported', value: 'EXPORTED', variant: 'success' },
  { label: 'Await to export', value: 'AWAIT_TO_EXPORT', variant: 'warning' },
  { label: 'Production Rejected', value: 'PRODUCTION_REJECTED', variant: 'destructive' },
  { label: 'Production Approved', value: 'PRODUCTION_APPROVED', variant: 'success' },
  { label: 'Cancelled', value: 'CANCELLED', variant: 'destructive' }
];
type StatusVariant = 'info' | 'destructive' | 'success' | 'warning' | 'default' | 'danger';
export interface UseImportRequestsResponse {
  pageMeta: PageMetaData;
  data: ImportRequest[];
}

export interface UseExportRequestsResponse {
  pageMeta: PageMetaData;
  data: any[];
}

export const DeliveryType = [
  { label: 'Material with Purchase Order', value: 'MATERIAL_BY_PO' },
  { label: 'Return Material', value: 'MATERIAL_RETURN' },
  { label: 'Material without Purchase Order', value: 'MATERIAL_NOT_BY_PO' },
  { label: 'Product with Manufacturing Order', value: 'PRODUCT_BY_BATCH' },
  { label: 'Return Product', value: 'PRODUCT_RETURN' },
  { label: 'Product without Manufacturing Order', value: 'PRODUCT_NOT_BY_BATCH' }
];

export interface UseImportRequestsInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export interface UseExportRequestsInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}
export interface PageMetaData {
  total: number;
  offset: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
