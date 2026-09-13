import React from 'react';
import { Badge } from '../../../components/common/Badge';
import { Loader } from '../../../components/common/Loader';
import { BookOpen, Clock, Calendar, Plus, GitBranch, Edit2, Trash2 } from 'lucide-react';

export const CourseTable = ({
  courses = [],
  branches = [],
  isLoading = false,
  onToggleActive,
  onCreateBranch,
  onViewBranches,
  onEditCourse,
  onDeleteCourse,
  canManageCourses = true,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded shadow-sm p-8">
        <Loader message="Loading academic programs..." />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded shadow-sm text-center py-12 text-slate-500">
        <BookOpen size={36} className="mx-auto text-slate-300 mb-2" />
        <p className="text-sm font-semibold">No degree programs found</p>
        <p className="text-xs mt-0.5">
          {canManageCourses
            ? 'Click "Register Program" to establish your first curriculum course.'
            : 'No degree programs have been configured yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Program & Code</th>
              <th className="py-3 px-4">Duration & Semesters</th>
              <th className="py-3 px-4">Specializations</th>
              <th className="py-3 px-4">Academic Status</th>
              <th className="py-3 px-4">Curriculum Scope</th>
              {(canManageCourses || onViewBranches) && (
                <th className="py-3 px-4 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {courses.map((course) => {
              const courseBranches = branches.filter((b) => b.courseId === course.courseId);

              return (
                <tr key={course.courseId} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                        {course.courseCode}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 block">{course.courseName}</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          ID: {course.courseId}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      <span>{course.durationInYears} Years</span>
                      <span className="text-slate-300">•</span>
                      <Calendar size={13} className="text-slate-400" />
                      <span>{course.totalSemesters} Semesters</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={courseBranches.length > 0 ? 'primary' : 'neutral'}>
                      {courseBranches.length} Disciplines
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    {canManageCourses ? (
                      <button
                        onClick={() => onToggleActive(course)}
                        className="inline-flex items-center gap-1 cursor-pointer"
                        title="Click to toggle program status"
                      >
                        {course.active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="neutral">Suspended</Badge>
                        )}
                      </button>
                    ) : (
                      course.active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="neutral">Suspended</Badge>
                      )
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                    {course.description || 'Standard degree program'}
                  </td>
                  {(canManageCourses || onViewBranches) && (
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {canManageCourses && onCreateBranch && (
                          <button
                            onClick={() => onCreateBranch(course.courseId)}
                            className="px-2 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1"
                            title="Add Branch under this Course"
                          >
                            <Plus size={13} />
                            <span>Branch</span>
                          </button>
                        )}
                        {onViewBranches && (
                          <button
                            onClick={() => onViewBranches(course.courseId)}
                            className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 flex items-center gap-1"
                            title="View Branches under this Course"
                          >
                            <GitBranch size={13} />
                            <span>View ({courseBranches.length})</span>
                          </button>
                        )}
                        {canManageCourses && onEditCourse && (
                          <button
                            onClick={() => onEditCourse(course)}
                            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                            title="Edit Program"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                        {canManageCourses && onDeleteCourse && (
                          <button
                            onClick={() => onDeleteCourse(course)}
                            className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete Program"
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
    </div>
  );
};
