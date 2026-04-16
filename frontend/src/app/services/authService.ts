import axiosInstance from '../config/axios';
import { LoginCredentials, SignupPayload, User } from '../types';

const getApiErrorMessage = (error: any, fallback: string) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (typeof error?.response?.data === 'string' && error.response.data.trim()) return error.response.data;
  if (error?.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  if (error?.message === 'Network Error') return 'Unable to reach the server. Please try again.';
  return fallback;
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      return {
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error: any) {
      throw new Error(getApiErrorMessage(error, 'Invalid email or password'));
    }
  },

  async signup(payload: SignupPayload): Promise<{ token: string; user: User }> {
    try {
      const response = await axiosInstance.post('/auth/register', payload);
      return {
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error: any) {
      throw new Error(getApiErrorMessage(error, 'Failed to create account'));
    }
  },

  async loginWithGoogle(credential: string): Promise<{ token: string; user: User }> {
    try {
      const response = await axiosInstance.post('/auth/google', { credential });
      return {
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error: any) {
      throw new Error(getApiErrorMessage(error, 'Failed to sign in with Google'));
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get('/users/profile');
    return response.data.data;
  },

  async updatePresence(): Promise<void> {
    await axiosInstance.post('/auth/presence');
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // Ignore logout API failures and clear local state anyway.
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};
