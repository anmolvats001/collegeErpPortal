import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { IS_PREVIEW_MODE, MOCK_CLASS_SUBJECTS } from '../utils/mockData';

export const classSubjectService = {
  // Bind / Map a Subject to a Class Section
  createClassSubject: async (classId, subjectId) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CLASS.CLASS_SUBJECTS, {
        classId,
        subjectId,
      });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newMapping = {
          classSubjectId: `cs-${Date.now()}`,
          id: `cs-${Date.now()}`,
          classId,
          subjectId,
          active: true,
        };
        MOCK_CLASS_SUBJECTS.push(newMapping);
        return newMapping;
      }
      throw err;
    }
  },

  // Get all class-subject mappings
  getAllClassSubjects: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CLASS.CLASS_SUBJECTS);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_CLASS_SUBJECTS;
      }
      throw err;
    }
  },

  // Get specific mapping by ID
  getClassSubject: async (classSubjectId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CLASS.CLASS_SUBJECTS}/${classSubjectId}`
    );
    return response.data;
  },

  // Get all subjects mapped to a specific class section
  getSubjectsOfClass: async (classId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CLASS.CLASS_SUBJECTS}/class/${classId}`
    );
    return response.data;
  },

  // Get all class sections mapped to a specific subject
  getClassesOfSubject: async (subjectId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CLASS.CLASS_SUBJECTS}/subject/${subjectId}`
    );
    return response.data;
  },

  // Update active status of a class-subject mapping
  updateActiveStatus: async (classSubjectId, active) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CLASS.CLASS_SUBJECTS}/active`,
      { classSubjectId, active }
    );
    return response.data;
  },

  // Remove / dissociate a subject from a class section
  deleteClassSubject: async (classSubjectId) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.CLASS.CLASS_SUBJECTS}/${classSubjectId}`
    );
    return response.data;
  },
};

export default classSubjectService;
