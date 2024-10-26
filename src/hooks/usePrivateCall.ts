import { useEffect } from 'react';
import Cookies from 'js-cookie';
import useRefreshToken from './useRefreshToken';
import axios from 'axios';
import { useSelector } from 'react-redux';
import loginSelector from '@/pages/login/slice/selector';
import { user } from '@/pages/login/types';
// import { useNavigate } from 'react-router-dom';
import useLogout from './useLogout';
import { useToast } from './use-toast';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '@/enums/httpStatus';
// import { refreshApi } from '@/utils/api/shared/refreshApi';
// import { actions } from '@/pages/login/slice';


const usePrivateCall = () => {
  const user: user = useSelector(loginSelector.user);
  const logout = useLogout();
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  const accessToken = Cookies.get('accessToken');
  // const refreshToken = Cookies.get('refreshToken');
  const { toast } = useToast();
  const refresh = useRefreshToken();


  

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        // case need to refresh 
        if (error?.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED && error?.response?.data?.message === HTTP_MESSAGE.EXPIRED  && !prevRequest?.sent) {
            prevRequest.sent = true; 
            const response = await refresh();
            const newAccessToken = response.accessToken;
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(prevRequest);
        }
        // case need to log in again
        if (error?.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED && (error?.response?.data?.message === HTTP_MESSAGE.UNAUTHORIZED
          ||error?.response?.data?.message === HTTP_MESSAGE.INVALID_TOKEN)   && !prevRequest?.sent) {
          prevRequest.sent = true; 
          logout();
          toast({
            title: "Lỗi đăng nhập",
            variant: 'destructive',
            description: "Hãy đăng nhập lại",
          })
          return axios(prevRequest);
      }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [user, refresh]);

  return axios;
};

export default usePrivateCall;

