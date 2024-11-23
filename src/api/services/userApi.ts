import { get } from "../ApiCaller";

let userPath = '/user';
let accountPath = '/account';
export const userApi = {
    getAllByRole: (role: string) => get(`${accountPath}/role/${role}`),
}

export const getWarehouseStaff = () => {
    return userApi.getAllByRole('WAREHOUSE_STAFF');
}