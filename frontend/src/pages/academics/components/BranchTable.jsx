import React from 'react';
import { Badge } from '../../../components/common/Badge';
import { Loader } from '../../../components/common/Loader';
import { GitBranch, Edit2, Trash2 } from 'lucide-react';

export const BranchTable = ({
  branches = [],
  courses = [],
  isLoading = false,
  onToggleActive,
  onEditBranch,
  onDeleteBranch,
  canManageCourses = true,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded shadow-sm p-8">
        <Loader message="Loading academic branches..." />
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded shadow-sm text-center py-12 text-slate-500">
        <GitBranch size={36} className="mx-auto text-slate-300 mb-2" />
        <p className="text-sm font-semibold">No specialization branches found</p>
        <p className="text-xs mt-0.5">
          {canManageCourses
            ? 'Click "Add Branch" to create a new discipline under a degree program.'
            : 'No academic branches configured yet.'}
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
              <th className="py-3 px-4">Branch & Code</th>
              <th className="py-3 px-4">Parent Degree Program</th>
              <th className="py-3 px-4">Discipline Scope</th>
              <th className="py-3 px-4">Status</th>
              {canManageCourses && <th className="py-3 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {branches.map((branch) => {
              const parentCourse = courses.find((c) => c.courseId === branch.courseId);

              return (
                <tr key={branch.branchId} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        {branch.branchCode}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 block">{branch.branchName}</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          ID: {branch.branchId}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {parentCourse ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {parentCourse.courseCode}
                        </span>
                        <span className="font-medium text-slate-800">{parentCourse.courseName}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">
                        Course ID: {branch.courseId}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-sm truncate">
                    {branch.branchDescription || 'Specialization discipline'}
                  </td>
                  <td className="py-3 px-4">
                    {canManageCourses ? (
                      <button
                        onClick={() => onToggleActive(branch)}
                        className="inline-flex items-center gap-1 cursor-pointer"
                        title="Click to toggle branch status"
                      >
                        {branch.active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="neutral">Suspended</Badge>
                        )}
                      </button>
                    ) : (
                      branch.active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="neutral">Suspended</Badge>
                      )
                    )}
                  </td>
                  {canManageCourses && (
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {onEditBranch && (
                          <button
                            onClick={() => onEditBranch(branch)}
                            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                            title="Edit Branch"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                        {onDeleteBranch && (
                          <button
                            onClick={() => onDeleteBranch(branch)}
                            className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete Branch"
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
