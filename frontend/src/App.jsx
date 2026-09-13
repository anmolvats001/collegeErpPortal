import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { UserManagementPage } from './pages/users/UserManagementPage';
import { UserProfilePage } from './pages/users/UserProfilePage';
import { RoleManagementPage } from './pages/roles/RoleManagementPage';
import { CollegeManagementPage } from './pages/colleges/CollegeManagementPage';
import { ModuleManagementPage } from './pages/modules/ModuleManagementPage';
import { NotFoundPage } from './pages/common/NotFoundPage';
import { UnauthorizedPage } from './pages/common/UnauthorizedPage';
import { ModuleNotEnabledPage } from './pages/common/ModuleNotEnabledPage';
import { CourseBranchManagementPage } from './pages/academics/CourseBranchManagementPage';
import { ClassSubjectManagementPage } from './pages/academics/ClassSubjectManagementPage';
import { StudentManagementPage } from './pages/academics/students/StudentManagementPage';
import { TeacherManagementPage } from './pages/academics/teachers/TeacherManagementPage';
import { AttendanceManagementPage } from './pages/academics/attendance/AttendanceManagementPage';
import { AssignmentManagementPage } from './pages/academics/assignments/AssignmentManagementPage';
import { ChatManagementPage } from './pages/academics/chat/ChatManagementPage';
import { ExamManagementPage } from './pages/academics/exams/ExamManagementPage';
import { NoticeManagementPage } from './pages/academics/notices/NoticeManagementPage';
import { AdmissionManagementPage } from './pages/admissions/AdmissionManagementPage';
import { PublicAdmissionApplyPage } from './pages/admissions/PublicAdmissionApplyPage';
import { FeeManagementPage } from './pages/fees/FeeManagementPage';
import { ModuleGuard } from './components/auth/ModuleGuard';
import { RoleGuard } from './components/auth/RoleGuard';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <TenantProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/apply" element={<PublicAdmissionApplyPage />} />
              <Route path="/apply/:collegeCode" element={<PublicAdmissionApplyPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardOverviewPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="profile" element={<UserProfilePage />} />
                <Route path="roles" element={<RoleManagementPage />} />
                <Route
                  path="colleges"
                  element={
                    <RoleGuard allowedRoles={['ROLE_MAIN_ADMIN']}>
                      <CollegeManagementPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="modules"
                  element={
                    <RoleGuard allowedRoles={['ROLE_MAIN_ADMIN']}>
                      <ModuleManagementPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="academics"
                  element={
                    <ModuleGuard moduleCode="CLASS" moduleTitle="Academics & Classroom Management">
                      <CourseBranchManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route path="courses" element={<Navigate to="/academics" replace />} />
                <Route path="branches" element={<Navigate to="/academics" replace />} />
                <Route
                  path="classes"
                  element={
                    <ModuleGuard moduleCode="CLASS" moduleTitle="Class & Cohort Management">
                      <ClassSubjectManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route
                  path="subjects"
                  element={
                    <ModuleGuard moduleCode="CLASS" moduleTitle="Subject & Syllabus Catalog">
                      <ClassSubjectManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route
                  path="class-subjects"
                  element={
                    <ModuleGuard moduleCode="CLASS" moduleTitle="Curriculum Allocation Matrix">
                      <ClassSubjectManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route
                  path="students"
                  element={
                    <ModuleGuard moduleCode="CLASS" moduleTitle="Student Directory & Enrollments">
                      <StudentManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route
                  path="student-classes"
                  element={
                    <ModuleGuard moduleCode="CLASS" moduleTitle="Student Class Cohort Enrollments">
                      <StudentManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route
                  path="teachers"
                  element={
                    <ModuleGuard moduleCode="CLASS" moduleTitle="Faculty & Subject Allocations">
                      <TeacherManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route
                  path="teacher-subjects"
                  element={
                    <ModuleGuard moduleCode="CLASS" moduleTitle="Faculty Teaching Allocations">
                      <TeacherManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route
                  path="attendance"
                  element={
                    <ModuleGuard moduleCode="ATTENDANCE" moduleTitle="Attendance & Lecture Registers">
                      <AttendanceManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route
                  path="assignments"
                  element={
                    <ModuleGuard moduleCode="CLASS" moduleTitle="Coursework & Assignments">
                      <AssignmentManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route
                  path="chat"
                  element={
                    <ModuleGuard moduleCode="CLASS" moduleTitle="Class Chat & Live Calls">
                      <ChatManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route
                  path="exams"
                  element={
                    <ModuleGuard moduleCode="CLASS" moduleTitle="Examinations & Grade Book">
                      <ExamManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route
                  path="notices"
                  element={
                    <ModuleGuard moduleCode="CLASS" moduleTitle="Academic Notices & Circulars">
                      <NoticeManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route
                  path="admissions"
                  element={
                    <ModuleGuard moduleCode="ADMISSION" moduleTitle="Admissions & Enrollment Hub">
                      <AdmissionManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route
                  path="fees"
                  element={
                    <ModuleGuard moduleCode="FEE" moduleTitle="Fee & Financial Accounts Desk">
                      <FeeManagementPage />
                    </ModuleGuard>
                  }
                />
                <Route path="module-disabled" element={<ModuleNotEnabledPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </TenantProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
