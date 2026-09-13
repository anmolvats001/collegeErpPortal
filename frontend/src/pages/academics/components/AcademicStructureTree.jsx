import React from 'react';
import { Button } from '../../../components/common/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const AcademicStructureTree = ({
  courses = [],
  branches = [],
  onCreateBranch,
  onEditBranch,
  onDeleteBranch,
  canManageCourses = true,
}) => {
  return (
    <div className="space-y-4">
      {courses.map((course) => {
        const courseBranches = branches.filter((b) => b.courseId === course.courseId);

        return (
          <div
            key={course.courseId}
            className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden"
          >
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-blue-900 bg-blue-100/80 px-2.5 py-1 rounded border border-blue-300">
                  {course.courseCode}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{course.courseName}</h3>
                  <p className="text-[11px] text-slate-500">
                    {course.durationInYears} Academic Years • {course.totalSemesters} Semesters • {courseBranches.length} Specializations
                  </p>
                </div>
              </div>

              {canManageCourses && onCreateBranch && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    icon={Plus}
                    onClick={() => onCreateBranch(course.courseId)}
                    className="text-xs"
                  >
                    Add Branch
                  </Button>
                </div>
              )}
            </div>

            <div className="p-4">
              {courseBranches.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No branches configured under this degree program yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {courseBranches.map((branch) => (
                    <div
                      key={branch.branchId}
                      className="p-3 bg-slate-50 border border-slate-200 rounded hover:border-slate-300 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200">
                            {branch.branchCode}
                          </span>
                          {branch.active ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Discipline" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-300" title="Suspended Discipline" />
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {branch.branchName}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                          {branch.branchDescription}
                        </p>
                      </div>

                      <div className="pt-2 mt-3 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">
                          {branch.branchId}
                        </span>
                        {canManageCourses && (
                          <div className="flex gap-1">
                            {onEditBranch && (
                              <button
                                onClick={() => onEditBranch(branch)}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                title="Edit Branch"
                              >
                                <Edit2 size={12} />
                              </button>
                            )}
                            {onDeleteBranch && (
                              <button
                                onClick={() => onDeleteBranch(branch)}
                                className="p-1 rounded text-red-400 hover:text-red-700 hover:bg-red-50"
                                title="Delete Branch"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
