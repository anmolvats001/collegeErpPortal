import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { IS_PREVIEW_MODE, MOCK_COURSES } from '../utils/mockData';

export const courseService = {
  // Create a new academic degree course / program
  createCourse: async (courseData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CLASS.COURSES, courseData);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newCourse = {
          courseId: `crs-${Date.now().toString().slice(-4)}`,
          id: `crs-${Date.now().toString().slice(-4)}`,
          ...courseData,
          active: true,
        };
        MOCK_COURSES.unshift(newCourse);
        return newCourse;
      }
      throw err;
    }
  },

  // Get all courses for current tenant college
  getCoursesOfMyCollege: async () => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.COURSES}/college`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_COURSES;
      }
      throw err;
    }
  },

  // Get courses of a specific college by UUID
  getCoursesOfCollegeById: async (collegeId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.COURSES}/college/${collegeId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_COURSES.filter((c) => c.collegeId === collegeId || !c.collegeId);
      }
      throw err;
    }
  },

  // Search courses by name
  searchCourses: async (courseName) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.COURSES}/search`, {
        params: { courseName },
      });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const q = courseName.toLowerCase();
        return MOCK_COURSES.filter(
          (c) => c.courseName?.toLowerCase().includes(q) || c.courseCode?.toLowerCase().includes(q)
        );
      }
      throw err;
    }
  },

  // Get specific course by ID
  getCourse: async (courseId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASS.COURSES}/${courseId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return MOCK_COURSES.find((c) => c.courseId === courseId || c.id === courseId);
      }
      throw err;
    }
  },

  // Update course active status
  updateCourseActive: async (courseId, active) => {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.CLASS.COURSES}/active`, {
        courseId,
        active,
      });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const target = MOCK_COURSES.find((c) => c.courseId === courseId || c.id === courseId);
        if (target) target.active = active;
        return target || { courseId, active };
      }
      throw err;
    }
  },

  // Update course metadata (name, code, duration, semesters, description)
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.CLASS.COURSES}/${courseId}`,
        courseData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_COURSES.findIndex((c) => c.courseId === courseId || c.id === courseId);
        if (idx !== -1) {
          MOCK_COURSES[idx] = { ...MOCK_COURSES[idx], ...courseData };
          return MOCK_COURSES[idx];
        }
        return { courseId, ...courseData };
      }
      throw err;
    }
  },

  // Delete course
  deleteCourse: async (courseId) => {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.CLASS.COURSES}/${courseId}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = MOCK_COURSES.findIndex((c) => c.courseId === courseId || c.id === courseId);
        if (idx !== -1) MOCK_COURSES.splice(idx, 1);
        return { success: true, message: 'Course deleted successfully' };
      }
      throw err;
    }
  },
};

export default courseService;

