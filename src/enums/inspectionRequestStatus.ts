export enum InspectionRequestStatus {
  CANCELLED = 'CANCELLED',
  INSPECTING = 'INSPECTING',
  INSPECTED = 'INSPECTED'
}

export const InspectionRequestStatusLabels: Record<InspectionRequestStatus, string> = {
  [InspectionRequestStatus.CANCELLED]: 'Cancelled',
  [InspectionRequestStatus.INSPECTING]: 'Inspecting',
  [InspectionRequestStatus.INSPECTED]: 'Inspected'
};
