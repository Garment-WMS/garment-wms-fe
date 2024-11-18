export interface ProductionPlan {
  statusCode: number;
  data: ProductionPlanData[];
  message: string;
  errors: null | any;
}

export interface ProductionPlanData {
  id: string;
  factoryDirectorId: string;
  name: string;
  code: string;
  note: string | null;
  status: string;
  expectedStartDate: string;
  expectedEndDate: string;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string | null;
  updatedAt: string;
  deletedAt: string | null;
  purchaseOrder: PurchaseOrder[];
  productionPlanDetail: ProductionPlanDetail[];
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  productionPlanId: string;
  purchasingStaffId: string;
  supplierId: string;
  status: string;
  currency: string;
  subTotalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  otherAmount: number;
  orderDate: string;
  note: string | null;
  expectedFinishDate: string;
  finishDate: string | null;
  cancelledAt: string | null;
  cancelledReason: string | null;
  cancelledBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  poDelivery: PODelivery[];
  supplier: any;
}

export interface PODelivery {
  id: string;
  purchaseOrderId: string;
  expectedDeliverDate: string;
  deliverDate: string | null;
  code: string;
  status: string;
  isExtra: boolean;
  cancelledAt: string | null;
  cancelledReason: string | null;
  cancelledBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  importRequest: ImportRequest[];
  poDeliveryDetail: PODeliveryDetail[];
}

interface ImportRequest {
  id: string;
  warehouseStaffId: string;
  poDeliveryId: string;
  purchasingStaffId: string;
  warehouseManagerId: string;
  productionDepartmentId: string | null;
  productionBatchId: string | null;
  status: string;
  code: string;
  type: string;
  startedAt: string | null;
  finishedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  description: string;
  managerNote: string | null;
  rejectAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface PODeliveryDetail {
  id: string;
  poDeliveryId: string;
  materialPackageId: string;
  quantityByPack: number;
  expiredDate: string | null;
  actualImportQuantity: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
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
  image: string | null;
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
