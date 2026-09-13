import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useTenant } from '../../../hooks/useTenant';
import { studentService } from '../../../services/studentService';
import { studentClassService } from '../../../services/studentClassService';
import { classSectionService } from '../../../services/classSectionService';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Badge } from '../../../components/common/Badge';
import { AlertBanner } from '../../../components/common/AlertBanner';
import { ConfirmModal } from '../../../components/common/ConfirmModal';
import { StudentTable } from './components/StudentTable';
import { StudentEnrollmentTable } from './components/StudentEnrollmentTable';
import { StudentModal } from './components/StudentModal';
import { StudentEnrollmentModal } from './components/StudentEnrollmentModal';
import {
  GraduationCap,
  Users,
  School,
  Plus,
  RefreshCw,
  Search,
  Calendar,
  UserCheck,
} from 'lucide-react';
import {
  IS_PREVIEW_MODE,
  MOCK_STUDENTS,
  MOCK_STUDENT_CLASSES,
  MOCK_CLASSES,
} from '../../../utils/mockData';

export const StudentManagementPage = () => {
  const { isMainAdmin, isCollegeAdmin, hasPermission, hasAnyPermission } = useAuth();
  const canManageStudents =
    hasAnyPermission(['CREATE_USER', 'UPDATE_USER', 'MANAGE_CLASSES']) ||
    isMainAdmin ||
    isCollegeAdmin;
  const canEnrollStudents =
    hasAnyPermission(['MANAGE_CLASSES', 'CREATE_USER']) ||
    isMainAdmin ||
    isCollegeAdmin;

  const { activeCollegeId, activeCollegeName } = useTenant();
  const location = useLocation();

  const getInitialTab = useCallback(() => {
    if (location.pathname.includes('/student-classes') || location.pathname.includes('/enrollment')) {
      return 'ENROLLMENTS';
    }
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'enrollments') return 'ENROLLMENTS';
    return 'DIRECTORY';
  }, [location.pathname, location.search]);

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [getInitialTab]);

  const [students, setStudents] = useState(() => {
    if (!IS_PREVIEW_MODE) return [];
    const initial = MOCK_STUDENTS.filter((s) => s.collegeId === activeCollegeId || !s.collegeId);
    return initial.length > 0 ? initial : MOCK_STUDENTS;
  });

  const [studentClasses, setStudentClasses] = useState(
    IS_PREVIEW_MODE ? MOCK_STUDENT_CLASSES : []
  );

  const [classes, setClasses] = useState(() => {
    if (!IS_PREVIEW_MODE) return [];
    const initial = MOCK_CLASSES.filter((c) => c.collegeId === activeCollegeId || !c.collegeId);
    return initial.length > 0 ? initial : MOCK_CLASSES;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);

  // Student Form Modal State
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [studentModalLoading, setStudentModalLoading] = useState(false);
  const [studentForm, setStudentForm] = useState({
    studentId: '',
    userId: '',
    firstName: '',
    lastName: '',
    enrollmentNumber: '',
    rollNumber: '',
    email: '',
    phoneNumber: '',
    gender: 'MALE',
    bloodGroup: 'O+',
    guardianName: '',
    guardianPhoneNumber: '',
    address: '',
  });

  // Enrollment Modal State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollModalLoading, setEnrollModalLoading] = useState(false);
  const [enrollmentForm, setEnrollmentForm] = useState({
    studentId: '',
    classId: '',
    semester: 1,
    academicYear: 2026,
    rollNumber: '',
  });

  // Confirm Modal State
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: 'student', // 'student' | 'enrollment'
    id: null,
    name: '',
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [stuRes, scRes, clsRes] = await Promise.allSettled([
        studentService.getAllStudents(),
        studentClassService.getAllStudentClasses(),
        classSectionService.getAllClasses(),
      ]);

      if (stuRes.status === 'fulfilled') {
        const val = Array.isArray(stuRes.value) ? stuRes.value : stuRes.value?.data;
        if (Array.isArray(val)) setStudents(val);
      }
      if (scRes.status === 'fulfilled') {
        const val = Array.isArray(scRes.value) ? scRes.value : scRes.value?.data;
        if (Array.isArray(val)) setStudentClasses(val);
      }
      if (clsRes.status === 'fulfilled') {
        const val = Array.isArray(clsRes.value) ? clsRes.value : clsRes.value?.data;
        if (Array.isArray(val)) setClasses(val);
      }
    } catch (error) {
      if (!IS_PREVIEW_MODE) {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to load students roster.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, activeCollegeId]);

  // Open Create Student
  const handleOpenCreateStudent = () => {
    setIsEditingStudent(false);
    setStudentForm({
      studentId: '',
      userId: `USR-${Date.now().toString().slice(-4)}`,
      firstName: '',
      lastName: '',
      enrollmentNumber: '',
      rollNumber: '',
      email: '',
      phoneNumber: '',
      gender: 'MALE',
      bloodGroup: 'O+',
      guardianName: '',
      guardianPhoneNumber: '',
      address: '',
    });
    setIsStudentModalOpen(true);
  };

  // Open Edit Student
  const handleOpenEditStudent = (stu) => {
    setIsEditingStudent(true);
    setStudentForm({
      studentId: stu.studentId,
      userId: stu.userId || `USR-${stu.studentId}`,
      firstName: stu.firstName || '',
      lastName: stu.lastName || '',
      enrollmentNumber: stu.enrollmentNumber || '',
      rollNumber: stu.rollNumber || '',
      email: stu.email || '',
      phoneNumber: stu.phoneNumber || '',
      gender: stu.gender || 'MALE',
      bloodGroup: stu.bloodGroup || 'O+',
      guardianName: stu.guardianName || '',
      guardianPhoneNumber: stu.guardianPhoneNumber || '',
      address: stu.address || '',
    });
    setIsStudentModalOpen(true);
  };

  // Submit Student Form
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setStudentModalLoading(true);

    try {
      if (isEditingStudent) {
        await studentService.updateStudent(studentForm.studentId, studentForm);
        setStudents((prev) =>
          prev.map((s) => (s.studentId === studentForm.studentId ? { ...s, ...studentForm } : s))
        );
        setAlert({
          type: 'success',
          message: `Student "${studentForm.firstName} ${studentForm.lastName}" updated successfully.`,
        });
      } else {
        const created = await studentService.createStudent(studentForm);
        const newStu = created || {
          studentId: `stu-${Date.now().toString().slice(-3)}`,
          collegeId: activeCollegeId,
          ...studentForm,
          active: true,
        };
        setStudents((prev) => [...prev, newStu]);
        setAlert({
          type: 'success',
          message: `Student "${studentForm.firstName} ${studentForm.lastName}" registered for ${activeCollegeName}.`,
        });
      }
      setIsStudentModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        if (isEditingStudent) {
          setStudents((prev) =>
            prev.map((s) => (s.studentId === studentForm.studentId ? { ...s, ...studentForm } : s))
          );
        } else {
          setStudents((prev) => [
            ...prev,
            {
              studentId: `stu-${Date.now().toString().slice(-3)}`,
              collegeId: activeCollegeId,
              ...studentForm,
              active: true,
            },
          ]);
        }
        setAlert({
          type: 'success',
          message: `[Preview Mode] Student "${studentForm.firstName} ${studentForm.lastName}" saved.`,
        });
        setIsStudentModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to save student record.',
        });
      }
    } finally {
      setStudentModalLoading(false);
    }
  };

  // Open Enrollment Modal
  const handleOpenEnrollModal = (preselectedStudentId = '') => {
    const defaultStudent = preselectedStudentId || (students[0]?.studentId || '');
    const defaultClass = classes[0]?.classId || '';
    const targetClass = classes.find((c) => c.classId === defaultClass);

    setEnrollmentForm({
      studentId: defaultStudent,
      classId: defaultClass,
      semester: targetClass?.semester || 1,
      academicYear: 2026,
      rollNumber: '',
    });
    setIsEnrollModalOpen(true);
  };

  // Submit Enrollment
  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();
    if (!enrollmentForm.studentId || !enrollmentForm.classId) return;

    setEnrollModalLoading(true);
    const targetStudent = students.find((s) => s.studentId === enrollmentForm.studentId);
    const targetClass = classes.find((c) => c.classId === enrollmentForm.classId);

    try {
      const created = await studentClassService.createStudentClass({
        studentId: enrollmentForm.studentId,
        classId: enrollmentForm.classId,
        academicYear: Number(enrollmentForm.academicYear),
        semester: Number(enrollmentForm.semester),
        rollNumber: enrollmentForm.rollNumber || targetStudent?.rollNumber || 'N/A',
      });

      const newSC = created || {
        studentClassId: `sc-${Date.now().toString().slice(-3)}`,
        studentId: enrollmentForm.studentId,
        studentName: `${targetStudent?.firstName} ${targetStudent?.lastName}`,
        enrollmentNumber: targetStudent?.enrollmentNumber || 'EN2026',
        classId: enrollmentForm.classId,
        className: targetClass?.className || 'Class',
        section: targetClass?.section || 'A',
        branchId: targetClass?.branchId || '',
        branchName: targetClass?.branchName || 'Branch',
        academicYear: Number(enrollmentForm.academicYear),
        semester: Number(enrollmentForm.semester),
        rollNumber: enrollmentForm.rollNumber || targetStudent?.rollNumber || 'N/A',
        active: true,
      };

      setStudentClasses((prev) => [...prev, newSC]);
      setAlert({
        type: 'success',
        message: `Enrolled ${targetStudent?.firstName} into ${targetClass?.className}.`,
      });
      setIsEnrollModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        const newSC = {
          studentClassId: `sc-${Date.now().toString().slice(-3)}`,
          studentId: enrollmentForm.studentId,
          studentName: `${targetStudent?.firstName} ${targetStudent?.lastName}`,
          enrollmentNumber: targetStudent?.enrollmentNumber || 'EN2026',
          classId: enrollmentForm.classId,
          className: targetClass?.className || 'Class',
          section: targetClass?.section || 'A',
          branchId: targetClass?.branchId || '',
          branchName: targetClass?.branchName || 'Branch',
          academicYear: Number(enrollmentForm.academicYear),
          semester: Number(enrollmentForm.semester),
          rollNumber: enrollmentForm.rollNumber || targetStudent?.rollNumber || 'N/A',
          active: true,
        };
        setStudentClasses((prev) => [...prev, newSC]);
        setAlert({
          type: 'success',
          message: `[Preview Mode] Enrolled ${targetStudent?.firstName} into ${targetClass?.className}.`,
        });
        setIsEnrollModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to enroll student.',
        });
      }
    } finally {
      setEnrollModalLoading(false);
    }
  };

  // Toggle Student Active
  const handleToggleStudentActive = async (stu) => {
    const nextStatus = !stu.active;
    try {
      await studentService.updateStudentActive(stu.studentId, nextStatus);
      setStudents((prev) =>
        prev.map((s) => (s.studentId === stu.studentId ? { ...s, active: nextStatus } : s))
      );
      setAlert({
        type: 'success',
        message: `Student "${stu.firstName}" status set to ${nextStatus ? 'Active' : 'Suspended'}.`,
      });
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setStudents((prev) =>
          prev.map((s) => (s.studentId === stu.studentId ? { ...s, active: nextStatus } : s))
        );
        setAlert({
          type: 'success',
          message: `[Preview Mode] Student "${stu.firstName}" status set to ${nextStatus ? 'Active' : 'Suspended'}.`,
        });
      }
    }
  };

  // Toggle Enrollment Active
  const handleToggleEnrollmentActive = async (sc) => {
    const nextStatus = !sc.active;
    try {
      await studentClassService.updateActiveStatus(sc.studentClassId, nextStatus);
      setStudentClasses((prev) =>
        prev.map((item) =>
          item.studentClassId === sc.studentClassId ? { ...item, active: nextStatus } : item
        )
      );
      setAlert({
        type: 'success',
        message: `Enrollment for ${sc.studentName} in ${sc.className} ${nextStatus ? 'activated' : 'suspended'}.`,
      });
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setStudentClasses((prev) =>
          prev.map((item) =>
            item.studentClassId === sc.studentClassId ? { ...item, active: nextStatus } : item
          )
        );
        setAlert({
          type: 'success',
          message: `[Preview Mode] Enrollment for ${sc.studentName} in ${sc.className} updated.`,
        });
      }
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    const { type, id, name } = confirmState;
    setConfirmState({ ...confirmState, isOpen: false });

    try {
      if (type === 'student') {
        await studentService.deleteStudent(id);
        setStudents((prev) => prev.filter((s) => s.studentId !== id));
        setStudentClasses((prev) => prev.filter((sc) => sc.studentId !== id));
        setAlert({ type: 'success', message: `Student "${name}" deleted successfully.` });
      } else if (type === 'enrollment') {
        await studentClassService.deleteStudentClass(id);
        setStudentClasses((prev) => prev.filter((sc) => sc.studentClassId !== id));
        setAlert({ type: 'success', message: `Student unenrolled from class successfully.` });
      }
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        if (type === 'student') {
          setStudents((prev) => prev.filter((s) => s.studentId !== id));
          setStudentClasses((prev) => prev.filter((sc) => sc.studentId !== id));
        } else if (type === 'enrollment') {
          setStudentClasses((prev) => prev.filter((sc) => sc.studentClassId !== id));
        }
        setAlert({ type: 'success', message: `[Preview Mode] ${name || 'Record'} deleted.` });
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to delete record.',
        });
      }
    }
  };

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      (s.firstName && s.firstName.toLowerCase().includes(q)) ||
      (s.lastName && s.lastName.toLowerCase().includes(q)) ||
      (s.enrollmentNumber && s.enrollmentNumber.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q))
    );
  });

  // Filtered Enrollments
  const filteredEnrollments = studentClasses.filter((sc) => {
    const q = searchTerm.toLowerCase();
    return (
      (sc.studentName && sc.studentName.toLowerCase().includes(q)) ||
      (sc.className && sc.className.toLowerCase().includes(q)) ||
      (sc.enrollmentNumber && sc.enrollmentNumber.toLowerCase().includes(q)) ||
      (sc.branchName && sc.branchName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap size={22} className="text-blue-800" />
            <h1 className="text-xl font-bold text-slate-900">
              Student Directory & Section Enrollments
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Institutional candidate registration, academic records, and class cohort section allocations
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Campus Scope:
            </span>
            <Badge variant="primary">
              {activeCollegeName || activeCollegeId || 'Current College'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={loadData}
            disabled={isLoading}
            className="text-xs"
          >
            Refresh
          </Button>
          {canEnrollStudents && (
            <Button
              variant="secondary"
              icon={School}
              onClick={() => handleOpenEnrollModal()}
              className="text-xs"
            >
              Enroll in Class
            </Button>
          )}
          {canManageStudents && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleOpenCreateStudent}
              className="text-xs"
            >
              Register Student
            </Button>
          )}
        </div>
      </div>

      {/* Alert Banner */}
      {alert && (
        <AlertBanner
          type={alert.type}
          message={alert.message}
          onDismiss={() => setAlert(null)}
        />
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <GraduationCap size={16} className="text-blue-800" />
            <span>Total Students</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{students.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Enrolled candidates</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <UserCheck size={16} className="text-emerald-700" />
            <span>Active Enrollments</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{studentClasses.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Section assignments</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <School size={16} className="text-purple-700" />
            <span>Class Sections</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{classes.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Cohorts available</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Calendar size={16} className="text-amber-700" />
            <span>Academic Term</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">2026</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Current academic year</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('DIRECTORY')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'DIRECTORY'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users size={16} />
          <span>Student Directory ({students.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('ENROLLMENTS')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'ENROLLMENTS'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <School size={16} />
          <span>Class Cohort Enrollments ({studentClasses.length})</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex items-center justify-between">
        <div className="w-full md:w-96">
          <Input
            id="studentSearchInput"
            type="text"
            placeholder={
              activeTab === 'DIRECTORY'
                ? 'Search students by name, enrollment, email...'
                : 'Search enrollments by student, class, branch...'
            }
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'DIRECTORY' && (
        <StudentTable
          students={filteredStudents}
          studentClasses={studentClasses}
          isLoading={isLoading}
          onOpenEditStudent={handleOpenEditStudent}
          onToggleStudentActive={handleToggleStudentActive}
          onDeleteStudent={(stu) =>
            setConfirmState({
              isOpen: true,
              type: 'student',
              id: stu.studentId,
              name: `${stu.firstName} ${stu.lastName}`,
            })
          }
          onOpenEnrollModal={handleOpenEnrollModal}
          canManageStudents={canManageStudents}
          canEnrollStudents={canEnrollStudents}
        />
      )}

      {activeTab === 'ENROLLMENTS' && (
        <StudentEnrollmentTable
          studentClasses={filteredEnrollments}
          isLoading={isLoading}
          onToggleEnrollmentActive={handleToggleEnrollmentActive}
          onDeleteEnrollment={(sc) =>
            setConfirmState({
              isOpen: true,
              type: 'enrollment',
              id: sc.studentClassId,
              name: `${sc.studentName} from ${sc.className}`,
            })
          }
          canManageStudents={canManageStudents}
        />
      )}

      {/* Modals */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        isEditing={isEditingStudent}
        isLoading={studentModalLoading}
        studentForm={studentForm}
        setStudentForm={setStudentForm}
        onSubmit={handleStudentSubmit}
      />

      <StudentEnrollmentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        isLoading={enrollModalLoading}
        enrollmentForm={enrollmentForm}
        setEnrollmentForm={setEnrollmentForm}
        students={students}
        classes={classes}
        onSubmit={handleEnrollmentSubmit}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title={`Delete ${confirmState.type === 'student' ? 'Student Profile' : 'Class Enrollment'}`}
        message={`Are you certain you wish to delete "${confirmState.name}"?`}
        warning="This action affects active attendance rosters, fee window records, and examination rolls."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};

export default StudentManagementPage;
