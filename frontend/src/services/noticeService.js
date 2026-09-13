import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { IS_PREVIEW_MODE, MOCK_NOTICES } from '../utils/mockData';

export const noticeService = {
  getAllNotices: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CLASS.NOTICES);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) return MOCK_NOTICES;
      throw err;
    }
  },

  getActiveNotices: async () => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.NOTICES}/active`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) return MOCK_NOTICES.filter((n) => n.active !== false);
      throw err;
    }
  },

  getCurrentNotices: async () => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.NOTICES}/current`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const now = new Date();
        return MOCK_NOTICES.filter((n) => {
          if (n.active === false) return false;
          if (n.expiryDate && new Date(n.expiryDate) < now) return false;
          return true;
        });
      }
      throw err;
    }
  },

  getNoticeById: async (noticeId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.NOTICES}/${noticeId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) return MOCK_NOTICES.find((n) => n.noticeId === noticeId) || MOCK_NOTICES[0];
      throw err;
    }
  },

  createNotice: async (noticeData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CLASS.NOTICES, noticeData);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newNotice = {
          noticeId: `notice-${Date.now()}`,
          ...noticeData,
          active: true,
          publishDate: noticeData.publishDate || new Date().toISOString(),
        };
        MOCK_NOTICES.unshift(newNotice);
        return newNotice;
      }
      throw err;
    }
  },

  updateNotice: async (noticeId, noticeData) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.CLASS.NOTICES}/${noticeId}`,
        noticeData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_NOTICES.findIndex((n) => n.noticeId === noticeId);
        if (idx !== -1) {
          MOCK_NOTICES[idx] = { ...MOCK_NOTICES[idx], ...noticeData };
          return MOCK_NOTICES[idx];
        }
      }
      throw err;
    }
  },

  deactivateNotice: async (noticeId) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.CLASS.NOTICES}/${noticeId}/deactivate`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const notice = MOCK_NOTICES.find((n) => n.noticeId === noticeId);
        if (notice) notice.active = false;
        return notice;
      }
      throw err;
    }
  },

  deleteNotice: async (noticeId) => {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.CLASS.NOTICES}/${noticeId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_NOTICES.findIndex((n) => n.noticeId === noticeId);
        if (idx !== -1) MOCK_NOTICES.splice(idx, 1);
        return { success: true, message: 'Notice deleted successfully' };
      }
      throw err;
    }
  },
};
