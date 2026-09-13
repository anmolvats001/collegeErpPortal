import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

export const permissionService = {
  getAllPermissions: async () => {
    const response = await apiClient.get(`${API_ENDPOINTS.CORE.PERMISSIONS}/all`);
    return response.data;
  },

  addPermission: async (permissionData) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.CORE.PERMISSIONS}/addPermission`,
      permissionData
    );
    return response.data;
  },

  deletePermission: async (permissionCode) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.CORE.PERMISSIONS}/${encodeURIComponent(permissionCode)}`
    );
    return response.data;
  },

  searchPermissions: async (keyword) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CORE.PERMISSIONS}/search?keyword=${encodeURIComponent(keyword)}`
    );
    return response.data;
  },

  existsByPermissionCode: async (permissionCode) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CORE.PERMISSIONS}/exists/${encodeURIComponent(permissionCode)}`
    );
    return response.data;
  },

  // Role - Permission Mappings
  getPermissionsForRole: async (roleId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CORE.ROLE_PERMISSIONS}/role/${roleId}`
    );
    return response.data;
  },

  updateRolePermissions: async (roleId, permissionIds) => {
    const response = await apiClient.put(
      `${API_ENDPOINTS.CORE.ROLE_PERMISSIONS}/${roleId}/permissions`,
      { permissionIds }
    );
    return response.data;
  },

  addPermissionToRole: async (roleId, permissionId) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.CORE.ROLE_PERMISSIONS}/${roleId}/permission/${encodeURIComponent(permissionId)}`
    );
    return response.data;
  },

  removePermissionFromRole: async (roleId, permissionId) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.CORE.ROLE_PERMISSIONS}/${encodeURIComponent(permissionId)}/role/${roleId}`
    );
    return response.data;
  },
};
