import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

export const collegeService = {
  // Fetch paginated colleges (Super Admin)
  getAllColleges: async (page = 0, size = 10) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CORE.COLLEGES}/allCollege?page=${page}&size=${size}`
    );
    return response.data;
  },

  // Get current tenant college
  getMyCollege: async () => {
    const response = await apiClient.get(`${API_ENDPOINTS.CORE.COLLEGES}/myCollege`);
    return response.data;
  },

  // Get college by ID (Super Admin)
  getCollegeById: async (collegeId) => {
    const response = await apiClient.get(`${API_ENDPOINTS.CORE.COLLEGES}/${collegeId}`);
    return response.data;
  },

  // Public college lookup by college code
  getPublicCollegeByCode: async (collegeCode) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CORE.COLLEGES}/public/code/${collegeCode}`
    );
    return response.data;
  },

  // Public college lookup by college UUID
  getPublicCollegeById: async (collegeId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CORE.COLLEGES}/public/id/${collegeId}`
    );
    return response.data;
  },

  // Register a new college (Super Admin)
  createCollege: async (collegeData) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.CORE.COLLEGES}/createCollege`,
      collegeData
    );
    return response.data;
  },

  // Update current tenant college data
  updateCollegeData: async (collegeData) => {
    const response = await apiClient.put(`${API_ENDPOINTS.CORE.COLLEGES}/`, collegeData);
    return response.data;
  },

  // Delete current tenant college
  deleteCollege: async () => {
    const response = await apiClient.delete(`${API_ENDPOINTS.CORE.COLLEGES}/`);
    return response.data;
  },

  // Search colleges with keyword filters
  searchColleges: async (searchParams) => {
    const response = await apiClient.get(`${API_ENDPOINTS.CORE.COLLEGES}/search`, {
      params: searchParams,
    });
    return response.data;
  },
};

export default collegeService;
