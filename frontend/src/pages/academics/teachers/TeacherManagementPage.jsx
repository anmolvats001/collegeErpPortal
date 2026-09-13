import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useTenant } from '../../../hooks/useTenant';
import { teacherService } from '../../../services/teacherService';
import { teacherSubjectService } from '../../../services/teacherSubjectService';
import { classSubjectService } from '../../../services/classSubjectService';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Badge } from '../../../components/common/Badge';
import { AlertBanner } from '../../../components/common/AlertBanner';
import { ConfirmModal } from '../../../components/common/ConfirmModal';
import { TeacherTable } from './components/TeacherTable';
import { TeacherSubjectTable } from './components/TeacherSubjectTable';
import { TeacherModal } from './components/TeacherModal';
import { TeacherSubjectModal } from './components/TeacherSubjectModal';
import {
  UserCheck,
  BookOpen,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Calendar,
  Building,
} from 'lucide-react';
import {
  IS_PREVIEW_MODE,
  MOCK_TEACHERS,
  MOCK_TEACHER_SUBJECTS,
  MOCK_CLASS_SUBJECTS,
} from '../../../utils/mockData';

export const TeacherManagementPage = () => {
  const { isMainAdmin, isCollegeAdmin, hasPermission, hasAnyPermission } = useAuth();
  const canManageFaculty =
    hasAnyPermission(['CREATE_USER', 'UPDATE_USER', 'MANAGE_CLASSES']) ||
    isMainAdmin ||
    isCollegeAdmin;
  const canAssignSubjects =
    hasAnyPermission(['MANAGE_CLASSES', 'CREATE_USER']) ||
    isMainAdmin ||
    isCollegeAdmin;

  const { activeCollegeId, activeCollegeName } = useTenant();
  const location = useLocation();

  const getInitialTab = useCallback(() => {
    if (location.pathname.includes('/teacher-subject') || location.pathname.includes('/allocation')) {
      return 'ALLOCATIONS';
    }
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'allocations') return 'ALLOCATIONS';
    return 'FACULTY';
  }, [location.pathname, location.search]);

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [getInitialTab]);

  const [teachers, setTeachers] = useState(() => {
    if (!IS_PREVIEW_MODE) return [];
    const initial = MOCK_TEACHERS.filter((t) => t.collegeId === activeCollegeId || !t.collegeId);
    return initial.length > 0 ? initial : MOCK_TEACHERS;
  });

  const [teacherSubjects, setTeacherSubjects] = useState(
    IS_PREVIEW_MODE ? MOCK_TEACHER_SUBJECTS : []
  );

  const [classSubjects, setClassSubjects] = useState(
    IS_PREVIEW_MODE ? MOCK_CLASS_SUBJECTS : []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);

  // Teacher Modal State
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);
  const [teacherModalLoading, setTeacherModalLoading] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    teacherId: '',
    userId: '',
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    phoneNumber: '',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering',
    qualification: '',
  });

  // TeacherSubject Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignModalLoading, setAssignModalLoading] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    teacherId: '',
    classSubjectId: '',
  });

  // Confirm Modal State
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: 'teacher', // 'teacher' | 'assignment'
    id: null,
    name: '',
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tchRes, tsRes, csRes] = await Promise.allSettled([
        teacherService.getAllTeachers(),
        teacherSubjectService.getAllTeacherSubjects(),
        classSubjectService.getAllClassSubjects(),
      ]);

      if (tchRes.status === 'fulfilled') {
        const val = Array.isArray(tchRes.value) ? tchRes.value : tchRes.value?.data;
        if (Array.isArray(val)) setTeachers(val);
      }
      if (tsRes.status === 'fulfilled') {
        const val = Array.isArray(tsRes.value) ? tsRes.value : tsRes.value?.data;
        if (Array.isArray(val)) setTeacherSubjects(val);
      }
      if (csRes.status === 'fulfilled') {
        const val = Array.isArray(csRes.value) ? csRes.value : csRes.value?.data;
        if (Array.isArray(val)) setClassSubjects(val);
      }
    } catch (error) {
      if (!IS_PREVIEW_MODE) {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to load faculty roster.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, activeCollegeId]);

  // Open Create Teacher
  const handleOpenCreateTeacher = () => {
    setIsEditingTeacher(false);
    setTeacherForm({
      teacherId: '',
      userId: `USR-${Date.now().toString().slice(-4)}`,
      firstName: '',
      lastName: '',
      employeeId: '',
      email: '',
      phoneNumber: '',
      designation: 'Assistant Professor',
      department: 'Computer Science & Engineering',
      qualification: '',
    });
    setIsTeacherModalOpen(true);
  };

  // Open Edit Teacher
  const handleOpenEditTeacher = (tch) => {
    setIsEditingTeacher(true);
    setTeacherForm({
      teacherId: tch.teacherId,
      userId: tch.userId || `USR-${tch.teacherId}`,
      firstName: tch.firstName || '',
      lastName: tch.lastName || '',
      employeeId: tch.employeeId || '',
      email: tch.email || '',
      phoneNumber: tch.phoneNumber || '',
      designation: tch.designation || 'Assistant Professor',
      department: tch.department || '',
      qualification: tch.qualification || '',
    });
    setIsTeacherModalOpen(true);
  };

  // Submit Teacher Form
  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    setTeacherModalLoading(true);

    try {
      if (isEditingTeacher) {
        await teacherService.updateTeacher(teacherForm.teacherId, teacherForm);
        setTeachers((prev) =>
          prev.map((t) => (t.teacherId === teacherForm.teacherId ? { ...t, ...teacherForm } : t))
        );
        setAlert({
          type: 'success',
          message: `Faculty record for "${teacherForm.firstName} ${teacherForm.lastName}" updated.`,
        });
      } else {
        const created = await teacherService.createTeacher(teacherForm);
        const newTch = created || {
          teacherId: `tch-${Date.now().toString().slice(-3)}`,
          collegeId: activeCollegeId,
          ...teacherForm,
          active: true,
        };
        setTeachers((prev) => [...prev, newTch]);
        setAlert({
          type: 'success',
          message: `Faculty member "${teacherForm.firstName} ${teacherForm.lastName}" registered for ${activeCollegeName}.`,
        });
      }
      setIsTeacherModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        if (isEditingTeacher) {
          setTeachers((prev) =>
            prev.map((t) => (t.teacherId === teacherForm.teacherId ? { ...t, ...teacherForm } : t))
          );
        } else {
          setTeachers((prev) => [
            ...prev,
            {
              teacherId: `tch-${Date.now().toString().slice(-3)}`,
              collegeId: activeCollegeId,
              ...teacherForm,
              active: true,
            },
          ]);
        }
        setAlert({
          type: 'success',
          message: `[Preview Mode] Faculty record for "${teacherForm.firstName} ${teacherForm.lastName}" saved.`,
        });
        setIsTeacherModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to save faculty record.',
        });
      }
    } finally {
      setTeacherModalLoading(false);
    }
  };

  // Open Assign Subject Modal
  const handleOpenAssignModal = (preselectedTeacherId = '') => {
    setAssignmentForm({
      teacherId: preselectedTeacherId || (teachers[0]?.teacherId || ''),
      classSubjectId: classSubjects[0]?.classSubjectId || '',
    });
    setIsAssignModalOpen(true);
  };

  // Submit Assignment
  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!assignmentForm.teacherId || !assignmentForm.classSubjectId) return;

    setAssignModalLoading(true);
    const targetTeacher = teachers.find((t) => t.teacherId === assignmentForm.teacherId);
    const targetCS = classSubjects.find((cs) => cs.classSubjectId === assignmentForm.classSubjectId);

    try {
      const created = await teacherSubjectService.createTeacherSubject({
        teacherId: assignmentForm.teacherId,
        classSubjectId: assignmentForm.classSubjectId,
      });

      const newTS = created || {
        teacherSubjectId: `ts-${Date.now().toString().slice(-3)}`,
        teacherId: assignmentForm.teacherId,
        teacherName: `${targetTeacher?.firstName} ${targetTeacher?.lastName}`,
        employeeId: targetTeacher?.employeeId || 'EMP',
        classSubjectId: assignmentForm.classSubjectId,
        classId: targetCS?.classId || '',
        className: targetCS?.className || 'Class',
        section: targetCS?.section || 'A',
        subjectId: targetCS?.subjectId || '',
        subjectName: targetCS?.subjectName || 'Subject',
        subjectCode: targetCS?.subjectCode || 'CODE',
        semester: targetCS?.semester || 1,
        active: true,
      };

      setTeacherSubjects((prev) => [...prev, newTS]);
      setAlert({
        type: 'success',
        message: `Assigned ${targetCS?.subjectCode} to ${targetTeacher?.firstName} ${targetTeacher?.lastName}.`,
      });
      setIsAssignModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        const newTS = {
          teacherSubjectId: `ts-${Date.now().toString().slice(-3)}`,
          teacherId: assignmentForm.teacherId,
          teacherName: `${targetTeacher?.firstName} ${targetTeacher?.lastName}`,
          employeeId: targetTeacher?.employeeId || 'EMP',
          classSubjectId: assignmentForm.classSubjectId,
          classId: targetCS?.classId || '',
          className: targetCS?.className || 'Class',
          section: targetCS?.section || 'A',
          subjectId: targetCS?.subjectId || '',
          subjectName: targetCS?.subjectName || 'Subject',
          subjectCode: targetCS?.subjectCode || 'CODE',
          semester: targetCS?.semester || 1,
          active: true,
        };
        setTeacherSubjects((prev) => [...prev, newTS]);
        setAlert({
          type: 'success',
          message: `[Preview Mode] Assigned ${targetCS?.subjectCode} to ${targetTeacher?.firstName} ${targetTeacher?.lastName}.`,
        });
        setIsAssignModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to allocate subject to teacher.',
        });
      }
    } finally {
      setAssignModalLoading(false);
    }
  };

  // Toggle Teacher Active
  const handleToggleTeacherActive = async (tch) => {
    const nextStatus = !tch.active;
    try {
      await teacherService.updateTeacherActive(tch.teacherId, nextStatus);
      setTeachers((prev) =>
        prev.map((t) => (t.teacherId === tch.teacherId ? { ...t, active: nextStatus } : t))
      );
      setAlert({
        type: 'success',
        message: `Faculty member "${tch.firstName}" status set to ${nextStatus ? 'Active' : 'Suspended'}.`,
      });
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setTeachers((prev) =>
          prev.map((t) => (t.teacherId === tch.teacherId ? { ...t, active: nextStatus } : t))
        );
        setAlert({
          type: 'success',
          message: `[Preview Mode] Faculty member "${tch.firstName}" status set to ${nextStatus ? 'Active' : 'Suspended'}.`,
        });
      }
    }
  };

  // Toggle Assignment Active
  const handleToggleAssignmentActive = async (ts) => {
    const nextStatus = !ts.active;
    try {
      await teacherSubjectService.updateActiveStatus(ts.teacherSubjectId, nextStatus);
      setTeacherSubjects((prev) =>
        prev.map((item) =>
          item.teacherSubjectId === ts.teacherSubjectId ? { ...item, active: nextStatus } : item
        )
      );
      setAlert({
        type: 'success',
        message: `Teaching allocation for ${ts.subjectCode} with ${ts.teacherName} ${nextStatus ? 'activated' : 'suspended'}.`,
      });
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setTeacherSubjects((prev) =>
          prev.map((item) =>
            item.teacherSubjectId === ts.teacherSubjectId ? { ...item, active: nextStatus } : item
          )
        );
        setAlert({
          type: 'success',
          message: `[Preview Mode] Teaching allocation for ${ts.subjectCode} updated.`,
        });
      }
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    const { type, id, name } = confirmState;
    setConfirmState({ ...confirmState, isOpen: false });

    try {
      if (type === 'teacher') {
        await teacherService.deleteTeacher(id);
        setTeachers((prev) => prev.filter((t) => t.teacherId !== id));
        setTeacherSubjects((prev) => prev.filter((ts) => ts.teacherId !== id));
        setAlert({ type: 'success', message: `Faculty member "${name}" deleted.` });
      } else if (type === 'assignment') {
        await teacherSubjectService.deleteTeacherSubject(id);
        setTeacherSubjects((prev) => prev.filter((ts) => ts.teacherSubjectId !== id));
        setAlert({ type: 'success', message: `Teaching allocation unassigned successfully.` });
      }
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        if (type === 'teacher') {
          setTeachers((prev) => prev.filter((t) => t.teacherId !== id));
          setTeacherSubjects((prev) => prev.filter((ts) => ts.teacherId !== id));
        } else if (type === 'assignment') {
          setTeacherSubjects((prev) => prev.filter((ts) => ts.teacherSubjectId !== id));
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

  // Filtered Teachers
  const filteredTeachers = teachers.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      (t.firstName && t.firstName.toLowerCase().includes(q)) ||
      (t.lastName && t.lastName.toLowerCase().includes(q)) ||
      (t.employeeId && t.employeeId.toLowerCase().includes(q)) ||
      (t.department && t.department.toLowerCase().includes(q)) ||
      (t.designation && t.designation.toLowerCase().includes(q))
    );
  });

  // Filtered Allocations
  const filteredAllocations = teacherSubjects.filter((ts) => {
    const q = searchTerm.toLowerCase();
    return (
      (ts.teacherName && ts.teacherName.toLowerCase().includes(q)) ||
      (ts.subjectName && ts.subjectName.toLowerCase().includes(q)) ||
      (ts.subjectCode && ts.subjectCode.toLowerCase().includes(q)) ||
      (ts.className && ts.className.toLowerCase().includes(q))
    );
  });

  // Unique departments count
  const departmentsCount = new Set(teachers.map((t) => t.department)).size;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck size={22} className="text-emerald-700" />
            <h1 className="text-xl font-bold text-slate-900">
              Faculty Registry & Subject Teaching Allocations
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Professor directories, academic qualifications, and class course instructor assignments
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
          {canAssignSubjects && (
            <Button
              variant="secondary"
              icon={BookOpen}
              onClick={() => handleOpenAssignModal()}
              className="text-xs"
            >
              Assign Subject
            </Button>
          )}
          {canManageFaculty && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleOpenCreateTeacher}
              className="text-xs"
            >
              Add Faculty
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
            <UserCheck size={16} className="text-emerald-700" />
            <span>Faculty Members</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{teachers.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Active professors & staff</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <BookOpen size={16} className="text-blue-800" />
            <span>Teaching Allocations</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{teacherSubjects.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Class course assignments</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Building size={16} className="text-purple-700" />
            <span>Departments</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{departmentsCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Academic disciplines</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Calendar size={16} className="text-amber-700" />
            <span>Academic Term</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">2026</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Current semester term</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('FACULTY')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'FACULTY'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck size={16} />
          <span>Faculty Directory ({teachers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('ALLOCATIONS')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'ALLOCATIONS'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen size={16} />
          <span>Teaching Subject Allocations ({teacherSubjects.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex items-center justify-between">
        <div className="w-full md:w-96">
          <Input
            id="teacherSearchInput"
            type="text"
            placeholder={
              activeTab === 'FACULTY'
                ? 'Search faculty by name, employee ID, department...'
                : 'Search allocations by teacher, subject, section...'
            }
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'FACULTY' && (
        <TeacherTable
          teachers={filteredTeachers}
          teacherSubjects={teacherSubjects}
          isLoading={isLoading}
          onOpenEditTeacher={handleOpenEditTeacher}
          onToggleTeacherActive={handleToggleTeacherActive}
          onDeleteTeacher={(tch) =>
            setConfirmState({
              isOpen: true,
              type: 'teacher',
              id: tch.teacherId,
              name: `${tch.firstName} ${tch.lastName}`,
            })
          }
          onOpenAssignModal={handleOpenAssignModal}
          canManageFaculty={canManageFaculty}
          canAssignSubjects={canAssignSubjects}
        />
      )}

      {activeTab === 'ALLOCATIONS' && (
        <TeacherSubjectTable
          teacherSubjects={filteredAllocations}
          isLoading={isLoading}
          onToggleAssignmentActive={handleToggleAssignmentActive}
          onDeleteAssignment={(ts) =>
            setConfirmState({
              isOpen: true,
              type: 'assignment',
              id: ts.teacherSubjectId,
              name: `${ts.subjectCode} assigned to ${ts.teacherName}`,
            })
          }
          canManageFaculty={canManageFaculty}
          canAssignSubjects={canAssignSubjects}
        />
      )}

      {/* Modals */}
      <TeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        isEditing={isEditingTeacher}
        isLoading={teacherModalLoading}
        teacherForm={teacherForm}
        setTeacherForm={setTeacherForm}
        onSubmit={handleTeacherSubmit}
      />

      <TeacherSubjectModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        isLoading={assignModalLoading}
        assignmentForm={assignmentForm}
        setAssignmentForm={setAssignmentForm}
        teachers={teachers}
        classSubjects={classSubjects}
        onSubmit={handleAssignmentSubmit}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title={`Delete ${confirmState.type === 'teacher' ? 'Faculty Record' : 'Teaching Allocation'}`}
        message={`Are you certain you wish to delete "${confirmState.name}"?`}
        warning="This action affects timetable allocations, attendance recording rights, and grade book authorizations."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};

export default TeacherManagementPage;
