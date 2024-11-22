import { get } from '../ApiCaller';
import privateCall from '../PrivateCaller';

let url = '/search';

export const scannerApi = {
  search: (type: string, code: string) => get(`${url}/${type}?code=${code}`)
};

export const scannerSearchFn = async (type: string, code: string): Promise<any> => {
  // Make the API request
  const res = await privateCall(scannerApi.search(type, code));
  return res.data.data;
};
