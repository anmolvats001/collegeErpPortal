import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import {
  IS_PREVIEW_MODE,
  MOCK_ATTENDANCE_SESSIONS,
  MOCK_ATTENDANCE_RECORDS,
  MOCK_STUDENT_ATTENDANCE_LOG,
  MOCK_STUDENT_ATTENDANCE_SUMMARIES,
} from '../utils/mockData';

export const attendanceService = {
  // Create an attendance lecture session
  createSession: async (sessionData) => {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.CLASS.ATTENDANCE}/session`,
        sessionData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newSession = {
          attendanceSessionId: `att-sess-${Date.now().toString().slice(-4)}`,
          id: `att-sess-${Date.now().toString().slice(-4)}`,
          ...sessionData,
          totalStudents: 32,
          presentCount: 0,
          absentCount: 0,
        };
        MOCK_ATTENDANCE_SESSIONS.unshift(newSession);
        return newSession;
      }
      throw err;
    }
  },

  // Get specific attendance session details
  getSession: async (sessionId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ATTENDANCE}/session/${sessionId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_ATTENDANCE_SESSIONS.find((s) => s.attendanceSessionId === sessionId || s.id === sessionId);
      }
      throw err;
    }
  },

  // Get current faculty member's sessions
  getMySessions: async () => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ATTENDANCE}/session/my`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_ATTENDANCE_SESSIONS;
      }
      throw err;
    }
  },

  // Get current faculty member's sessions for specific date
  getMySessionsByDate: async (date) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ATTENDANCE}/session/my/date/${date}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_ATTENDANCE_SESSIONS.filter((s) => s.attendanceDate === date);
      }
      throw err;
    }
  },

  // Get all attendance sessions for a subject course
  getSubjectSessions: async (classSubjectId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ATTENDANCE}/session/subject/${classSubjectId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_ATTENDANCE_SESSIONS.filter((s) => s.classSubjectId === classSubjectId);
      }
      throw err;
    }
  },

  // Get all institutional sessions for a date
  getSessionsByDate: async (date) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ATTENDANCE}/session/date/${date}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_ATTENDANCE_SESSIONS;
      }
      throw err;
    }
  },

  // Mark bulk attendance for students in a session
  markBulkAttendance: async (bulkData) => {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.CLASS.ATTENDANCE}/bulk`,
        bulkData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const records = (bulkData.attendanceList || []).map((item, idx) => ({
          attendanceId: `rec-${Date.now().toString().slice(-4)}-${idx}`,
          attendanceSessionId: bulkData.sessionId,
          studentClassId: item.studentClassId,
          status: item.status,
        }));
        // Update session counts
        const targetSession = MOCK_ATTENDANCE_SESSIONS.find((s) => s.attendanceSessionId === bulkData.sessionId);
        if (targetSession) {
          targetSession.presentCount = records.filter((r) => r.status === 'PRESENT').length;
          targetSession.absentCount = records.filter((r) => r.status === 'ABSENT').length;
          targetSession.totalStudents = records.length;
        }
        return records;
      }
      throw err;
    }
  },

  // Get all attendance records for a session
  getAttendanceOfSession: async (sessionId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ATTENDANCE}/session/${sessionId}/records`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_ATTENDANCE_RECORDS.filter((r) => r.attendanceSessionId === sessionId);
      }
      throw err;
    }
  },

  // Get current logged-in student's attendance history
  getMyAttendance: async () => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ATTENDANCE}/my`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_STUDENT_ATTENDANCE_LOG;
      }
      throw err;
    }
  },

  // Get current logged-in student's subject attendance summaries
  getMyAttendanceSummaries: async () => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ATTENDANCE}/my/summary`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_STUDENT_ATTENDANCE_SUMMARIES;
      }
      throw err;
    }
  },

  // Get all attendance records for a student enrollment
  getStudentAttendance: async (studentClassId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ATTENDANCE}/student/${studentClassId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_ATTENDANCE_RECORDS.filter((r) => r.studentClassId === studentClassId);
      }
      throw err;
    }
  },

  // Get student attendance for a specific course subject
  getStudentAttendanceOfSubject: async (studentClassId, classSubjectId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ATTENDANCE}/student/${studentClassId}/subject/${classSubjectId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_ATTENDANCE_RECORDS.filter((r) => r.studentClassId === studentClassId);
      }
      throw err;
    }
  },

  // Get calculated attendance summary & percentage
  getAttendanceSummary: async (studentClassId, classSubjectId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.ATTENDANCE}/student/${studentClassId}/subject/${classSubjectId}/summary`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return {
          studentClassId,
          classSubjectId,
          totalLectures: 24,
          attendedLectures: 21,
          absentLectures: 3,
          exemptLectures: 0,
          attendancePercentage: 87.5,
          eligibleForExam: true,
        };
      }
      throw err;
    }
  },

  // Update a single attendance status (PRESENT / ABSENT / EXEMPT)
  updateAttendance: async (attendanceId, status) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.CLASS.ATTENDANCE}/${attendanceId}`,
        null,
        { params: { status } }
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const target = MOCK_ATTENDANCE_RECORDS.find((r) => r.attendanceId === attendanceId);
        if (target) target.status = status;
        return target || { attendanceId, status };
      }
      throw err;
    }
  },
};

