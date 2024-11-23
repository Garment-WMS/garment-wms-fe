export enum ProductionBatchStatus {
  EXECUTING = 'EXECUTING',
  IMPORTING = 'IMPORTING',
  IMPORTED = 'IMPORTED',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED'
}

export const ProductionBatchStatusLabels: Record<ProductionBatchStatus, string> = {
  [ProductionBatchStatus.EXECUTING]: 'Executing',
  [ProductionBatchStatus.IMPORTING]: 'Importing',
  [ProductionBatchStatus.IMPORTED]: 'Imported',
  [ProductionBatchStatus.FINISHED]: 'Finished',
  [ProductionBatchStatus.CANCELED]: 'Canceled'
};

export const ProductionBatchStatusColors: Record<ProductionBatchStatus, string> = {
  [ProductionBatchStatus.EXECUTING]: 'bg-yellow-500 text-white',
  [ProductionBatchStatus.IMPORTING]: 'bg-blue-500 text-white',
  [ProductionBatchStatus.IMPORTED]: 'bg-teal-500 text-white',
  [ProductionBatchStatus.FINISHED]: 'bg-green-500 text-white',
  [ProductionBatchStatus.CANCELED]: 'bg-red-500 text-white'
};
