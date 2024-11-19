export enum InspectionRequestType {
  MATERIAL = 'MATERIAL',
  PRODUCT = 'PRODUCT'
}

export const InspectionRequestTypeLabels: Record<InspectionRequestType, string> = {
  [InspectionRequestType.MATERIAL]: 'Material',
  [InspectionRequestType.PRODUCT]: 'Product'
};
