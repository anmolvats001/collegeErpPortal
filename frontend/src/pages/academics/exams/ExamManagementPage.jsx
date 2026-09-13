import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useTenant } from '../../../hooks/useTenant';
import { examService } from '../../../services/examService';
import { classSubjectService } from '../../../services/classSubjectService';
import { teacherSubjectService } from '../../../services/teacherSubjectService';
import { classSectionService } from '../../../services/classSectionService';
import { subjectService } from '../../../services/subjectService';
import { studentClassService } from '../../../services/studentClassService';
import { ExamScheduleTable } from './components/ExamScheduleTable';
import { ExamResultTable } from './components/ExamResultTable';
import { CreateExamModal } from './components/CreateExamModal';
import { BulkGradeModal } from './components/BulkGradeModal';
import { AlertBanner } from '../../../components/common/AlertBanner';
import { Button } from '../../../components/common/Button';
import {
  Award,
  Calendar,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Loader2,
  GraduationCap,
} from 'lucide-react';

export const ExamManagementPage = () => {
  const { isMainAdmin, isCollegeAdmin, isTeacher, hasAnyPermission } = useAuth();
  const { currentCollege } = useTenant();

  const [activeTab, setActiveTab] = useState('TIMETABLE'); // 'TIMETABLE' | 'GRADES'
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classSubjects, setClassSubjects] = useState([]);
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [banner, setBanner] = useState({ show: false, message: '', type: 'info' });

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const canManage =
    hasAnyPermission(['PUBLISH_EXAM', 'SCHEDULE_EXAM', 'GRADE_EXAM']) ||
    isMainAdmin ||
    isCollegeAdmin ||
    isTeacher;

  useEffect(() => {
    loadAllData();
  }, [currentCollege?.id]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [examList, csList, tsList, classList, subList] = await Promise.all([
        examService.getAllExams(),
        classSubjectService.getAllClassSubjects().catch(() => []),
        teacherSubjectService.getAllTeacherSubjects().catch(() => []),
        classSectionService.getAllClasses().catch(() => []),
        subjectService.getAllSubjects().catch(() => []),
      ]);

      const rawExams = Array.isArray(examList) ? examList : [];
      const rawClasses = Array.isArray(classList) ? classList : [];
      const rawSubs = Array.isArray(subList) ? subList : [];
      const rawCS = Array.isArray(csList) ? csList : [];
      const rawTS = Array.isArray(tsList) ? tsList : [];

      // Enrich Class-Subjects with names and codes
      const enrichedCS = rawCS.map((cs) => {
        const cId = cs.classId || cs.classSectionId;
        const matchedClass = rawClasses.find((c) => (c.classId || c.id) === cId);
        const matchedSub = rawSubs.find((s) => (s.subjectId || s.id) === cs.subjectId);
        return {
          ...cs,
          id: cs.classSubjectId || cs.id,
          classSubjectId: cs.classSubjectId || cs.id,
          classId: cId,
          className: cs.className || matchedClass?.className || `Class ${cId}`,
          section: cs.section || matchedClass?.section || 'A',
          subjectName: cs.subjectName || matchedSub?.subjectName || 'Course',
          subjectCode: cs.subjectCode || matchedSub?.subjectCode || 'CODE',
        };
      });

      // Enrich Teacher-Subjects
      const enrichedTS = rawTS.map((ts) => ({
        ...ts,
        id: ts.teacherSubjectId || ts.id,
        teacherSubjectId: ts.teacherSubjectId || ts.id,
        teacherName: ts.teacherName || ts.teacherId || 'Faculty Member',
        subjectCode: ts.subjectCode || 'Course',
        className: ts.className || 'Class',
      }));

      setExams(rawExams);
      setClasses(rawClasses);
      setClassSubjects(enrichedCS);
      setTeacherSubjects(enrichedTS);

      if (rawExams.length > 0 && !selectedExam) {
        handleSelectExamForGrades(rawExams[0]);
      }
    } catch (err) {
      setBanner({
        show: true,
        message: 'Could not load exams. Running in offline preview mode.',
        type: 'warning',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectExamForGrades = async (exam) => {
    setSelectedExam(exam);
    try {
      const [resList, stuList] = await Promise.all([
        examService.getResultsOfExam(exam.examId),
        studentClassService.getStudentsOfClass(exam.classSubjectId || 'cls-001').catch(() => []),
      ]);

      setExamResults(Array.isArray(resList) ? resList : []);
      setEnrolledStudents(Array.isArray(stuList) ? stuList : []);
    } catch (err) {
      console.error('Failed to load exam grades', err);
    }
  };

  const handleOpenGradesTab = (exam) => {
    handleSelectExamForGrades(exam);
    setActiveTab('GRADES');
  };

  // Create or Update Exam
  const handleSaveExam = async (examData) => {
    if (editingExam) {
      const updated = await examService.updateExam(editingExam.examId, examData);
      setExams((prev) => prev.map((e) => (e.examId === editingExam.examId ? { ...e, ...updated } : e)));
      setBanner({ show: true, message: 'Exam schedule updated!', type: 'success' });
    } else {
      const created = await examService.createExam(examData);
      setExams((prev) => [created, ...prev]);
      setBanner({ show: true, message: 'New examination scheduled!', type: 'success' });
    }
    setEditingExam(null);
  };

  // Delete Exam
  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to remove this examination schedule?')) return;
    await examService.deleteExam(examId);
    setExams((prev) => prev.filter((e) => e.examId !== examId));
    if (selectedExam?.examId === examId) {
      setSelectedExam(null);
      setExamResults([]);
    }
    setBanner({ show: true, message: 'Examination deleted.', type: 'info' });
  };

  // Update Marks
  const handleUpdateMarks = async (resultId, marks) => {
    const updated = await examService.updateResultMarks(resultId, marks);
    setExamResults((prev) =>
      prev.map((r) => (r.resultId === resultId ? { ...r, ...updated } : r))
    );
    setBanner({ show: true, message: 'Student score updated.', type: 'success' });
  };

  // Delete Result
  const handleDeleteResult = async (resultId) => {
    await examService.deleteResult(resultId);
    setExamResults((prev) => prev.filter((r) => r.resultId !== resultId));
    setBanner({ show: true, message: 'Grade record deleted.', type: 'info' });
  };

  // Bulk commit
  const handleBulkSubmit = async ({ examId, results }) => {
    const committed = await examService.createBulkResults({ examId, results });
    setExamResults(committed);
    setBanner({
      show: true,
      message: `Committed scores for ${results.length} students!`,
      type: 'success',
    });
  };

  // Filter exams
  const filteredExams = exams.filter((e) => {
    const matchesSearch =
      (e.examName && e.examName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.subjectCode && e.subjectCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.examType && e.examType.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {banner.show && (
        <AlertBanner
          message={banner.message}
          type={banner.type}
          onClose={() => setBanner({ show: false, message: '', type: 'info' })}
        />
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Award className="text-blue-600" size={24} />
            <h1 className="text-lg font-bold text-slate-900">Examinations & Grade Book</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage academic test timetables, mid-term evaluations, practical vivas, and student marks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManage && (
            <Button
              variant="primary"
              onClick={() => {
                setEditingExam(null);
                setIsCreateModalOpen(true);
              }}
              icon={Plus}
              className="text-xs"
            >
              Schedule Exam
            </Button>
          )}
        </div>
      </div>

      {/* Tab Nav & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('TIMETABLE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'TIMETABLE'
                ? 'bg-white shadow-sm text-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar size={14} />
            <span>Timetable & Schedules ({exams.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('GRADES')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'GRADES'
                ? 'bg-white shadow-sm text-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet size={14} />
            <span>Grade Book & Scores</span>
          </button>
        </div>

        {/* Search and Filters for Timetable */}
        {activeTab === 'TIMETABLE' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        )}

        {/* Exam Selector for Grades Tab */}
        {activeTab === 'GRADES' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Active Exam:</span>
            <select
              value={selectedExam?.examId || ''}
              onChange={(e) => {
                const found = exams.find((ex) => ex.examId === e.target.value);
                if (found) handleSelectExamForGrades(found);
              }}
              className="text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium text-slate-800 max-w-xs truncate"
            >
              {exams.map((ex) => (
                <option key={ex.examId} value={ex.examId}>
                  {ex.examName} ({ex.subjectCode || 'Exam'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-xs">Loading examinations...</p>
        </div>
      ) : activeTab === 'TIMETABLE' ? (
        <ExamScheduleTable
          exams={filteredExams}
          onEditExam={(exam) => {
            setEditingExam(exam);
            setIsCreateModalOpen(true);
          }}
          onDeleteExam={handleDeleteExam}
          onOpenGrades={handleOpenGradesTab}
          canManage={canManage}
        />
      ) : (
        <ExamResultTable
          selectedExam={selectedExam}
          results={examResults}
          onUpdateMarks={handleUpdateMarks}
          onDeleteResult={handleDeleteResult}
          onOpenBulkModal={() => setIsBulkModalOpen(true)}
          canManage={canManage}
        />
      )}

      {/* Modals */}
      <CreateExamModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingExam(null);
        }}
        onSubmit={handleSaveExam}
        initialData={editingExam}
        classes={classes}
        classSubjects={classSubjects}
        teacherSubjects={teacherSubjects}
      />

      <BulkGradeModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        exam={selectedExam}
        students={enrolledStudents}
        existingResults={examResults}
        onSubmitBulk={handleBulkSubmit}
      />
    </div>
  );
};
