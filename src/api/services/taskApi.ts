import { get, post } from '../ApiCaller';
import privateCall from '../PrivateCaller';

let importRequestUrl = '/task';

export const taskApi = {
  getMy: () => get(`${importRequestUrl}/my`),
  getDetail: (id: string) => get(`${importRequestUrl}/${id}`),
  getAllTask: (type: string, id: string) =>
    get(`/task?filter[0][field]=${type}&filter[0][value]=${id}&filter[0][type]==`),
  getTaskByTimeZoneAndRole: (type: string, start: string, ended: string) =>
    post(`/task/${type}`, { expectedStartAt: start, expectedEndAt: ended })
};

export const getTaskByTimeZoneAndRole = async (type: string, start: string, ended: string) => {
  const res = await privateCall(taskApi.getTaskByTimeZoneAndRole(type, start, ended));
  return res.data;
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
