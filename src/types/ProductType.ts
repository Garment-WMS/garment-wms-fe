import { PageMetaData } from "./Shared";

export interface ProductVariantResponse {
    statusCode: number;
    data: {
      data: ProductVariant[];
      pageMeta: PageMetaData;
    };
    message: string;
    errors: any | null;
  }

  export interface ProductVariant{
    id: string;
    productId: string;
    name: string;
    code: string;
    reorderLevel: number;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;

    image: string | null;
    onHand: number;
    numberOfMaterialPackage: number;
    product:Product;
    productSize: ProductSize[];
  }
  export interface ProductReceipt {
    id: string;
    productSizeId: string;
    importReceiptId: string;
    expireDate: string;
    importDate: string;
    quantityByPack: number;
    remainQuantityByPack: number;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
  }
  export interface ProductSize{
    id: string;
    productVariantId: string;
    code: string;
    name: string;
    width: number;
    length: number;
    height: number;
    weight: number;
    size: string;
    productReceipt: ProductReceipt[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }
  export interface Product{
    id: string;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    productUom: UOM;
  }
  export interface UOM {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }
  export interface ProductResponse {
    id: string;
  }