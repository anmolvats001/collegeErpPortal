import React, { createContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, USER_ROLES } from '../utils/constants';
import { parseUserFromToken, isTokenExpired } from '../utils/jwtUtils';
import { authService } from '../services/authService';
import {
  IS_PREVIEW_MODE,
  MOCK_USER,
  MOCK_ADMIN_USER,
  MOCK_TEACHER_USER,
  MOCK_STUDENT_USER,
} from '../utils/mockData';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => (IS_PREVIEW_MODE ? MOCK_USER : null));
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN));
  const [isLoading, setIsLoading] = useState(false);

  const initAuth = useCallback(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (savedToken && !isTokenExpired(savedToken)) {
      const parsedUser = parseUserFromToken(savedToken);
      setUser(parsedUser);
      setAccessToken(savedToken);

      if (parsedUser?.collegeId && !localStorage.getItem(STORAGE_KEYS.COLLEGE_ID)) {
        localStorage.setItem(STORAGE_KEYS.COLLEGE_ID, parsedUser.collegeId);
      }
    } else if (IS_PREVIEW_MODE) {
      setUser(MOCK_USER);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      setUser(null);
      setAccessToken(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (userId, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(userId, password);

      if (data && data.jwtToken) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.jwtToken);
        setAccessToken(data.jwtToken);

        if (data.refreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
          setRefreshToken(data.refreshToken);
        }

        const parsedUser = parseUserFromToken(data.jwtToken);
        setUser(parsedUser);

        if (parsedUser?.collegeId) {
          localStorage.setItem(STORAGE_KEYS.COLLEGE_ID, parsedUser.collegeId);
        }

        return { success: true, user: parsedUser };
      }
      return { success: false, message: data?.message || 'Login failed' };
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        const previewUser = { ...MOCK_USER, userId: userId || MOCK_USER.userId };
        setUser(previewUser);
        return { success: true, user: previewUser };
      }
      const message = error.response?.data?.message || 'Invalid credentials or server error';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.COLLEGE_ID);
      localStorage.removeItem(STORAGE_KEYS.COLLEGE_NAME);
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      window.location.href = '/login';
    }
  };

  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    const cleanRole = role.replace(/^ROLE_/, '');
    return user.roles.some((r) => r === role || r === cleanRole || r === `ROLE_${cleanRole}`);
  };

  const hasAnyRole = (roles = []) => {
    if (!user || !user.roles) return false;
    return roles.some((role) => hasRole(role));
  };

  const PERMISSION_ALIASES = {
    MANAGE_CLASSES: ['MANAGE_CLASSES', 'CREATE_CLASS', 'UPDATE_CLASS', 'CREATE_COURSE', 'CREATE_BRANCH'],
    PUBLISH_EXAM: ['PUBLISH_EXAM', 'CREATE_EXAM', 'PUBLISH_RESULT', 'ENTER_MARKS'],
    SCHEDULE_EXAM: ['SCHEDULE_EXAM', 'CREATE_EXAM'],
    POST_NOTICE: ['POST_NOTICE', 'CREATE_NOTICE'],
    TAKE_ATTENDANCE: ['TAKE_ATTENDANCE', 'MARK_ATTENDANCE', 'CREATE_ATTENDANCE'],
    VIEW_MY_ATTENDANCE: ['VIEW_MY_ATTENDANCE', 'VIEW_ATTENDANCE', 'GET_ATTENDANCE'],
    VIEW_EXAMS: ['VIEW_EXAMS', 'VIEW_EXAM', 'GET_EXAM'],
    VIEW_RESULTS: ['VIEW_RESULTS', 'VIEW_MARKS', 'GET_EXAM_RESULT'],
    CHAT_ACCESS: ['CHAT_ACCESS', 'SEND_MESSAGE', 'VIEW_MESSAGE', 'VIEW_CONVERSATION'],
    VIEW_NOTICES: ['VIEW_NOTICES', 'VIEW_NOTICE', 'GET_NOTICE'],
    VIEW_SUBJECTS: ['VIEW_SUBJECTS', 'VIEW_SUBJECT', 'GET_SUBJECT'],
    VERIFY_FEE_PAYMENT: ['VERIFY_FEE_PAYMENT', 'UPDATE_FEES', 'COLLECT_FEES'],
    MANAGE_FEE_WINDOWS: ['MANAGE_FEE_WINDOWS', 'UPDATE_FEES', 'COLLECT_FEES'],
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    const candidates = PERMISSION_ALIASES[permission] || [permission];
    return candidates.some((cand) => user.permissions.includes(cand));
  };

  const hasAnyPermission = (permissions = []) => {
    if (!user || !user.permissions) return false;
    return permissions.some((permission) => hasPermission(permission));
  };

  const requestOtp = async (userId) => {
    try {
      const data = await authService.forgotPasswordAndSendOtp(userId);
      return { success: true, message: data?.message || 'OTP sent successfully' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP. Please check User ID.',
      };
    }
  };

  const verifyOtp = async (userId, otp) => {
    try {
      const data = await authService.verifyOtp(userId, otp);
      return { success: true, message: data?.message || 'OTP verified successfully' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid or expired OTP.',
      };
    }
  };

  const resetPassword = async (userId, newPassword) => {
    try {
      const data = await authService.resetPassword(userId, newPassword);
      return { success: true, message: data?.message || 'Password reset successfully' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password.',
      };
    }
  };

  const isMainAdmin = hasRole(USER_ROLES.MAIN_ADMIN) || hasRole(USER_ROLES.SUPER_ADMIN);
  const isCollegeAdmin = hasRole(USER_ROLES.COLLEGE_ADMIN);
  const isTeacher = hasRole(USER_ROLES.TEACHER);
  const isStudent = hasRole(USER_ROLES.STUDENT);

  const switchPreviewRole = (roleType) => {
    if (roleType === 'STUDENT') {
      setUser(MOCK_STUDENT_USER);
    } else if (roleType === 'TEACHER') {
      setUser(MOCK_TEACHER_USER);
    } else {
      setUser(MOCK_ADMIN_USER);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        requestOtp,
        verifyOtp,
        resetPassword,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAnyPermission,
        isMainAdmin,
        isCollegeAdmin,
        isTeacher,
        isStudent,
        switchPreviewRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
