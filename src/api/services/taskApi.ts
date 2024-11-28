import { get } from '../ApiCaller';
import privateCall from '../PrivateCaller';

let importRequestUrl = '/task';

export const taskApi = {
  getMy: () => get(`${importRequestUrl}/my`),
  getDetail: (id: string) => get(`${importRequestUrl}/${id}`),
  getAllTask: (type: string, id: string) =>
    get(`/task?filter[0][field]=${type}&filter[0][value]=${id}&filter[0][type]==`)
};

export const getAllTasks = async (type: string, id: string) => {
  const res = await privateCall(taskApi.getAllTask(type, id));
  return res.data.data;
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
