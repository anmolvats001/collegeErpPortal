import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { IS_PREVIEW_MODE, MOCK_TEACHER_SUBJECTS } from '../utils/mockData';

export const teacherSubjectService = {
  // Assign faculty to a class curriculum subject
  createTeacherSubject: async (assignmentData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.CLASS.TEACHER_SUBJECTS,
        assignmentData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newAssignment = {
          teacherSubjectId: `ts-${Date.now()}`,
          id: `ts-${Date.now()}`,
          ...assignmentData,
          active: true,
        };
        MOCK_TEACHER_SUBJECTS.push(newAssignment);
        return newAssignment;
      }
      throw err;
    }
  },

  // Get all teacher-subject assignments
  getAllTeacherSubjects: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CLASS.TEACHER_SUBJECTS);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_TEACHER_SUBJECTS;
      }
      throw err;
    }
  },

  // Get specific teacher-subject assignment by ID
  getTeacherSubject: async (teacherSubjectId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CLASS.TEACHER_SUBJECTS}/${teacherSubjectId}`
    );
    return response.data;
  },

  // Get all subject allocations assigned to a teacher
  getSubjectsOfTeacher: async (teacherId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CLASS.TEACHER_SUBJECTS}/teacher/${teacherId}`
    );
    return response.data;
  },

  // Get all teachers assigned to a specific class subject
  getTeachersOfClassSubject: async (classSubjectId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CLASS.TEACHER_SUBJECTS}/class-subject/${classSubjectId}`
    );
    return response.data;
  },

  // Toggle teacher subject assignment status
  updateActiveStatus: async (teacherSubjectId, active) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CLASS.TEACHER_SUBJECTS}/active`,
      {
        teacherSubjectId,
        active,
      }
    );
    return response.data;
  },

  // Remove teacher subject assignment
  deleteTeacherSubject: async (teacherSubjectId) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.CLASS.TEACHER_SUBJECTS}/${teacherSubjectId}`
    );
    return response.data;
  },
};
