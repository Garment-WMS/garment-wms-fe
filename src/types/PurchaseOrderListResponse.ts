import { PageMetaData } from './ImportRequestType';
import { PurchaseOrder } from './PurchaseOrder';

export interface PurchaseOrderListResponse {
  pageMeta: PageMetaData;
  data: PurchaseOrder[];
}
