import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

export interface ImportRequest {
  id: string;
  poDelivery?: poDelivery;
  warehouseStaffName?: string;
  type: string
  supplier?: string;
  deliveryType?: string;
  createdAt?: string;
  updatedAt?: string;
  finishAt?: string;
  importRequestDetail?: ImportRequestDetails[];
  status?: string;
}
export interface poDelivery{
  id: string,
  purchaseOrderId: string,
  expectedDeliverDate: string,
  deliverDate: string,
  purchaseOrder: PurchaseOrder
}
export interface PurchaseOrder{
  id: string,
  poNumber: string,
  supplier: Supplier,
  status: string
}
export interface Supplier{
  supplierName: string,
  address: string,
  email: string,
  phoneNumber: string,
  fax: string
}
export interface ImportRequestDetails {
  id: string;
  materialVariant?: MaterialVariant;
  quantityByPack?: number;
}

export interface MaterialVariant{
  id: string;
  name: string;
  code:string;
  packUnit: string;
  uomPerPack: number;
  material: Material;
}
export interface Material{
  id: string;
  name: string;
  code: string;
  reorderLevel: number;
  materialType: MaterialType;
}
export interface MaterialType{
  id: string;
  name: string;
  code: string;
}
export const Status: { label: string; value: string; variant: StatusVariant }[] = [
  { label: 'Arrived', value: 'ARRIVED', variant: 'info' },
  { label: 'Rejected', value: 'REJECTED', variant: 'destructive' },
  { label: 'Approved', value: 'APPROVED', variant: 'success' },
  { label: 'Inspecting', value: 'INSPECTING', variant: 'warning' },
  { label: 'Inspected', value: 'INSPECTED', variant: 'success' },
  { label: 'Importing', value: 'IMPORTING', variant: 'warning' },
  { label: 'Imported', value: 'IMPORTED', variant: 'success' },
  { label: 'Canceled', value: 'CANCELED', variant: 'destructive' }
];
type StatusVariant = 'info' | 'destructive' | 'success' | 'warning' | 'default';
export interface UseImportRequestsResponse {
  pageMeta: PageMetaData;
  data: ImportRequest[];
}

export const DeliveryType = [
  { label: 'Material with Purchase Order', value: 'MATERIAL_BY_PO' },
  { label: 'Return Material', value: 'MATERIAL_RETURN' },
  { label: 'Material without Purchase Order', value: 'MATERIAL_NOT_BY_PO' },
  { label: 'Product with Manufacturing Order', value: 'PRODUCT_BY_MO' },
  { label: 'Return Product', value: 'PRODUCT_RETURN' },
  { label: 'Product without Manufacturing Order', value: 'PRODUCT_NOT_BY_MO' }
];

export interface UseImportRequestsInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}
export interface PageMetaData{
  totalItems: number;
  offset: number;
  limit: number;
  page: number;
  totalPages: number;
}

  
