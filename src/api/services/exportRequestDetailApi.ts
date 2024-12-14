import { get } from '../ApiCaller';
import privateCall from '../PrivateCaller';

let url = '/material-export-request-detail';

export const exportRequestDetailApi = {
  checkQuantity: (id: string) => get(`${url}/check-quantity/${id}`)
};

export const checkExportRequestDetailQuantityFn = async (id: string) => {
  try {
    const res = await privateCall(exportRequestDetailApi.checkQuantity(id));
    return res.data;
  } catch (error) {
    console.error('Error fetching export request detail quantity:', error);
    throw error;
  }
};
