import { ProductionBatchStatus } from '@/enums/productionBatch';
import { ProductionPlanDetail } from './ProductionPlan';
import { ImportRequest } from './ImportRequestType';

export interface ProductionBatch {
  id: string;
  productionPlanDetailId?: string | null;
  code?: string | null;
  name: string;
  description?: string | null;
  quantityToProduce: number;
  canceledAt?: string | null;
  canceledBy?: string | null;
  canceledReason?: string | null;
  status: ProductionBatchStatus;
  startDate?: string | null;
  finishedDate?: string | null;
  expectedFinishDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  materialExportRequest?: any[];
  productionPlanDetail?: ProductionPlanDetail;
  importRequest?: ImportRequest[];
}