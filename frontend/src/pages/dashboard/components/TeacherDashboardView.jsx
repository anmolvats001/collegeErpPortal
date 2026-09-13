import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/common/Badge';
import { StatCard } from '../../../components/common/StatCard';
import { Card } from '../../../components/common/Card';
import {
  CalendarCheck,
  BookOpen,
  FileText,
  Award,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import {
  IS_PREVIEW_MODE,
  MOCK_TEACHER_SUBJECTS,
  MOCK_ATTENDANCE_SESSIONS,
  MOCK_ASSIGNMENTS,
} from '../../../utils/mockData';

export const TeacherDashboardView = ({ user, activeCollegeName }) => {
  const teacherLectures = IS_PREVIEW_MODE
    ? [
        {
          sessionId: 'att-sess-001',
          subjectCode: 'CS-301',
          subjectName: 'Data Structures & Algorithms',
          className: 'CSE-3A',
          section: 'A',
          time: '09:00 - 10:00',
          room: 'LH-102',
          status: 'RECORDED',
          totalStudents: 32,
          presentCount: 29,
        },
        {
          sessionId: 'att-sess-102',
          subjectCode: 'CS-301',
          subjectName: 'Data Structures Lab (Batch 1)',
          className: 'CSE-3A',
          section: 'A',
          time: '11:30 - 13:30',
          room: 'Computer Lab 2',
          status: 'PENDING',
          totalStudents: 32,
          presentCount: 0,
        },
        {
          sessionId: 'att-sess-103',
          subjectCode: 'CS-303',
          subjectName: 'Computer Organization & Architecture',
          className: 'CSE-3A',
          section: 'A',
          time: '14:00 - 15:00',
          room: 'LH-101',
          status: 'UPCOMING',
          totalStudents: 32,
          presentCount: 0,
        },
      ]
    : [];

  const assignedSubjects = IS_PREVIEW_MODE ? MOCK_TEACHER_SUBJECTS.slice(0, 2) : [];
  const gradingTasks = IS_PREVIEW_MODE ? MOCK_ASSIGNMENTS.slice(0, 2) : [];

  return (
    <div className="space-y-6">
      {/* Teacher Welcome Hero */}
      <div className="bg-gradient-to-r from-[#0f2942] to-indigo-900 text-white rounded p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Faculty Instruction Portal
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded border border-indigo-400 bg-indigo-700/80 text-white shadow-xs">
              Teaching Faculty
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1">
            Welcome, {user?.userName || 'Prof. Sunita Verma'}!
          </h1>
          <p className="text-xs text-indigo-200 mt-1">
            {user?.department || 'Department of Computer Science & Engineering'} • {activeCollegeName || 'Main Campus'}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-300">
            <span>Faculty ID: <strong>{user?.employeeId || user?.userId || 'FAC-102'}</strong></span>
            <span>•</span>
            <span>Assigned Courses: <strong>2 Active Allocations</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <Link
            to="/attendance"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
          >
            <CalendarCheck size={16} />
            <span>Mark Roll Call</span>
          </Link>
          <Link
            to="/assignments"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
          >
            <Plus size={16} />
            <span>New Assignment</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/classes" className="block hover:opacity-95 transition">
          <StatCard
            title="Assigned Classes"
            value="2 Cohorts"
            icon={Users}
            color="primary"
            subtext="CSE-3A, CSE-3B"
          />
        </Link>

        <Link to="/attendance" className="block hover:opacity-95 transition">
          <StatCard
            title="Today's Lectures"
            value="3 Sessions"
            icon={CalendarCheck}
            color="accent"
            subtext="1 Marked, 1 Pending"
          />
        </Link>

        <Link to="/attendance" className="block hover:opacity-95 transition">
          <StatCard
            title="Attendance Status"
            value="90.6%"
            icon={UserCheck}
            color="success"
            subtext="Class average turnout"
          />
        </Link>

        <Link to="/assignments" className="block hover:opacity-95 transition">
          <StatCard
            title="Submissions to Grade"
            value="8 Pending"
            icon={FileText}
            color="warning"
            subtext="Lab Practical 1"
          />
        </Link>
      </div>

      {/* Two Column Layout: Today's Roll Calls & Grading Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Teaching Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Today's Lecture Schedule & Attendance Registers"
            subtitle="Record student roll calls and session turnout"
          >
            {teacherLectures.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No teaching lectures scheduled for today.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {teacherLectures.map((lec) => (
                  <div key={lec.sessionId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{lec.subjectCode}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-700">{lec.subjectName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="font-bold text-blue-800">{lec.className}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {lec.time}
                        </span>
                        <span>•</span>
                        <span>{lec.room}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {lec.status === 'RECORDED' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            ✓ {lec.presentCount}/{lec.totalStudents} Present
                          </span>
                          <Link
                            to="/attendance"
                            className="text-xs font-medium text-blue-700 hover:underline"
                          >
                            View Sheet
                          </Link>
                        </div>
                      ) : (
                        <Link
                          to="/attendance"
                          className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 px-3 py-1.5 rounded transition shadow-xs"
                        >
                          <CalendarCheck size={13} />
                          <span>Take Roll Call</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Assigned Teaching Courses */}
          <Card
            title="My Allocated Courses & Subjects"
            subtitle="Teaching subjects assigned by department head"
          >
            {assignedSubjects.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No teaching subjects assigned yet for this academic year.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assignedSubjects.map((ts) => (
                  <div key={ts.teacherSubjectId} className="p-3 border border-slate-200 rounded bg-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                        {ts.subjectCode}
                      </span>
                      <Badge variant="neutral">{ts.className}</Badge>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1.5">{ts.subjectName}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
                      <span>Semester {ts.semester}</span>
                      <Link to="/attendance" className="text-blue-700 font-semibold hover:underline">
                        Attendance Log →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Grading Queue & Quick Faculty Actions */}
        <div className="space-y-6">
          {/* Assignment Grading Queue */}
          <Card
            title="Grading Tasks"
            subtitle="Student submissions waiting for review"
          >
            {gradingTasks.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No pending assignment grading tasks.
              </div>
            ) : (
              <div className="space-y-3">
                {gradingTasks.map((asg) => (
                  <div key={asg.assignmentId} className="p-3 border border-slate-200 rounded bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                        {asg.className}
                      </span>
                      <span className="text-[11px] font-bold text-amber-600">
                        {asg.totalSubmissions - asg.gradedCount} Unchecked
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                      {asg.assignmentName}
                    </h5>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500">{asg.gradedCount}/{asg.totalSubmissions} graded</span>
                      <Link
                        to="/assignments"
                        className="text-xs font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        <span>Grade Now</span>
                        <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions Shortcuts */}
          <Card
            title="Faculty Tools"
            subtitle="Direct operational links"
          >
            <div className="space-y-2 text-xs">
              <Link
                to="/attendance"
                className="flex items-center justify-between p-2 rounded hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium"
              >
                <div className="flex items-center gap-2">
                  <CalendarCheck size={15} className="text-blue-800" />
                  <span>Class Roll Call Sheet</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </Link>
              <Link
                to="/students"
                className="flex items-center justify-between p-2 rounded hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-indigo-700" />
                  <span>Student Directory</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </Link>
              <Link
                to="/exams"
                className="flex items-center justify-between p-2 rounded hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Award size={15} className="text-amber-700" />
                  <span>Examinations & Grade Book</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </Link>
              <Link
                to="/notices"
                className="flex items-center justify-between p-2 rounded hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium"
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={15} className="text-purple-700" />
                  <span>Publish Academic Notice</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
