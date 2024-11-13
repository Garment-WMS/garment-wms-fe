
import { get, post } from "../ApiCaller";
let loginUrl = `/auth/sign-in`;
// let registerUrl = `/auth/register`;
let refreshTokenUrl = `/auth/refresh-token`;
// let GooogleAuth = `/auth/google-oauth`;
export const authApi = {
    login: (email: string, password: string, role: string) => {
        return post(loginUrl, { email, password, role });
    },
    // register: (email: string, password: string) => {
    //     return post(registerUrl, { email, password });
    // },
    refreshToken: (header: any) => {
        return get(refreshTokenUrl,{},header);
    },
    confirmOtp: (id: string, otp: string, token: string) => {
        return post(
            `/Auth/confirm-otp`,
            { id: id, otp: otp },
            {},
            { Authorization: token }
        );
    },
};