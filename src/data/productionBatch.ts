import { ProductionBatchStatus } from '@/enums/productionBatch';
import { ProductionBatch } from '@/types/ProductionBatch';

export const getMockProductionBatch = (): ProductionBatch => ({
  id: 'mock-id-12345',
  productionPlanDetailId: 'mock-plan-id-67890',
  code: 'MOCK-CODE-001',
  name: 'Mock Production Batch',
  description: 'This is a mocked production batch for testing.',
  quantityToProduce: 1000,
  canceledAt: null,
  canceledBy: null,
  canceledReason: null,
  status: ProductionBatchStatus.EXECUTING,
  startDate: new Date().toISOString(),
  finishedDate: null,
  expectedFinishDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Mock one week later
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  materialExportRequest: [],
  importRequest: [],
  productionPlanDetail: {
    id: 'mock-plan-detail-id',
    productionPlanId: 'mock-production-plan-id',
    productSizeId: 'mock-product-size-id',
    quantityToProduce: 1000,
    code: 'MOCK-PLAN-CODE-002',
    note: 'Mock note for production plan.',
    startDate: new Date().toISOString(),
    finishDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    productSize: {
      id: 'mock-product-size-id',
      productVariantId: 'mock-product-variant-id',
      name: 'Mock Product Size - M',
      code: 'MOCK-SIZE-CODE-003',
      width: 0.3,
      height: 0.02,
      length: 0.4,
      weight: 0.3,
      size: 'M',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      productVariant: {
        id: 'mock-variant-id',
        productId: 'mock-product-id',
        image: null,
        name: 'Mock Product Variant',
        code: 'MOCK-VARIANT-CODE-004',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        product: {
          id: 'mock-product-id',
          productUomId: 'mock-product-uom-id',
          name: 'Mock Product',
          code: 'MOCK-PRODUCT-CODE-005',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          productUom: {
            id: 'mock-product-uom-id',
            name: 'pcs',
            uomCharacter: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null
          }
        }
      }
    }
  }
});
