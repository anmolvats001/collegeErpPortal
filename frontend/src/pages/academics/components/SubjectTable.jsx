import React from 'react';
import { Badge } from '../../../components/common/Badge';
import { Loader } from '../../../components/common/Loader';
import { BookOpen, Edit2, Trash2 } from 'lucide-react';

export const SubjectTable = ({
  subjects,
  courses,
  isLoading,
  onOpenEditSubject,
  onToggleSubjectActive,
  onDeleteSubject,
  canManageClasses = true,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
      {isLoading ? (
        <Loader message="Loading subject catalog..." />
      ) : subjects.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <BookOpen size={36} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold">No curriculum subjects found</p>
          <p className="text-xs mt-0.5">
            {canManageClasses
              ? 'Click "Add Subject" to register a syllabus course.'
              : 'No curriculum subjects have been registered yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Subject & Code</th>
                <th className="py-3 px-4">Degree Program</th>
                <th className="py-3 px-4">Semester & Credits</th>
                <th className="py-3 px-4">Description / Syllabus</th>
                <th className="py-3 px-4">Status</th>
                {canManageClasses && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {subjects.map((sub) => {
                const parentCourse = courses.find((c) => c.courseId === sub.courseId);

                return (
                  <tr key={sub.subjectId} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                          {sub.subjectCode}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block">{sub.subjectName}</span>
                          <span className="font-mono text-[10px] text-slate-400">
                            ID: {sub.subjectId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {parentCourse ? (
                        <span className="font-medium text-slate-800">
                          {parentCourse.courseCode} - {parentCourse.courseName}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">
                          Course: {sub.courseId}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="primary">{sub.credits} Credits</Badge>
                        <span className="text-slate-300">•</span>
                        <span className="font-medium text-slate-600">Sem {sub.semester}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {sub.description || 'Curriculum course'}
                    </td>
                    <td className="py-3 px-4">
                      {canManageClasses ? (
                        <button
                          onClick={() => onToggleSubjectActive(sub)}
                          className="inline-flex items-center gap-1 cursor-pointer"
                          title="Toggle active status"
                        >
                          {sub.active !== false ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="neutral">Suspended</Badge>
                          )}
                        </button>
                      ) : (
                        sub.active !== false ? (
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
                            onClick={() => onOpenEditSubject(sub)}
                            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                            title="Edit Subject"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteSubject(sub)}
                            className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete Subject"
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
