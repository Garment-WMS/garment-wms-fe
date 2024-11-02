import { PageMeta } from './purchaseOrder';

// Unit of Measure (UOM)
export interface UOM {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Material Type
export interface MaterialType {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Material
export interface Material {
  id: string;
  materialUomId: string;
  name: string;
  code: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  materialUom: UOM;
  materialType: MaterialType;
}

// Material Variant
export interface MaterialVariant {
  id: string;
  materialId: string;
  image: string;
  name: string;
  code: string;
  reorderLevel: number;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  material: Material;
}

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
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  materialVariant: MaterialVariant;
}

export type MaterialVariantResponse = {
  statusCode: number;
  data: {
    data: MaterialVariant[];
    pageMeta: PageMeta;
  };
  message: string;
  errors: any | null;
};
