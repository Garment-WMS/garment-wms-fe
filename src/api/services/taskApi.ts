import { get } from '../ApiCaller';
import privateCall from '../PrivateCaller';

let importRequestUrl = '/task';

export const taskApi = {
  getMy: () => get(`${importRequestUrl}/my`),
  getDetail: (id: string) => get(`${importRequestUrl}/${id}`)
};

export const getMytaskFn = async (): Promise<any> => {
  // Make the API request
  const res = await privateCall(taskApi.getMy());
  return res.data.data;
};
export const getTaskDetailFn = async (id: string): Promise<any> => {
  // Make the API request
  const res = await privateCall(taskApi.getDetail(id));
  return res.data;
};
