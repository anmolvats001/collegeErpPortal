import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';

export const ClassSubjectModal = ({
  isOpen,
  onClose,
  isLoading,
  mappingForm,
  setMappingForm,
  classes,
  subjects,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Allocate Subject to Class Section"
      subtitle="Associate a curriculum syllabus subject with a specific student cohort section."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="mapClassSelect" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Select Class Section Cohort
          </label>
          <select
            id="mapClassSelect"
            value={mappingForm.classId}
            onChange={(e) => setMappingForm({ ...mappingForm, classId: e.target.value })}
            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">Select Section</option>
            {classes.map((c) => (
              <option key={c.classId} value={c.classId}>
                {c.className} (Sec {c.section} • {c.branchName})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="mapSubjectSelect" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Select Curriculum Subject
          </label>
          <select
            id="mapSubjectSelect"
            value={mappingForm.subjectId}
            onChange={(e) => setMappingForm({ ...mappingForm, subjectId: e.target.value })}
            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.subjectCode} - {s.subjectName} (Sem {s.semester} • {s.credits} Credits)
              </option>
            ))}
          </select>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
          <p>
            Mapping this subject creates the academic enrollment context for timetables, attendance registers, and semester grade sheets.
          </p>
        </div>

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
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="text-xs"
          >
            Confirm Allocation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
