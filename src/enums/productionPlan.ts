export enum ProductionPlanStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED'
}

export const ProductionPlanStatusLabels: Record<ProductionPlanStatus, string> = {
  [ProductionPlanStatus.PLANNING]: 'Planning',
  [ProductionPlanStatus.IN_PROGRESS]: 'In Progress',
  [ProductionPlanStatus.FINISHED]: 'Finished'
};
