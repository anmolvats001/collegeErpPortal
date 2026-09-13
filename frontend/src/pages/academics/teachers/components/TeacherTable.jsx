import React from 'react';
import { Badge } from '../../../../components/common/Badge';
import { Loader } from '../../../../components/common/Loader';
import { UserCheck, Mail, Phone, Edit2, Trash2, BookOpen } from 'lucide-react';

export const TeacherTable = ({
  teachers,
  teacherSubjects,
  isLoading,
  onOpenEditTeacher,
  onToggleTeacherActive,
  onDeleteTeacher,
  onOpenAssignModal,
  canManageFaculty = true,
  canAssignSubjects = true,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
      {isLoading ? (
        <Loader message="Loading faculty directory..." />
      ) : teachers.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <UserCheck size={36} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold">No faculty members found</p>
          <p className="text-xs mt-0.5">
            {canManageFaculty
              ? 'Click "Add Faculty" to register a teaching staff member.'
              : 'No faculty records have been registered yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Faculty Member</th>
                <th className="py-3 px-4">Designation & Dept</th>
                <th className="py-3 px-4">Qualification</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Teaching Subjects</th>
                <th className="py-3 px-4">Status</th>
                {(canManageFaculty || canAssignSubjects) && (
                  <th className="py-3 px-4 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {teachers.map((tch) => {
                const assignedSubjects = teacherSubjects.filter(
                  (ts) => ts.teacherId === tch.teacherId && ts.active !== false
                );

                return (
                  <tr key={tch.teacherId} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {tch.firstName?.[0] || 'T'}
                          {tch.lastName?.[0] || ''}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {tch.firstName} {tch.lastName}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            Emp: {tch.employeeId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">
                        {tch.designation || 'Faculty Member'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {tch.department || 'Department N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-700 font-medium">
                        {tch.qualification || 'Standard Degree'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5 text-[11px]">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Mail size={12} className="text-slate-400" />
                          <span>{tch.email}</span>
                        </div>
                        {tch.phoneNumber && (
                          <div className="flex items-center gap-1 text-slate-500">
                            <Phone size={12} className="text-slate-400" />
                            <span>{tch.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={assignedSubjects.length > 0 ? 'primary' : 'neutral'}>
                        {assignedSubjects.length} Allocations
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {canManageFaculty ? (
                        <button
                          onClick={() => onToggleTeacherActive(tch)}
                          className="inline-flex items-center gap-1 cursor-pointer"
                          title="Toggle active status"
                        >
                          {tch.active !== false ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="neutral">Suspended</Badge>
                          )}
                        </button>
                      ) : (
                        tch.active !== false ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="neutral">Suspended</Badge>
                        )
                      )}
                    </td>
                    {(canManageFaculty || canAssignSubjects) && (
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {canAssignSubjects && onOpenAssignModal && (
                            <button
                              onClick={() => onOpenAssignModal(tch.teacherId)}
                              className="px-2 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1"
                              title="Assign Subject to Faculty"
                            >
                              <BookOpen size={12} />
                              <span>+ Subject</span>
                            </button>
                          )}
                          {canManageFaculty && onOpenEditTeacher && (
                            <button
                              onClick={() => onOpenEditTeacher(tch)}
                              className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                              title="Edit Faculty Record"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          {canManageFaculty && onDeleteTeacher && (
                            <button
                              onClick={() => onDeleteTeacher(tch)}
                              className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Delete Faculty Record"
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
