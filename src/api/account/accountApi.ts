import privateCall from '../PrivateCaller';
import { get, post } from '../services/ApiCaller';

export const accountApi = {
  getByRole: (role: string) => get(`/${role}`),
  createNewAccount: (data: CreateAccountData) => post(`/auth/sign-up`, data),
  uploadAvatar: (file: File | Blob) => {
    const formData = new FormData();
    const config = {
      'Content-Type': 'multipart/form-data'
    };
    formData.append('file', file);
    console.log(formData);
    return post(`/account/avatar`, formData,undefined,config); // Using a multipart/form-data POST
  },
  uploadAvatarById: (id: string,file: File | Blob) => {
    const formData = new FormData();
    const config = {
      'Content-Type': 'multipart/form-data'
    };
    formData.append('file', file);
    console.log(formData);
    return post(`/account/avatar/${id}`, formData,undefined,config); // Using a multipart/form-data POST
  },
};

export const getAccountByRole = async ({ role }: any): Promise<any> => {
  const res = await privateCall(accountApi.getByRole(role));
  return res.data.data;
};

export const createNewAccount = async (accountData: CreateAccountData): Promise<any> => {
  const res = await privateCall(accountApi.createNewAccount(accountData));
  return res.data;
};

export const uploadAvatar = async (file: File | Blob): Promise<any> => {
  const res = await privateCall(accountApi.uploadAvatar(file));
  return res.data;
};
export const uploadAvatarById = async (id:string,file: File | Blob): Promise<any> => {
  const res = await privateCall(accountApi.uploadAvatarById(id,file));
  return res.data;
};
// Define a TypeScript interface for type safety
interface CreateAccountData {
  email: string;
  password: string;
  role: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string; // ISO 8601 date format (e.g., "1994-02-10")
  gender: 'MALE' | 'FEMALE' | 'OTHER'; // Enum for gender values
}
