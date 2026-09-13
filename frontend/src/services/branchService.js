import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { IS_PREVIEW_MODE, MOCK_BRANCHES } from '../utils/mockData';

export const branchService = {
  // Create branch under a parent course
  createBranch: async (courseId, branchData) => {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.CLASS.BRANCHES}/course/${courseId}`,
        branchData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newBranch = {
          branchId: `br-${Date.now().toString().slice(-4)}`,
          id: `br-${Date.now().toString().slice(-4)}`,
          courseId,
          ...branchData,
          active: true,
        };
        MOCK_BRANCHES.unshift(newBranch);
        return newBranch;
      }
      throw err;
    }
  },

  // Get branches belonging to a specific course
  getBranchesOfCourse: async (courseId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.BRANCHES}/course/${courseId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_BRANCHES.filter((b) => b.courseId === courseId);
      }
      throw err;
    }
  },

  // Get branch by ID
  getBranchById: async (branchId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.BRANCHES}/${branchId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_BRANCHES.find((b) => b.branchId === branchId || b.id === branchId);
      }
      throw err;
    }
  },

  // Search branches by name
  searchBranches: async (branchName) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.BRANCHES}/search`, {
        params: { branchName },
      });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const q = branchName.toLowerCase();
        return MOCK_BRANCHES.filter(
          (b) => b.branchName?.toLowerCase().includes(q) || b.branchCode?.toLowerCase().includes(q)
        );
      }
      throw err;
    }
  },

  // Get all branches in current tenant college
  getAllBranches: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CLASS.BRANCHES);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_BRANCHES;
      }
      throw err;
    }
  },

  // Update branch active status
  updateBranchActive: async (branchId, active) => {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.CLASS.BRANCHES}/active`, {
        branchId,
        active,
      });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const target = MOCK_BRANCHES.find((b) => b.branchId === branchId || b.id === branchId);
        if (target) target.active = active;
        return target || { branchId, active };
      }
      throw err;
    }
  },

  // Update branch metadata
  updateBranch: async (branchId, branchData) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.CLASS.BRANCHES}/${branchId}`,
        branchData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_BRANCHES.findIndex((b) => b.branchId === branchId || b.id === branchId);
        if (idx !== -1) {
          MOCK_BRANCHES[idx] = { ...MOCK_BRANCHES[idx], ...branchData };
          return MOCK_BRANCHES[idx];
        }
        return { branchId, ...branchData };
      }
      throw err;
    }
  },

  // Delete branch
  deleteBranch: async (branchId) => {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.CLASS.BRANCHES}/${branchId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_BRANCHES.findIndex((b) => b.branchId === branchId || b.id === branchId);
        if (idx !== -1) MOCK_BRANCHES.splice(idx, 1);
        return { success: true, message: 'Branch deleted successfully' };
      }
      throw err;
    }
  },
};

export default branchService;

