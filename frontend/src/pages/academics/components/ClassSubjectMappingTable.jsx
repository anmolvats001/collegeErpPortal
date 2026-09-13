import React from 'react';
import { Badge } from '../../../components/common/Badge';
import { Link as LinkIcon, Unlink } from 'lucide-react';

export const ClassSubjectMappingTable = ({
  classSubjects,
  onToggleMappingActive,
  onUnlinkMapping,
  canManageClasses = true,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
      <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <span>
          Curriculum allocations bind individual courses to class cohorts for timetable and grading.
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          Total Mappings: {classSubjects.length}
        </span>
      </div>

      {classSubjects.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <LinkIcon size={36} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold">No subject-class allocations defined</p>
          <p className="text-xs mt-0.5">
            {canManageClasses
              ? 'Click "Map Subject" to bind a syllabus course to a class section.'
              : 'No curriculum courses allocated to this cohort yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Class Cohort</th>
                <th className="py-3 px-4">Allocated Subject & Code</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Mapping Status</th>
                {canManageClasses && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {classSubjects.map((mapItem) => (
                <tr key={mapItem.classSubjectId} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span className="font-mono bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                        {mapItem.className}
                      </span>
                      <span className="text-slate-500 font-normal">Sec {mapItem.section}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                        {mapItem.subjectCode}
                      </span>
                      <span className="font-semibold text-slate-900">{mapItem.subjectName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    Semester {mapItem.semester}
                  </td>
                  <td className="py-3 px-4">
                    {canManageClasses ? (
                      <button
                        onClick={() => onToggleMappingActive(mapItem)}
                        className="inline-flex items-center gap-1 cursor-pointer"
                        title="Toggle allocation status"
                      >
                        {mapItem.active !== false ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="neutral">Suspended</Badge>
                        )}
                      </button>
                    ) : (
                      mapItem.active !== false ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="neutral">Suspended</Badge>
                      )
                    )}
                  </td>
                  {canManageClasses && (
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onUnlinkMapping(mapItem)}
                        className="px-2 py-1 text-xs font-semibold rounded text-red-600 hover:bg-red-50 border border-red-200 flex items-center gap-1 inline-flex"
                        title="Dissociate Subject from Class"
                      >
                        <Unlink size={12} />
                        <span>Unlink</span>
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
