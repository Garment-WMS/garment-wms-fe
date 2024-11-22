export enum PurchaseOrderDeliveryStatus {
  PENDING = 'PENDING',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
  IMPORTING = 'IMPORTING'
}

export const PurchaseOrderDeliveryStatusLabels: Record<PurchaseOrderDeliveryStatus, string> = {
  [PurchaseOrderDeliveryStatus.PENDING]: 'Pending',
  [PurchaseOrderDeliveryStatus.CANCELLED]: 'Cancelled',
  [PurchaseOrderDeliveryStatus.FINISHED]: 'Finished',
  [PurchaseOrderDeliveryStatus.IMPORTING]: 'Importing'
};
