import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { IS_PREVIEW_MODE, MOCK_CLASSES } from '../utils/mockData';

export const classSectionService = {
  // Create a new class section cohort
  createClass: async (classData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CLASS.CLASSES, classData);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newClass = {
          classId: `cls-${Date.now()}`,
          id: `cls-${Date.now()}`,
          ...classData,
          active: true,
        };
        MOCK_CLASSES.push(newClass);
        return newClass;
      }
      throw err;
    }
  },

  // Get all class sections for current tenant college
  getAllClasses: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CLASS.CLASSES);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_CLASSES;
      }
      throw err;
    }
  },

  // Get class sections by branch
  getClassesByBranch: async (branchId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CLASS.CLASSES}/branch/${branchId}`
    );
    return response.data;
  },

  // Get class sections by branch and semester
  getClassesByBranchAndSemester: async (branchId, semester) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CLASS.CLASSES}/branch/${branchId}/semester/${semester}`
    );
    return response.data;
  },

  // Get specific class section by ID
  getClassById: async (classId) => {
    const response = await apiClient.get(`${API_ENDPOINTS.CLASS.CLASSES}/${classId}`);
    return response.data;
  },

  // Search class sections by name
  searchClasses: async (className) => {
    const response = await apiClient.get(`${API_ENDPOINTS.CLASS.CLASSES}/search`, {
      params: { className },
    });
    return response.data;
  },

  // Update class section metadata
  updateClass: async (classId, classData) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CLASS.CLASSES}/${classId}`,
      classData
    );
    return response.data;
  },

  // Toggle class section active status
  updateClassActive: async (classId, active) => {
    const response = await apiClient.patch(`${API_ENDPOINTS.CLASS.CLASSES}/active`, {
      classId,
      active,
    });
    return response.data;
  },

  // Delete class section
  deleteClass: async (classId) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.CLASS.CLASSES}/${classId}`);
    return response.data;
  },
};

export default classSectionService;
