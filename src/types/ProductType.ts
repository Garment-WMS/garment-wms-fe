import { InspectionReport } from "./InspectionReport";
import { InventoryStock, MaterialVariant, ReceiptAdjustment } from "./MaterialTypes";
import { PageMetaData } from "./Shared";
import { User } from "./User";

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
    onHandQualified: number;
    onHandDisqualified: number;
    numberOfMaterialPackage: number;
    product:Product;
    productAttribute: ProductAttribute
    productSize: ProductSize[];
  }
  export type ProductAttribute = {
    id: string
    name: string
    value: string
    type: string
    productSize: ProductSize
  }
  export interface ProductReceipt {
    id: string;
    productSizeId: string;
    code: string;
    isDefect: boolean
    importReceiptId: string;
    expireDate: string;
    importDate: string;
    quantityByUom: number;
    remainQuantityByUom: number;
    productSize: ProductSize;
    importReceipt: ProductImportReceipt;
    receiptAdjustment: ReceiptAdjustment[];
    inspectionReport: InspectionReport;
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
    uom:UOM;
    size: string;
    productFormula: productFormula[];
    productReceipt: ProductReceipt[];
    productVariant: ProductVariant;
    inventoryStock: InventoryStock;
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
    numberOfProductVariants: number;
    productUom: UOM;
  }
  export interface UOM {
    id: string;
    name: string;
    uomCharacter: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }
  export interface ProductResponse {
    id: string;
  }

  export type OneMonthDataForProduct = {
    productVariant: ProductVariant;
    totalImportQuantityByUom: number;
    totalImportQuantityBySize: number;
    totalExportQuantityBySize: number;
    totalExportQuantityByUom: number;
  };
export interface ProductVariantResponse {
  statusCode: number;
  data: {
    data: ProductVariant[];
    pageMeta: PageMetaData;
  };
  message: string;
  errors: any | null;
}
export interface ProductHistoryResponse {
  statusCode: number;
  data: {
    data: ProductReceiptBase[];
    pageMeta: PageMetaData;
  };
  message: string;
  errors: any | null;
}
export interface ProductReceiptBase {
  code: string;
  type: string;
  quantityByPack: number;
  createdAt: string;
  isDefect: boolean;
  updatedAt: string;
}

export interface ImportReceiptForHistory extends ProductReceiptBase {
  productReceiptId: string;
  importReceiptId: string;
}

// export interface ExportReceiptForHistory extends ReceiptBase {
//   materialExportReceiptDetailId: string;
//   materialExportReceiptId: string;
// }

export interface AdjustmentReceiptForHistory extends ProductReceiptBase {
  receiptAdjustmentId: string;
  inventoryReportId: string;
}
export interface ProductReceiptResponse{
  statusCode: number;
  data: {
    data: ProductReceipt[];
    pageMeta: PageMetaData;
  };
  message: string;
  errors: any | null;
}
export interface ProductImportReceiptResponse{
  statusCode: number;
  data: {
    data: ProductImportReceipt[];
    pageMeta: PageMetaData;
  };
  message: string;
  errors: any | null;
}
export interface ProductExportReceiptResponse{
  statusCode: number;
  data: {
    data: ProductExportReceipt[];
    pageMeta: PageMetaData;
  };
  message: string;
  errors: any | null;
}
export interface ProductImportReceipt {
  id: string;
  productId: string;
  code: string;
  importReceiptId: string;
  expireDate: string;
  type: string;
  startedAt: string;
  quantityByUom: number;
  warehouseManager: User;
  warehouseStaff: User;
  importDate: string;
  productSize: ProductSize;
  remainQuantityByUom: number;
  inspectionReport: InspectionReport;
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
  { label: 'Disposed', value: 'DISPOSED', variant: 'destructive' },
  { label: 'Used', value: 'USED', variant: 'destructive' }
];
export interface ProductExportReceipt {
  id: string;
  productId: string;
  code: string;
  importDate: string;
  exportReceiptId: string;
  expireDate: string;
  quantityByUom: number;
  remainQuantityByUom: number;
  productSize: ProductSize;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  status: string;

}

export type ProductReceiptStatisticsResponse = {
  monthlyData: MonthlyData[];
};

export type MonthlyData = {
  month: number;
  data: OneMonthData[];
};

export type OneMonthData = {
  productVariant: ProductVariant;
  totalImportQuantityByUom: number;
  totalImportQuantityByPack: number;
  totalExportQuantityByPack: number;
  totalExportQuantityByUom: number;
};

export interface productFormula  {
  id: string,
  productSizeId: string,
  name: string,
  code: string,
  isBaseFormula: boolean,
  quantityRangeStart: number,
  quantityRangeEnd: number,
  productFormulaMaterial: productFormulaMaterial[],
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface productFormulaMaterial {
  id:string,
  productFormulaId:string,
  materialId:string,
  materialVariant:MaterialVariant,
  quantityByUom: number,
}
