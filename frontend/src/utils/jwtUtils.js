import { jwtDecode } from 'jwt-decode';

export const decodeJwtToken = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeJwtToken(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

export const parseUserFromToken = (token) => {
  const decoded = decodeJwtToken(token);
  if (!decoded) return null;

  return {
    userId: decoded.sub || decoded.userId || 'Unknown',
    roles: decoded.roles || [],
    permissions: decoded.permissions || [],
    modules: decoded.modules || [],
    collegeId: decoded.collegeId || null,
  };
};
