import { PageMetaData } from './ImportRequestType';
import { InspectionRequest } from './InspectionRequest';

export interface InspectionRequestListResponse {
  pageMeta: PageMetaData;
  data: InspectionRequest[];
}
