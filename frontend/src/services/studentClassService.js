import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { IS_PREVIEW_MODE, MOCK_STUDENT_CLASSES } from '../utils/mockData';

export const studentClassService = {
  // Enroll student into class section
  createStudentClass: async (enrollmentData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.CLASS.STUDENT_CLASSES,
        enrollmentData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newEnroll = {
          studentClassId: `sc-${Date.now().toString().slice(-4)}`,
          id: `sc-${Date.now().toString().slice(-4)}`,
          ...enrollmentData,
          active: true,
        };
        MOCK_STUDENT_CLASSES.unshift(newEnroll);
        return newEnroll;
      }
      throw err;
    }
  },

  // Get all student class enrollments
  getAllStudentClasses: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CLASS.STUDENT_CLASSES);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_STUDENT_CLASSES;
      }
      throw err;
    }
  },

  // Get specific student-class enrollment
  getStudentClass: async (studentClassId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.STUDENT_CLASSES}/${studentClassId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_STUDENT_CLASSES.find((sc) => sc.studentClassId === studentClassId || sc.id === studentClassId);
      }
      throw err;
    }
  },

  // Get all class sections enrolled by a student
  getClassesOfStudent: async (studentId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.STUDENT_CLASSES}/student/${studentId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_STUDENT_CLASSES.filter((sc) => sc.studentId === studentId);
      }
      throw err;
    }
  },

  // Get all student enrollments in a class section
  getStudentsOfClass: async (classId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.STUDENT_CLASSES}/class/${classId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_STUDENT_CLASSES.filter((sc) => sc.classId === classId || sc.classSectionId === classId);
      }
      throw err;
    }
  },

  // Get students of class by semester
  getStudentsOfClassAndSemester: async (classId, semester) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.STUDENT_CLASSES}/class/${classId}/semester/${semester}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_STUDENT_CLASSES.filter(
          (sc) => (sc.classId === classId || sc.classSectionId === classId) && Number(sc.semester) === Number(semester)
        );
      }
      throw err;
    }
  },

  // Update enrollment metadata
  updateStudentClass: async (studentClassId, enrollmentData) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.CLASS.STUDENT_CLASSES}/${studentClassId}`,
        enrollmentData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_STUDENT_CLASSES.findIndex((sc) => sc.studentClassId === studentClassId || sc.id === studentClassId);
        if (idx !== -1) {
          MOCK_STUDENT_CLASSES[idx] = { ...MOCK_STUDENT_CLASSES[idx], ...enrollmentData };
          return MOCK_STUDENT_CLASSES[idx];
        }
        return { studentClassId, ...enrollmentData };
      }
      throw err;
    }
  },

  // Toggle enrollment active status
  updateActiveStatus: async (studentClassId, active) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.CLASS.STUDENT_CLASSES}/active`,
        {
          studentClassId,
          active,
        }
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const target = MOCK_STUDENT_CLASSES.find((sc) => sc.studentClassId === studentClassId || sc.id === studentClassId);
        if (target) target.active = active;
        return target || { studentClassId, active };
      }
      throw err;
    }
  },

  // Remove enrollment / unenroll student
  deleteStudentClass: async (studentClassId) => {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.CLASS.STUDENT_CLASSES}/${studentClassId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_STUDENT_CLASSES.findIndex((sc) => sc.studentClassId === studentClassId || sc.id === studentClassId);
        if (idx !== -1) MOCK_STUDENT_CLASSES.splice(idx, 1);
        return { success: true, message: 'Student unenrolled successfully' };
      }
      throw err;
    }
  },
};

