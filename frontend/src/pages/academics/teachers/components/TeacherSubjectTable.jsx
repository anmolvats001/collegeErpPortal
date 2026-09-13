import React from 'react';
import { Badge } from '../../../../components/common/Badge';
import { Loader } from '../../../../components/common/Loader';
import { BookOpen, UserMinus } from 'lucide-react';

export const TeacherSubjectTable = ({
  teacherSubjects,
  isLoading,
  onToggleAssignmentActive,
  onDeleteAssignment,
  canManageFaculty = true,
  canAssignSubjects = true,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
      <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <span>
          Faculty curriculum assignments associating professors and lecturers to class sections and syllabus courses.
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          Total Allocations: {teacherSubjects.length}
        </span>
      </div>

      {isLoading ? (
        <Loader message="Loading faculty teaching matrix..." />
      ) : teacherSubjects.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <BookOpen size={36} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold">No faculty subject allocations found</p>
          <p className="text-xs mt-0.5">
            {canAssignSubjects
              ? 'Click "Assign Subject" to designate an instructor for a class course.'
              : 'No faculty teaching allocations configured yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Faculty Instructor</th>
                <th className="py-3 px-4">Subject & Code</th>
                <th className="py-3 px-4">Class Section Cohort</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Teaching Status</th>
                {(canAssignSubjects || canManageFaculty) && (
                  <th className="py-3 px-4 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {teacherSubjects.map((ts) => (
                <tr key={ts.teacherSubjectId} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{ts.teacherName}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      Emp ID: {ts.employeeId}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                        {ts.subjectCode}
                      </span>
                      <span className="font-semibold text-slate-900">{ts.subjectName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span className="font-mono bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                        {ts.className}
                      </span>
                      <span className="text-slate-500 font-normal">Sec {ts.section}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    Semester {ts.semester}
                  </td>
                  <td className="py-3 px-4">
                    {canAssignSubjects || canManageFaculty ? (
                      <button
                        onClick={() => onToggleAssignmentActive(ts)}
                        className="inline-flex items-center gap-1 cursor-pointer"
                        title="Toggle active assignment"
                      >
                        {ts.active !== false ? (
                          <Badge variant="success">Assigned</Badge>
                        ) : (
                          <Badge variant="neutral">Suspended</Badge>
                        )}
                      </button>
                    ) : (
                      ts.active !== false ? (
                        <Badge variant="success">Assigned</Badge>
                      ) : (
                        <Badge variant="neutral">Suspended</Badge>
                      )
                    )}
                  </td>
                  {(canAssignSubjects || canManageFaculty) && (
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteAssignment(ts)}
                        className="px-2 py-1 text-xs font-semibold rounded text-red-600 hover:bg-red-50 border border-red-200 flex items-center gap-1 inline-flex"
                        title="Unassign Faculty from this Subject"
                      >
                        <UserMinus size={12} />
                        <span>Unassign</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
