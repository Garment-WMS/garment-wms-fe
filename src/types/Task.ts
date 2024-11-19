// Main Task type
export interface Task {
  id: string;
  code: string;
  importReceiptId: string | null;
  exportReceiptId: string | null;
  materialExportReceiptId: string | null;
  inspectionRequestId: string;
  inventoryReportId: string | null;
  warehouseStaffId: string | null;
  inspectionDepartmentId: string;
  taskType: string;
  staffNote: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  warehouseStaff: any | null; // Using 'any' as the structure is not provided
  inspectionRequest: any;
  importReceipt: any | null; // Using 'any' as the structure is not provided
  materialExportReceipt: any | null; // Using 'any' as the structure is not provided
  inspectionDepartment: any;
  inventoryReport: any | null; // Using 'any' as the structure is not provided
  todo: Todo[];
}
interface Todo {
  id: string;
  taskId: string;
  code: string;
  title: string;
  seqNumber: number;
  isChecked: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
