import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

export const userService = {
  createUser: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.CORE.USERS, userData);
    return response.data;
  },

  getMyProfile: async () => {
    const response = await apiClient.get(`${API_ENDPOINTS.CORE.USERS}/me`);
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await apiClient.get(`${API_ENDPOINTS.CORE.USERS}/${userId}`);
    return response.data;
  },

  updateMyProfile: async (profileData) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CORE.USERS}/byUser`,
      profileData
    );
    return response.data;
  },

  updateUserByAdmin: async (adminUserData) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CORE.USERS}/byAdmin`,
      adminUserData
    );
    return response.data;
  },

  getAllUsers: async () => {
    const response = await apiClient.get(`${API_ENDPOINTS.CORE.USERS}/all`);
    return response.data;
  },

  getCollegeUsers: async () => {
    const response = await apiClient.get(`${API_ENDPOINTS.CORE.USERS}/college`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.CORE.USERS}/${userId}`);
    return response.data;
  },

  activateUser: async (userId) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CORE.USERS}/${userId}/activate`
    );
    return response.data;
  },

  deactivateUser: async (userId) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CORE.USERS}/${userId}/deactivate`
    );
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CORE.USERS}/changePassword`,
      { oldPassword, newPassword }
    );
    return response.data;
  },

  searchUsers: async (keyword) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CORE.USERS}/search?keyword=${encodeURIComponent(keyword)}`
    );
    return response.data;
  },

  checkUser: async (userId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CORE.USERS}/checkUser?userId=${encodeURIComponent(userId)}`
    );
    return response.data;
  },
};
