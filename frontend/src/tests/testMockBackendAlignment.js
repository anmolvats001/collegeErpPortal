/**
 * Automated Verification Script: Test Mock Data Alignment with Backend Models
 * Run with: node src/tests/testMockBackendAlignment.js
 */

import {
  MOCK_ADMIN_USER,
  MOCK_TEACHER_USER,
  MOCK_STUDENT_USER,
  MOCK_PERMISSIONS,
  MOCK_ROLES,
  MOCK_ROLE_PERMISSIONS,
  MOCK_SYSTEM_MODULES,
  MOCK_COLLEGES,
  MOCK_COURSES,
  MOCK_BRANCHES,
  MOCK_CLASSES,
  MOCK_SUBJECTS,
  MOCK_CLASS_SUBJECTS,
  MOCK_TEACHERS,
  MOCK_STUDENTS,
  MOCK_STUDENT_CLASSES,
  MOCK_TEACHER_SUBJECTS,
  MOCK_ATTENDANCE_SESSIONS,
  MOCK_ATTENDANCE_RECORDS,
  MOCK_EXAMS,
  MOCK_EXAM_RESULTS,
  MOCK_NOTICES,
  MOCK_FEES,
  MOCK_FEE_PAYMENTS,
  MOCK_FEE_WINDOWS,
  MOCK_ADMISSION_APPLICATIONS,
  MOCK_ADMISSION_DOCUMENTS,
} from '../utils/mockData.js';
import { API_ENDPOINTS } from '../utils/constants.js';

let passedChecks = 0;
let totalChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  PASS: ${message}`);
  } else {
    console.error(`  FAIL: ${message}`);
    process.exitCode = 1;
  }
}

console.log('\n======================================================');
console.log('--- 1. BACKEND PERMISSION INITIALIZER ALIGNMENT ---');
console.log('======================================================');

const backendCanonicalPermissions = [
  // User
  'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'VIEW_USER', 'VIEW_ALL_USER', 'VIEW_ALL_COLLEGE_USER', 'DELETE_ALL_COLLEGE_USERS',
  // Role
  'CREATE_ROLE', 'UPDATE_ROLE', 'DELETE_ROLE', 'VIEW_ROLE', 'ASSIGN_ROLE', 'REMOVE_ROLE',
  // Attendance
  'MARK_ATTENDANCE', 'EDIT_ATTENDANCE', 'VIEW_ATTENDANCE', 'DELETE_ATTENDANCE',
  // Classes
  'CREATE_CLASS', 'UPDATE_CLASS', 'DELETE_CLASS', 'VIEW_CLASS', 'TAKE_CLASS',
  // Timetable
  'CREATE_TIMETABLE', 'UPDATE_TIMETABLE', 'DELETE_TIMETABLE', 'VIEW_TIMETABLE',
  // Exams
  'CREATE_EXAM', 'UPDATE_EXAM', 'DELETE_EXAM', 'VIEW_EXAM', 'ENTER_MARKS', 'UPDATE_MARKS', 'VIEW_MARKS', 'PUBLISH_RESULT',
  // Assignments
  'CREATE_ASSIGNMENT', 'UPDATE_ASSIGNMENT', 'DELETE_ASSIGNMENT', 'VIEW_ASSIGNMENT', 'SUBMIT_ASSIGNMENT', 'GRADE_ASSIGNMENT',
  // Notice
  'CREATE_NOTICE', 'UPDATE_NOTICE', 'DELETE_NOTICE', 'VIEW_NOTICE',
  // Messaging
  'SEND_MESSAGE', 'VIEW_MESSAGE', 'DELETE_MESSAGE',
  // Events
  'CREATE_EVENT', 'UPDATE_EVENT', 'DELETE_EVENT', 'VIEW_EVENT',
  // Library
  'ADD_BOOK', 'UPDATE_BOOK', 'DELETE_BOOK', 'VIEW_BOOK', 'ISSUE_BOOK', 'RETURN_BOOK',
  // Hostel
  'ALLOCATE_ROOM', 'UPDATE_ROOM', 'VIEW_ROOM', 'VACATE_ROOM',
  // Fees
  'COLLECT_FEES', 'UPDATE_FEES', 'VIEW_FEES',
  // Leave
  'APPLY_LEAVE', 'APPROVE_LEAVE', 'REJECT_LEAVE', 'VIEW_LEAVE',
  // Reports
  'VIEW_REPORT', 'EXPORT_REPORT',
  // Profile
  'VIEW_PROFILE', 'UPDATE_PROFILE',
  // Settings
  'VIEW_SETTINGS', 'UPDATE_SETTINGS',
  // Endpoints specific
  'CREATE_ATTENDANCE', 'CREATE_BRANCH', 'CREATE_CALL', 'CREATE_CLASS_SUBJECT', 'CREATE_CONVERSATION',
  'CREATE_CONVERSATION_MEMBER', 'CREATE_COURSE', 'CREATE_EXAM_RESULT', 'CREATE_STUDENT', 'CREATE_STUDENT_CLASS',
  'CREATE_SUBJECT', 'CREATE_TEACHER', 'CREATE_TEACHER_SUBJECT', 'DELETE_BRANCH', 'DELETE_CLASS_SUBJECT',
  'DELETE_CONVERSATION', 'DELETE_CONVERSATION_MEMBER', 'DELETE_COURSE', 'DELETE_EXAM_RESULT', 'DELETE_STUDENT',
  'DELETE_STUDENT_CLASS', 'DELETE_SUBJECT', 'DELETE_TEACHER', 'DELETE_TEACHER_SUBJECT', 'END_CALL',
  'GET_ALL_COLLEGE_COURSE', 'GET_ASSIGNMENT', 'GET_ATTENDANCE', 'GET_BRANCH', 'GET_CLASS',
  'GET_CLASS_SUBJECT', 'GET_COURSE', 'GET_EXAM', 'GET_EXAM_RESULT', 'GET_NOTICE',
  'GET_STUDENT', 'GET_STUDENT_CLASS', 'GET_SUBJECT', 'GET_TEACHER', 'GET_TEACHER_SUBJECT',
  'MARK_ASSIGNMENT', 'UPDATE_ATTENDANCE', 'UPDATE_BRANCH', 'UPDATE_CLASS_SUBJECT', 'UPDATE_CONVERSATION',
  'UPDATE_CONVERSATION_MEMBER', 'UPDATE_COURSE', 'UPDATE_EXAM_RESULT', 'UPDATE_STUDENT', 'UPDATE_STUDENT_CLASS',
  'UPDATE_SUBJECT', 'UPDATE_TEACHER', 'UPDATE_TEACHER_SUBJECT', 'VIEW_CALL', 'VIEW_CONVERSATION',
  'VIEW_CONVERSATION_MEMBER', 'CREATE_ADMISSION', 'VIEW_ADMISSION', 'UPDATE_ADMISSION', 'DELETE_ADMISSION',
  'APPROVE_ADMISSION', 'REJECT_ADMISSION', 'VIEW_ADMISSION_DOCUMENT', 'UPLOAD_ADMISSION_DOCUMENT',
  'VERIFY_ADMISSION_DOCUMENT', 'REJECT_ADMISSION_DOCUMENT', 'GET_PERMISSION', 'ASSIGN_PERMISSION', 'REMOVE_PERMISSION'
];

const mockPermCodes = new Set(MOCK_PERMISSIONS.map((p) => p.permissionCode));
let missingPerms = backendCanonicalPermissions.filter((p) => !mockPermCodes.has(p));

assert(missingPerms.length === 0, `All ${backendCanonicalPermissions.length} backend permissions exist in MOCK_PERMISSIONS. Missing: ${missingPerms.join(', ')}`);

console.log('\n======================================================');
console.log('--- 2. BACKEND MODULE DATA INITIALIZER ALIGNMENT ---');
console.log('======================================================');

const backendModules = [
  'ATTENDANCE', 'LIBRARY', 'HOSTEL', 'EXAM', 'ADMISSION', 'TIMETABLE', 'FACULTY', 'NOTICE', 'EVENT',
  'CORE', 'CLASS', 'FEE', 'NOTIFICATION', 'FILES'
];

const mockModuleCodes = new Set(MOCK_SYSTEM_MODULES.map((m) => m.moduleCode));
let missingModules = backendModules.filter((m) => !mockModuleCodes.has(m));

assert(missingModules.length === 0, `All backend modules exist in MOCK_SYSTEM_MODULES. Missing: ${missingModules.join(', ')}`);

console.log('\n======================================================');
console.log('--- 3. MOCK USER PERMISSIONS & ROLES AUDIT ---');
console.log('======================================================');

// Admin User
assert(MOCK_ADMIN_USER.roles.includes('ROLE_MAIN_ADMIN') || MOCK_ADMIN_USER.roles.includes('MAIN_ADMIN'), 'Admin user has MAIN_ADMIN role');
assert(MOCK_ADMIN_USER.permissions.includes('CREATE_USER'), 'Admin user has CREATE_USER');
assert(MOCK_ADMIN_USER.permissions.includes('CREATE_CLASS'), 'Admin user has CREATE_CLASS');
assert(MOCK_ADMIN_USER.permissions.includes('MANAGE_CLASSES'), 'Admin user retains MANAGE_CLASSES alias');

// Teacher User
assert(MOCK_TEACHER_USER.roles.includes('ROLE_TEACHER') || MOCK_TEACHER_USER.roles.includes('TEACHER'), 'Teacher user has TEACHER role');
assert(MOCK_TEACHER_USER.permissions.includes('MARK_ATTENDANCE'), 'Teacher user has MARK_ATTENDANCE');
assert(MOCK_TEACHER_USER.permissions.includes('CREATE_ASSIGNMENT'), 'Teacher user has CREATE_ASSIGNMENT');
assert(MOCK_TEACHER_USER.permissions.includes('CREATE_EXAM'), 'Teacher user has CREATE_EXAM');
assert(!MOCK_TEACHER_USER.permissions.includes('CREATE_USER'), 'Teacher user does NOT have CREATE_USER');

// Student User
assert(MOCK_STUDENT_USER.roles.includes('ROLE_STUDENT') || MOCK_STUDENT_USER.roles.includes('STUDENT'), 'Student user has STUDENT role');
assert(MOCK_STUDENT_USER.permissions.includes('VIEW_PROFILE'), 'Student user has VIEW_PROFILE');
assert(MOCK_STUDENT_USER.permissions.includes('VIEW_ATTENDANCE'), 'Student user has VIEW_ATTENDANCE');
assert(MOCK_STUDENT_USER.permissions.includes('SUBMIT_ASSIGNMENT'), 'Student user has SUBMIT_ASSIGNMENT');
assert(!MOCK_STUDENT_USER.permissions.includes('CREATE_CLASS'), 'Student user does NOT have CREATE_CLASS');
assert(!MOCK_STUDENT_USER.permissions.includes('MARK_ATTENDANCE'), 'Student user does NOT have MARK_ATTENDANCE');

console.log('\n======================================================');
console.log('--- 4. ENTITY FIELDS AUDIT AGAINST BACKEND DTOS ---');
console.log('======================================================');

// Course: CourseResponse
const courseReqFields = ['courseId', 'courseName', 'courseCode', 'description', 'durationInYears', 'totalSemesters', 'active'];
const courseValid = MOCK_COURSES.every((c) => courseReqFields.every((f) => f in c));
assert(courseValid, 'All MOCK_COURSES match CourseResponse schema');

// Branch: BranchResponse
const branchReqFields = ['branchId', 'branchName', 'branchCode', 'branchDescription'];
const branchValid = MOCK_BRANCHES.every((b) => branchReqFields.every((f) => f in b));
assert(branchValid, 'All MOCK_BRANCHES match BranchResponse schema');

// Class: ClassResponse
const classReqFields = ['classId', 'className', 'section', 'branchName', 'semester', 'academicYear'];
const classValid = MOCK_CLASSES.every((cls) => classReqFields.every((f) => f in cls));
assert(classValid, 'All MOCK_CLASSES match ClassResponse schema');

// Subject: SubjectResponse
const subjectReqFields = ['subjectId', 'subjectName', 'subjectCode', 'description', 'credits', 'semester', 'courseId', 'active'];
const subjectValid = MOCK_SUBJECTS.every((s) => subjectReqFields.every((f) => f in s));
assert(subjectValid, 'All MOCK_SUBJECTS match SubjectResponse schema');

// ClassSubject: ClassSubjectResponse
const csReqFields = ['classSubjectId', 'classId', 'className', 'section', 'subjectId', 'subjectName', 'subjectCode', 'semester', 'active'];
const csValid = MOCK_CLASS_SUBJECTS.every((cs) => csReqFields.every((f) => f in cs));
assert(csValid, 'All MOCK_CLASS_SUBJECTS match ClassSubjectResponse schema');

// Student: StudentResponse
const studentReqFields = [
  'studentId', 'userId', 'enrollmentNumber', 'rollNumber', 'firstName', 'lastName',
  'email', 'phoneNumber', 'gender', 'bloodGroup', 'guardianName', 'guardianPhoneNumber',
  'address', 'admissionDate', 'dateOfBirth', 'profilePhoto', 'active'
];
const studentValid = MOCK_STUDENTS.every((st) => studentReqFields.every((f) => f in st));
assert(studentValid, 'All MOCK_STUDENTS match StudentResponse schema (including dateOfBirth & profilePhoto)');

// Teacher: TeacherResponse
const teacherReqFields = [
  'teacherId', 'userId', 'employeeId', 'firstName', 'lastName', 'email', 'phoneNumber',
  'designation', 'department', 'joiningDate', 'qualification', 'active'
];
const teacherValid = MOCK_TEACHERS.every((t) => teacherReqFields.every((f) => f in t));
assert(teacherValid, 'All MOCK_TEACHERS match TeacherResponse schema');

// StudentClass: StudentClassResponse
const scReqFields = [
  'studentClassId', 'studentId', 'studentName', 'enrollmentNumber', 'classId',
  'className', 'section', 'branchId', 'branchName', 'academicYear', 'semester', 'rollNumber', 'active'
];
const scValid = MOCK_STUDENT_CLASSES.every((sc) => scReqFields.every((f) => f in sc));
assert(scValid, 'All MOCK_STUDENT_CLASSES match StudentClassResponse schema');

// TeacherSubject: TeacherSubjectResponse
const tsReqFields = [
  'teacherSubjectId', 'teacherId', 'teacherName', 'employeeId', 'classSubjectId',
  'classId', 'className', 'section', 'subjectId', 'subjectName', 'subjectCode', 'semester', 'active'
];
const tsValid = MOCK_TEACHER_SUBJECTS.every((ts) => tsReqFields.every((f) => f in ts));
assert(tsValid, 'All MOCK_TEACHER_SUBJECTS match TeacherSubjectResponse schema');

// AttendanceSession: AttendanceSessionResponse
const attSessReqFields = [
  'attendanceSessionId', 'teacherSubjectId', 'classSubjectId', 'teacherId',
  'classId', 'subjectId', 'subjectName', 'className', 'section', 'attendanceDate', 'startTime', 'endTime'
];
const attSessValid = MOCK_ATTENDANCE_SESSIONS.every((as) => attSessReqFields.every((f) => f in as));
assert(attSessValid, 'All MOCK_ATTENDANCE_SESSIONS match AttendanceSessionResponse schema');

// AttendanceRecord: AttendanceResponse
const attRecReqFields = [
  'attendanceId', 'attendanceSessionId', 'studentClassId', 'studentId',
  'studentName', 'rollNumber', 'classSubjectId', 'subjectName', 'attendanceDate', 'startTime', 'endTime', 'status'
];
const attRecValid = MOCK_ATTENDANCE_RECORDS.every((ar) => attRecReqFields.every((f) => f in ar));
assert(attRecValid, 'All MOCK_ATTENDANCE_RECORDS match AttendanceResponse schema');

// Exam: ExamResponse
const examReqFields = [
  'examId', 'examName', 'examType', 'classSubjectId', 'teacherSubjectId',
  'examDate', 'startTime', 'endTime', 'maxMarks', 'passingMarks', 'status'
];
const validExamTypes = ['QUIZ', 'MIDTERM', 'ENDTERM', 'PRACTICAL', 'INTERNAL', 'VIVA', 'OTHER'];
const validExamStatuses = ['SCHEDULED', 'COMPLETED', 'CANCELLED'];
const examValid = MOCK_EXAMS.every((e) =>
  examReqFields.every((f) => f in e) &&
  validExamTypes.includes(e.examType) &&
  validExamStatuses.includes(e.status)
);
assert(examValid, 'All MOCK_EXAMS match ExamResponse schema & backend enums');

// ExamResult: ExamResultResponse
const erReqFields = ['resultId', 'examId', 'studentClassId', 'marks', 'maxMarks', 'passed'];
const erValid = MOCK_EXAM_RESULTS.every((er) => erReqFields.every((f) => f in er));
assert(erValid, 'All MOCK_EXAM_RESULTS match ExamResultResponse schema');

// Notice: NoticeResponse
const noticeReqFields = ['noticeId', 'title', 'description', 'publishDate', 'expiryDate', 'active'];
const noticeValid = MOCK_NOTICES.every((n) => noticeReqFields.every((f) => f in n));
assert(noticeValid, 'All MOCK_NOTICES match NoticeResponse schema');

// Fees: FeeResponse
const feeReqFields = ['id', 'collegeId', 'studentUserId', 'studentName', 'courseId', 'courseName', 'branchId', 'branchName', 'totalFee', 'paidAmount', 'remainingAmount', 'status'];
const feeValid = MOCK_FEES.every((fee) => feeReqFields.every((f) => f in fee));
assert(feeValid, 'All MOCK_FEES match FeeResponse schema');

// Fee Payments: FeePaymentResponse
const feePayReqFields = ['id', 'studentUserId', 'amount', 'paymentMethod', 'transactionIds', 'proofImages', 'remarks', 'status', 'submittedAt'];
const feePayValid = MOCK_FEE_PAYMENTS.every((fp) => feePayReqFields.every((f) => f in fp));
assert(feePayValid, 'All MOCK_FEE_PAYMENTS match FeePaymentResponse schema');

// Fee Form Windows: FeeFormWindowResponse
const feeWinReqFields = ['id', 'formName', 'openAt', 'closeAt', 'active', 'createdBy'];
const feeWinValid = MOCK_FEE_WINDOWS.every((fw) => feeWinReqFields.every((f) => f in fw));
assert(feeWinValid, 'All MOCK_FEE_WINDOWS match FeeFormWindowResponse schema');

// Admission Applications: AdmissionApplicationResponse & AdmissionStatus enum
const validAdmissionStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
const admReqFields = ['id', 'applicationNumber', 'collegeCode', 'applicantName', 'email', 'phoneNumber', 'gender', 'courseId', 'courseName', 'branchId', 'branchName', 'status', 'submittedAt'];
const admValid = MOCK_ADMISSION_APPLICATIONS.every((aa) =>
  admReqFields.every((f) => f in aa) && validAdmissionStatuses.includes(aa.status)
);
assert(admValid, 'All MOCK_ADMISSION_APPLICATIONS match AdmissionApplicationResponse schema & AdmissionStatus enum');

// Admission Documents: DocumentResponse
const docReqFields = ['id', 'applicationId', 'documentType', 'fileName', 'fileUrl', 'uploadedAt', 'verified'];
const docValid = MOCK_ADMISSION_DOCUMENTS.every((d) => docReqFields.every((f) => f in d));
assert(docValid, 'All MOCK_ADMISSION_DOCUMENTS match DocumentResponse schema');

// Admission API Endpoints & Permissions Alignment
const admEndpoints = ['BASE', 'APPLICATIONS', 'DASHBOARD', 'PUBLIC_APPLY_CODE', 'PUBLIC_APPLY_ID', 'PUBLIC_TRACK', 'DOCUMENTS'];
const hasAllAdmEndpoints = admEndpoints.every((ep) => ep in API_ENDPOINTS.ADMISSION);
assert(hasAllAdmEndpoints, 'API_ENDPOINTS.ADMISSION contains all required endpoints including PUBLIC_TRACK and DOCUMENTS');

const adminHasDocPerms = ['VIEW_ADMISSION_DOCUMENT', 'UPLOAD_ADMISSION_DOCUMENT', 'VERIFY_ADMISSION_DOCUMENT'].every(
  (p) => MOCK_ADMIN_USER.permissions.includes(p)
);
assert(adminHasDocPerms, 'MOCK_ADMIN_USER has canonical admission document verification permissions');

// Fee API Endpoints & Permissions Alignment
const feeEndpoints = ['BASE', 'MY', 'FORMS', 'FORM_STATUS', 'PAYMENTS', 'MY_PAYMENTS'];
const hasAllFeeEndpoints = feeEndpoints.every((ep) => ep in API_ENDPOINTS.FEE);
assert(hasAllFeeEndpoints, 'API_ENDPOINTS.FEE contains all required endpoints: BASE, MY, FORMS, FORM_STATUS, PAYMENTS, MY_PAYMENTS');

const adminHasFeePerms = [
  'CREATE_FEE', 'UPDATE_FEE', 'VIEW_FEE',
  'OPEN_FEE_FORM', 'UPDATE_FEE_FORM', 'VIEW_FEE_FORM',
  'APPROVE_FEE_FORM', 'REJECT_FEE_FORM',
].every((p) => MOCK_ADMIN_USER.permissions.includes(p));
assert(adminHasFeePerms, 'MOCK_ADMIN_USER has canonical fee & window management authorities');

const studentHasFeePerms = ['VIEW_FEE', 'VIEW_FEE_FORM'].every(
  (p) => MOCK_STUDENT_USER.permissions.includes(p)
);
assert(studentHasFeePerms, 'MOCK_STUDENT_USER has VIEW_FEE and VIEW_FEE_FORM authorities');

const validPaymentMethods = ['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'ONLINE'];
const allPaymentsValidMethod = MOCK_FEE_PAYMENTS.every((p) => validPaymentMethods.includes(p.paymentMethod));
assert(allPaymentsValidMethod, 'All MOCK_FEE_PAYMENTS have valid PaymentMethod enums (CASH, UPI, CARD, BANK_TRANSFER, ONLINE)');

// Cloudinary & Notification API Endpoints Alignment
assert(API_ENDPOINTS.FILES?.BASE === '/api/files', 'API_ENDPOINTS.FILES.BASE routes to /api/files');
assert(API_ENDPOINTS.NOTIFICATIONS?.BASE === '/api/notifications', 'API_ENDPOINTS.NOTIFICATIONS.BASE routes to /api/notifications');


console.log('\n======================================================');
console.log(`TOTAL CHECKS: ${totalChecks} | PASSED: ${passedChecks} | FAILED: ${totalChecks - passedChecks}`);
console.log('======================================================\n');

if (passedChecks === totalChecks) {
  console.log('ALL MOCK DATA AND BACKEND SCHEMAS ARE 100% ALIGNED!\n');
} else {
  process.exit(1);
}
