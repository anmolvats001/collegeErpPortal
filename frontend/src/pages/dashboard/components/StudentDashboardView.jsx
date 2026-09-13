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
  Clock,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  CreditCard,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  IS_PREVIEW_MODE,
  MOCK_STUDENT_ATTENDANCE_SUMMARIES,
  MOCK_ASSIGNMENTS,
} from '../../../utils/mockData';

export const StudentDashboardView = ({ user, activeCollegeName }) => {
  const summaries = IS_PREVIEW_MODE ? MOCK_STUDENT_ATTENDANCE_SUMMARIES : [];
  const assignmentsList = IS_PREVIEW_MODE ? MOCK_ASSIGNMENTS : [];
  const todaySchedule = IS_PREVIEW_MODE
    ? [
        {
          time: '09:00 - 10:00',
          subjectCode: 'CS-301',
          subjectName: 'Data Structures & Algorithms',
          room: 'LH-102 (Theory)',
          faculty: 'Prof. Sunita Verma',
          status: 'COMPLETED',
        },
        {
          time: '10:15 - 11:15',
          subjectCode: 'CS-302',
          subjectName: 'Database Management Systems',
          room: 'CS Lab 3 (Practical)',
          faculty: 'Dr. Amit Patel',
          status: 'ONGOING',
        },
        {
          time: '11:30 - 12:30',
          subjectCode: 'MATH-301',
          subjectName: 'Discrete Mathematical Structures',
          room: 'LH-104 (Lecture)',
          faculty: 'Ramesh Gupta',
          status: 'UPCOMING',
        },
        {
          time: '14:00 - 15:00',
          subjectCode: 'CS-303',
          subjectName: 'Computer Organization & Architecture',
          room: 'LH-101 (Lecture)',
          faculty: 'Prof. Sunita Verma',
          status: 'UPCOMING',
        },
      ]
    : [];

  // Turnout calculation
  const totalLectures = summaries.reduce((acc, s) => acc + (s.totalLectures || 0), 0);
  const attendedLectures = summaries.reduce((acc, s) => acc + (s.attendedLectures || 0), 0);
  const overallRate = totalLectures > 0 ? ((attendedLectures / totalLectures) * 100).toFixed(1) : 0;
  const isEligible = Number(overallRate) >= 75;

  const defaulterSubjects = summaries.filter((s) => (s.attendancePercentage || 0) < 75);

  return (
    <div className="space-y-6">
      {/* Student Welcome Hero */}
      <div className="bg-gradient-to-r from-[#0f2942] to-blue-900 text-white rounded p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
              Student Academic Portal
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded border border-blue-400 bg-blue-700/80 text-white shadow-xs">
              Semester {user?.semester || 3}
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1">
            Welcome back, {user?.userName || 'Rahul Mehta'}!
          </h1>
          <p className="text-xs text-blue-200 mt-1">
            {user?.branchName || 'Computer Science & Engineering'} • Class {user?.className || 'CSE-3A'} (Sec {user?.section || 'A'})
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-300">
            <span>Roll No: <strong>{user?.rollNumber || 'CS-01'}</strong></span>
            <span>•</span>
            <span>Enrollment: <strong>{user?.enrollmentNumber || 'EN2024CS001'}</strong></span>
            <span>•</span>
            <span>Campus: <strong>{activeCollegeName || 'Main Campus'}</strong></span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <Link
            to="/attendance"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
          >
            <CalendarCheck size={16} />
            <span>My Attendance ({overallRate}%)</span>
          </Link>
          <Link
            to="/assignments"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
          >
            <FileText size={16} />
            <span>Assignments</span>
          </Link>
        </div>
      </div>

      {/* Defaulter Alert If Any Course < 75% */}
      {defaulterSubjects.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded p-4 flex items-start gap-3 shadow-xs">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              Subject Attendance Alert
            </h3>
            <p className="text-xs text-amber-800 mt-0.5">
              You are running below the 75% mandatory threshold in:{' '}
              {defaulterSubjects.map((s, idx) => (
                <strong key={s.subjectCode}>
                  {s.subjectCode} ({s.attendancePercentage}%){idx < defaulterSubjects.length - 1 ? ', ' : ''}
                </strong>
              ))}
              . Please attend consecutive lectures to regain term exam eligibility.
            </p>
          </div>
          <Link
            to="/attendance"
            className="text-xs font-semibold text-amber-900 underline hover:text-amber-700 shrink-0"
          >
            Review Ledger
          </Link>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/attendance" className="block hover:opacity-95 transition">
          <StatCard
            title="My Attendance Rate"
            value={`${overallRate}%`}
            icon={CalendarCheck}
            color={isEligible ? 'success' : 'warning'}
            subtext={isEligible ? 'Eligible for term exams' : 'Attention required (<75%)'}
          />
        </Link>

        <Link to="/subjects" className="block hover:opacity-95 transition">
          <StatCard
            title="Enrolled Subjects"
            value="4 Subjects"
            icon={BookOpen}
            color="primary"
            subtext="3 Theory, 1 Lab Course"
          />
        </Link>

        <Link to="/assignments" className="block hover:opacity-95 transition">
          <StatCard
            title="Pending Assignments"
            value="2 Tasks"
            icon={FileText}
            color="accent"
            subtext="Due by September 25"
          />
        </Link>

        <Link to="/exams" className="block hover:opacity-95 transition">
          <StatCard
            title="Upcoming Exams"
            value="3 Papers"
            icon={Award}
            color="warning"
            subtext="Mid-Semester Timetable"
          />
        </Link>
      </div>

      {/* Two Column Layout: Today's Lectures & Academic Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Today's Lecture Schedule"
            subtitle="Real-time class schedule & attendance status"
          >
            {todaySchedule.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No lectures scheduled for today.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {todaySchedule.map((item, idx) => (
                  <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 shrink-0 font-mono text-xs font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{item.subjectCode}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-xs text-slate-700 font-medium">{item.subjectName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {item.time}
                          </span>
                          <span>•</span>
                          <span>{item.room}</span>
                          <span>•</span>
                          <span>{item.faculty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 self-start sm:self-auto">
                      {item.status === 'COMPLETED' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 size={12} /> Present
                        </span>
                      )}
                      {item.status === 'ONGOING' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded animate-pulse">
                          <Clock size={12} /> In Progress
                        </span>
                      )}
                      {item.status === 'UPCOMING' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Subject Attendance Summary */}
          <Card
            title="My Course Turnout Summary"
            subtitle="Individual breakdown per enrolled course subject"
          >
            {summaries.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No course turnout records available yet for this semester.
              </div>
            ) : (
              <div className="space-y-3">
                {summaries.map((sub) => {
                  const isSubEligible = sub.attendancePercentage >= 75;
                  return (
                    <div key={sub.subjectCode} className="p-3 border border-slate-200 rounded bg-slate-50/50">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="font-bold text-slate-800">
                          {sub.subjectCode} - {sub.subjectName}
                        </div>
                        <div className="font-mono font-bold">
                          <span className={isSubEligible ? 'text-emerald-700' : 'text-amber-600'}>
                            {sub.attendancePercentage}%
                          </span>
                          <span className="text-slate-400 font-normal text-[11px] ml-1">
                            ({sub.attendedLectures}/{sub.totalLectures} lectures)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${isSubEligible ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${Math.min(sub.attendancePercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Deadlines, Fees & Notices */}
        <div className="space-y-6">
          {/* Pending Deadlines */}
          <Card
            title="Upcoming Submissions"
            subtitle="Assignment homework due dates"
          >
            {assignmentsList.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No pending assignment submissions.
              </div>
            ) : (
              <div className="space-y-3">
                {assignmentsList.slice(0, 3).map((asg) => (
                <div
                  key={asg.assignmentId}
                  className="p-3 border border-slate-200 rounded hover:border-slate-300 transition bg-white"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                      {asg.subjectCode}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Due {asg.dueDate}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                    {asg.assignmentName}
                  </h4>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500">Max Marks: {asg.maxMarks}</span>
                    <Link
                      to="/assignments"
                      className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-800"
                    >
                      <span>Submit Work</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            )}
          </Card>

          {/* Fee & Accounts Status */}
          <Card
            title="Fee Accounts & Dues"
            subtitle="Academic year 2026 billing status"
          >
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-semibold">Odd Semester Dues</span>
                <Badge variant="success">All Cleared</Badge>
              </div>
              <p className="text-xl font-black text-slate-900 mt-1">₹0.00</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Full tuition & examination fees settled.
              </p>
              <Link
                to="/fees"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900"
              >
                <span>View Fee Receipt & Ledger</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </Card>

          {/* Campus Bulletin Shortcut */}
          <Card
            title="Institutional Notices"
            subtitle="Recent circulars from Academic Office"
          >
            <div className="space-y-2 text-xs">
              <div className="p-2 border-l-2 border-blue-700 bg-slate-50">
                <p className="font-bold text-slate-900">Mid-Semester Exam Timetable</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Commencing October 5, 2026.</p>
              </div>
              <div className="p-2 border-l-2 border-emerald-600 bg-slate-50">
                <p className="font-bold text-slate-900">Library Book Return Clearance</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Before semester exams registration.</p>
              </div>
              <Link
                to="/notices"
                className="block text-center text-xs font-semibold text-blue-700 hover:underline pt-1"
              >
                View All Academic Notices →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
