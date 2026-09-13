import React from 'react';
import { Badge } from '../../../components/common/Badge';
import { Loader } from '../../../components/common/Loader';
import { Users, Calendar, Link as LinkIcon, Edit2, Trash2 } from 'lucide-react';

export const ClassTable = ({
  classes,
  classSubjects,
  isLoading,
  onOpenEditClass,
  onToggleClassActive,
  onDeleteClass,
  onOpenMappingModal,
  canManageClasses = true,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
      {isLoading ? (
        <Loader message="Loading class cohorts..." />
      ) : classes.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Users size={36} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold">No class sections found</p>
          <p className="text-xs mt-0.5">
            {canManageClasses
              ? 'Click "Create Class" to establish a student section cohort.'
              : 'No class section cohorts have been configured yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Class Section</th>
                <th className="py-3 px-4">Branch / Discipline</th>
                <th className="py-3 px-4">Term / Semester</th>
                <th className="py-3 px-4">Allocated Subjects</th>
                <th className="py-3 px-4">Status</th>
                {canManageClasses && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {classes.map((cls) => {
                const mappedSubjects = classSubjects.filter(
                  (m) => m.classId === cls.classId && m.active !== false
                );

                return (
                  <tr key={cls.classId} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                          {cls.className}
                        </span>
                        <Badge variant="neutral">Sec {cls.section}</Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">
                        {cls.branchName || 'Specialization Branch'}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        ID: {cls.classId}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar size={13} className="text-slate-400" />
                        <span>Year {cls.academicYear}</span>
                        <span className="text-slate-300">•</span>
                        <span>Semester {cls.semester}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={mappedSubjects.length > 0 ? 'primary' : 'neutral'}>
                        {mappedSubjects.length} Courses
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {canManageClasses ? (
                        <button
                          onClick={() => onToggleClassActive(cls)}
                          className="inline-flex items-center gap-1 cursor-pointer"
                          title="Toggle active status"
                        >
                          {cls.active !== false ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="neutral">Suspended</Badge>
                          )}
                        </button>
                      ) : (
                        cls.active !== false ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="neutral">Suspended</Badge>
                        )
                      )}
                    </td>
                    {canManageClasses && (
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onOpenMappingModal(cls.classId)}
                            className="px-2 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 flex items-center gap-1"
                            title="Map Subject to this Section"
                          >
                            <LinkIcon size={12} />
                            <span>+ Subject</span>
                          </button>
                          <button
                            onClick={() => onOpenEditClass(cls)}
                            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                            title="Edit Class Section"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteClass(cls)}
                            className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete Class Section"
                          >
                            <Trash2 size={14} />
                          </button>
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
