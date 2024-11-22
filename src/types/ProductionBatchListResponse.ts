import { PageMetaData } from './ImportRequestType';
import { ProductionBatch } from './ProductionPlan';

export interface ProductionBatchListResponse {
  pageMeta: PageMetaData;
  data: ProductionBatch[];
}
