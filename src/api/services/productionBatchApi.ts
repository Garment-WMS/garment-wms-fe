import { get } from '../ApiCaller';
import privateCall from '../PrivateCaller';

let url = '/production-batch';

export const productionBatchApi = {
  getAll: () => get(`${url}`),
  getProdutFormula: (id: string) => get(`/product-formula/by-product-batch/${id}`)
};

export const getProductionBatchFn = async (): Promise<any> => {
  // Make the API request
  const res = await privateCall(productionBatchApi.getAll());
  return res.data.data;
};

export const getProductFormulaByProductionBatchFn = async (id: string): Promise<any> => {
  // Make the API request
  const res = await privateCall(productionBatchApi.getProdutFormula(id));
  return res.data.data;
};
