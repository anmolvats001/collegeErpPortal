import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { IS_PREVIEW_MODE, MOCK_TEACHERS } from '../utils/mockData';

export const teacherService = {
  // Create faculty/teacher record
  createTeacher: async (teacherData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CLASS.TEACHERS, teacherData);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newTeacher = {
          teacherId: `tch-${Date.now().toString().slice(-4)}`,
          id: `tch-${Date.now().toString().slice(-4)}`,
          userId: `usr-${Date.now().toString().slice(-4)}`,
          ...teacherData,
          active: true,
        };
        MOCK_TEACHERS.unshift(newTeacher);
        return newTeacher;
      }
      throw err;
    }
  },

  // Get all faculty for current college tenant
  getAllTeachers: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CLASS.TEACHERS);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_TEACHERS;
      }
      throw err;
    }
  },

  // Get faculty by teacherId
  getTeacher: async (teacherId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.TEACHERS}/${teacherId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_TEACHERS.find((t) => t.teacherId === teacherId || t.id === teacherId);
      }
      throw err;
    }
  },

  // Get faculty by user UUID
  getTeacherByUserId: async (userId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.TEACHERS}/user/${userId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_TEACHERS.find((t) => t.userId === userId);
      }
      throw err;
    }
  },

  // Search faculty by name
  searchTeachers: async (name) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.TEACHERS}/search`, {
        params: { name },
      });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const q = name.toLowerCase();
        return MOCK_TEACHERS.filter(
          (t) =>
            `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
            t.employeeId?.toLowerCase().includes(q)
        );
      }
      throw err;
    }
  },

  // Update faculty profile
  updateTeacher: async (teacherId, teacherData) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.CLASS.TEACHERS}/${teacherId}`,
        teacherData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_TEACHERS.findIndex((t) => t.teacherId === teacherId || t.id === teacherId);
        if (idx !== -1) {
          MOCK_TEACHERS[idx] = { ...MOCK_TEACHERS[idx], ...teacherData };
          return MOCK_TEACHERS[idx];
        }
        return { teacherId, ...teacherData };
      }
      throw err;
    }
  },

  // Toggle faculty active status
  updateTeacherActive: async (teacherId, active) => {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.CLASS.TEACHERS}/active`, {
        teacherId,
        active,
      });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const target = MOCK_TEACHERS.find((t) => t.teacherId === teacherId || t.id === teacherId);
        if (target) target.active = active;
        return target || { teacherId, active };
      }
      throw err;
    }
  },

  // Delete faculty record
  deleteTeacher: async (teacherId) => {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.CLASS.TEACHERS}/${teacherId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_TEACHERS.findIndex((t) => t.teacherId === teacherId || t.id === teacherId);
        if (idx !== -1) MOCK_TEACHERS.splice(idx, 1);
        return { success: true, message: 'Teacher deleted successfully' };
      }
      throw err;
    }
  },
};

