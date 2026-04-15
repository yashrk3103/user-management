import { User, CreateUserDto, UpdateUserDto, ChangePasswordDto } from '../types';
import axiosInstance from '../config/axios';

const mapApiUser = (user: any): User => ({
  ...user,
  createdBy: typeof user.createdBy === 'object' ? user.createdBy?.name : user.createdBy,
  updatedBy: typeof user.updatedBy === 'object' ? user.updatedBy?.name : user.updatedBy,
  lastActive: user.updatedAt,
});

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await axiosInstance.get('/users', {
      params: { page: 1, limit: 100 },
    });
    return response.data.data.map(mapApiUser);
  },

  async getUserById(id: string): Promise<User> {
    const response = await axiosInstance.get(`/users/${id}`);
    return mapApiUser(response.data.data);
  },

  async createUser(data: CreateUserDto): Promise<User> {
    const response = await axiosInstance.post('/users', data);
    return mapApiUser(response.data.user);
  },

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return mapApiUser(response.data.user);
  },

  async deleteUser(id: string): Promise<void> {
    await userService.deactivateUser(id);
  },

  async deactivateUser(id: string): Promise<void> {
    await axiosInstance.put(`/users/${id}/deactivate`);
  },

  async activateUser(id: string): Promise<void> {
    await axiosInstance.put(`/users/${id}/activate`);
  },

  async updateProfile(id: string, data: Partial<User>): Promise<User> {
    const payload: Record<string, any> = {};
    if (data.name !== undefined) payload.name = data.name;
    const response = await axiosInstance.put('/users/profile', payload);
    return mapApiUser(response.data.user);
  },

  async changePassword(id: string, data: ChangePasswordDto): Promise<void> {
    await axiosInstance.put('/users/profile', {
      password: data.newPassword,
    });
  },
};
