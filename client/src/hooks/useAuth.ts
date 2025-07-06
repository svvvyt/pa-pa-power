import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCredentials, logout, setLoading, updateUser } from '../store/slices/authSlice';
import { useLoginMutation, useRegisterMutation } from '../store/api/authApi';
import type { LoginCredentials, RegisterCredentials } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading } = useAppSelector(state => state.auth);
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch(setLoading(true));
      const result = await loginMutation(credentials).unwrap();
      dispatch(setCredentials({ user: result.user, token: result.token }));
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.data?.error || 'Login failed' 
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch(setLoading(true));
      const result = await registerMutation(credentials).unwrap();
      dispatch(setCredentials({ user: result.user, token: result.token }));
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.data?.error || 'Registration failed' 
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const updateUserProfile = (updates: Partial<typeof user>) => {
    if (user) {
      dispatch(updateUser(updates));
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || isLoginLoading || isRegisterLoading,
    login,
    register,
    logout: logoutUser,
    updateUser: updateUserProfile,
  };
}; 