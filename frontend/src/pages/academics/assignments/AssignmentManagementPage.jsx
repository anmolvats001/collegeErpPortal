import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useTenant } from '../../../hooks/useTenant';
import { assignmentService } from '../../../services/assignmentService';
import { teacherSubjectService } from '../../../services/teacherSubjectService';
import { studentClassService } from '../../../services/studentClassService';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Badge } from '../../../components/common/Badge';
import { AlertBanner } from '../../../components/common/AlertBanner';
import { AssignmentTable } from './components/AssignmentTable';
import { CreateAssignmentModal } from './components/CreateAssignmentModal';
import { GradeAssignmentModal } from './components/GradeAssignmentModal';
import {
  FileText,
  Plus,
  RefreshCw,
  Search,
  Award,
  CheckCircle,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  IS_PREVIEW_MODE,
  MOCK_ASSIGNMENTS,
  MOCK_STUDENT_ASSIGNMENTS,
  MOCK_TEACHER_SUBJECTS,
  MOCK_STUDENT_CLASSES,
} from '../../../utils/mockData';

export const AssignmentManagementPage = () => {
  const { isMainAdmin, isCollegeAdmin, isTeacher, isStudent, hasAnyPermission } = useAuth();
  const { activeCollegeId, activeCollegeName } = useTenant();
  const canManage =
    hasAnyPermission(['CREATE_ASSIGNMENT', 'GRADE_ASSIGNMENT']) ||
    isMainAdmin ||
    isCollegeAdmin ||
    isTeacher;

  const [assignments, setAssignments] = useState(() => {
    if (!IS_PREVIEW_MODE) return [];
    const initial = MOCK_ASSIGNMENTS.filter((a) => a.collegeId === activeCollegeId || !a.collegeId);
    return initial.length > 0 ? initial : MOCK_ASSIGNMENTS;
  });

  const [teacherSubjects, setTeacherSubjects] = useState(
    IS_PREVIEW_MODE ? MOCK_TEACHER_SUBJECTS : []
  );

  const [studentClasses, setStudentClasses] = useState(
    IS_PREVIEW_MODE ? MOCK_STUDENT_CLASSES : []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);

  // Create Assignment Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalLoading, setCreateModalLoading] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    teacherSubjectId: '',
    assignmentName: '',
    description: '',
    maxMarks: 50,
    dueDate: '2026-09-30',
  });

  // Grade Assignment Modal State
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [gradeModalLoading, setGradeModalLoading] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [gradingRoster, setGradingRoster] = useState([]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tsRes, scRes] = await Promise.allSettled([
        teacherSubjectService.getAllTeacherSubjects(),
        studentClassService.getAllStudentClasses(),
      ]);

      if (tsRes.status === 'fulfilled') {
        const val = Array.isArray(tsRes.value) ? tsRes.value : tsRes.value?.data;
        if (Array.isArray(val)) setTeacherSubjects(val);
      }
      if (scRes.status === 'fulfilled') {
        const val = Array.isArray(scRes.value) ? scRes.value : scRes.value?.data;
        if (Array.isArray(val)) setStudentClasses(val);
      }
    } catch (error) {
      if (!IS_PREVIEW_MODE) {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to load assignments.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, activeCollegeId]);

  // Open Create Assignment
  const handleOpenCreateAssignment = () => {
    setAssignmentForm({
      teacherSubjectId: teacherSubjects[0]?.teacherSubjectId || '',
      assignmentName: '',
      description: '',
      maxMarks: 50,
      dueDate: '2026-09-30',
    });
    setIsCreateModalOpen(true);
  };

  // Submit Assignment Creation
  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!assignmentForm.teacherSubjectId) return;

    setCreateModalLoading(true);
    const targetTS = teacherSubjects.find(
      (ts) => ts.teacherSubjectId === assignmentForm.teacherSubjectId
    );

    try {
      const created = await assignmentService.createAssignment({
        assignmentName: assignmentForm.assignmentName,
        description: assignmentForm.description,
        maxMarks: Number(assignmentForm.maxMarks),
        classSubjectId: targetTS?.classSubjectId || '',
        teacherSubjectId: assignmentForm.teacherSubjectId,
      });

      const newAssignment = created || {
        assignmentId: `asg-${Date.now().toString().slice(-3)}`,
        collegeId: activeCollegeId,
        assignmentName: assignmentForm.assignmentName,
        description: assignmentForm.description,
        maxMarks: Number(assignmentForm.maxMarks),
        classSubjectId: targetTS?.classSubjectId || '',
        teacherSubjectId: assignmentForm.teacherSubjectId,
        subjectCode: targetTS?.subjectCode || 'CODE',
        subjectName: targetTS?.subjectName || 'Subject',
        className: targetTS?.className || 'Class',
        section: targetTS?.section || 'A',
        teacherName: targetTS?.teacherName || 'Faculty',
        dueDate: assignmentForm.dueDate,
        totalSubmissions: 30,
        gradedCount: 0,
      };

      setAssignments((prev) => [newAssignment, ...prev]);
      setAlert({
        type: 'success',
        message: `Coursework assignment "${assignmentForm.assignmentName}" published.`,
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        const newAssignment = {
          assignmentId: `asg-${Date.now().toString().slice(-3)}`,
          collegeId: activeCollegeId,
          assignmentName: assignmentForm.assignmentName,
          description: assignmentForm.description,
          maxMarks: Number(assignmentForm.maxMarks),
          classSubjectId: targetTS?.classSubjectId || '',
          teacherSubjectId: assignmentForm.teacherSubjectId,
          subjectCode: targetTS?.subjectCode || 'CODE',
          subjectName: targetTS?.subjectName || 'Subject',
          className: targetTS?.className || 'Class',
          section: targetTS?.section || 'A',
          teacherName: targetTS?.teacherName || 'Faculty',
          dueDate: assignmentForm.dueDate,
          totalSubmissions: 30,
          gradedCount: 0,
        };
        setAssignments((prev) => [newAssignment, ...prev]);
        setAlert({
          type: 'success',
          message: `[Preview Mode] Assignment "${assignmentForm.assignmentName}" published.`,
        });
        setIsCreateModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to publish assignment.',
        });
      }
    } finally {
      setCreateModalLoading(false);
    }
  };

  // Open Grading Modal
  const handleOpenGradeAssignment = async (asg) => {
    setActiveAssignment(asg);
    setGradeModalLoading(true);

    try {
      // Find candidate students enrolled in this assignment's class
      let eligibleStudents = studentClasses.filter(
        (sc) => sc.className === asg.className
      );

      if (eligibleStudents.length === 0) {
        eligibleStudents = studentClasses.slice(0, 4);
      }

      // Initialize grading roster with mock default scores
      const initialRoster = eligibleStudents.map((stu, i) => {
        const defaultScore = Math.min(asg.maxMarks, Math.round(asg.maxMarks * (0.75 + (i % 3) * 0.1)));
        return {
          studentClassId: stu.studentClassId,
          studentName: stu.studentName,
          enrollmentNumber: stu.enrollmentNumber,
          marks: defaultScore,
        };
      });

      setGradingRoster(initialRoster);
      setIsGradeModalOpen(true);
    } finally {
      setGradeModalLoading(false);
    }
  };

  // Change individual student marks
  const handleMarkChange = (studentClassId, marks) => {
    setGradingRoster((prev) =>
      prev.map((r) => (r.studentClassId === studentClassId ? { ...r, marks } : r))
    );
  };

  // Commit Grading Sheet
  const handleGradingSubmit = async () => {
    if (!activeAssignment) return;
    setGradeModalLoading(true);

    const marksPayload = gradingRoster.map((r) => ({
      assignmentId: activeAssignment.assignmentId,
      studentClassId: r.studentClassId,
      marks: Number(r.marks || 0),
    }));

    try {
      await assignmentService.bulkMarkAssignment({ marks: marksPayload });
      setAssignments((prev) =>
        prev.map((a) =>
          a.assignmentId === activeAssignment.assignmentId
            ? { ...a, gradedCount: gradingRoster.length }
            : a
        )
      );

      setAlert({
        type: 'success',
        message: `Marks committed for "${activeAssignment.assignmentName}".`,
      });
      setIsGradeModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setAssignments((prev) =>
          prev.map((a) =>
            a.assignmentId === activeAssignment.assignmentId
              ? { ...a, gradedCount: gradingRoster.length }
              : a
          )
        );

        setAlert({
          type: 'success',
          message: `[Preview Mode] Marks recorded for "${activeAssignment.assignmentName}".`,
        });
        setIsGradeModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to submit marks.',
        });
      }
    } finally {
      setGradeModalLoading(false);
    }
  };

  // Filtered Assignments
  const filteredAssignments = assignments.filter((a) => {
    const q = searchTerm.toLowerCase();
    return (
      (a.assignmentName && a.assignmentName.toLowerCase().includes(q)) ||
      (a.subjectName && a.subjectName.toLowerCase().includes(q)) ||
      (a.subjectCode && a.subjectCode.toLowerCase().includes(q)) ||
      (a.className && a.className.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText size={22} className="text-blue-800" />
            <h1 className="text-xl font-bold text-slate-900">
              Coursework & Assignment Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish academic assignments, problem rubrics, and grade student submissions
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
          {canManage && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleOpenCreateAssignment}
              className="text-xs"
            >
              Publish Assignment
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
            <FileText size={16} className="text-blue-800" />
            <span>Coursework Tasks</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{assignments.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Active assignments</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle size={16} className="text-emerald-700" />
            <span>Graded Rate</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">88%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Evaluated submissions</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Award size={16} className="text-amber-600" />
            <span>Average Score</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">82%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Cohort performance</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Calendar size={16} className="text-purple-700" />
            <span>Academic Term</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">2026</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Active evaluation cycle</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex items-center justify-between">
        <div className="w-full md:w-96">
          <Input
            id="asgSearchInput"
            type="text"
            placeholder="Search assignments by title, course, section..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <AssignmentTable
        assignments={filteredAssignments}
        isLoading={isLoading}
        onOpenGradeAssignment={handleOpenGradeAssignment}
        canManage={canManage}
      />

      {/* Modals */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        isLoading={createModalLoading}
        assignmentForm={assignmentForm}
        setAssignmentForm={setAssignmentForm}
        teacherSubjects={teacherSubjects}
        onSubmit={handleAssignmentSubmit}
      />

      <GradeAssignmentModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        isLoading={gradeModalLoading}
        activeAssignment={activeAssignment}
        gradingRoster={gradingRoster}
        onMarkChange={handleMarkChange}
        onSubmit={handleGradingSubmit}
      />
    </div>
  );
};

export default AssignmentManagementPage;
