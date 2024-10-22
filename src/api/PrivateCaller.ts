import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '@/enums/httpStatus';
import Cookies from 'js-cookie';
import { authApi } from './auth/auth';
import axios from 'axios';


const privateCall = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});
const handleRequestSuccess = async (config:any ) => {
    const token = Cookies.get('accessToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
};

const handleRequestErr = (err: any) => {
    return Promise.reject(err);
};

const handleResponseSuccess = (res:any) => {
    return res;
};

const handleResponseErr = async (error :any) => {
    const originalRequest = error.config;
    const refreshToken = Cookies.get('refreshToken');
    console.log('error',error);
    if (error?.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED && error?.response?.data?.message === HTTP_MESSAGE.EXPIRED && !originalRequest._retry ) {
        originalRequest._retry = true;
        try{
            let header = {
                'Refresh-Token': refreshToken,
              };
              const response = await privateCall(authApi.refreshToken(header));
              Cookies.set('accessToken', response?.data?.data.accessToken);
    Cookies.set('refreshToken', response?.data?.data.refreshToken);
        console.log(response);
        const newAccessToken = response.data.accessToken;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return privateCall(originalRequest);
        }
        
        // const refreshToken = Cookies.get('refreshToken');

        // if (!refreshToken) return Promise.reject(err);

        // try {
        //     const res = await axiosClient.post('/refresh-token', {
        //         token: refreshToken
        //     });

        //     const newAccessToken = res.data.accessToken;
        //     Cookies.set('token', newAccessToken);
        //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        //     return axiosClient(originalRequest);
         catch (error) {
            Cookies.remove('token');
            Cookies.remove('refreshToken');

            return Promise.reject(error);
        }
    }
};

privateCall.interceptors.request.use(
    (config: any) => handleRequestSuccess(config),
    (err: any) => handleRequestErr(err)
);

privateCall.interceptors.response.use(
    (config: any) => handleResponseSuccess(config),
    (err: any) => handleResponseErr(err)
);

export default privateCall;