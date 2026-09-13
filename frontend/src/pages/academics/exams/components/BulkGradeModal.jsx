import React, { useState, useEffect } from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Button } from '../../../../components/common/Button';
import { FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const BulkGradeModal = ({
  isOpen,
  onClose,
  exam,
  students = [],
  existingResults = [],
  onSubmitBulk,
}) => {
  const [marksState, setMarksState] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && exam) {
      const initial = {};
      students.forEach((s) => {
        const found = existingResults.find((r) => r.studentClassId === s.id);
        initial[s.id] = found ? found.marks?.toString() : '';
      });
      setMarksState(initial);
      setError('');
    }
  }, [isOpen, exam, students, existingResults]);

  if (!exam) return null;

  const maxMarks = exam.maxMarks || 100;
  const passingMarks = exam.passingMarks || 40;

  const handleMarkChange = (studentId, value) => {
    setMarksState((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleQuickFillPassing = () => {
    const filled = {};
    students.forEach((s) => {
      filled[s.id] = String(passingMarks);
    });
    setMarksState(filled);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payloadResults = [];

    for (const s of students) {
      const raw = marksState[s.id];
      if (raw !== '' && raw !== undefined) {
        const val = parseInt(raw, 10);
        if (isNaN(val) || val < 0 || val > maxMarks) {
          setError(`Invalid marks for ${s.studentName || s.id}. Must be between 0 and ${maxMarks}.`);
          return;
        }
        payloadResults.push({
          studentClassId: s.id,
          marks: val,
        });
      }
    }

    if (payloadResults.length === 0) {
      setError('Please enter marks for at least one student.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onSubmitBulk({
        examId: exam.examId,
        results: payloadResults,
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit exam results.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const gradedCount = Object.values(marksState).filter((v) => v !== '').length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Mass Grade Sheet: ${exam.examName}`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Info & Stats bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
          <div>
            <span className="font-bold">Max Marks: {maxMarks}</span> • Passing Standard:{' '}
            <span className="text-emerald-700 font-bold">{passingMarks}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold">
              Graded: {gradedCount} / {students.length}
            </span>
            <button
              type="button"
              onClick={handleQuickFillPassing}
              className="text-[11px] text-blue-700 hover:text-blue-900 underline font-medium"
            >
              Fill Passing Score
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Student Marks Ledger */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
          {students.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No students enrolled in this class cohort.
            </div>
          ) : (
            students.map((student, idx) => {
              const currentVal = marksState[student.id];
              const valNum = parseInt(currentVal, 10);
              const isPassed = !isNaN(valNum) && valNum >= passingMarks;

              return (
                <div
                  key={student.id}
                  className="p-3 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-slate-400 font-mono text-xs w-6">{idx + 1}.</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-slate-900 truncate">
                        {student.studentName || student.id}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {student.enrollmentNumber || student.rollNumber || 'EN2024CS---'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max={maxMarks}
                        placeholder="--"
                        value={currentVal || ''}
                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                        className="w-20 p-1.5 text-center font-bold text-xs bg-white border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <span className="text-xs text-slate-400 font-normal">/ {maxMarks}</span>
                    </div>

                    {currentVal !== '' && currentVal !== undefined && (
                      <span className="w-16 text-center">
                        {isPassed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            <CheckCircle size={12} /> Pass
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            <XCircle size={12} /> Fail
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            icon={FileSpreadsheet}
          >
            Commit All Scores ({gradedCount})
          </Button>
        </div>
      </form>
    </Modal>
  );
};
