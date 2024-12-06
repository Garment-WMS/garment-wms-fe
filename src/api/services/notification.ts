import { get } from "../ApiCaller";

const url = '/notification';
export const notificationApi = {
    getAll: ()=>{
        return get(`${url}/my`);
    },
    getOneAndMarkSeen: (id:string)=>{
        return get(`${url}/${id}`);
    }
}