import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, Edit3, Trash2, Users, FileSpreadsheet } from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { Button } from '../../../../components/common/Button';

export const ExamResultTable = ({
  selectedExam,
  results = [],
  onUpdateMarks,
  onDeleteResult,
  onOpenBulkModal,
  canManage = true,
}) => {
  const [editingResultId, setEditingResultId] = useState(null);
  const [editMarksValue, setEditMarksValue] = useState('');

  if (!selectedExam) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
        <Award size={36} className="mx-auto mb-2 text-slate-300" />
        <h4 className="text-sm font-bold text-slate-700">Select an Exam to View Grades</h4>
        <p className="text-xs text-slate-500 mt-1">
          Choose an exam from the timetable to inspect student scores and enter evaluation marks.
        </p>
      </div>
    );
  }

  // Summary Metrics
  const total = results.length;
  const passedCount = results.filter((r) => r.passed).length;
  const avgMarks =
    total > 0
      ? (results.reduce((acc, curr) => acc + (curr.marks || 0), 0) / total).toFixed(1)
      : 0;
  const highestMarks =
    total > 0 ? Math.max(...results.map((r) => r.marks || 0)) : 0;

  const handleStartEdit = (res) => {
    setEditingResultId(res.resultId);
    setEditMarksValue(res.marks?.toString() || '');
  };

  const handleSaveEdit = async (res) => {
    const val = parseInt(editMarksValue, 10);
    if (!isNaN(val) && val >= 0 && val <= (res.maxMarks || selectedExam.maxMarks)) {
      await onUpdateMarks(res.resultId, val);
    }
    setEditingResultId(null);
  };

  return (
    <div className="space-y-4">
      {/* Exam Header & Stats Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {selectedExam.subjectCode || 'Exam'}
            </span>
            <h2 className="text-sm font-bold text-slate-900">{selectedExam.examName}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Maximum Marks: <strong className="text-slate-800">{selectedExam.maxMarks}</strong> •
            Passing Criteria:{' '}
            <strong className="text-emerald-700">{selectedExam.passingMarks}</strong>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Graded</span>
              <span className="font-bold text-slate-800">{total} Candidates</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Pass Rate</span>
              <span className="font-bold text-emerald-600">
                {total > 0 ? Math.round((passedCount / total) * 100) : 0}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Average</span>
              <span className="font-bold text-blue-600">{avgMarks}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Highest</span>
              <span className="font-bold text-purple-600">{highestMarks}</span>
            </div>
          </div>

          {canManage && (
            <Button
              variant="primary"
              onClick={onOpenBulkModal}
              icon={FileSpreadsheet}
              className="text-xs shrink-0"
            >
              Bulk Grade Sheet
            </Button>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {results.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No marks have been recorded yet for this exam. Click "Bulk Grade Sheet" to enter scores.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Enrollment No.</th>
                <th className="p-3.5 text-center">Score / Max</th>
                <th className="p-3.5">Percentage</th>
                <th className="p-3.5">Evaluation</th>
                {canManage && <th className="p-3.5 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {results.map((res) => {
                const max = res.maxMarks || selectedExam.maxMarks || 100;
                const percentage = Math.round(((res.marks || 0) / max) * 100);
                const isEditing = editingResultId === res.resultId;

                return (
                  <tr key={res.resultId} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-bold text-slate-900">
                      {res.studentName || res.studentClassId}
                    </td>

                    <td className="p-3.5 font-mono text-slate-600">
                      {res.enrollmentNumber || 'EN2024CS---'}
                    </td>

                    <td className="p-3.5 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max={max}
                            value={editMarksValue}
                            onChange={(e) => setEditMarksValue(e.target.value)}
                            className="w-16 p-1 text-center font-bold border border-blue-500 rounded text-xs focus:ring-1 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(res)}
                            className="text-emerald-600 hover:text-emerald-800 font-bold px-1"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span className="font-bold text-slate-900">
                          {res.marks} <span className="text-slate-400 font-normal">/ {max}</span>
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2 max-w-[140px]">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              res.passed ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-600">
                          {percentage}%
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      {res.passed ? (
                        <Badge variant="success" icon={CheckCircle}>
                          PASSED
                        </Badge>
                      ) : (
                        <Badge variant="danger" icon={XCircle}>
                          FAILED
                        </Badge>
                      )}
                    </td>

                    {canManage && (
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleStartEdit(res)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition"
                            title="Edit Score"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteResult(res.resultId)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete Result"
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
        )}
      </div>
    </div>
  );
};
