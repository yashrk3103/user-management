import axiosInstance from '../config/axios';
import { LoginCredentials, SignupPayload, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      return {
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Invalid email or password');
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
      throw new Error(error.response?.data?.message || 'Failed to create account');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get('/users/profile');
    return response.data.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
