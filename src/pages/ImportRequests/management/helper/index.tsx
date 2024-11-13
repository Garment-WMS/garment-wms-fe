import { DeliveryType, Status } from '@/types/ImportRequestType';

export const getLabelOfImportType = (type: string) => {
  const typeObj = DeliveryType.find((s) => s.value === type);
  return typeObj ? typeObj.label : 'N/A'; // Default variant if no match is found
};
export const getStatusBadgeVariant = (status: string) => {
  const statusObj = Status.find((s: any) => s.value === status);
  return statusObj ? statusObj.variant : 'default'; // Default variant if no match is found
};

export const getSatusName = (status: string) => {
  const statusObj = Status.find((s: any) => s.value === status);
  return statusObj ? statusObj.label : 'default'; // Default variant if no match is found
};
