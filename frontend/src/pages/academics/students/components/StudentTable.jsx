import React from 'react';
import { Badge } from '../../../../components/common/Badge';
import { Loader } from '../../../../components/common/Loader';
import { GraduationCap, Mail, Phone, Edit2, Trash2, School } from 'lucide-react';

export const StudentTable = ({
  students,
  studentClasses,
  isLoading,
  onOpenEditStudent,
  onToggleStudentActive,
  onDeleteStudent,
  onOpenEnrollModal,
  canManageStudents = true,
  canEnrollStudents = true,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
      {isLoading ? (
        <Loader message="Loading student directory..." />
      ) : students.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <GraduationCap size={36} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold">No students found</p>
          <p className="text-xs mt-0.5">
            {canManageStudents
              ? 'Click "Register Student" to register an academic student record.'
              : 'No student candidate records have been registered yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Student & Enrollment</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Guardian / Blood Group</th>
                <th className="py-3 px-4">Enrolled Section</th>
                <th className="py-3 px-4">Status</th>
                {(canManageStudents || canEnrollStudents) && (
                  <th className="py-3 px-4 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.map((stu) => {
                const enrollment = studentClasses.find(
                  (sc) => sc.studentId === stu.studentId && sc.active !== false
                );

                return (
                  <tr key={stu.studentId} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {stu.firstName?.[0] || 'S'}
                          {stu.lastName?.[0] || ''}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {stu.firstName} {stu.lastName}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[10px]">
                            <span className="bg-slate-100 text-slate-600 px-1 rounded border border-slate-200">
                              {stu.enrollmentNumber}
                            </span>
                            {stu.rollNumber && (
                              <span className="text-slate-400">Roll: {stu.rollNumber}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5 text-[11px]">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Mail size={12} className="text-slate-400" />
                          <span>{stu.email}</span>
                        </div>
                        {stu.phoneNumber && (
                          <div className="flex items-center gap-1 text-slate-500">
                            <Phone size={12} className="text-slate-400" />
                            <span>{stu.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[11px]">
                        <span className="text-slate-800 font-medium block">
                          {stu.guardianName || 'Guardian N/A'}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          {stu.bloodGroup && (
                            <Badge variant="neutral">Blood: {stu.bloodGroup}</Badge>
                          )}
                          {stu.gender && (
                            <span className="text-[10px] text-slate-400 uppercase">
                              {stu.gender}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {enrollment ? (
                        <div>
                          <Badge variant="primary">
                            {enrollment.className} (Sec {enrollment.section})
                          </Badge>
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            Sem {enrollment.semester} • {enrollment.academicYear}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Not Assigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {canManageStudents ? (
                        <button
                          onClick={() => onToggleStudentActive(stu)}
                          className="inline-flex items-center gap-1 cursor-pointer"
                          title="Toggle active status"
                        >
                          {stu.active !== false ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="neutral">Suspended</Badge>
                          )}
                        </button>
                      ) : (
                        stu.active !== false ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="neutral">Suspended</Badge>
                        )
                      )}
                    </td>
                    {(canManageStudents || canEnrollStudents) && (
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {canEnrollStudents && onOpenEnrollModal && (
                            <button
                              onClick={() => onOpenEnrollModal(stu.studentId)}
                              className="px-2 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 flex items-center gap-1"
                              title="Assign or Change Class Section"
                            >
                              <School size={12} />
                              <span>{enrollment ? 'Section' : 'Assign'}</span>
                            </button>
                          )}
                          {canManageStudents && onOpenEditStudent && (
                            <button
                              onClick={() => onOpenEditStudent(stu)}
                              className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                              title="Edit Student Record"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          {canManageStudents && onDeleteStudent && (
                            <button
                              onClick={() => onDeleteStudent(stu)}
                              className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Delete Student Record"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
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
