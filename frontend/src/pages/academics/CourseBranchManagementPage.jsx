import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import { courseService } from '../../services/courseService';
import { branchService } from '../../services/branchService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { AlertBanner } from '../../components/common/AlertBanner';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { CourseTable } from './components/CourseTable';
import { BranchTable } from './components/BranchTable';
import { AcademicStructureTree } from './components/AcademicStructureTree';
import { CourseModal } from './components/CourseModal';
import { BranchModal } from './components/BranchModal';
import {
  GraduationCap,
  GitBranch,
  Plus,
  RefreshCw,
  Search,
  BookOpen,
  Layers,
  Clock,
  Filter,
} from 'lucide-react';
import {
  IS_PREVIEW_MODE,
  MOCK_COURSES,
  MOCK_BRANCHES,
} from '../../utils/mockData';

export const CourseBranchManagementPage = () => {
  const { isMainAdmin, isCollegeAdmin, hasPermission } = useAuth();
  const canManageCourses = hasPermission('MANAGE_CLASSES') || isMainAdmin || isCollegeAdmin;
  const { activeCollegeId, activeCollegeName } = useTenant();

  const [courses, setCourses] = useState(() => {
    if (!IS_PREVIEW_MODE) return [];
    const initial = MOCK_COURSES.filter((c) => c.collegeId === activeCollegeId || !c.collegeId);
    return initial.length > 0 ? initial : MOCK_COURSES;
  });

  const [branches, setBranches] = useState(() => {
    if (!IS_PREVIEW_MODE) return [];
    const initial = MOCK_BRANCHES.filter((b) => b.collegeId === activeCollegeId || !b.collegeId);
    return initial.length > 0 ? initial : MOCK_BRANCHES;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('COURSES'); // 'COURSES' | 'BRANCHES' | 'STRUCTURE'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [alert, setAlert] = useState(null);

  // Course Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [courseModalLoading, setCourseModalLoading] = useState(false);
  const [courseForm, setCourseForm] = useState({
    courseId: '',
    courseName: '',
    courseCode: '',
    description: '',
    durationInYears: 4,
    totalSemesters: 8,
  });

  // Branch Modal State
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isEditingBranch, setIsEditingBranch] = useState(false);
  const [branchModalLoading, setBranchModalLoading] = useState(false);
  const [branchForm, setBranchForm] = useState({
    branchId: '',
    courseId: '',
    branchName: '',
    branchCode: '',
    branchDescription: '',
  });

  // Confirm Delete State
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: 'course', // 'course' | 'branch'
    id: null,
    name: '',
  });

  const loadAcademicData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [crsRes, brRes] = await Promise.allSettled([
        courseService.getCoursesOfMyCollege(),
        branchService.getAllBranches(),
      ]);

      if (crsRes.status === 'fulfilled') {
        const val = Array.isArray(crsRes.value) ? crsRes.value : crsRes.value?.data;
        if (Array.isArray(val)) setCourses(val);
      }
      if (brRes.status === 'fulfilled') {
        const val = Array.isArray(brRes.value) ? brRes.value : brRes.value?.data;
        if (Array.isArray(val)) setBranches(val);
      }
    } catch (error) {
      if (!IS_PREVIEW_MODE) {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to load academic courses and branches.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAcademicData();
  }, [loadAcademicData, activeCollegeId]);

  // Course Handlers
  const handleOpenCreateCourse = () => {
    setIsEditingCourse(false);
    setCourseForm({
      courseId: '',
      courseName: '',
      courseCode: '',
      description: '',
      durationInYears: 4,
      totalSemesters: 8,
    });
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course) => {
    setIsEditingCourse(true);
    setCourseForm({
      courseId: course.courseId,
      courseName: course.courseName,
      courseCode: course.courseCode,
      description: course.description || '',
      durationInYears: course.durationInYears || 4,
      totalSemesters: course.totalSemesters || 8,
    });
    setIsCourseModalOpen(true);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setCourseModalLoading(true);
    try {
      if (isEditingCourse) {
        await courseService.updateCourse(courseForm.courseId, courseForm);
        setCourses((prev) =>
          prev.map((c) => (c.courseId === courseForm.courseId ? { ...c, ...courseForm } : c))
        );
        setAlert({ type: 'success', message: `Program "${courseForm.courseName}" updated.` });
      } else {
        const created = await courseService.createCourse(courseForm);
        const newCourse = created || {
          courseId: `crs-${Date.now().toString().slice(-3)}`,
          collegeId: activeCollegeId,
          ...courseForm,
          active: true,
        };
        setCourses((prev) => [...prev, newCourse]);
        setAlert({ type: 'success', message: `Program "${courseForm.courseName}" registered.` });
      }
      setIsCourseModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        if (isEditingCourse) {
          setCourses((prev) =>
            prev.map((c) => (c.courseId === courseForm.courseId ? { ...c, ...courseForm } : c))
          );
        } else {
          setCourses((prev) => [
            ...prev,
            {
              courseId: `crs-${Date.now().toString().slice(-3)}`,
              collegeId: activeCollegeId,
              ...courseForm,
              active: true,
            },
          ]);
        }
        setAlert({ type: 'success', message: `[Preview Mode] Program updated.` });
        setIsCourseModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to save course program.',
        });
      }
    } finally {
      setCourseModalLoading(false);
    }
  };

  // Branch Handlers
  const handleOpenCreateBranch = (preselectedCourseId = '') => {
    setIsEditingBranch(false);
    setBranchForm({
      branchId: '',
      courseId: preselectedCourseId || (courses[0]?.courseId || ''),
      branchName: '',
      branchCode: '',
      branchDescription: '',
    });
    setIsBranchModalOpen(true);
  };

  const handleOpenEditBranch = (branch) => {
    setIsEditingBranch(true);
    setBranchForm({
      branchId: branch.branchId,
      courseId: branch.courseId || '',
      branchName: branch.branchName,
      branchCode: branch.branchCode,
      branchDescription: branch.branchDescription || '',
    });
    setIsBranchModalOpen(true);
  };

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    if (!branchForm.courseId) {
      setAlert({ type: 'danger', message: 'Please select a parent degree program.' });
      return;
    }

    setBranchModalLoading(true);
    try {
      if (isEditingBranch) {
        await branchService.updateBranch(branchForm.branchId, {
          branchName: branchForm.branchName,
          branchCode: branchForm.branchCode,
          branchDescription: branchForm.branchDescription,
        });
        setBranches((prev) =>
          prev.map((b) => (b.branchId === branchForm.branchId ? { ...b, ...branchForm } : b))
        );
        setAlert({ type: 'success', message: `Branch "${branchForm.branchName}" updated.` });
      } else {
        const created = await branchService.createBranch(branchForm.courseId, {
          branchName: branchForm.branchName,
          branchCode: branchForm.branchCode,
          branchDescription: branchForm.branchDescription,
        });
        const newBranch = created || {
          branchId: `br-${Date.now().toString().slice(-3)}`,
          collegeId: activeCollegeId,
          ...branchForm,
          active: true,
        };
        setBranches((prev) => [...prev, newBranch]);
        setAlert({ type: 'success', message: `Branch "${branchForm.branchName}" added.` });
      }
      setIsBranchModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        if (isEditingBranch) {
          setBranches((prev) =>
            prev.map((b) => (b.branchId === branchForm.branchId ? { ...b, ...branchForm } : b))
          );
        } else {
          setBranches((prev) => [
            ...prev,
            {
              branchId: `br-${Date.now().toString().slice(-3)}`,
              collegeId: activeCollegeId,
              ...branchForm,
              active: true,
            },
          ]);
        }
        setAlert({ type: 'success', message: `[Preview Mode] Branch saved.` });
        setIsBranchModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to save branch.',
        });
      }
    } finally {
      setBranchModalLoading(false);
    }
  };

  // Status Toggles
  const handleToggleCourseActive = async (course) => {
    const nextStatus = !course.active;
    try {
      await courseService.updateCourseActive(course.courseId, nextStatus);
      setCourses((prev) =>
        prev.map((c) => (c.courseId === course.courseId ? { ...c, active: nextStatus } : c))
      );
      setAlert({
        type: 'success',
        message: `Program "${course.courseName}" is now ${nextStatus ? 'Active' : 'Inactive'}.`,
      });
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setCourses((prev) =>
          prev.map((c) => (c.courseId === course.courseId ? { ...c, active: nextStatus } : c))
        );
        setAlert({
          type: 'success',
          message: `[Preview Mode] Program status updated.`,
        });
      }
    }
  };

  const handleToggleBranchActive = async (branch) => {
    const nextStatus = !branch.active;
    try {
      await branchService.updateBranchActive(branch.branchId, nextStatus);
      setBranches((prev) =>
        prev.map((b) => (b.branchId === branch.branchId ? { ...b, active: nextStatus } : b))
      );
      setAlert({
        type: 'success',
        message: `Branch "${branch.branchName}" is now ${nextStatus ? 'Active' : 'Inactive'}.`,
      });
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setBranches((prev) =>
          prev.map((b) => (b.branchId === branch.branchId ? { ...b, active: nextStatus } : b))
        );
        setAlert({
          type: 'success',
          message: `[Preview Mode] Branch status updated.`,
        });
      }
    }
  };

  // Deletions
  const handleDeleteCourse = (course) => {
    setConfirmState({
      isOpen: true,
      type: 'course',
      id: course.courseId,
      name: course.courseName,
    });
  };

  const handleDeleteBranch = (branch) => {
    setConfirmState({
      isOpen: true,
      type: 'branch',
      id: branch.branchId,
      name: branch.branchName,
    });
  };

  const handleConfirmDelete = async () => {
    const { type, id, name } = confirmState;
    setConfirmState({ ...confirmState, isOpen: false });

    try {
      if (type === 'course') {
        await courseService.deleteCourse(id);
        setCourses((prev) => prev.filter((c) => c.courseId !== id));
        setBranches((prev) => prev.filter((b) => b.courseId !== id));
        setAlert({ type: 'success', message: `Program "${name}" removed.` });
      } else {
        await branchService.deleteBranch(id);
        setBranches((prev) => prev.filter((b) => b.branchId !== id));
        setAlert({ type: 'success', message: `Branch "${name}" removed.` });
      }
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        if (type === 'course') {
          setCourses((prev) => prev.filter((c) => c.courseId !== id));
          setBranches((prev) => prev.filter((b) => b.courseId !== id));
        } else {
          setBranches((prev) => prev.filter((b) => b.branchId !== id));
        }
        setAlert({ type: 'success', message: `[Preview Mode] ${name} removed.` });
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to delete record.',
        });
      }
    }
  };

  // Filtering
  const filteredCourses = courses.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.courseName?.toLowerCase().includes(q) ||
      c.courseCode?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  });

  const filteredBranches = branches.filter((b) => {
    const matchesCourse = selectedCourseFilter === 'ALL' || b.courseId === selectedCourseFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      b.branchName?.toLowerCase().includes(q) ||
      b.branchCode?.toLowerCase().includes(q) ||
      b.branchDescription?.toLowerCase().includes(q);
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap size={22} className="text-blue-800" />
            <h1 className="text-xl font-bold text-slate-900">
              Courses & Specialization Branches
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Establish academic curriculum degrees, duration timelines, and departmental disciplines
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Active College:
            </span>
            <Badge variant="primary">
              {activeCollegeName || activeCollegeId || 'Current Campus'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={loadAcademicData}
            disabled={isLoading}
            className="text-xs"
          >
            Refresh
          </Button>
          {canManageCourses && (
            <>
              <Button
                variant="secondary"
                icon={Plus}
                onClick={() => handleOpenCreateBranch()}
                className="text-xs"
              >
                Add Branch
              </Button>
              <Button
                variant="primary"
                icon={Plus}
                onClick={handleOpenCreateCourse}
                className="text-xs"
              >
                Register Program
              </Button>
            </>
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

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <BookOpen size={16} className="text-blue-800" />
            <span>Degree Programs</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{courses.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Approved academic programs</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <GitBranch size={16} className="text-emerald-700" />
            <span>Specialization Branches</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{branches.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Academic disciplines</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Clock size={16} className="text-amber-700" />
            <span>Standard Durations</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">2 - 4 Yrs</p>
          <p className="text-[11px] text-slate-500 mt-0.5">4 to 8 Semesters</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Layers size={16} className="text-purple-700" />
            <span>Curriculum Standing</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">AICTE / UGC</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Accredited curriculum</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('COURSES')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'COURSES'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen size={16} />
          <span>Degree Programs ({courses.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('BRANCHES')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'BRANCHES'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitBranch size={16} />
          <span>Academic Branches ({branches.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('STRUCTURE')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'STRUCTURE'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={16} />
          <span>Academic Tree & Hierarchy</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-96">
          <Input
            id="academicSearchInput"
            type="text"
            placeholder={
              activeTab === 'COURSES'
                ? 'Search degree programs by name or code...'
                : 'Search specialization branches...'
            }
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {activeTab === 'BRANCHES' && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Filter size={13} /> Program:
            </span>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="p-1.5 text-xs border border-slate-300 rounded bg-white font-medium focus:ring-1 focus:ring-blue-800"
            >
              <option value="ALL">All Degree Programs ({courses.length})</option>
              {courses.map((c) => (
                <option key={c.courseId} value={c.courseId}>
                  {c.courseCode} - {c.courseName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TAB Contents */}
      {activeTab === 'COURSES' && (
        <CourseTable
          courses={filteredCourses}
          branches={branches}
          isLoading={isLoading}
          onToggleActive={handleToggleCourseActive}
          onCreateBranch={handleOpenCreateBranch}
          onViewBranches={(courseId) => {
            setSelectedCourseFilter(courseId);
            setActiveTab('BRANCHES');
          }}
          onEditCourse={handleOpenEditCourse}
          onDeleteCourse={handleDeleteCourse}
          canManageCourses={canManageCourses}
        />
      )}

      {activeTab === 'BRANCHES' && (
        <BranchTable
          branches={filteredBranches}
          courses={courses}
          isLoading={isLoading}
          onToggleActive={handleToggleBranchActive}
          onEditBranch={handleOpenEditBranch}
          onDeleteBranch={handleDeleteBranch}
          canManageCourses={canManageCourses}
        />
      )}

      {activeTab === 'STRUCTURE' && (
        <AcademicStructureTree
          courses={courses}
          branches={branches}
          onCreateBranch={handleOpenCreateBranch}
          onEditBranch={handleOpenEditBranch}
          onDeleteBranch={handleDeleteBranch}
          canManageCourses={canManageCourses}
        />
      )}

      {/* Modals */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        isEditing={isEditingCourse}
        isLoading={courseModalLoading}
        formData={courseForm}
        setFormData={setCourseForm}
        onSubmit={handleCourseSubmit}
      />

      <BranchModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        isEditing={isEditingBranch}
        isLoading={branchModalLoading}
        formData={branchForm}
        setFormData={setBranchForm}
        courses={courses}
        onSubmit={handleBranchSubmit}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title={`Delete Academic ${confirmState.type === 'course' ? 'Program' : 'Branch'}`}
        message={`Are you sure you want to permanently delete "${confirmState.name}"?`}
        warning={
          confirmState.type === 'course'
            ? 'Deleting this degree program will also dissociate all attached specialization branches.'
            : 'Deleting this branch will affect all class sections and student enrollments assigned to it.'
        }
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};

export default CourseBranchManagementPage;
