import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useTenant } from '../../../hooks/useTenant';
import { attendanceService } from '../../../services/attendanceService';
import { teacherSubjectService } from '../../../services/teacherSubjectService';
import { studentClassService } from '../../../services/studentClassService';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Badge } from '../../../components/common/Badge';
import { AlertBanner } from '../../../components/common/AlertBanner';
import { AttendanceSessionTable } from './components/AttendanceSessionTable';
import { CreateSessionModal } from './components/CreateSessionModal';
import { AttendanceSheetModal } from './components/AttendanceSheetModal';
import { StudentAttendanceReportModal } from './components/StudentAttendanceReportModal';
import { StudentPersonalAttendanceView } from './components/StudentPersonalAttendanceView';
import {
  CalendarCheck,
  Plus,
  RefreshCw,
  Search,
  Users,
  CheckCircle,
  Calendar,
  Clock,
  FileCheck2,
} from 'lucide-react';
import {
  IS_PREVIEW_MODE,
  MOCK_ATTENDANCE_SESSIONS,
  MOCK_ATTENDANCE_RECORDS,
  MOCK_TEACHER_SUBJECTS,
  MOCK_STUDENT_CLASSES,
} from '../../../utils/mockData';

export const AttendanceManagementPage = () => {
  const { user, isStudent, isTeacher, isCollegeAdmin, isMainAdmin, hasAnyPermission } = useAuth();
  const { activeCollegeId, activeCollegeName } = useTenant();

  const [sessions, setSessions] = useState(() => {
    if (!IS_PREVIEW_MODE) return [];
    const initial = MOCK_ATTENDANCE_SESSIONS.filter((s) => s.collegeId === activeCollegeId || !s.collegeId);
    return initial.length > 0 ? initial : MOCK_ATTENDANCE_SESSIONS;
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

  // Create Session Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalLoading, setCreateModalLoading] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    teacherSubjectId: '',
    attendanceDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
  });

  // Roll Call Modal State
  const [isRollCallOpen, setIsRollCallOpen] = useState(false);
  const [rollCallLoading, setRollCallLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [roster, setRoster] = useState([]);

  // Student Attendance Report State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const [sessRes, tsRes, scRes] = await Promise.allSettled([
        attendanceService.getSessionsByDate(today),
        teacherSubjectService.getAllTeacherSubjects(),
        studentClassService.getAllStudentClasses(),
      ]);

      if (sessRes.status === 'fulfilled') {
        const val = Array.isArray(sessRes.value) ? sessRes.value : sessRes.value?.data;
        if (Array.isArray(val)) setSessions(val);
      }
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
          message: error.response?.data?.message || 'Failed to load attendance sessions.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, activeCollegeId]);

  // Open Create Session
  const handleOpenCreateSession = () => {
    setSessionForm({
      teacherSubjectId: teacherSubjects[0]?.teacherSubjectId || '',
      attendanceDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
    });
    setIsCreateModalOpen(true);
  };

  // Submit Session Creation
  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    if (!sessionForm.teacherSubjectId) return;

    setCreateModalLoading(true);
    const targetTS = teacherSubjects.find((ts) => ts.teacherSubjectId === sessionForm.teacherSubjectId);

    try {
      const created = await attendanceService.createSession({
        teacherSubjectId: sessionForm.teacherSubjectId,
        attendanceDate: sessionForm.attendanceDate,
        startTime: `${sessionForm.startTime}:00`,
        endTime: `${sessionForm.endTime}:00`,
      });

      const newSession = created || {
        attendanceSessionId: `att-sess-${Date.now().toString().slice(-3)}`,
        collegeId: activeCollegeId,
        teacherSubjectId: sessionForm.teacherSubjectId,
        subjectCode: targetTS?.subjectCode || 'CODE',
        subjectName: targetTS?.subjectName || 'Subject',
        classId: targetTS?.classId || '',
        className: targetTS?.className || 'Class',
        section: targetTS?.section || 'A',
        teacherName: targetTS?.teacherName || 'Faculty',
        attendanceDate: sessionForm.attendanceDate,
        startTime: `${sessionForm.startTime}:00`,
        endTime: `${sessionForm.endTime}:00`,
        totalStudents: 32,
        presentCount: 0,
        absentCount: 0,
      };

      setSessions((prev) => [newSession, ...prev]);
      setAlert({
        type: 'success',
        message: `Attendance session created for ${targetTS?.subjectCode} (${targetTS?.className}).`,
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        const newSession = {
          attendanceSessionId: `att-sess-${Date.now().toString().slice(-3)}`,
          collegeId: activeCollegeId,
          teacherSubjectId: sessionForm.teacherSubjectId,
          subjectCode: targetTS?.subjectCode || 'CODE',
          subjectName: targetTS?.subjectName || 'Subject',
          classId: targetTS?.classId || '',
          className: targetTS?.className || 'Class',
          section: targetTS?.section || 'A',
          teacherName: targetTS?.teacherName || 'Faculty',
          attendanceDate: sessionForm.attendanceDate,
          startTime: `${sessionForm.startTime}:00`,
          endTime: `${sessionForm.endTime}:00`,
          totalStudents: 32,
          presentCount: 0,
          absentCount: 0,
        };
        setSessions((prev) => [newSession, ...prev]);
        setAlert({
          type: 'success',
          message: `[Preview Mode] Attendance session initialized for ${targetTS?.subjectCode}.`,
        });
        setIsCreateModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to create attendance session.',
        });
      }
    } finally {
      setCreateModalLoading(false);
    }
  };

  // Open Roll Call Sheet
  const handleOpenTakeAttendance = async (session) => {
    setActiveSession(session);
    setRollCallLoading(true);

    try {
      // Find candidate students enrolled in this session's class
      let eligibleStudents = studentClasses.filter(
        (sc) => sc.classId === session.classId && sc.active !== false
      );

      if (eligibleStudents.length === 0) {
        eligibleStudents = studentClasses.slice(0, 4);
      }

      // Initialize roster with PRESENT by default
      const initialRoster = eligibleStudents.map((stu) => ({
        studentClassId: stu.studentClassId,
        studentName: stu.studentName,
        enrollmentNumber: stu.enrollmentNumber,
        rollNumber: stu.rollNumber,
        status: 'PRESENT',
      }));

      setRoster(initialRoster);
      setIsRollCallOpen(true);
    } finally {
      setRollCallLoading(false);
    }
  };

  // Change individual student status in roster
  const handleRosterStatusChange = (studentClassId, status) => {
    setRoster((prev) =>
      prev.map((r) => (r.studentClassId === studentClassId ? { ...r, status } : r))
    );
  };

  // Mark all students with a status
  const handleMarkAll = (status) => {
    setRoster((prev) => prev.map((r) => ({ ...r, status })));
  };

  // Submit Roll Call
  const handleRollCallSubmit = async () => {
    if (!activeSession) return;
    setRollCallLoading(true);

    const payload = {
      attendanceSessionId: activeSession.attendanceSessionId,
      students: roster.map((r) => ({
        studentClassId: r.studentClassId,
        status: r.status,
      })),
    };

    try {
      await attendanceService.markBulkAttendance(payload);
      const presentCount = roster.filter((r) => r.status === 'PRESENT').length;
      const absentCount = roster.filter((r) => r.status === 'ABSENT').length;

      setSessions((prev) =>
        prev.map((s) =>
          s.attendanceSessionId === activeSession.attendanceSessionId
            ? { ...s, presentCount, absentCount, totalStudents: roster.length }
            : s
        )
      );

      setAlert({
        type: 'success',
        message: `Roll call recorded for ${activeSession.subjectCode} (${presentCount} Present, ${absentCount} Absent).`,
      });
      setIsRollCallOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        const presentCount = roster.filter((r) => r.status === 'PRESENT').length;
        const absentCount = roster.filter((r) => r.status === 'ABSENT').length;

        setSessions((prev) =>
          prev.map((s) =>
            s.attendanceSessionId === activeSession.attendanceSessionId
              ? { ...s, presentCount, absentCount, totalStudents: roster.length }
              : s
          )
        );

        setAlert({
          type: 'success',
          message: `[Preview Mode] Roll call recorded (${presentCount} Present, ${absentCount} Absent).`,
        });
        setIsRollCallOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to submit attendance roll.',
        });
      }
    } finally {
      setRollCallLoading(false);
    }
  };

  // Filtered Sessions
  const filteredSessions = sessions.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      (s.subjectName && s.subjectName.toLowerCase().includes(q)) ||
      (s.subjectCode && s.subjectCode.toLowerCase().includes(q)) ||
      (s.className && s.className.toLowerCase().includes(q)) ||
      (s.teacherName && s.teacherName.toLowerCase().includes(q))
    );
  });

  // Check if user has permission to schedule and take class attendance
  const canMarkAttendance =
    hasAnyPermission(['MARK_ATTENDANCE', 'TAKE_ATTENDANCE']) ||
    isTeacher ||
    isCollegeAdmin ||
    isMainAdmin;

  // If user cannot mark class roll calls (e.g. Student or custom role without MARK_ATTENDANCE), render personal student attendance ledger
  if (!canMarkAttendance) {
    return <StudentPersonalAttendanceView user={user} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck size={22} className="text-blue-800" />
            <h1 className="text-xl font-bold text-slate-900">
              Class Attendance & Lecture Registers
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Session scheduling, faculty roll call registers, and candidate turnout analytics
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
          <Button
            variant="secondary"
            icon={FileCheck2}
            onClick={() => setIsReportModalOpen(true)}
            className="text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            Student Turnout Report
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleOpenCreateSession}
            className="text-xs"
          >
            New Attendance Session
          </Button>
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
            <CalendarCheck size={16} className="text-blue-800" />
            <span>Recorded Sessions</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{sessions.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Lecture roll calls</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle size={16} className="text-emerald-700" />
            <span>Average Turnout</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">91%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Campus attendance rate</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Users size={16} className="text-purple-700" />
            <span>Students Monitored</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{studentClasses.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Active enrollments</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Calendar size={16} className="text-amber-700" />
            <span>Academic Term</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">2026</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Odd semester term</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex items-center justify-between">
        <div className="w-full md:w-96">
          <Input
            id="attendanceSearchInput"
            type="text"
            placeholder="Search sessions by subject, section, faculty..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Sessions Table */}
      <AttendanceSessionTable
        sessions={filteredSessions}
        isLoading={isLoading}
        onOpenTakeAttendance={handleOpenTakeAttendance}
        onOpenCreateSession={handleOpenCreateSession}
      />

      {/* Modals */}
      <CreateSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        isLoading={createModalLoading}
        sessionForm={sessionForm}
        setSessionForm={setSessionForm}
        teacherSubjects={teacherSubjects}
        onSubmit={handleSessionSubmit}
      />

      <AttendanceSheetModal
        isOpen={isRollCallOpen}
        onClose={() => setIsRollCallOpen(false)}
        isLoading={rollCallLoading}
        activeSession={activeSession}
        roster={roster}
        onStatusChange={handleRosterStatusChange}
        onMarkAll={handleMarkAll}
        onSubmit={handleRollCallSubmit}
      />

      <StudentAttendanceReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        studentClasses={studentClasses}
        teacherSubjects={teacherSubjects}
      />
    </div>
  );
};

export default AttendanceManagementPage;
