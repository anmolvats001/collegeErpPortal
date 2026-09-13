import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import { classSectionService } from '../../services/classSectionService';
import { subjectService } from '../../services/subjectService';
import { classSubjectService } from '../../services/classSubjectService';
import { branchService } from '../../services/branchService';
import { courseService } from '../../services/courseService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { AlertBanner } from '../../components/common/AlertBanner';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ClassTable } from './components/ClassTable';
import { SubjectTable } from './components/SubjectTable';
import { ClassSubjectMappingTable } from './components/ClassSubjectMappingTable';
import { ClassModal } from './components/ClassModal';
import { SubjectModal } from './components/SubjectModal';
import { ClassSubjectModal } from './components/ClassSubjectModal';
import {
  Users,
  BookOpen,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Link as LinkIcon,
  Calendar,
} from 'lucide-react';
import {
  IS_PREVIEW_MODE,
  MOCK_CLASSES,
  MOCK_SUBJECTS,
  MOCK_CLASS_SUBJECTS,
  MOCK_BRANCHES,
  MOCK_COURSES,
} from '../../utils/mockData';

export const ClassSubjectManagementPage = () => {
  const { user, isMainAdmin, isCollegeAdmin, isTeacher, isStudent, hasPermission } = useAuth();
  const canManageClasses = hasPermission('MANAGE_CLASSES') || isMainAdmin || isCollegeAdmin;

  const { activeCollegeId, activeCollegeName } = useTenant();
  const location = useLocation();

  const getInitialTab = useCallback(() => {
    if (location.pathname.includes('/subjects')) return 'SUBJECTS';
    if (location.pathname.includes('/class-subject') || location.pathname.includes('/mapping')) return 'MAPPING';
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'subjects') return 'SUBJECTS';
    if (tabParam === 'mapping') return 'MAPPING';
    if (isStudent && !canManageClasses) return 'SUBJECTS';
    return 'CLASSES';
  }, [location.pathname, location.search, isStudent, canManageClasses]);

  const [classes, setClasses] = useState(() => {
    if (!IS_PREVIEW_MODE) return [];
    const initial = MOCK_CLASSES.filter((c) => c.collegeId === activeCollegeId || !c.collegeId);
    return initial.length > 0 ? initial : MOCK_CLASSES;
  });

  const [subjects, setSubjects] = useState(() => {
    if (!IS_PREVIEW_MODE) return [];
    const initial = MOCK_SUBJECTS.filter((s) => s.collegeId === activeCollegeId || !s.collegeId);
    return initial.length > 0 ? initial : MOCK_SUBJECTS;
  });

  const [classSubjects, setClassSubjects] = useState(
    IS_PREVIEW_MODE ? MOCK_CLASS_SUBJECTS : []
  );

  const [branches, setBranches] = useState(() => {
    if (!IS_PREVIEW_MODE) return [];
    const initial = MOCK_BRANCHES.filter((b) => b.collegeId === activeCollegeId || !b.collegeId);
    return initial.length > 0 ? initial : MOCK_BRANCHES;
  });

  const [courses, setCourses] = useState(() => {
    if (!IS_PREVIEW_MODE) return [];
    const initial = MOCK_COURSES.filter((c) => c.collegeId === activeCollegeId || !c.collegeId);
    return initial.length > 0 ? initial : MOCK_COURSES;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [getInitialTab]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('ALL');
  const [alert, setAlert] = useState(null);

  // Class Section Modal State
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isEditingClass, setIsEditingClass] = useState(false);
  const [classModalLoading, setClassModalLoading] = useState(false);
  const [classForm, setClassForm] = useState({
    classId: '',
    className: '',
    section: 'A',
    branchId: '',
    semester: 1,
    academicYear: 2026,
  });

  // Subject Modal State
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [subjectModalLoading, setSubjectModalLoading] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    subjectId: '',
    subjectName: '',
    subjectCode: '',
    credits: 4,
    semester: 1,
    courseId: '',
    description: '',
  });

  // Map Subject to Class Modal State
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [mappingModalLoading, setMappingModalLoading] = useState(false);
  const [mappingForm, setMappingForm] = useState({
    classId: '',
    subjectId: '',
  });

  // Confirm Modal State
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: 'class', // 'class' | 'subject' | 'mapping'
    id: null,
    name: '',
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [clsData, subData, mapData, brData, crsData] = await Promise.allSettled([
        classSectionService.getAllClasses(),
        subjectService.getAllSubjects(),
        classSubjectService.getAllClassSubjects(),
        branchService.getAllBranches(),
        courseService.getCoursesOfMyCollege(),
      ]);

      if (clsData.status === 'fulfilled') {
        const val = Array.isArray(clsData.value) ? clsData.value : clsData.value?.data;
        if (Array.isArray(val)) setClasses(val);
      }
      if (subData.status === 'fulfilled') {
        const val = Array.isArray(subData.value) ? subData.value : subData.value?.data;
        if (Array.isArray(val)) setSubjects(val);
      }
      if (mapData.status === 'fulfilled') {
        const val = Array.isArray(mapData.value) ? mapData.value : mapData.value?.data;
        if (Array.isArray(val)) setClassSubjects(val);
      }
      if (brData.status === 'fulfilled') {
        const val = Array.isArray(brData.value) ? brData.value : brData.value?.data;
        if (Array.isArray(val)) setBranches(val);
      }
      if (crsData.status === 'fulfilled') {
        const val = Array.isArray(crsData.value) ? crsData.value : crsData.value?.data;
        if (Array.isArray(val)) setCourses(val);
      }
    } catch (error) {
      if (!IS_PREVIEW_MODE) {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to load class and subject catalog.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, activeCollegeId]);

  // Open Create Class Modal
  const handleOpenCreateClass = () => {
    setIsEditingClass(false);
    setClassForm({
      classId: '',
      className: '',
      section: 'A',
      branchId: branches[0]?.branchId || '',
      semester: 1,
      academicYear: 2026,
    });
    setIsClassModalOpen(true);
  };

  // Open Edit Class Modal
  const handleOpenEditClass = (cls) => {
    setIsEditingClass(true);
    setClassForm({
      classId: cls.classId,
      className: cls.className,
      section: cls.section,
      branchId: cls.branchId || '',
      semester: cls.semester,
      academicYear: cls.academicYear,
    });
    setIsClassModalOpen(true);
  };

  // Submit Class Form
  const handleClassSubmit = async (e) => {
    e.preventDefault();
    if (!classForm.branchId) {
      setAlert({ type: 'danger', message: 'Please select a specialization branch.' });
      return;
    }

    setClassModalLoading(true);
    const selectedBranch = branches.find((b) => b.branchId === classForm.branchId);

    try {
      if (isEditingClass) {
        await classSectionService.updateClass(classForm.classId, {
          className: classForm.className,
          section: classForm.section,
          branchId: classForm.branchId,
          semester: Number(classForm.semester),
          academicYear: Number(classForm.academicYear),
        });
        setClasses((prev) =>
          prev.map((c) =>
            c.classId === classForm.classId
              ? {
                  ...c,
                  ...classForm,
                  branchName: selectedBranch?.branchName || c.branchName,
                }
              : c
          )
        );
        setAlert({ type: 'success', message: `Class section "${classForm.className}" updated.` });
      } else {
        const created = await classSectionService.createClass({
          className: classForm.className,
          section: classForm.section,
          branchId: classForm.branchId,
          semester: Number(classForm.semester),
          academicYear: Number(classForm.academicYear),
        });
        const newClass = created || {
          classId: `cls-${Date.now().toString().slice(-3)}`,
          collegeId: activeCollegeId,
          ...classForm,
          branchName: selectedBranch?.branchName || 'Specialization Branch',
          active: true,
        };
        setClasses((prev) => [...prev, newClass]);
        setAlert({
          type: 'success',
          message: `Class section "${classForm.className}" created for ${activeCollegeName}.`,
        });
      }
      setIsClassModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        if (isEditingClass) {
          setClasses((prev) =>
            prev.map((c) =>
              c.classId === classForm.classId
                ? {
                    ...c,
                    ...classForm,
                    branchName: selectedBranch?.branchName || c.branchName,
                  }
                : c
            )
          );
        } else {
          setClasses((prev) => [
            ...prev,
            {
              classId: `cls-${Date.now().toString().slice(-3)}`,
              collegeId: activeCollegeId,
              ...classForm,
              branchName: selectedBranch?.branchName || 'Specialization Branch',
              active: true,
            },
          ]);
        }
        setAlert({
          type: 'success',
          message: `[Preview Mode] Class section "${classForm.className}" saved for ${activeCollegeName}.`,
        });
        setIsClassModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to save class section.',
        });
      }
    } finally {
      setClassModalLoading(false);
    }
  };

  // Open Create Subject Modal
  const handleOpenCreateSubject = () => {
    setIsEditingSubject(false);
    setSubjectForm({
      subjectId: '',
      subjectName: '',
      subjectCode: '',
      credits: 4,
      semester: 1,
      courseId: courses[0]?.courseId || '',
      description: '',
    });
    setIsSubjectModalOpen(true);
  };

  // Open Edit Subject Modal
  const handleOpenEditSubject = (sub) => {
    setIsEditingSubject(true);
    setSubjectForm({
      subjectId: sub.subjectId,
      subjectName: sub.subjectName,
      subjectCode: sub.subjectCode,
      credits: sub.credits || 4,
      semester: sub.semester || 1,
      courseId: sub.courseId || '',
      description: sub.description || '',
    });
    setIsSubjectModalOpen(true);
  };

  // Submit Subject Form
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    if (!subjectForm.courseId) {
      setAlert({ type: 'danger', message: 'Please select a parent degree program.' });
      return;
    }

    setSubjectModalLoading(true);
    try {
      if (isEditingSubject) {
        await subjectService.updateSubject(subjectForm.subjectId, {
          subjectName: subjectForm.subjectName,
          subjectCode: subjectForm.subjectCode,
          credits: Number(subjectForm.credits),
          semester: Number(subjectForm.semester),
          courseId: subjectForm.courseId,
          description: subjectForm.description,
        });
        setSubjects((prev) =>
          prev.map((s) => (s.subjectId === subjectForm.subjectId ? { ...s, ...subjectForm } : s))
        );
        setAlert({ type: 'success', message: `Subject "${subjectForm.subjectName}" updated.` });
      } else {
        const created = await subjectService.createSubject({
          subjectName: subjectForm.subjectName,
          subjectCode: subjectForm.subjectCode,
          credits: Number(subjectForm.credits),
          semester: Number(subjectForm.semester),
          courseId: subjectForm.courseId,
          description: subjectForm.description,
        });
        const newSub = created || {
          subjectId: `sub-${Date.now().toString().slice(-3)}`,
          collegeId: activeCollegeId,
          ...subjectForm,
          active: true,
        };
        setSubjects((prev) => [...prev, newSub]);
        setAlert({
          type: 'success',
          message: `Subject "${subjectForm.subjectName}" registered for ${activeCollegeName}.`,
        });
      }
      setIsSubjectModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        if (isEditingSubject) {
          setSubjects((prev) =>
            prev.map((s) => (s.subjectId === subjectForm.subjectId ? { ...s, ...subjectForm } : s))
          );
        } else {
          setSubjects((prev) => [
            ...prev,
            {
              subjectId: `sub-${Date.now().toString().slice(-3)}`,
              collegeId: activeCollegeId,
              ...subjectForm,
              active: true,
            },
          ]);
        }
        setAlert({
          type: 'success',
          message: `[Preview Mode] Subject "${subjectForm.subjectName}" saved for ${activeCollegeName}.`,
        });
        setIsSubjectModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to save subject.',
        });
      }
    } finally {
      setSubjectModalLoading(false);
    }
  };

  // Open Map Subject to Class Modal
  const handleOpenMappingModal = (preselectedClassId = '') => {
    setMappingForm({
      classId: preselectedClassId || (classes[0]?.classId || ''),
      subjectId: subjects[0]?.subjectId || '',
    });
    setIsMappingModalOpen(true);
  };

  // Submit Map Subject to Class
  const handleMappingSubmit = async (e) => {
    e.preventDefault();
    if (!mappingForm.classId || !mappingForm.subjectId) return;

    setMappingModalLoading(true);
    const targetClass = classes.find((c) => c.classId === mappingForm.classId);
    const targetSubject = subjects.find((s) => s.subjectId === mappingForm.subjectId);

    try {
      const created = await classSubjectService.createClassSubject(
        mappingForm.classId,
        mappingForm.subjectId
      );
      const newMap = created || {
        classSubjectId: `cs-${Date.now().toString().slice(-3)}`,
        classId: mappingForm.classId,
        className: targetClass?.className || 'Class',
        section: targetClass?.section || 'A',
        subjectId: mappingForm.subjectId,
        subjectName: targetSubject?.subjectName || 'Subject',
        subjectCode: targetSubject?.subjectCode || 'CODE',
        semester: targetSubject?.semester || 1,
        active: true,
      };
      setClassSubjects((prev) => [...prev, newMap]);
      setAlert({
        type: 'success',
        message: `Allocated "${targetSubject?.subjectName}" to ${targetClass?.className}.`,
      });
      setIsMappingModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        const newMap = {
          classSubjectId: `cs-${Date.now().toString().slice(-3)}`,
          classId: mappingForm.classId,
          className: targetClass?.className || 'Class',
          section: targetClass?.section || 'A',
          subjectId: mappingForm.subjectId,
          subjectName: targetSubject?.subjectName || 'Subject',
          subjectCode: targetSubject?.subjectCode || 'CODE',
          semester: targetSubject?.semester || 1,
          active: true,
        };
        setClassSubjects((prev) => [...prev, newMap]);
        setAlert({
          type: 'success',
          message: `[Preview Mode] Allocated "${targetSubject?.subjectName}" to ${targetClass?.className}.`,
        });
        setIsMappingModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to map subject to class.',
        });
      }
    } finally {
      setMappingModalLoading(false);
    }
  };

  // Toggle Class Active
  const handleToggleClassActive = async (cls) => {
    const nextStatus = !cls.active;
    try {
      await classSectionService.updateClassActive(cls.classId, nextStatus);
      setClasses((prev) =>
        prev.map((c) => (c.classId === cls.classId ? { ...c, active: nextStatus } : c))
      );
      setAlert({
        type: 'success',
        message: `Class "${cls.className}" status set to ${nextStatus ? 'Active' : 'Suspended'}.`,
      });
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setClasses((prev) =>
          prev.map((c) => (c.classId === cls.classId ? { ...c, active: nextStatus } : c))
        );
        setAlert({
          type: 'success',
          message: `[Preview Mode] Class "${cls.className}" status set to ${nextStatus ? 'Active' : 'Suspended'}.`,
        });
      }
    }
  };

  // Toggle Subject Active
  const handleToggleSubjectActive = async (sub) => {
    const nextStatus = !sub.active;
    try {
      await subjectService.updateSubjectActive(sub.subjectId, nextStatus);
      setSubjects((prev) =>
        prev.map((s) => (s.subjectId === sub.subjectId ? { ...s, active: nextStatus } : s))
      );
      setAlert({
        type: 'success',
        message: `Subject "${sub.subjectName}" status set to ${nextStatus ? 'Active' : 'Suspended'}.`,
      });
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setSubjects((prev) =>
          prev.map((s) => (s.subjectId === sub.subjectId ? { ...s, active: nextStatus } : s))
        );
        setAlert({
          type: 'success',
          message: `[Preview Mode] Subject "${sub.subjectName}" status set to ${nextStatus ? 'Active' : 'Suspended'}.`,
        });
      }
    }
  };

  // Toggle ClassSubject Active
  const handleToggleMappingActive = async (mapItem) => {
    const nextStatus = !mapItem.active;
    try {
      await classSubjectService.updateActiveStatus(mapItem.classSubjectId, nextStatus);
      setClassSubjects((prev) =>
        prev.map((m) =>
          m.classSubjectId === mapItem.classSubjectId ? { ...m, active: nextStatus } : m
        )
      );
      setAlert({
        type: 'success',
        message: `Subject "${mapItem.subjectCode}" in ${mapItem.className} ${nextStatus ? 'activated' : 'deactivated'}.`,
      });
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setClassSubjects((prev) =>
          prev.map((m) =>
            m.classSubjectId === mapItem.classSubjectId ? { ...m, active: nextStatus } : m
          )
        );
        setAlert({
          type: 'success',
          message: `[Preview Mode] Subject "${mapItem.subjectCode}" in ${mapItem.className} ${nextStatus ? 'activated' : 'deactivated'}.`,
        });
      }
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    const { type, id, name } = confirmState;
    setConfirmState({ ...confirmState, isOpen: false });

    try {
      if (type === 'class') {
        await classSectionService.deleteClass(id);
        setClasses((prev) => prev.filter((c) => c.classId !== id));
        setClassSubjects((prev) => prev.filter((m) => m.classId !== id));
        setAlert({ type: 'success', message: `Class "${name}" deleted.` });
      } else if (type === 'subject') {
        await subjectService.deleteSubject(id);
        setSubjects((prev) => prev.filter((s) => s.subjectId !== id));
        setClassSubjects((prev) => prev.filter((m) => m.subjectId !== id));
        setAlert({ type: 'success', message: `Subject "${name}" deleted.` });
      } else if (type === 'mapping') {
        await classSubjectService.deleteClassSubject(id);
        setClassSubjects((prev) => prev.filter((m) => m.classSubjectId !== id));
        setAlert({ type: 'success', message: `Subject unmapped from class successfully.` });
      }
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        if (type === 'class') {
          setClasses((prev) => prev.filter((c) => c.classId !== id));
          setClassSubjects((prev) => prev.filter((m) => m.classId !== id));
        } else if (type === 'subject') {
          setSubjects((prev) => prev.filter((s) => s.subjectId !== id));
          setClassSubjects((prev) => prev.filter((m) => m.subjectId !== id));
        } else if (type === 'mapping') {
          setClassSubjects((prev) => prev.filter((m) => m.classSubjectId !== id));
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

  // Filtered Classes
  const filteredClasses = classes.filter((c) => {
    const matchesSearch =
      c.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.branchName && c.branchName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBranch =
      selectedBranchFilter === 'ALL' || c.branchId === selectedBranchFilter;
    return matchesSearch && matchesBranch;
  });

  // Filtered Subjects
  const filteredSubjects = subjects.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.subjectName.toLowerCase().includes(q) ||
      s.subjectCode.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q))
    );
  });

  // Filtered Mappings
  const filteredMappings = classSubjects.filter((m) => {
    const q = searchTerm.toLowerCase();
    return (
      m.className.toLowerCase().includes(q) ||
      m.subjectCode.toLowerCase().includes(q) ||
      m.subjectName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen size={22} className="text-blue-800" />
            <h1 className="text-xl font-bold text-slate-900">
              Class Cohorts, Subjects & Curriculum Allocation
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section management, semester course syllabus, and lecture curriculum mapping
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Institutional Scope:
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
          {canManageClasses && (
            <>
              <Button
                variant="secondary"
                icon={LinkIcon}
                onClick={() => handleOpenMappingModal()}
                className="text-xs"
              >
                Map Subject
              </Button>
              <Button
                variant="secondary"
                icon={Plus}
                onClick={handleOpenCreateSubject}
                className="text-xs"
              >
                Add Subject
              </Button>
              <Button
                variant="primary"
                icon={Plus}
                onClick={handleOpenCreateClass}
                className="text-xs"
              >
                Create Class
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

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Users size={16} className="text-blue-800" />
            <span>Class Cohorts</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{classes.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Active sections configured</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <BookOpen size={16} className="text-emerald-700" />
            <span>Curriculum Subjects</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{subjects.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Approved syllabus courses</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Layers size={16} className="text-purple-700" />
            <span>Mapped Allocations</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{classSubjects.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Class-subject bindings</p>
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
        {canManageClasses && (
          <button
            onClick={() => setActiveTab('CLASSES')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'CLASSES'
                ? 'border-blue-800 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users size={16} />
            <span>Class Sections ({classes.length})</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab('SUBJECTS')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'SUBJECTS'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen size={16} />
          <span>Subject Catalog ({subjects.length})</span>
        </button>
        {canManageClasses && (
          <button
            onClick={() => setActiveTab('MAPPING')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'MAPPING'
                ? 'border-blue-800 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon size={16} />
            <span>Curriculum Allocation Matrix ({classSubjects.length})</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-96">
          <Input
            id="classSubSearchInput"
            type="text"
            placeholder={
              activeTab === 'CLASSES'
                ? 'Search classes by name, section, branch...'
                : activeTab === 'SUBJECTS'
                ? 'Search subjects by title or code...'
                : 'Search curriculum allocations...'
            }
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {activeTab === 'CLASSES' && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Filter size={13} /> Branch:
            </span>
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="p-1.5 text-xs border border-slate-300 rounded bg-white font-medium focus:ring-1 focus:ring-blue-800"
            >
              <option value="ALL">All Disciplines ({branches.length})</option>
              {branches.map((b) => (
                <option key={b.branchId} value={b.branchId}>
                  {b.branchCode} - {b.branchName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Class Sections Table */}
      {activeTab === 'CLASSES' && (
        <ClassTable
          classes={filteredClasses}
          classSubjects={classSubjects}
          isLoading={isLoading}
          onOpenEditClass={handleOpenEditClass}
          onToggleClassActive={handleToggleClassActive}
          onDeleteClass={(cls) =>
            setConfirmState({
              isOpen: true,
              type: 'class',
              id: cls.classId,
              name: cls.className,
            })
          }
          onOpenMappingModal={handleOpenMappingModal}
          canManageClasses={canManageClasses}
        />
      )}

      {/* Tab 2: Subject Catalog Table */}
      {activeTab === 'SUBJECTS' && (
        <SubjectTable
          subjects={filteredSubjects}
          courses={courses}
          isLoading={isLoading}
          onOpenEditSubject={handleOpenEditSubject}
          onToggleSubjectActive={handleToggleSubjectActive}
          onDeleteSubject={(sub) =>
            setConfirmState({
              isOpen: true,
              type: 'subject',
              id: sub.subjectId,
              name: sub.subjectName,
            })
          }
          canManageClasses={canManageClasses}
        />
      )}

      {/* Tab 3: Class-Subject Allocation Matrix */}
      {activeTab === 'MAPPING' && (
        <ClassSubjectMappingTable
          classSubjects={filteredMappings}
          onToggleMappingActive={handleToggleMappingActive}
          onUnlinkMapping={(mapItem) =>
            setConfirmState({
              isOpen: true,
              type: 'mapping',
              id: mapItem.classSubjectId,
              name: `${mapItem.subjectCode} from ${mapItem.className}`,
            })
          }
          canManageClasses={canManageClasses}
        />
      )}

      {/* Modal 1: Create / Edit Class Section */}
      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        isEditing={isEditingClass}
        isLoading={classModalLoading}
        classForm={classForm}
        setClassForm={setClassForm}
        branches={branches}
        onSubmit={handleClassSubmit}
      />

      {/* Modal 2: Create / Edit Subject */}
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        isEditing={isEditingSubject}
        isLoading={subjectModalLoading}
        subjectForm={subjectForm}
        setSubjectForm={setSubjectForm}
        courses={courses}
        onSubmit={handleSubjectSubmit}
      />

      {/* Modal 3: Map Subject to Class */}
      <ClassSubjectModal
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
        isLoading={mappingModalLoading}
        mappingForm={mappingForm}
        setMappingForm={setMappingForm}
        classes={classes}
        subjects={subjects}
        onSubmit={handleMappingSubmit}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title={`Delete ${
          confirmState.type === 'class'
            ? 'Class Section'
            : confirmState.type === 'subject'
            ? 'Subject'
            : 'Allocation'
        }`}
        message={`Are you certain you wish to delete "${confirmState.name}"?`}
        warning="This will affect active student schedules, attendance rolls, and academic records."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};

export default ClassSubjectManagementPage;
