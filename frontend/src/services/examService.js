import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { IS_PREVIEW_MODE, MOCK_EXAMS, MOCK_EXAM_RESULTS } from '../utils/mockData';

export const examService = {
  // ================= EXAMS =================
  getAllExams: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CLASS.EXAMS);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) return MOCK_EXAMS;
      throw err;
    }
  },

  getExamById: async (examId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.EXAMS}/${examId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) return MOCK_EXAMS.find((e) => e.examId === examId) || MOCK_EXAMS[0];
      throw err;
    }
  },

  getExamsOfClassSubject: async (classSubjectId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.EXAMS}/class-subject/${classSubjectId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) return MOCK_EXAMS.filter((e) => e.classSubjectId === classSubjectId);
      throw err;
    }
  },

  getExamsOfTeacherSubject: async (teacherSubjectId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.EXAMS}/teacher-subject/${teacherSubjectId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE)
        return MOCK_EXAMS.filter((e) => e.teacherSubjectId === teacherSubjectId);
      throw err;
    }
  },

  getExamsByDate: async (date) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.EXAMS}/date/${date}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) return MOCK_EXAMS.filter((e) => e.examDate === date);
      throw err;
    }
  },

  createExam: async (examData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CLASS.EXAMS, examData);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newExam = {
          examId: `exam-${Date.now()}`,
          ...examData,
          status: examData.status || 'SCHEDULED',
        };
        MOCK_EXAMS.unshift(newExam);
        return newExam;
      }
      throw err;
    }
  },

  updateExam: async (examId, examData) => {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.CLASS.EXAMS}/${examId}`, examData);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_EXAMS.findIndex((e) => e.examId === examId);
        if (idx !== -1) {
          MOCK_EXAMS[idx] = { ...MOCK_EXAMS[idx], ...examData };
          return MOCK_EXAMS[idx];
        }
      }
      throw err;
    }
  },

  deleteExam: async (examId) => {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.CLASS.EXAMS}/${examId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_EXAMS.findIndex((e) => e.examId === examId);
        if (idx !== -1) MOCK_EXAMS.splice(idx, 1);
        return { success: true, message: 'Exam deleted successfully' };
      }
      throw err;
    }
  },

  // ================= EXAM RESULTS =================
  createResult: async (resultData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CLASS.EXAM_RESULTS, resultData);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const targetExam = MOCK_EXAMS.find((e) => e.examId === resultData.examId);
        const maxMarks = targetExam?.maxMarks || 100;
        const passingMarks = targetExam?.passingMarks || 40;
        const newRes = {
          resultId: `res-${Date.now()}`,
          examId: resultData.examId,
          studentClassId: resultData.studentClassId,
          marks: resultData.marks,
          maxMarks,
          passed: resultData.marks >= passingMarks,
        };
        MOCK_EXAM_RESULTS.push(newRes);
        return newRes;
      }
      throw err;
    }
  },

  createBulkResults: async (bulkData) => {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.CLASS.EXAM_RESULTS}/bulk`,
        bulkData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const targetExam = MOCK_EXAMS.find((e) => e.examId === bulkData.examId);
        const maxMarks = targetExam?.maxMarks || 100;
        const passingMarks = targetExam?.passingMarks || 40;

        const created = (bulkData.results || []).map((r, i) => {
          const res = {
            resultId: `res-${Date.now()}-${i}`,
            examId: bulkData.examId,
            studentClassId: r.studentClassId,
            marks: r.marks,
            maxMarks,
            passed: r.marks >= passingMarks,
          };
          // Upsert in mock data
          const existIdx = MOCK_EXAM_RESULTS.findIndex(
            (er) => er.examId === bulkData.examId && er.studentClassId === r.studentClassId
          );
          if (existIdx !== -1) {
            MOCK_EXAM_RESULTS[existIdx] = res;
          } else {
            MOCK_EXAM_RESULTS.push(res);
          }
          return res;
        });
        return created;
      }
      throw err;
    }
  },

  getResultById: async (resultId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.EXAM_RESULTS}/${resultId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) return MOCK_EXAM_RESULTS.find((r) => r.resultId === resultId);
      throw err;
    }
  },

  getResultsOfExam: async (examId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.EXAM_RESULTS}/exam/${examId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) return MOCK_EXAM_RESULTS.filter((r) => r.examId === examId);
      throw err;
    }
  },

  getStudentResults: async (studentClassId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.EXAM_RESULTS}/student/${studentClassId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE)
        return MOCK_EXAM_RESULTS.filter((r) => r.studentClassId === studentClassId);
      throw err;
    }
  },

  updateResultMarks: async (resultId, marks) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.CLASS.EXAM_RESULTS}/${resultId}?marks=${marks}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const item = MOCK_EXAM_RESULTS.find((r) => r.resultId === resultId);
        if (item) {
          item.marks = marks;
          item.passed = marks >= (item.maxMarks * 0.4);
        }
        return item;
      }
      throw err;
    }
  },

  deleteResult: async (resultId) => {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.CLASS.EXAM_RESULTS}/${resultId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_EXAM_RESULTS.findIndex((r) => r.resultId === resultId);
        if (idx !== -1) MOCK_EXAM_RESULTS.splice(idx, 1);
        return { success: true, message: 'Exam result deleted successfully' };
      }
      throw err;
    }
  },
};
