import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { PageMeta } from './PurchaseOrder';
import { PageMetaData } from './Shared';

// Unit of Measure (UOM)
export interface UOM {
  id: string;
  name: string;
  uomCharacter: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Material Type
export interface Material {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  materialUom: UOM;
  numberOfMaterialVariants: number;
}

// Material
export interface MaterialVariant {
  id: string;
  materialId: string;
  materialUomId: string;
  name: string;
  code: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  material: Material;
  materialPackage: MaterialPackage[];
  materialAttribute: MaterialAttribute[];
  image: string | null;
  onHand: number;
  numberOfMaterialPackage: number;
}

export interface MaterialVariantResponse {
  statusCode: number;
  data: {
    data: MaterialVariant[];
    pageMeta: PageMetaData;
  };
  message: string;
  errors: any | null;
}
export interface MaterialReceiptResponse {
  statusCode: number;
  data: {
    data: MaterialReceipt[];
    pageMeta: PageMetaData;
  };
  message: string;
  errors: any | null;
}
export interface MaterialImportReceiptResponse {
  statusCode: number;
  data: {
    data: MaterialImportReceipt[];
    pageMeta: PageMetaData;
  };
  message: string;
  errors: any | null;
}
export interface MaterialExportReceiptResponse {
  statusCode: number;
  data: {
    data: MaterialExportReceipt[];
    pageMeta: PageMetaData;
  };
  message: string;
  errors: any | null;
}
// export interface MaterialReceiptResponse {
//   statusCode: number;
//   data: MaterialReceipt;
//   message: string;
//   errors: any | null;
// }
export interface MaterialReceipt {
  id: string;
  materialId: string;
  code: string;
  importReceiptId: string;
  expireDate: string;
  quantityByPack: number;
  importDate: string;
  materialPackage: MaterialPackage;
  remainQuantityByPack: number;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  status: string;
}
export interface OneMaterialReceipt{
  id: string;
  code: string;
  importReceiptId: string;
  expireDate: string;
  quantityByPack: number;
  importDate: string;
  materialPackage: MaterialPackage;
  remainQuantityByPack: number;
  materialExportReceiptDetail: MaterialExportReceiptDetail[]
  receiptAdjustment: ReceiptAdjustment[]
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  status: string;
}

export interface MaterialExportReceiptDetail{
  id: string
  quantityByPack: number
  createdAt: string
  materialExportReceipt: MaterialExportReceipt
}
export interface ReceiptAdjustment{
  id: string
  beforeAdjustQuantity: number
  afterAdjustQuantity: number
  status: string
  adjustedAt: string
}
export interface MaterialImportReceipt {
  id: string;
  materialId: string;
  code: string;
  importReceiptId: string;
  expireDate: string;
  quantityByPack: number;
  importDate: string;
  materialPackage: MaterialPackage;
  remainQuantityByPack: number;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  status: string;
}
type StatusVariant = 'info' | 'destructive' | 'success' | 'warning' | 'default';

export const receiptStatus = ['IMPORTING', 'AVAILABLE', 'USED'];
export const ReceiptStatusLabel: { label: string; value: string; variant: StatusVariant }[] = [
  { label: 'Importing', value: 'IMPORTING', variant: 'warning' },
  { label: 'Available', value: 'AVAILABLE', variant: 'success' },
  { label: 'Used', value: 'USED', variant: 'destructive' }
];
export interface MaterialExportReceipt {
  id: string;
  materialId: string;
  code: string;
  importDate: string;
  exportReceiptId: string;
  expireDate: string;
  quantityByPack: number;
  remainQuantityByPack: number;
  materialReceipt: MaterialReceipt;
  type: string;
  materialPackage: MaterialPackage;
  startedAt: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  status: string;

}
export interface MaterialDataToRender {
  limit: number;
  page: number;
  total: number;
  totalFiltered: number;
  data: MaterialVariant[];
}
export interface UseMaterialsInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

// Material Variant

// Material Package Interface
export interface MaterialPackage {
  id: string;
  materialVariantId: string;
  SKU: string;
  name: string;
  code: string;
  packUnit: string;
  uomPerPack: number;
  packedWidth: number;
  packedLength: number;
  packedHeight: number;
  packedWeight: number;
  uom: UOM;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  materialReceipt: MaterialReceipt[];
  material: Material;
  inventoryStock: InventoryStock
  materialVariant: MaterialVariant;
}

export interface InventoryStock {
  id: string;
  materialVariantId: string | null;
  productVariantId: string | null;
  quantityByPack: number;
  quantityByUom: number;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}
export type MaterialPackageResponse = {
  statusCode: number;
  data: {
    data: MaterialPackage[];
    pageMeta: PageMeta;
  };
  message: string;
  errors: any | null;
};

export type MaterialReceiptStatisticsResponse = {
  monthlyData: MonthlyData[];
};

export type MonthlyData = {
  month: number;
  data: OneMonthData[];
};

export type OneMonthData = {
  materialVariant: MaterialVariant;
  totalImportQuantityByUom: number;
  totalImportQuantityByPack: number;
  totalExportQuantityByPack: number;
  totalExportQuantityByUom: number;
};
export type MaterialAttribute = {
  id: string
  name: string
  value: string
  type: string
  materialPackage: MaterialPackage
}
