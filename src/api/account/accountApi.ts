import privateCall from '../PrivateCaller';
import { get, post } from '../services/ApiCaller';

export const accountApi = {
  getByRole: (role: string) => get(`/${role}`)
};

export const getAccountByRole = async ({ role }: any): Promise<any> => {
  const res = await privateCall(accountApi.getByRole(role));
  return res.data.data;
};
