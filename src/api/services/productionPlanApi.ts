import { UseImportRequestsInput, UseImportRequestsResponse } from '@/types/ImportRequestType';
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';
import { get, post } from '../ApiCaller';
import privateCall from '../PrivateCaller';
import { ProductionPlanData } from '@/types/ProductionPlan';

let importRequestUrl = '/production-plan';

export const productionPlanAPI = {
  getOne: (id: string) => get(`${importRequestUrl}/${id}`),
  getAll: () => get(`${importRequestUrl}`)
};

export const getAllProductionPlanFn = async (): Promise<any> => {
  // Make the API request
  const res = await privateCall(productionPlanAPI.getAll());
  return res.data.data.data;
};
