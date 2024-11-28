import { get } from '../ApiCaller';
import privateCall from '../PrivateCaller';

let url = '/dashboard';

export const dashboardApi = {
  getDashboard: (startDate: string, endDate: string) =>
    get(`${url}?from=${startDate}&to=${endDate}`),
  getLatestImportReceipt: (startDate: string, endDate: string) =>
    get(`/import-receipt/latest?from=${startDate}&to=${endDate}`),
  getLatestExportReceipt: (startDate: string, endDate: string) =>
    get(`material-export-request/latest?from=${startDate}&to=${endDate}`)
};

export const getDashboardFn = async (startDate: string, endDate: string): Promise<any> => {
  // Make the API request
  const res = await privateCall(dashboardApi.getDashboard(startDate, endDate));
  return res.data.data;
};
export const getLatestImportReceiptFn = async (
  startDate: string,
  endDate: string
): Promise<any> => {
  // Make the API request
  const res = await privateCall(dashboardApi.getLatestImportReceipt(startDate, endDate));
  return res.data.data;
};
export const getLatestExportReceiptFn = async (
  startDate: string,
  endDate: string
): Promise<any> => {
  // Make the API request
  const res = await privateCall(dashboardApi.getLatestExportReceipt(startDate, endDate));
  return res.data.data;
};
