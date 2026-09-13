import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import {
  IS_PREVIEW_MODE,
  MOCK_CONVERSATIONS,
  MOCK_CONVERSATION_MEMBERS,
  MOCK_MESSAGES,
} from '../utils/mockData';

export const chatService = {
  // ================= CONVERSATIONS =================
  getConversationsOfCollege: async () => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.CONVERSATIONS}/college`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_CONVERSATIONS;
      }
      throw err;
    }
  },

  getConversationById: async (conversationId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.CONVERSATIONS}/${conversationId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const found = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
        return found || MOCK_CONVERSATIONS[0];
      }
      throw err;
    }
  },

  getConversationByClass: async (classId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.CONVERSATIONS}/class/${classId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_CONVERSATIONS.find((c) => c.classId === classId) || null;
      }
      throw err;
    }
  },

  getConversationsByBranch: async (branchId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.CONVERSATIONS}/branch/${branchId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_CONVERSATIONS.filter((c) => c.branchId === branchId);
      }
      throw err;
    }
  },

  createConversation: async (classId) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CLASS.CONVERSATIONS, { classId });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newConv = {
          id: `conv-${Date.now()}`,
          classId,
          className: `Class Cohort ${classId}`,
          active: true,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        MOCK_CONVERSATIONS.unshift(newConv);
        return newConv;
      }
      throw err;
    }
  },

  toggleActiveStatus: async (conversationId, active) => {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.CLASS.CONVERSATIONS}/active`, {
        conversationId,
        active,
      });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const conv = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
        if (conv) conv.active = active;
        return conv;
      }
      throw err;
    }
  },

  deleteConversation: async (conversationId) => {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.CLASS.CONVERSATIONS}/${conversationId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_CONVERSATIONS.findIndex((c) => c.id === conversationId);
        if (idx !== -1) MOCK_CONVERSATIONS.splice(idx, 1);
        return { success: true, message: 'Conversation deleted successfully' };
      }
      throw err;
    }
  },

  // ================= CONVERSATION MEMBERS =================
  getConversationMembers: async (conversationId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.CONVERSATION_MEMBERS}/conversation/${conversationId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_CONVERSATION_MEMBERS.filter((m) => m.conversationId === conversationId);
      }
      throw err;
    }
  },

  getMyMemberships: async () => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.CONVERSATION_MEMBERS}/my`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_CONVERSATION_MEMBERS.slice(0, 3);
      }
      throw err;
    }
  },

  addMember: async ({ conversationId, userId, memberType }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CLASS.CONVERSATION_MEMBERS, {
        conversationId,
        userId,
        memberType,
      });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newMember = {
          id: `mem-${Date.now()}`,
          conversationId,
          userId,
          userName: userId,
          memberType,
          active: true,
          createdAt: new Date().toISOString(),
        };
        MOCK_CONVERSATION_MEMBERS.push(newMember);
        return newMember;
      }
      throw err;
    }
  },

  updateMemberActiveStatus: async (memberId, active) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.CLASS.CONVERSATION_MEMBERS}/${memberId}/active?active=${active}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const mem = MOCK_CONVERSATION_MEMBERS.find((m) => m.id === memberId);
        if (mem) mem.active = active;
        return mem;
      }
      throw err;
    }
  },

  removeMember: async (memberId) => {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.CLASS.CONVERSATION_MEMBERS}/${memberId}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_CONVERSATION_MEMBERS.findIndex((m) => m.id === memberId);
        if (idx !== -1) MOCK_CONVERSATION_MEMBERS.splice(idx, 1);
        return { success: true, message: 'Member removed successfully' };
      }
      throw err;
    }
  },

  // ================= MESSAGES =================
  getMessages: async (conversationId, page = 0, size = 50) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CLASS.MESSAGES}/conversation/${conversationId}?page=${page}&size=${size}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const msgs = MOCK_MESSAGES[conversationId] || [];
        return {
          content: msgs,
          totalElements: msgs.length,
          totalPages: 1,
          number: 0,
        };
      }
      throw err;
    }
  },

  sendMessage: async ({ conversationId, messageType = 'TEXT', message }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CLASS.MESSAGES, {
        conversationId,
        messageType,
        message,
      });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          conversationId,
          conversationMemberId: 'mem-cur',
          userId: 'ADMIN-2026',
          userName: 'Dr. Rajesh Sharma',
          userRole: 'TEACHER',
          messageType,
          message,
          createdAt: new Date().toISOString(),
          collegeId: 'COL-DELHI-001',
        };
        if (!MOCK_MESSAGES[conversationId]) {
          MOCK_MESSAGES[conversationId] = [];
        }
        MOCK_MESSAGES[conversationId].push(newMsg);
        return newMsg;
      }
      throw err;
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.CLASS.MESSAGES}/${messageId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        Object.keys(MOCK_MESSAGES).forEach((k) => {
          MOCK_MESSAGES[k] = MOCK_MESSAGES[k].filter((m) => m.id !== messageId);
        });
        return { success: true, message: 'Message deleted successfully' };
      }
      throw err;
    }
  },
};
