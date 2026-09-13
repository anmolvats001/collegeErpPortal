# 🚀 Multi-Tenant College ERP - Frontend Work Log & Roadmap

> [!NOTE]
> **PREVIEW / OFFLINE MODE IS CURRENTLY ACTIVE**:
> Since the backend microservices are not currently running locally, authentication barriers have been bypassed and mock data has been enabled so that every page and modal can be interactively previewed in the browser.
> See [`OFFLINE_PREVIEW_MODE.md`](file:///c:/Antigravity/MultiTenantFrontend/frontend/OFFLINE_PREVIEW_MODE.md) for details and how to switch back to live backend mode when ready (`IS_PREVIEW_MODE = false` in `src/utils/mockData.js`).

This document records the architecture, conventions, microservice mappings, completed modules, and upcoming steps so development can seamlessly resume anytime.

---

## 📌 1. System Architecture & Port Mapping

All frontend requests communicate through the **Spring Cloud API Gateway** running at `http://localhost:8080`.

| Microservice | Internal Port | Gateway Route Prefix | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `8080` | `/api/...` | Single entry point & tenant routing |
| **Core Service** | `8082` | `/api/v1/core/**` | Auth, Users, Roles, Permissions, Colleges, Modules |
| **Class Service** | `8083` | `/api/v1/class/**` | Students, Teachers, Classes, Subjects, Attendance, Exams, Chat |
| **Admission Service**| `8084` | `/api/v1/admission/**`| Public applications, application reviews, approvals |
| **Fee Service** | `8085` | `/api/v1/fee/**` | Fee accounts, fee windows, payment submission & verification |
| **Notification** | `8086` | `/api/notifications/**`| Kafka-driven email and system notifications |
| **Cloudinary** | `8087` | `/api/files/**` | Document and file uploads |

---

## 🔐 2. Authentication & Multi-Tenancy Protocol

Every authenticated HTTP request from the frontend includes two essential headers:
1. **`Authorization: Bearer <jwtToken>`** - JWT containing `sub` (userId), `roles`, `permissions`, `modules`, and `collegeId`.
2. **`CollegeId: <activeCollegeUUID>`** - Required for multi-tenant data isolation.

JWT Tokens are stored in `localStorage` alongside active tenant metadata. The `apiClient` automatically intercepts outgoing requests to inject these headers and handles silent token refreshes on `401 Unauthorized`.

---

## 📂 3. Directory Structure

```text
frontend/
├── PROJECT_ROADMAP.md          # This tracking file
├── index.html                  # HTML entry point with Google Fonts
├── package.json                # React 18, React Router v6, Axios, Lucide Icons, Vite
├── vite.config.js              # Dev proxy to http://localhost:8080
└── src/
    ├── main.jsx                # Application root mount
    ├── App.jsx                 # Route definitions and provider tree
    ├── index.css               # Design system tokens and styling
    ├── components/
    │   ├── common/             # Reusable UI primitives (Button, Input, Badge, Table, Modal, StatCard, Loader)
    │   ├── layout/             # DashboardLayout, Sidebar, Navbar
    │   └── auth/               # ProtectedRoute, RoleGuard
    ├── context/
    │   ├── AuthContext.jsx     # User authentication and permission checks
    │   └── TenantContext.jsx   # College tenant state and switcher
    ├── hooks/
    │   ├── useAuth.js          # Hook for AuthContext
    │   └── useTenant.js        # Hook for TenantContext
    ├── pages/
    │   ├── auth/               # LoginPage, ForgotPasswordPage
    │   ├── dashboard/          # DashboardOverviewPage (role-adaptive)
    │   ├── colleges/           # CollegeManagementPage (Super Admin)
    │   ├── admissions/         # PublicAdmissionPage, AdmissionManagementPage
    │   ├── academics/          # Classes, Subjects, Teachers, Students
    │   ├── attendance/         # Attendance sessions and marking
    │   ├── fees/               # Fee accounts and payment approvals
    │   └── common/             # NotFoundPage, UnauthorizedPage
    ├── services/
    │   ├── apiClient.js        # Axios instance with interceptors & refresh flow
    │   ├── authService.js      # Login, logout, refresh token, OTP
    │   ├── collegeService.js   # College CRUD and module bindings
    │   ├── classService.js     # Class, subject, teacher, student APIs
    │   ├── admissionService.js # Application submission & review APIs
    │   └── feeService.js       # Fee windows, accounts & payments APIs
    └── utils/
        ├── constants.js        # Storage keys, user roles, API route prefixes
        └── jwtUtils.js         # JWT decode helper (claims, expiration check)
```

---

## 🧭 4. Development Progress & Checklist

### Phase 1: Foundation & Scaffold ✅
- [x] Project initialized with React 18 + Vite (JSX)
- [x] Dependencies installed (`react-router-dom`, `axios`, `lucide-react`, `jwt-decode`, `tailwindcss@3`, `postcss`, `autoprefixer`)
- [x] Clean, scalable folder structure (`components`, `pages`, `context`, `services`, `hooks`, `utils`)
- [x] Institutional, humanly college design system built with **Tailwind CSS v3** (`tailwind.config.js` and `index.css`)
- [x] Centralized HTTP Client with automatic `Authorization` and `CollegeId` headers (`apiClient.js`)
- [x] `AuthContext` for login, token decode, logout, and role/permission checks
- [x] `TenantContext` for multi-college switching and tenant persistence
- [x] Protected routing with `ProtectedRoute` and `RoleGuard`
- [x] Core layout (`DashboardLayout`, `Sidebar`, `Navbar`)
- [x] Authentic College Portal `LoginPage` (with Official Notices, Helpdesk banner & Guidelines) & `DashboardOverviewPage`
- [x] Project roadmap and session resumption log (`PROJECT_ROADMAP.md`)

---

### Phase 2: Core Service Integration ⏳
#### Auth Module ✅
- [x] User Login with JWT & tenant claims decode (`/api/v1/core/auth/login`)
- [x] Transparent token refresh flow on 401 (`/api/v1/core/auth/refreshToken`)
- [x] Institutional sign-out with token invalidation (`/api/v1/core/auth/logout`)
- [x] OTP request dispatcher (`/api/v1/core/auth/forgotPasswordAndSendOtp`)
- [x] 6-digit OTP verification (`/api/v1/core/auth/verifyOtp`)
- [x] Password commit & reset (`/api/v1/core/auth/resetPassword`)
- [x] Dedicated 3-step Password Recovery UI (`/forgot-password`) with progress stepper

#### User Administration & Profile Module ✅
- [x] Provision Institutional User (`POST /api/v1/core/users`)
- [x] Self Profile retrieval & Contact updates (`GET /api/v1/core/users/me`, `PATCH /api/v1/core/users/byUser`)
- [x] Administrative User updates (`PATCH /api/v1/core/users/byAdmin`)
- [x] Tenant & Global User Listings (`GET /api/v1/core/users/college`, `GET /api/v1/core/users/all`)
- [x] Account Activation & Deactivation (`PATCH /api/v1/core/users/{userId}/activate`, `deactivate`)
- [x] User account deletion (`DELETE /api/v1/core/users/{userId}`)
- [x] In-portal password changes (`PATCH /api/v1/core/users/changePassword`)
- [x] Keyword search & validation (`GET /api/v1/core/users/search`, `GET /checkUser`)
- [x] User Directory UI (`/users`) with keyword filtering and modal forms
- [x] User Profile UI (`/profile`) with personal record editor

#### College & Module Management ✅
- [x] Super Admin: College registration and listing (`/api/v1/core/college`)
  - [x] `collegeService.js` connecting all 8 endpoints of `CollegeController.java`
  - [x] College Directory UI (`/colleges`) with real-time keyword search (name, code, university, city)
  - [x] Multi-field Autonomous College Registration modal with NAAC/standing details
  - [x] Institutional Profile and edit modal
  - [x] Tenant Context Switcher directly from the institutional directory
- [x] Dedicated Module Management & Architecture (`/modules`) ✅
  - [x] `moduleService.js` connecting `ModuleController.java` & `CollegeModuleController.java`
  - [x] Multi-Tenant Subscription Matrix with interactive quick-toggles per college per microservice
  - [x] Platform System Modules Catalog & "Register Platform Module" modal
  - [x] Module Distribution filtering: view all colleges holding an active subscription to any specific module
  - [x] Interactive confirmation modal before modifying microservice subscriptions
- [x] Common System & Tenant Infrastructure (`common`) ✅
  - [x] `TenantContext.jsx` with active module synchronization and `hasModule(code)` helper
  - [x] `ModuleGuard.jsx` for microservice route gating
  - [x] `ModuleNotEnabledPage.jsx` for unsubscribed module notification
  - [x] `TenantSelectorModal.jsx` integrated into top Navbar for quick campus switching
  - [x] `ErrorBoundary.jsx` catching runtime exceptions with university portal error fallback
  - [x] `ConfirmModal.jsx` and `AlertBanner.jsx` common primitives
  - [x] Dynamic Sidebar navigation gating matching college subscriptions

---

### Phase 3: Class Service Integration ⏳
#### Course & Branch Architecture ✅
- [x] Degree Programs / Courses (`/api/v1/class/course`)
  - [x] `courseService.js` mapping all 8 endpoints of `CourseController.java` (`/college`, `/college/{collegeId}`, `/search`, `/{courseId}`, `/active`, `PATCH /{courseId}`, `DELETE /{courseId}`)
  - [x] Degree Program registration modal (Name, Code, Duration, Semesters, Accreditation)
  - [x] Interactive status toggles and Program edit modals
- [x] Specialization Branches (`/api/v1/class/branch`)
  - [x] `branchService.js` mapping all 8 endpoints of `BranchController.java` (`/course/{courseId}`, `/{branchId}`, `/search`, `GET /`, `/active`, `PATCH /{branchId}`, `DELETE /{branchId}`)
  - [x] Add Branch modal with parent course binding
  - [x] Branch filtering by parent Degree Program
- [x] Academic Curriculum & Programs UI (`/academics`)
  - [x] Degree Programs catalog with connected discipline counts
  - [x] Specialization Branches directory with filter by program
  - [x] Academic Tree & Hierarchy Visualizer
  - [x] Protected with `ModuleGuard` for `CLASS` module subscription

#### Class Cohorts, Subjects & Curriculum Allocation ✅
- [x] Class Sections & Cohorts (`/api/v1/class/classes`)
  - [x] `classSectionService.js` mapping all 9 endpoints of `ClassController.java` (`createClass`, `getAllClasses`, `getClassesByBranch`, `getClassesByBranchAndSemester`, `getClassById`, `searchClasses`, `updateClass`, `updateClassActive`, `deleteClass`)
  - [x] Class Cohort Creation & Edition modal (Class Name, Section, Branch, Semester, Academic Year)
  - [x] Active/Suspended status toggle and deletion flows
- [x] Subject & Syllabus Catalog (`/api/v1/class/subject`)
  - [x] `subjectService.js` mapping all 9 endpoints of `SubjectController.java` (`createSubject`, `getAllSubjects`, `getSubject`, `getSubjectsOfCourse`, `getSubjectsOfCourseAndSemester`, `searchSubjects`, `updateSubject`, `updateSubjectActive`, `deleteSubject`)
  - [x] Curriculum Subject registration modal (Subject Name, Code, Credits, Semester, Course)
  - [x] Course-level and semester-level subject catalog management
- [x] Class-Subject Curriculum Allocation Matrix (`/api/v1/class/class-subject`)
  - [x] `classSubjectService.js` mapping all 7 endpoints of `ClassSubjectController.java` (`createClassSubject`, `getAllClassSubjects`, `getClassSubject`, `getSubjectsOfClass`, `getClassesOfSubject`, `updateActiveStatus`, `deleteClassSubject`)
  - [x] Subject to Class Section mapping modal with duplicate prevention
  - [x] Allocation Matrix UI with status toggles and unmapping confirmation
- [x] Integrated Management Portal (`/classes`, `/subjects`, `/class-subjects`)
  - [x] Dynamic URL synchronization and tab navigation (Class Sections, Subject Catalog, Allocation Matrix)
  - [x] Institutional multi-tenant scoping matching active college
  - [x] Seamless mock fallback supporting offline browser preview

#### Students, Faculty & Teaching Allocations ✅
- [x] Student Directory & Profiles (`/api/v1/class/student`)
  - [x] `studentService.js` mapping all 8 endpoints of `StudentController.java` (`createStudent`, `getAllStudents`, `getStudent`, `getStudentByUserId`, `searchStudents`, `updateStudent`, `updateStudentActive`, `deleteStudent`)
  - [x] Register Student modal (Enrollment No, Roll No, Guardian info, Blood Group, Contact details)
  - [x] Student Directory UI (`/students`) with keyword search and active status toggle
- [x] Student-Class Cohort Enrollments (`/api/v1/class/student-class`)
  - [x] `studentClassService.js` mapping all 9 endpoints of `StudentClassController.java` (`createStudentClass`, `getAllStudentClasses`, `getStudentClass`, `getClassesOfStudent`, `getStudentsOfClass`, `getStudentsOfClassAndSemester`, `updateStudentClass`, `updateActiveStatus`, `deleteStudentClass`)
  - [x] Enroll Student in Class modal with section picker and semester selection
  - [x] Class Roster table with unenroll confirmation and active toggle
- [x] Faculty Directory & Credentials (`/api/v1/class/teacher`)
  - [x] `teacherService.js` mapping all 8 endpoints of `TeacherController.java` (`createTeacher`, `getAllTeachers`, `getTeacher`, `getTeacherByUserId`, `searchTeachers`, `updateTeacher`, `updateTeacherActive`, `deleteTeacher`)
  - [x] Add Faculty modal (Employee ID, Academic Designation, Department, Qualifications, Contact)
  - [x] Faculty Directory UI (`/teachers`) with department counts and status toggle
- [x] Teacher-Subject Class Allocations (`/api/v1/class/teacher-subject`)
  - [x] `teacherSubjectService.js` mapping all 7 endpoints of `TeacherSubjectController.java` (`createTeacherSubject`, `getAllTeacherSubjects`, `getTeacherSubject`, `getSubjectsOfTeacher`, `getTeachersOfClassSubject`, `updateActiveStatus`, `deleteTeacherSubject`)
  - [x] Assign Subject to Faculty modal linking instructor to class cohort courses
  - [x] Teaching Allocations table with unassign action and status toggle

#### Attendance & Coursework Assignment Modules ✅
- [x] Class Attendance & Roll Call Registers (`/api/v1/class/attendance`)
  - [x] `attendanceService.js` mapping all 13 endpoints of `AttendanceController.java` (`createSession`, `getSession`, `getMySessions`, `getMySessionsByDate`, `getSubjectSessions`, `getSessionsByDate`, `markBulkAttendance`, `getAttendanceOfSession`, `getMyAttendance`, `getStudentAttendance`, `getStudentAttendanceOfSubject`, `getAttendanceSummary`, `updateAttendance`)
  - [x] Create Lecture Session modal (Course, Date, Start & End Time slots)
  - [x] Interactive Roll Call Sheet modal with multi-status quick toggles (`PRESENT`, `ABSENT`, `EXEMPT`) and bulk shortcuts
  - [x] Attendance Registers UI (`/attendance`) with turnout percentage analytics
- [x] Coursework Assignments & Grade Sheets (`/api/v1/class/assignment`)
  - [x] `assignmentService.js` mapping all 10 endpoints of `AssignmentController.java` (`createAssignment`, `getAssignment`, `getAssignmentsOfClassSubject`, `getAssignmentsOfTeacherSubject`, `markAssignment`, `bulkMarkAssignment`, `getAssignmentMarks`, `getStudentAssignments`, `getStudentSubjectAssignments`, `updateMarks`)
  - [x] Publish Assignment modal (Problem statement, max marks, deadline)
  - [x] Grade Sheet modal with candidate marks entry, automatic percentages, and bulk grading commit
  - [x] Assignment Management UI (`/assignments`) with submission and grading progress bars

#### Upcoming Class Service Modules ⏳
- [ ] Examination schedule & result publishing (`/api/v1/class/exam`, `/examResult`)
- [ ] Notice board & Announcements (`/api/v1/class/notice`)
- [ ] Real-time Class Chat (WebSocket / STOMP)

---

### Phase 4: Admission Service Integration ⏳
- [ ] Public college admission form (`/api/v1/admission/public/code/{collegeCode}/apply`)
- [ ] Document upload during admission via Cloudinary service
- [ ] College Admin: Admission dashboard, application filtering, review modal
- [ ] Approve / Reject application workflow

---

### Phase 5: Fee Service Integration ⏳
- [ ] Fee category and window configuration
- [ ] Student fee account balance view
- [ ] Student payment submission with transaction ID & proof upload
- [ ] Admin payment verification and approval workflow

---

### Phase 6: Cloudinary & Notification Integration ⏳
- [ ] Cloudinary file upload widget for assignments, receipts, and avatars
- [ ] In-app notification bell & toast updates
