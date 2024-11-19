import { PageMetaData } from './ImportRequestType';
import { ProductionPlan } from './ProductionPlan';

export interface ProductionPlanListResponse {
  pageMeta: PageMetaData;
  data: ProductionPlan[];
}
