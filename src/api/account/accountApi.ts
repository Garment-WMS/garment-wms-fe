import privateCall from '../PrivateCaller';
import { get, post } from '../services/ApiCaller';


export const accountApi = {
  getByRole: (role: string) => get(`account/role/${role}`);
};



export const getAccountByRole = async ({
  role
}: any): Promise<any> => {
  
  // Make the API request
  const res = await privateCall(accountApi.getByRole(role));
  return res.data.data;
};

