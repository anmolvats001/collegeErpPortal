import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { IS_PREVIEW_MODE, MOCK_CALLS } from '../utils/mockData';

export const callService = {
  createCall: async (callType = 'VIDEO') => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CLASS.CALLS, { callType });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const newCall = {
          callId: `call-${Date.now()}`,
          createdBy: 'ADMIN-2026',
          callType,
          status: 'ACTIVE',
          joinCode,
          meetingLink: `https://meet.college-erp.edu/${joinCode}`,
          startedAt: new Date().toISOString(),
          endedAt: null,
        };
        MOCK_CALLS.unshift(newCall);
        return newCall;
      }
      throw err;
    }
  },

  getCallById: async (callId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.CALLS}/${callId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_CALLS.find((c) => c.callId === callId) || MOCK_CALLS[0];
      }
      throw err;
    }
  },

  joinCall: async (joinCode) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.CALLS}/join/${encodeURIComponent(joinCode)}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const found = MOCK_CALLS.find(
          (c) => c.joinCode?.toUpperCase() === joinCode?.trim()?.toUpperCase()
        );
        if (found) return found;
        return {
          callId: `call-${Date.now()}`,
          createdBy: 'FAC-102',
          callType: 'VIDEO',
          status: 'ACTIVE',
          joinCode: joinCode.toUpperCase(),
          meetingLink: `https://meet.college-erp.edu/${joinCode}`,
          startedAt: new Date().toISOString(),
          endedAt: null,
        };
      }
      throw err;
    }
  },

  endCall: async (callId) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.CLASS.CALLS}/${callId}/end`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const call = MOCK_CALLS.find((c) => c.callId === callId);
        if (call) {
          call.status = 'ENDED';
          call.endedAt = new Date().toISOString();
        }
        return call || { status: 'ENDED' };
      }
      throw err;
    }
  },
};
