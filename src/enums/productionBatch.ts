export enum ProductionBatchStatus {
  EXECUTING = 'EXECUTING',
  WAITING_FOR_EXPORTING_MATERIAL = 'WAITING_FOR_EXPORTING_MATERIAL',
  MANUFACTURING = 'MANUFACTURING',
  IMPORTING = 'IMPORTING',
  IMPORTED = 'IMPORTED',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED'
}

export const ProductionBatchStatusLabels: Record<ProductionBatchStatus, string> = {
  [ProductionBatchStatus.EXECUTING]: 'Executing',
  [ProductionBatchStatus.WAITING_FOR_EXPORTING_MATERIAL]: 'Waiting for exporting material',
  [ProductionBatchStatus.MANUFACTURING]: 'Manufacturing',
  [ProductionBatchStatus.IMPORTING]: 'Importing',
  [ProductionBatchStatus.IMPORTED]: 'Imported',
  [ProductionBatchStatus.FINISHED]: 'Finished',
  [ProductionBatchStatus.CANCELLED]: 'Cancelled'
};

export const ProductionBatchStatusColors: Record<ProductionBatchStatus, string> = {
  [ProductionBatchStatus.EXECUTING]: 'bg-yellow-500 text-white',
  [ProductionBatchStatus.WAITING_FOR_EXPORTING_MATERIAL]: 'bg-yellow-500 text-white',
  [ProductionBatchStatus.MANUFACTURING]: 'bg-yellow-500 text-white',
  [ProductionBatchStatus.IMPORTING]: 'bg-blue-500 text-white',
  [ProductionBatchStatus.IMPORTED]: 'bg-teal-500 text-white',
  [ProductionBatchStatus.FINISHED]: 'bg-green-500 text-white',
  [ProductionBatchStatus.CANCELLED]: 'bg-red-500 text-white'
};
