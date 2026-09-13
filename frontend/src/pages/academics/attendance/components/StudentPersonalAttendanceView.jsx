import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../../../services/attendanceService';
import { Badge } from '../../../../components/common/Badge';
import { Button } from '../../../../components/common/Button';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  BookOpen,
  Filter,
  RefreshCw,
  Award,
  GraduationCap,
  ShieldAlert,
} from 'lucide-react';
import {
  IS_PREVIEW_MODE,
  MOCK_STUDENT_ATTENDANCE_SUMMARIES,
  MOCK_STUDENT_ATTENDANCE_LOG,
} from '../../../../utils/mockData';

export const StudentPersonalAttendanceView = ({ user }) => {
  const [summaries, setSummaries] = useState(() => (IS_PREVIEW_MODE ? MOCK_STUDENT_ATTENDANCE_SUMMARIES : []));
  const [logs, setLogs] = useState(() => (IS_PREVIEW_MODE ? MOCK_STUDENT_ATTENDANCE_LOG : []));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sumRes, logRes] = await Promise.allSettled([
        attendanceService.getMyAttendanceSummaries(),
        attendanceService.getMyAttendance(),
      ]);

      if (sumRes.status === 'fulfilled' && Array.isArray(sumRes.value)) {
        setSummaries(sumRes.value);
      }
      if (logRes.status === 'fulfilled' && Array.isArray(logRes.value)) {
        setLogs(logRes.value);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Aggregate stats
  const totalLectures = summaries.reduce((acc, s) => acc + (s.totalLectures || 0), 0);
  const attendedLectures = summaries.reduce((acc, s) => acc + (s.attendedLectures || 0), 0);
  const absentLectures = summaries.reduce((acc, s) => acc + (s.absentLectures || 0), 0);
  const exemptLectures = summaries.reduce((acc, s) => acc + (s.exemptLectures || 0), 0);
  const overallPercentage = totalLectures > 0 ? ((attendedLectures / totalLectures) * 100).toFixed(1) : 0;
  const isOverallEligible = Number(overallPercentage) >= 75;

  // Filtered logs
  const filteredLogs = logs.filter((log) => {
    const matchesSubject = selectedSubject === 'ALL' || log.subjectCode === selectedSubject;
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      (log.subjectName && log.subjectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.subjectCode && log.subjectCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.teacherName && log.teacherName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSubject && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap size={24} className="text-blue-800" />
            <h1 className="text-xl font-bold text-slate-900">
              My Attendance & Academic Turnout
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personal attendance ledger, course-wise percentage requirements, and lecture history.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="primary">
              {user?.className || 'CSE-3A'} • Sec {user?.section || 'A'}
            </Badge>
            <Badge variant="neutral">
              Roll No: {user?.rollNumber || 'CS-01'}
            </Badge>
            <Badge variant="neutral">
              Enrollment: {user?.enrollmentNumber || 'EN2024CS001'}
            </Badge>
          </div>
        </div>

        <Button
          variant="secondary"
          icon={RefreshCw}
          onClick={loadData}
          disabled={isLoading}
          className="text-xs self-start md:self-auto"
        >
          Refresh Records
        </Button>
      </div>

      {/* Exam Eligibility Banner */}
      {isOverallEligible ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded p-4 flex items-start gap-3">
          <CheckCircle2 size={22} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-emerald-900">
              Eligible for Term-End Final Examinations
            </h3>
            <p className="text-xs text-emerald-700 mt-0.5">
              Your overall attendance is <strong>{overallPercentage}%</strong>, comfortably above the university mandatory 75% threshold.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-300 rounded p-4 flex items-start gap-3">
          <ShieldAlert size={22} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">
              Defaulter Warning: Attendance Below 75%
            </h3>
            <p className="text-xs text-amber-700 mt-0.5">
              Your overall attendance is currently <strong>{overallPercentage}%</strong>. You must attend upcoming lectures regularly to avoid semester exam debarment.
            </p>
          </div>
        </div>
      )}

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Rate</span>
            <CalendarCheck size={16} className={isOverallEligible ? 'text-emerald-600' : 'text-amber-600'} />
          </div>
          <p className={`text-2xl font-black mt-2 ${isOverallEligible ? 'text-emerald-600' : 'text-amber-600'}`}>
            {overallPercentage}%
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${isOverallEligible ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(Number(overallPercentage), 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Min. required: 75%</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conducted</span>
            <BookOpen size={16} className="text-blue-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalLectures}</p>
          <p className="text-[11px] text-slate-500 mt-1">Total course sessions</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attended</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{attendedLectures}</p>
          <p className="text-[11px] text-slate-500 mt-1">Sessions present</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Missed</span>
            <XCircle size={16} className="text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600 mt-2">{absentLectures}</p>
          <p className="text-[11px] text-slate-500 mt-1">{exemptLectures} duty exemption(s)</p>
        </div>
      </div>

      {/* Subject-Wise Turnout Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={16} className="text-blue-800" />
            Subject-Wise Attendance Breakdown
          </h2>
          <span className="text-xs text-slate-500">{summaries.length} enrolled subjects</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summaries.map((sub) => {
            const isEligible = sub.attendancePercentage >= 75;
            return (
              <div
                key={sub.subjectCode}
                className="bg-white border border-slate-200 rounded p-4 shadow-sm hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {sub.subjectCode}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{sub.subjectName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Faculty: {sub.teacherName}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-lg font-black ${
                        isEligible ? 'text-emerald-700' : 'text-amber-600'
                      }`}
                    >
                      {sub.attendancePercentage}%
                    </span>
                    <div>
                      {isEligible ? (
                        <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          Low Attendance
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isEligible ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(sub.attendancePercentage, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  <span>Attended: <strong>{sub.attendedLectures}</strong> / {sub.totalLectures}</span>
                  <span>Absent: <strong>{sub.absentLectures}</strong></span>
                  {sub.exemptLectures > 0 && (
                    <span>Exempt: <strong>{sub.exemptLectures}</strong></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chronological Lecture History Log */}
      <div className="bg-white border border-slate-200 rounded shadow-sm">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck size={16} className="text-blue-800" />
              Lecture Attendance History
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Day-to-day session participation log recorded by course faculty
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search subject or faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="py-1 px-2 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Subjects</option>
              {summaries.map((s) => (
                <option key={s.subjectCode} value={s.subjectCode}>
                  {s.subjectCode}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1 px-2 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="EXEMPT">Exempt</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Date & Time</th>
                <th className="py-2.5 px-4">Subject</th>
                <th className="py-2.5 px-4">Faculty Instructor</th>
                <th className="py-2.5 px-4">Session Topic / Remarks</th>
                <th className="py-2.5 px-4">My Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No attendance records match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.recordId} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{log.attendanceDate}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {log.startTime} - {log.endTime}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{log.subjectCode}</div>
                      <div className="text-slate-500 text-[11px]">{log.subjectName}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {log.teacherName}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {log.remarks || 'Regular Lecture'}
                    </td>
                    <td className="py-3 px-4">
                      {log.status === 'PRESENT' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={12} /> Present
                        </span>
                      )}
                      {log.status === 'ABSENT' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                          <XCircle size={12} /> Absent
                        </span>
                      )}
                      {log.status === 'EXEMPT' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          <Award size={12} /> Exempt
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
