import { post } from './ApiCaller';
import privateCall from '../PrivateCaller';
const importRequestPath = '/import-request';
export const importRequestApi = {
  createImportProduct:(body:any) => post(`${importRequestPath}/product`,body),
  create: async (
    poDeliveryId: string,
    description: string,
    importRequestDetails: any[],
    type: string
  ): Promise<any> => {
    // Example API call
    return privateCall(
      post('/import-request', {
        poDeliveryId,
        description,
        importRequestDetails,
        type
      })
    );
  }
};
