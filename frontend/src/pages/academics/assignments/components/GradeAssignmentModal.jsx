import React from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Button } from '../../../../components/common/Button';
import { Badge } from '../../../../components/common/Badge';
import { Award, Check } from 'lucide-react';

export const GradeAssignmentModal = ({
  isOpen,
  onClose,
  isLoading,
  activeAssignment,
  gradingRoster,
  onMarkChange,
  onSubmit,
}) => {
  if (!activeAssignment) return null;

  const maxMarks = activeAssignment.maxMarks || 100;
  const gradedList = gradingRoster.filter((r) => r.marks !== '' && r.marks !== null);
  const averageMarks = gradedList.length > 0
    ? Math.round(gradedList.reduce((acc, curr) => acc + Number(curr.marks || 0), 0) / gradedList.length)
    : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Grade Submissions: ${activeAssignment.assignmentName}`}
      subtitle={`Course: ${activeAssignment.subjectCode} (${activeAssignment.className}) • Maximum Score: ${maxMarks} Marks`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Grading Metrics Overview */}
        <div className="bg-slate-50 border border-slate-200 rounded p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-amber-600" />
            <span className="font-semibold text-slate-700">
              Evaluated: {gradedList.length} / {gradingRoster.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Class Average:</span>
            <span className="font-bold text-slate-900">{averageMarks} / {maxMarks}</span>
            <Badge variant="primary">{Math.round((averageMarks / maxMarks) * 100)}%</Badge>
          </div>
        </div>

        {/* Student Marks List */}
        <div className="max-h-96 overflow-y-auto border border-slate-200 rounded divide-y divide-slate-100">
          {gradingRoster.map((item, idx) => {
            const currentScore = Number(item.marks || 0);
            const scorePercent = maxMarks > 0 ? Math.round((currentScore / maxMarks) * 100) : 0;

            return (
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
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.enrollmentNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={maxMarks}
                      placeholder="0"
                      value={item.marks ?? ''}
                      onChange={(e) => onMarkChange(item.studentClassId, e.target.value)}
                      className="w-20 p-1.5 text-xs text-right font-bold border border-slate-300 rounded focus:ring-1 focus:ring-blue-800"
                    />
                    <span className="text-xs text-slate-400">/ {maxMarks}</span>
                  </div>

                  <Badge
                    variant={
                      scorePercent >= 75
                        ? 'success'
                        : scorePercent >= 40
                        ? 'primary'
                        : 'warning'
                    }
                  >
                    {scorePercent}%
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
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
            Commit Grade Sheet
          </Button>
        </div>
      </div>
    </Modal>
  );
};
