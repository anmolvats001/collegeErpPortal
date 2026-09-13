import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { IS_PREVIEW_MODE, MOCK_SUBJECTS } from '../utils/mockData';

export const subjectService = {
  // Create a new curriculum subject
  createSubject: async (subjectData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CLASS.SUBJECTS, subjectData);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newSub = {
          subjectId: `sub-${Date.now()}`,
          id: `sub-${Date.now()}`,
          ...subjectData,
          active: true,
        };
        MOCK_SUBJECTS.push(newSub);
        return newSub;
      }
      throw err;
    }
  },

  // Get all subjects in current tenant college
  getAllSubjects: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CLASS.SUBJECTS);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_SUBJECTS;
      }
      throw err;
    }
  },

  // Get subject by ID
  getSubject: async (subjectId) => {
    const response = await apiClient.get(`${API_ENDPOINTS.CLASS.SUBJECTS}/${subjectId}`);
    return response.data;
  },

  // Get subjects belonging to a course
  getSubjectsOfCourse: async (courseId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CLASS.SUBJECTS}/course/${courseId}`
    );
    return response.data;
  },

  // Get subjects belonging to a course and semester
  getSubjectsOfCourseAndSemester: async (courseId, semester) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CLASS.SUBJECTS}/course/${courseId}/semester/${semester}`
    );
    return response.data;
  },

  // Search subjects by name
  searchSubjects: async (subjectName) => {
    const response = await apiClient.get(`${API_ENDPOINTS.CLASS.SUBJECTS}/search`, {
      params: { subjectName },
    });
    return response.data;
  },

  // Update subject metadata
  updateSubject: async (subjectId, subjectData) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CLASS.SUBJECTS}/${subjectId}`,
      subjectData
    );
    return response.data;
  },

  // Toggle subject active status
  updateSubjectActive: async (subjectId, active) => {
    const response = await apiClient.patch(`${API_ENDPOINTS.CLASS.SUBJECTS}/active`, {
      subjectId,
      active,
    });
    return response.data;
  },

  // Delete subject
  deleteSubject: async (subjectId) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.CLASS.SUBJECTS}/${subjectId}`);
    return response.data;
  },
};

export default subjectService;
