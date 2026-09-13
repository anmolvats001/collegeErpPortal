import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

export const roleService = {
  getAllRoles: async () => {
    const response = await apiClient.get(API_ENDPOINTS.CORE.ROLES);
    return response.data;
  },

  getRoleById: async (roleId) => {
    const response = await apiClient.get(`${API_ENDPOINTS.CORE.ROLES}/${roleId}`);
    return response.data;
  },

  createRole: async (roleData) => {
    const response = await apiClient.post(API_ENDPOINTS.CORE.ROLES, roleData);
    return response.data;
  },

  updateRole: async (roleId, roleData) => {
    const response = await apiClient.put(`${API_ENDPOINTS.CORE.ROLES}/${roleId}`, roleData);
    return response.data;
  },

  deleteRole: async (roleId) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.CORE.ROLES}/${roleId}`);
    return response.data;
  },

  existsByRoleName: async (roleName) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CORE.ROLES}/exists/${encodeURIComponent(roleName)}`
    );
    return response.data;
  },

  assignRoleToUser: async (roleId, userId) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.CORE.ROLES}/${roleId}/users/${encodeURIComponent(userId)}`
    );
    return response.data;
  },

  removeRoleFromUser: async (roleId, userId) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.CORE.ROLES}/${roleId}/users/${encodeURIComponent(userId)}`
    );
    return response.data;
  },

  getUsersByRole: async (roleId) => {
    const response = await apiClient.get(`${API_ENDPOINTS.CORE.ROLES}/${roleId}/users`);
    return response.data;
  },

  getRolesByUser: async (userId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CORE.ROLES}/users/${encodeURIComponent(userId)}`
    );
    return response.data;
  },

  removeAllRolesFromUser: async (userId) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.CORE.ROLES}/users/${encodeURIComponent(userId)}`
    );
    return response.data;
  },
};
