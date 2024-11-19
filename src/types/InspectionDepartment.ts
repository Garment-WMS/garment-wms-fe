import { Account } from './Account';
import { InspectionRequest } from './InspectionReport';

export interface InspectionDepartment {
  id: string;
  accountId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  account?: Account | null;
  inspectionRequest: InspectionRequest[];
}
