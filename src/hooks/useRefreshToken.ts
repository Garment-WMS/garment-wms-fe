import { authApi } from '@/api/auth/auth';
import privateCall from '@/api/PrivateCaller';
import Cookies from 'js-cookie';


export const useRefreshToken = async (): Promise<string | null> => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) {
    console.error('Refresh token is missing');
    return null;
  }

  try {
    let header = {
        'Refresh-Token': refreshToken
      };
    const response = await privateCall(authApi.refreshToken(header) );
    const newAccessToken = response.data.data.accessToken;
    Cookies.set('accessToken', newAccessToken);
    Cookies.set('refreshToken', response.data.data.refreshToken);
    return newAccessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    window.location.href = '/login'; // Redirect to login
    return null;
  }
};
