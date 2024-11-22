export interface MaterialExportRequest {
  id: string;
  code: string;
  productionBatchId: string;
  productFormulaId: string;
  warehouseManagerId: string | null;
  warehouseStaffId: string | null;
  productionDepartmentId: string;
  status: string;
  description: string;
  managerNote: string | null;
  rejectAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  materialExportRequestDetail: MaterialExportRequestDetail[];
  productFormula: ProductFormula;
  productionBatch: ProductionBatch;
  productionDepartment: ProductionDepartment;
  warehouseManager: any;
  warehouseStaff: any;
  finishAt: string;
}

export interface MaterialExportRequestDetail {
  id: string;
  materialExportRequestId: string;
  materialVariantId: string;
  quantityByUom: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  materialVariant: MaterialVariant;
}

interface MaterialVariant {
  id: string;
  materialId: string;
  image: string;
  name: string;
  code: string;
  reorderLevel: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  material: Material;
  materialAttribute: MaterialAttribute[];
  materialInspectionCriteria: any[]; // Assuming this is an empty array based on the provided data
}

interface Material {
  id: string;
  materialUomId: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  materialUom: MaterialUom;
}

interface MaterialUom {
  id: string;
  name: string;
  uomCharacter: string;
  uomDataType: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface MaterialAttribute {
  id: string;
  materialVariantId: string;
  name: string;
  value: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface ProductFormula {
  id: string;
  productSizeId: string;
  name: string;
  code: string;
  isBaseFormula: boolean;
  quantityRangeStart: number;
  quantityRangeEnd: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  productSize: ProductSize;
  productFormulaMaterial: ProductFormulaMaterial[];
}

interface ProductSize {
  id: string;
  productVariantId: string;
  name: string;
  code: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  size: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  productVariant: ProductVariant;
}

interface ProductVariant {
  id: string;
  productId: string;
  image: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product: Product;
}

interface Product {
  id: string;
  productUomId: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  productUom: ProductUom;
}

interface ProductUom {
  id: string;
  name: string;
  uomCharacter: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface ProductFormulaMaterial {
  id: string;
  productFormulaId: string;
  materialVariantId: string;
  quantityByUom: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  materialId: string | null;
  materialVariant: MaterialVariant;
}

interface ProductionBatch {
  id: string;
  productionPlanDetailId: string;
  code: string;
  name: string;
  description: string | null;
  quantityToProduce: number;
  canceledAt: string | null;
  canceledBy: string | null;
  canceledReason: string | null;
  status: string;
  startDate: string | null;
  finishedDate: string | null;
  expectedFinishDate: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  importRequest: any[]; // Assuming this is an empty array based on the provided data
  materialExportRequest: MaterialExportRequest[];
  productionPlanDetail: ProductionPlanDetail;
}

interface ProductionPlanDetail {
  id: string;
  productionPlanId: string;
  productSizeId: string;
  quantityToProduce: number;
  code: string;
  note: string | null;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  productSize: ProductSize;
}

interface ProductionDepartment {
  id: string;
  accountId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  account: Account;
}

interface Account {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  cidId: string | null;
  dateOfBirth: string;
  firstName: string;
  gender: string;
  isDeleted: boolean;
  isVerified: boolean;
  lastName: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  deletedAt: string | null;
  updatedAt: string;
}
export const Status: { label: string; value: string; variant: any }[] = [
  { label: 'Wait approval', value: 'ARRIVED', variant: 'info' },
  { label: 'Rejected', value: 'REJECTED', variant: 'danger' },
  { label: 'Approved', value: 'APPROVED', variant: 'success' },
  { label: 'Inspecting', value: 'INSPECTING', variant: 'warning' },
  { label: 'Inspected', value: 'INSPECTED', variant: 'success' },
  { label: 'Importing', value: 'IMPORTING', variant: 'warning' },
  { label: 'Imported', value: 'IMPORTED', variant: 'success' },
  { label: 'Canceled', value: 'CANCELED', variant: 'danger' }
];
