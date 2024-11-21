import { PageMetaData } from './ImportRequestType';
import { InspectionReport } from './InspectionReport';

export interface InspectionReportListResponse {
  pageMeta: PageMetaData;
  data: InspectionReport[];
}
