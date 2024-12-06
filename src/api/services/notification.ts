import { get } from "../ApiCaller";

const url = '/notification';
export const notificationApi = {
    getAll: ()=>{
        get(url);
    }
}