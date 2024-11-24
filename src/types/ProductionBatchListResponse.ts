import { PageMetaData } from './ImportRequestType';
import { ProductionBatch } from './ProductionBatch';


export interface ProductionBatchListResponse {
  pageMeta: PageMetaData;
  data: ProductionBatch[];
}
