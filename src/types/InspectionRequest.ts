import { InspectionRequestStatus } from '@/enums/inspectionRequestStatus';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import { ImportRequest } from './ImportRequestType';
import { InspectionDepartment } from './InspectionDepartment';
import { InspectionReport } from './InspectionReport';

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
