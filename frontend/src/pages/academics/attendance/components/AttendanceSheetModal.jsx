import React from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Button } from '../../../../components/common/Button';
import { Badge } from '../../../../components/common/Badge';
import { Check, X, AlertCircle } from 'lucide-react';

export const AttendanceSheetModal = ({
  isOpen,
  onClose,
  isLoading,
  activeSession,
  roster,
  onStatusChange,
  onMarkAll,
  onSubmit,
}) => {
  if (!activeSession) return null;

  const presentCount = roster.filter((r) => r.status === 'PRESENT').length;
  const absentCount = roster.filter((r) => r.status === 'ABSENT').length;
  const exemptCount = roster.filter((r) => r.status === 'EXEMPT').length;
  const total = roster.length || 1;
  const turnoutPercent = Math.round((presentCount / total) * 100);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Roll Call: ${activeSession.subjectCode} - ${activeSession.className}`}
      subtitle={`Session Date: ${activeSession.attendanceDate} (${activeSession.startTime?.slice(0, 5)} - ${activeSession.endTime?.slice(0, 5)})`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Turnout Summary & Quick Actions */}
        <div className="bg-slate-50 border border-slate-200 rounded p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span className="text-xs font-semibold text-slate-700">Present: {presentCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
              <span className="text-xs font-semibold text-slate-700">Absent: {absentCount}</span>
            </div>
            {exemptCount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="text-xs font-semibold text-slate-700">Exempt: {exemptCount}</span>
              </div>
            )}
            <Badge variant={turnoutPercent >= 75 ? 'success' : 'warning'}>
              {turnoutPercent}% Turnout
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onMarkAll('PRESENT')}
              className="px-2 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded"
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => onMarkAll('ABSENT')}
              className="px-2 py-1 text-xs font-semibold bg-red-50 text-red-800 hover:bg-red-100 border border-red-200 rounded"
            >
              All Absent
            </button>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="max-h-96 overflow-y-auto border border-slate-200 rounded divide-y divide-slate-100">
          {roster.map((item, idx) => (
            <div
              key={item.studentClassId || idx}
              className="p-3 flex items-center justify-between hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-400 w-6">
                  {idx + 1}.
                </span>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    {item.studentName}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>{item.enrollmentNumber}</span>
                    {item.rollNumber && (
                      <span className="text-slate-600 bg-slate-100 px-1 rounded">
                        Roll: {item.rollNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Radio Buttons */}
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => onStatusChange(item.studentClassId, 'PRESENT')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-l border flex items-center gap-1 transition ${
                    item.status === 'PRESENT'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <Check size={12} />
                  <span>Present</span>
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(item.studentClassId, 'ABSENT')}
                  className={`px-2.5 py-1 text-xs font-semibold border-t border-b flex items-center gap-1 transition ${
                    item.status === 'ABSENT'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-red-50 hover:text-red-700'
                  }`}
                >
                  <X size={12} />
                  <span>Absent</span>
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(item.studentClassId, 'EXEMPT')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-r border flex items-center gap-1 transition ${
                    item.status === 'EXEMPT'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  <AlertCircle size={12} />
                  <span>Exempt</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onSubmit}
            isLoading={isLoading}
            className="text-xs"
          >
            Save Attendance Records
          </Button>
        </div>
      </div>
    </Modal>
  );
};
