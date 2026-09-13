import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { IS_PREVIEW_MODE, MOCK_STUDENTS } from '../utils/mockData';

export const studentService = {
  // Create student profile
  createStudent: async (studentData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CLASS.STUDENTS, studentData);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newStudent = {
          studentId: `stu-${Date.now().toString().slice(-4)}`,
          id: `stu-${Date.now().toString().slice(-4)}`,
          userId: `usr-${Date.now().toString().slice(-4)}`,
          ...studentData,
          active: true,
        };
        MOCK_STUDENTS.unshift(newStudent);
        return newStudent;
      }
      throw err;
    }
  },

  // Get all students for current college tenant
  getAllStudents: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CLASS.STUDENTS);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_STUDENTS;
      }
      throw err;
    }
  },

  // Get student by studentId
  getStudent: async (studentId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.STUDENTS}/${studentId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_STUDENTS.find((s) => s.studentId === studentId || s.id === studentId);
      }
      throw err;
    }
  },

  // Get student by user UUID
  getStudentByUserId: async (userId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.STUDENTS}/user/${userId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_STUDENTS.find((s) => s.userId === userId);
      }
      throw err;
    }
  },

  // Search students by name
  searchStudents: async (name) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.STUDENTS}/search`, {
        params: { name },
      });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const q = name.toLowerCase();
        return MOCK_STUDENTS.filter(
          (s) =>
            `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
            s.enrollmentNumber?.toLowerCase().includes(q)
        );
      }
      throw err;
    }
  },

  // Update student profile
  updateStudent: async (studentId, studentData) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.CLASS.STUDENTS}/${studentId}`,
        studentData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_STUDENTS.findIndex((s) => s.studentId === studentId || s.id === studentId);
        if (idx !== -1) {
          MOCK_STUDENTS[idx] = { ...MOCK_STUDENTS[idx], ...studentData };
          return MOCK_STUDENTS[idx];
        }
        return { studentId, ...studentData };
      }
      throw err;
    }
  },

  // Toggle student active status
  updateStudentActive: async (studentId, active) => {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.CLASS.STUDENTS}/active`, {
        studentId,
        active,
      });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const target = MOCK_STUDENTS.find((s) => s.studentId === studentId || s.id === studentId);
        if (target) target.active = active;
        return target || { studentId, active };
      }
      throw err;
    }
  },

  // Delete student profile
  deleteStudent: async (studentId) => {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.CLASS.STUDENTS}/${studentId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_STUDENTS.findIndex((s) => s.studentId === studentId || s.id === studentId);
        if (idx !== -1) MOCK_STUDENTS.splice(idx, 1);
        return { success: true, message: 'Student deleted successfully' };
      }
      throw err;
    }
  },
};

