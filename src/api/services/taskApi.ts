import { get } from '../ApiCaller';
import privateCall from '../PrivateCaller';

let importRequestUrl = '/task';

export const taskApi = {
  getMy: () => get(`${importRequestUrl}/my`)
};

export const getMytaskFn = async (): Promise<any> => {
  // Make the API request
  const res = await privateCall(taskApi.getMy());
  return res.data.data;
};
