import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

export const authService = {
  login: async (userId, password) => {
    const response = await apiClient.post(`${API_ENDPOINTS.CORE.AUTH}/login`, {
      userId,
      password,
    });
    return response.data;
  },

  logout: async (refreshToken) => {
    const response = await apiClient.put(`${API_ENDPOINTS.CORE.AUTH}/logout`, {
      refreshToken,
    });
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post(`${API_ENDPOINTS.CORE.AUTH}/refreshToken`, {
      refreshToken,
    });
    return response.data;
  },

  forgotPasswordAndSendOtp: async (userId) => {
    const response = await apiClient.post(`${API_ENDPOINTS.CORE.AUTH}/forgotPasswordAndSendOtp`, {
      userId,
    });
    return response.data;
  },

  verifyOtp: async (userId, otp) => {
    const response = await apiClient.post(`${API_ENDPOINTS.CORE.AUTH}/verifyOtp`, {
      userId,
      otp,
    });
    return response.data;
  },

  resetPassword: async (userId, newPassword) => {
    const response = await apiClient.post(`${API_ENDPOINTS.CORE.AUTH}/resetPassword`, {
      userId,
      newPassword,
    });
    return response.data;
  },
};
