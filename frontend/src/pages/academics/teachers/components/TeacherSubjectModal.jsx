import React from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Button } from '../../../../components/common/Button';

export const TeacherSubjectModal = ({
  isOpen,
  onClose,
  isLoading,
  assignmentForm,
  setAssignmentForm,
  teachers,
  classSubjects,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Subject to Faculty Instructor"
      subtitle="Designate an instructor responsible for delivering syllabus lectures and grading a class cohort course."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="assignTeacherSelect" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Select Faculty Instructor
          </label>
          <select
            id="assignTeacherSelect"
            value={assignmentForm.teacherId}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, teacherId: e.target.value })}
            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">Select Faculty Member</option>
            {teachers.map((t) => (
              <option key={t.teacherId} value={t.teacherId}>
                {t.firstName} {t.lastName} ({t.designation} • {t.employeeId})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="assignClassSubSelect" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Select Class Cohort & Subject Course
          </label>
          <select
            id="assignClassSubSelect"
            value={assignmentForm.classSubjectId}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, classSubjectId: e.target.value })}
            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">Select Class Subject Offering</option>
            {classSubjects.map((cs) => (
              <option key={cs.classSubjectId} value={cs.classSubjectId}>
                {cs.className} (Sec {cs.section}) → {cs.subjectCode} - {cs.subjectName} (Sem {cs.semester})
              </option>
            ))}
          </select>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900">
          <p>
            Assigning faculty grants course-level permissions to take class attendance, publish lecture notices, and record internal marks.
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
