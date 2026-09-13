import React from 'react';
import { Badge } from '../../../../components/common/Badge';
import { Loader } from '../../../../components/common/Loader';
import { School, UserMinus, Calendar } from 'lucide-react';

export const StudentEnrollmentTable = ({
  studentClasses,
  isLoading,
  onToggleEnrollmentActive,
  onDeleteEnrollment,
  canManageStudents = true,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
      <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <span>
          Active roster showing student cohort allocations across degree sections and semesters.
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          Enrolled Records: {studentClasses.length}
        </span>
      </div>

      {isLoading ? (
        <Loader message="Loading enrollment matrix..." />
      ) : studentClasses.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <School size={36} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold">No active student-class enrollments found</p>
          <p className="text-xs mt-0.5">
            {canManageStudents
              ? 'Click "Enroll in Class" to allocate a student to a class cohort.'
              : 'No active class cohort allocations found.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Student Candidate</th>
                <th className="py-3 px-4">Allocated Class Section</th>
                <th className="py-3 px-4">Specialization Branch</th>
                <th className="py-3 px-4">Academic Term</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Status</th>
                {canManageStudents && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {studentClasses.map((sc) => (
                <tr key={sc.studentClassId} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{sc.studentName}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {sc.enrollmentNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span className="font-mono bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                        {sc.className}
                      </span>
                      <span className="text-slate-500 font-normal">Sec {sc.section}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800">
                      {sc.branchName || 'Discipline'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      <span>Sem {sc.semester}</span>
                      <span className="text-slate-300">•</span>
                      <span>{sc.academicYear}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                      {sc.rollNumber || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {canManageStudents ? (
                      <button
                        onClick={() => onToggleEnrollmentActive(sc)}
                        className="inline-flex items-center gap-1 cursor-pointer"
                        title="Toggle active enrollment"
                      >
                        {sc.active !== false ? (
                          <Badge variant="success">Enrolled</Badge>
                        ) : (
                          <Badge variant="neutral">Suspended</Badge>
                        )}
                      </button>
                    ) : (
                      sc.active !== false ? (
                        <Badge variant="success">Enrolled</Badge>
                      ) : (
                        <Badge variant="neutral">Suspended</Badge>
                      )
                    )}
                  </td>
                  {canManageStudents && (
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteEnrollment(sc)}
                        className="px-2 py-1 text-xs font-semibold rounded text-red-600 hover:bg-red-50 border border-red-200 flex items-center gap-1 inline-flex"
                        title="Withdraw / Unenroll Student from this Class"
                      >
                        <UserMinus size={12} />
                        <span>Unenroll</span>
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
