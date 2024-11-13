import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { PageMeta } from './purchaseOrder';
import { PageMetaData } from './ImportRequestType';

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
  numberOfMaterialVariants:number
}

// Material
export interface MaterialVariant {
  id: string;
  materialId: string;
  materialUomId: string;
  name: string;
  code: string;
  reorderLevel: number;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  material: Material;
  materialPackage: MaterialPackage[]
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
export interface MaterialReceiptResponse {
  statusCode: number;
  data: MaterialReceipt;
  message: string;
  errors: any | null;
}
export interface MaterialReceipt {
  id: string;
  materialPackageId: string;
  importReceiptId: string;
  quantityByPack: number;
  remainQuantityByPack: number;
  status: string;
  materialPackage: MaterialPackage;
  expiredDate: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}
export interface MaterialImportReceipt{
  id: string;
  materialId: string;
  code: string;
  importReceiptId: string;
  expireDate: string;
  quantityByPack:number;
  importDate:string;
  materialPackage: MaterialPackage;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}
export interface MaterialExportReceipt{
  id: string;
  materialId: string;
  code: string;
  importDate:string;
  exportReceiptId: string;
  expireDate: string;
  quantityByPack:number;
  materialPackage: MaterialPackage;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
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
export interface MaterialPackage {
  id: string;
  materialId: string;
  name: string;
  code: string;
  packUnit: string;
  uomPerPack: number;
  packedWidth: number;
  packedLength: number;
  packedHeight: number;
  packedWeight: number;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  material: Material;
  uom: UOM
  inventoryStock: InventoryStock
}
export interface InventoryStock {
  id: string;
  materialVariantId: string | null;
  productVariantId: string | null;
  quantityByPack: number;
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
