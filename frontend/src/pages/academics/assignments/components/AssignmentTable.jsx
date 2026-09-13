import React from 'react';
import { Badge } from '../../../../components/common/Badge';
import { Loader } from '../../../../components/common/Loader';
import { FileText, Calendar, Award, CheckCircle } from 'lucide-react';

export const AssignmentTable = ({
  assignments,
  isLoading,
  onOpenGradeAssignment,
  canManage = true,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
      {isLoading ? (
        <Loader message="Loading coursework assignments..." />
      ) : assignments.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <FileText size={36} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold">No coursework assignments found</p>
          <p className="text-xs mt-0.5">Click "Publish Assignment" to create an academic coursework task.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Assignment Title & Subject</th>
                <th className="py-3 px-4">Class Section Cohort</th>
                <th className="py-3 px-4">Max Marks</th>
                <th className="py-3 px-4">Submission Deadline</th>
                <th className="py-3 px-4">Grading Progress</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {assignments.map((asg) => {
                const total = asg.totalSubmissions || 30;
                const graded = asg.gradedCount || 25;
                const progressPercent = Math.round((graded / total) * 100);

                return (
                  <tr key={asg.assignmentId} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                            {asg.subjectCode}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">{asg.assignmentName}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 max-w-sm truncate mt-0.5">
                          {asg.description || 'Coursework assignment'}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                          {asg.className}
                        </span>
                        <span className="text-slate-500 font-normal">Sec {asg.section}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <Award size={13} className="text-amber-600" />
                        <span>{asg.maxMarks} Marks</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{asg.dueDate || '2026-09-25'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
                          <span>{graded} / {total} Graded</span>
                          <Badge variant={progressPercent === 100 ? 'success' : 'primary'}>
                            {progressPercent}%
                          </Badge>
                        </div>
                        <div className="w-28 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden border border-slate-200">
                          <div
                            className="h-full bg-blue-700 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {canManage ? (
                        <button
                          onClick={() => onOpenGradeAssignment(asg)}
                          className="px-2.5 py-1.5 text-xs font-semibold rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 inline-flex items-center gap-1.5"
                          title="Grade Student Submissions"
                        >
                          <CheckCircle size={13} />
                          <span>Grade Sheet</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle size={12} className="text-emerald-600" />
                          <span>Submitted</span>
                        </span>
                      )}
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
