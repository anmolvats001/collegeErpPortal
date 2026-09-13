import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

export const moduleService = {
  // Fetch all global platform modules (Super Admin)
  getAllSystemModules: async () => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CORE.MODULES}/getAllModules`
    );
    return response.data;
  },

  // Create a new platform module (Super Admin)
  createSystemModule: async (moduleData) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.CORE.MODULES}/createModule`,
      moduleData
    );
    return response.data;
  },

  // Get active/assigned modules for a specific college
  getModulesOfCollege: async (collegeId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CORE.COLLEGE_MODULES}/college/${collegeId}`
    );
    return response.data;
  },

  // Assign a module to a college
  assignModuleToCollege: async (collegeId, moduleCode) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.CORE.COLLEGE_MODULES}`,
      { collegeId, moduleCode }
    );
    return response.data;
  },

  // Update module enabled/disabled status for a college
  updateModuleStatus: async (collegeId, moduleCode, enabled) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CORE.COLLEGE_MODULES}/status`,
      { collegeId, moduleCode, enabled }
    );
    return response.data;
  },

  // Unassign/remove a specific module from a college
  removeModuleFromCollege: async (collegeId, moduleCode) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.CORE.COLLEGE_MODULES}/college/${collegeId}/module/${moduleCode}`
    );
    return response.data;
  },

  // Remove all modules from a college
  removeAllModulesFromCollege: async (collegeId) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.CORE.COLLEGE_MODULES}/college/${collegeId}`
    );
    return response.data;
  },

  // Check if a module is assigned to a college
  isModuleAssigned: async (collegeId, moduleCode) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CORE.COLLEGE_MODULES}/exists`,
      { params: { collegeId, moduleCode } }
    );
    return response.data;
  },

  // Get colleges that have a specific module assigned
  getCollegesByModule: async (moduleCode, page = 0, size = 10) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CORE.COLLEGE_MODULES}/colleges`,
      { params: { moduleCode, page, size } }
    );
    return response.data;
  },
};

export default moduleService;
