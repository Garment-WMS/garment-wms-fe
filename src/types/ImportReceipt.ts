import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { PageMetaData } from './ImportRequestType';
import { MaterialPackage } from './MaterialTypes';

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
  status: 'IMPORTING' | 'IMPORTED' | 'CANCELED' | 'AVAILABLE' | 'USED';
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

export const ImportReceiptType: {
  label: string;
  value: 'MATERIAL' | 'PRODUCT';
}[] = [
  {
    label: 'Material',
    value: 'MATERIAL'
  },
  {
    label: 'Product',
    value: 'PRODUCT'
  }
];

export const ImportReceiptStatus: {
  label: string;
  value: string;
}[] = [
  {
    label: 'Await to import',
    value: 'AWAIT_TO_IMPORT'
  },
  {
    label: 'Rejected',
    value: 'REJECTED'
  },
  {
    label: 'Importing',
    value: 'IMPORTING'
  },
  {
    label: 'Imported',
    value: 'IMPORTED'
  }
];
export type ImportReceipt = {
  discussion: any;
  id: string;
  warehouseStaffId: string;
  warehouseManagerId: string;
  inspectionReportId: string | null;
  code: string;
  status: 'IMPORTING' | 'IMPORTED' | 'CANCELED' | 'AWAIT_TO_IMPORT';
  type: 'MATERIAL' | 'PRODUCT';
  note: string | null;
  startedAt: string;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  warehouseManager: WarehouseStaff;
  warehouseStaff: WarehouseStaff;
  materialReceipt: MaterialReceipt[];
  productReceipt: any[]; // Replace with appropriate type if productReceipt has a defined structure
  inspectionReport: InspectionReport | null;
};

export interface UseImportReceiptResponse {
  pageMeta: PageMetaData;
  data: ImportReceipt[];
}

export interface UseImportReceiptInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}
