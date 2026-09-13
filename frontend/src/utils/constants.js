export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'erp_access_token',
  REFRESH_TOKEN: 'erp_refresh_token',
  COLLEGE_ID: 'erp_college_id',
  COLLEGE_NAME: 'erp_college_name',
  USER_DATA: 'erp_user_data',
};

export const USER_ROLES = {
  MAIN_ADMIN: 'ROLE_MAIN_ADMIN',
  SUPER_ADMIN: 'ROLE_MAIN_ADMIN',
  COLLEGE_ADMIN: 'ROLE_COLLEGE_ADMIN',
  TEACHER: 'ROLE_TEACHER',
  STUDENT: 'ROLE_STUDENT',
};

export const API_ENDPOINTS = {
  GATEWAY_BASE: 'http://localhost:8080',
  CORE: {
    AUTH: '/api/v1/core/auth',
    USERS: '/api/v1/core/users',
    COLLEGES: '/api/v1/core/college',
    ROLES: '/api/v1/core/roles',
    PERMISSIONS: '/api/v1/core/permission',
    ROLE_PERMISSIONS: '/api/v1/core/rolePermission',
    MODULES: '/api/v1/core/module',
    COLLEGE_MODULES: '/api/v1/core/college-modules',
  },
  CLASS: {
    BASE: '/api/v1/class',
    COURSES: '/api/v1/class/course',
    BRANCHES: '/api/v1/class/branch',
    STUDENTS: '/api/v1/class/student',
    TEACHERS: '/api/v1/class/teacher',
    CLASSES: '/api/v1/class/classes',
    SUBJECTS: '/api/v1/class/subject',
    CLASS_SUBJECTS: '/api/v1/class/class-subject',
    STUDENT_CLASSES: '/api/v1/class/student-class',
    TEACHER_SUBJECTS: '/api/v1/class/teacher-subject',
    ATTENDANCE: '/api/v1/class/attendance',
    ASSIGNMENTS: '/api/v1/class/assignment',
    EXAMS: '/api/v1/class/exam',
    EXAM_RESULTS: '/api/v1/class/exam-result',
    NOTICES: '/api/v1/class/notice',
    CONVERSATIONS: '/api/v1/class/conversation',
    CONVERSATION_MEMBERS: '/api/v1/class/conversation-members',
    MESSAGES: '/api/v1/class/messages',
    CALLS: '/api/v1/class/calls',
  },
  ADMISSION: {
    BASE: '/api/v1/admission',
    APPLICATIONS: '/api/v1/admission/applications',
    DASHBOARD: '/api/v1/admission/dashboard',
    PUBLIC_APPLY_CODE: '/api/v1/admission/public/code',
    PUBLIC_APPLY_ID: '/api/v1/admission/public/id',
    PUBLIC_TRACK: '/api/v1/admission/public/track',
    DOCUMENTS: '/api/v1/admission/documents',
  },
  FEE: {
    BASE: '/api/v1/fee',
    MY: '/api/v1/fee/my',
    FORMS: '/api/v1/fee/forms',
    FORM_STATUS: '/api/v1/fee/forms/status',
    PAYMENTS: '/api/v1/fee/payments',
    MY_PAYMENTS: '/api/v1/fee/payments/my',
  },
  FILES: {
    BASE: '/api/files',
  },
  NOTIFICATIONS: {
    BASE: '/api/notifications',
  },
};
