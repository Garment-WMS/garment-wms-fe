import { useDispatch } from 'react-redux';
import { actions } from '@/pages/login/slice';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = async () => {
    dispatch(actions.setUser(null));
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    localStorage.removeItem('userData');
    navigate('/login')
  };

  return logout;
};

export default useLogout;
