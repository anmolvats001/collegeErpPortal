import React from 'react';
import { Badge } from '../../../../components/common/Badge';
import { Loader } from '../../../../components/common/Loader';
import { CalendarCheck, Clock, Calendar, CheckCircle, Users } from 'lucide-react';

export const AttendanceSessionTable = ({
  sessions,
  isLoading,
  onOpenTakeAttendance,
  onOpenCreateSession,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
      {isLoading ? (
        <Loader message="Loading attendance sessions..." />
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <CalendarCheck size={36} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold">No attendance sessions recorded</p>
          <p className="text-xs mt-0.5">Click "New Attendance Session" to initiate a roll-call lecture slot.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Subject & Lecture</th>
                <th className="py-3 px-4">Class Section Cohort</th>
                <th className="py-3 px-4">Session Schedule</th>
                <th className="py-3 px-4">Faculty Instructor</th>
                <th className="py-3 px-4">Attendance Turnout</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sessions.map((sess) => {
                const total = sess.totalStudents || 30;
                const present = sess.presentCount ?? 28;
                const percentage = Math.round((present / total) * 100);

                return (
                  <tr key={sess.attendanceSessionId} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                          {sess.subjectCode}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block">{sess.subjectName}</span>
                          <span className="font-mono text-[10px] text-slate-400">
                            ID: {sess.attendanceSessionId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                          {sess.className}
                        </span>
                        <span className="text-slate-500 font-normal">Sec {sess.section}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="space-y-0.5 text-[11px]">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{sess.attendanceDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock size={12} className="text-slate-400" />
                          <span>
                            {sess.startTime?.slice(0, 5)} - {sess.endTime?.slice(0, 5)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900 block">
                        {sess.teacherName || 'Faculty Instructor'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
                          <span>{present} / {total} Present</span>
                          <Badge variant={percentage >= 75 ? 'success' : 'warning'}>
                            {percentage}%
                          </Badge>
                        </div>
                        <div className="w-28 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              percentage >= 75 ? 'bg-emerald-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenTakeAttendance(sess)}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 inline-flex items-center gap-1.5"
                        title="Open Attendance Sheet"
                      >
                        <CheckCircle size={13} />
                        <span>Roll Call</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
