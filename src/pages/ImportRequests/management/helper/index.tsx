import { DeliveryType } from '@/types/ImportRequestType';

export const getLabelOfImportType = (type: string) => {
  const typeObj = DeliveryType.find((s) => s.value === type);
  return typeObj ? typeObj.label : 'N/A'; // Default variant if no match is found
};
