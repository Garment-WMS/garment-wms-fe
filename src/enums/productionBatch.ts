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
