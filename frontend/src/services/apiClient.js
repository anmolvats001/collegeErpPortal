import axios from 'axios';
import { STORAGE_KEYS, API_ENDPOINTS } from '../utils/constants';

const apiClient = axios.create({
  baseURL: '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const collegeId = localStorage.getItem(STORAGE_KEYS.COLLEGE_ID);
    if (collegeId) {
      config.headers['CollegeId'] = collegeId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_ENDPOINTS.CORE.AUTH}/refreshToken`,
            { refreshToken }
          );

          if (response.data?.jwtToken) {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.jwtToken);
            if (response.data.refreshToken) {
              localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
            }

            originalRequest.headers['Authorization'] = `Bearer ${response.data.jwtToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
