export enum ImportRequestStatus {
  ARRIVED = 'ARRIVED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  INSPECTING = 'INSPECTING',
  INSPECTED = 'INSPECTED',
  IMPORTING = 'IMPORTING',
  IMPORTED = 'IMPORTED'
}

export const ImportRequestStatusLabels: Record<ImportRequestStatus, string> = {
  [ImportRequestStatus.ARRIVED]: 'Arrived',
  [ImportRequestStatus.PENDING]: 'Pending',
  [ImportRequestStatus.CANCELLED]: 'Cancelled',
  [ImportRequestStatus.REJECTED]: 'Rejected',
  [ImportRequestStatus.APPROVED]: 'Approved',
  [ImportRequestStatus.INSPECTING]: 'Inspecting',
  [ImportRequestStatus.INSPECTED]: 'Inspected',
  [ImportRequestStatus.IMPORTING]: 'Importing',
  [ImportRequestStatus.IMPORTED]: 'Imported'
};

export enum ImportRequestStatusStyles {
  ARRIVED = 'bg-green-500 text-white',
  PENDING = 'bg-yellow-500 text-white',
  CANCELLED = 'bg-red-500 text-white',
  REJECTED = 'bg-gray-500 text-white',
  APPROVED = 'bg-blue-500 text-white',
  INSPECTING = 'bg-orange-500 text-white',
  INSPECTED = 'bg-teal-500 text-white',
  IMPORTING = 'bg-purple-500 text-white',
  IMPORTED = 'bg-primaryLight text-white',
  DEFAULT = 'bg-gray-200 text-black'
}
