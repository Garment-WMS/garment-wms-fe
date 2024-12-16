import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { MaterialPackage } from './MaterialTypes';
import { User } from './User';
import { PageMetaData } from './Shared';
import { MaterialExportRequest } from './exportRequest';

export type MaterialExportReceipt = {
  id: string;
  code: string;
  materialExportRequestId: string;
  warehouseStaffId: string;
  type: string;
  status: string;
  note: string;
  startAt: string;
  finishedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  warehouseStaff: User;
  materialExportRequest: MaterialExportRequest;
  materialExportReceiptDetail: MaterialExportReceiptDetail[];
};
export interface MaterialExportReceiptDetail {
  id: string;
  materialExportReceiptId: string;
  materialReceiptId: string;
  quantityByPack: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  materialReceipt: MaterialReceipt;
}
export type MaterialReceipt = {
  id: string;
  materialPackageId: string;
  importReceiptId: string;
  code: string;
  expireDate: string | null;
  importDate: string | null;
  quantityByPack: number;
  materialPackage: MaterialPackage;
  remainQuantityByPack: number;
  status: 'IMPORTING' | 'IMPORTED' | 'CANCELLED' | 'AVAILABLE' | 'USED';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type Account = {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  cidId: string | null;
  dateOfBirth: string;
  firstName: string;
  gender: 'MALE' | 'FEMALE' | string;
  isDeleted: boolean;
  isVerified: boolean;
  lastName: string;
  phoneNumber: string;
  status: 'active' | string;
  createdAt: string;
  deletedAt: string | null;
  updatedAt: string;
};

type WarehouseStaff = {
  id: string;
  accountId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  account: Account;
};

type InspectionRequest = {
  id: string;
  code: string;
  purchasingStaffId: string | null;
  warehouseManagerId: string;
  productionDeparmentId: string | null;
  inspectionDepartmentId: string;
  status: 'INSPECTED' | 'PENDING' | 'REJECTED';
  type: 'MATERIAL' | 'PRODUCT';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  importRequestId: string;
  note: string | null;
  inspectionDepartment: any;
};

type InspectionReport = {
  id: string;
  inspectionRequestId: string;
  code: string;
  createdAt: string;
  updateAt: string;
  deletedAt: string | null;
  inspectionRequest: InspectionRequest;
};

export type ExportReceipt = {
  discussion: any;
  id: string;
  warehouseStaffId: string;
  warehouseManagerId: string;
  inspectionReportId: string | null;
  code: string;
  status: 'EXPORTING' | 'EXPORTED' | 'CANCELLED';
  type: 'PRODUCTION' | 'DISPOSED';
  note: string | null;
  startedAt: string;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  warehouseManager: WarehouseStaff;
  warehouseStaff: WarehouseStaff;
  productionDepartment: WarehouseStaff;
  materialReceipt: MaterialExportReceipt[];
  materialExportRequest: MaterialExportRequest;
  materialExportReceiptDetail: MaterialExportReceiptDetail[];
  productReceipt: any[]; // Replace with appropriate type if productReceipt has a defined structure
  inspectionReport: InspectionReport | null;
  expectedStartedAt: string;
  expectedFinishedAt: string;
};
export const ExportReceiptType = [
  { label: 'For Production', value: 'PRODUCTION', variant: 'default' },
  { label: 'Canceled', value: 'DISCHARGE', variant: 'destructive' }
];

export const ExportReceiptStatus = [
  { label: 'Exported', value: 'EXPORTED', variant: 'success' },
  { label: 'Exporting', value: 'EXPORTING', variant: 'warning' },
  { label: 'Canceled', value: 'CANCELLED', variant: 'destructive' }
];
export interface UseExportReceiptResponse {
  statusCode: number;
  data: {
    data: MaterialExportReceipt[];
    pageMeta: PageMetaData;
  };
  message: string;
  errors: any | null;
}

export interface UseExportReceiptInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}
