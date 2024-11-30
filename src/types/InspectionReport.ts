import { InspectionRequestStatus } from '@/enums/inspectionRequestStatus';
import { ImportReceipt } from './ImportReceipt';
import { ImportRequest } from './ImportRequestType';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import { InspectionDepartment } from './InspectionDepartment';
import { InspectionReportDetail } from './InspectionReportDetail';

export interface InspectionRequest {
  id: string;
  code: string;
  purchasingStaffId?: string | null;
  warehouseManagerId?: string | null;
  productionDeparmentId?: string | null;
  inspectionDepartmentId: string;
  status: InspectionRequestStatus;
  type: InspectionRequestType;
  createdAt?: string | null;
  updatedAt?: string | null; // Matches DateTime? with @updatedAt
  deletedAt?: string | null; // Matches DateTime?
  importRequestId?: string | null;
  note?: string | null;
  inspectionReport?: InspectionReport | null;
  importRequest?: ImportRequest | null;
  inspectionDepartment: InspectionDepartment;
  purchasingStaff?: any;
  productionDeparment?: any;
  warehouseManager?: any;
}

export interface InspectionReport {
  id: string;
  inspectionRequestId: string;
  code: string;
  type: string;
  createdAt?: string | null;
  updateAt?: string | null;
  deletedAt?: string | null;
  importReceipt?: ImportReceipt | null;
  inspectionRequest: InspectionRequest;
  inspectionReportDetail: InspectionReportDetail[];
}
