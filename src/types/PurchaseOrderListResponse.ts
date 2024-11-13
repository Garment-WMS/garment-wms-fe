import { PageMetaData } from './ImportRequestType';
import { PurchaseOrder } from './purchaseOrder';

export interface PurchaseOrderListResponse {
  pageMeta: PageMetaData;
  data: PurchaseOrder[];
}
