import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { IS_PREVIEW_MODE, MOCK_ASSIGNMENTS, MOCK_STUDENT_ASSIGNMENTS } from '../utils/mockData';

export const assignmentService = {
  // Create an assignment
  createAssignment: async (assignmentData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.CLASS.ASSIGNMENTS,
        assignmentData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newAsg = {
          assignmentId: `asg-${Date.now().toString().slice(-4)}`,
          id: `asg-${Date.now().toString().slice(-4)}`,
          ...assignmentData,
          totalSubmissions: 32,
          gradedCount: 0,
        };
        MOCK_ASSIGNMENTS.unshift(newAsg);
        return newAsg;
      }
      throw err;
    }
  },

  // Get specific assignment by ID
  getAssignment: async (assignmentId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ASSIGNMENTS}/${assignmentId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_ASSIGNMENTS.find((a) => a.assignmentId === assignmentId || a.id === assignmentId);
      }
      throw err;
    }
  },

  // Get assignments of ClassSubject offering
  getAssignmentsOfClassSubject: async (classSubjectId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ASSIGNMENTS}/class-subject/${classSubjectId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_ASSIGNMENTS.filter((a) => a.classSubjectId === classSubjectId);
      }
      throw err;
    }
  },

  // Get assignments of TeacherSubject allocation
  getAssignmentsOfTeacherSubject: async (teacherSubjectId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ASSIGNMENTS}/teacher-subject/${teacherSubjectId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_ASSIGNMENTS.filter((a) => a.teacherSubjectId === teacherSubjectId);
      }
      throw err;
    }
  },

  // Score/mark an individual student assignment
  markAssignment: async (markData) => {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.CLASS.ASSIGNMENTS}/marks`,
        markData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newMark = {
          studentAssignmentId: `sa-${Date.now().toString().slice(-4)}`,
          ...markData,
        };
        MOCK_STUDENT_ASSIGNMENTS.push(newMark);
        return newMark;
      }
      throw err;
    }
  },

  // Bulk score/mark student assignments
  bulkMarkAssignment: async (bulkData) => {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.CLASS.ASSIGNMENTS}/marks/bulk`,
        bulkData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const marks = (bulkData.studentMarks || []).map((m, idx) => ({
          studentAssignmentId: `sa-${Date.now().toString().slice(-4)}-${idx}`,
          assignmentId: bulkData.assignmentId,
          studentClassId: m.studentClassId,
          marksObtained: m.marksObtained,
        }));
        // Update assignment graded count
        const asg = MOCK_ASSIGNMENTS.find((a) => a.assignmentId === bulkData.assignmentId);
        if (asg) {
          asg.gradedCount = marks.length;
        }
        return marks;
      }
      throw err;
    }
  },

  // Get marks of all students for an assignment
  getAssignmentMarks: async (assignmentId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ASSIGNMENTS}/${assignmentId}/marks`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_STUDENT_ASSIGNMENTS.filter((m) => m.assignmentId === assignmentId);
      }
      throw err;
    }
  },

  // Get all assignments for a student enrollment
  getStudentAssignments: async (studentClassId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ASSIGNMENTS}/student/${studentClassId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_STUDENT_ASSIGNMENTS.filter((m) => m.studentClassId === studentClassId);
      }
      throw err;
    }
  },

  // Get assignments of student for a course subject
  getStudentSubjectAssignments: async (studentClassId, classSubjectId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ASSIGNMENTS}/student/${studentClassId}/class-subject/${classSubjectId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_STUDENT_ASSIGNMENTS.filter((m) => m.studentClassId === studentClassId);
      }
      throw err;
    }
  },

  // Update scored marks
  updateMarks: async (studentAssignmentId, marks) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.CLASS.ASSIGNMENTS}/marks/${studentAssignmentId}`,
        null,
        { params: { marks } }
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const target = MOCK_STUDENT_ASSIGNMENTS.find((m) => m.studentAssignmentId === studentAssignmentId);
        if (target) target.marksObtained = marks;
        return target || { studentAssignmentId, marksObtained: marks };
      }
      throw err;
    }
  },
};

