import React from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Input } from '../../../../components/common/Input';
import { Button } from '../../../../components/common/Button';

export const CreateAssignmentModal = ({
  isOpen,
  onClose,
  isLoading,
  assignmentForm,
  setAssignmentForm,
  teacherSubjects,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Publish Coursework Assignment"
      subtitle="Define academic problem statement, submission deadlines, and maximum score weighting."
      maxWidth="max-w-xl"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="asgTSSelect" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Course & Class Cohort Allocation
          </label>
          <select
            id="asgTSSelect"
            value={assignmentForm.teacherSubjectId}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, teacherSubjectId: e.target.value })}
            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">Select Teaching Course Allocation</option>
            {teacherSubjects.map((ts) => (
              <option key={ts.teacherSubjectId} value={ts.teacherSubjectId}>
                {ts.className} (Sec {ts.section}) → {ts.subjectCode} - {ts.subjectName} ({ts.teacherName})
              </option>
            ))}
          </select>
        </div>

        <Input
          id="asgName"
          label="Assignment Title"
          type="text"
          placeholder="e.g. Lab Practical 1: Balanced Binary Search Trees"
          value={assignmentForm.assignmentName}
          onChange={(e) => setAssignmentForm({ ...assignmentForm, assignmentName: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="asgMaxMarks"
            label="Maximum Marks"
            type="number"
            min={1}
            max={500}
            value={assignmentForm.maxMarks}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, maxMarks: e.target.value })}
            required
          />
          <Input
            id="asgDueDate"
            label="Submission Deadline"
            type="date"
            value={assignmentForm.dueDate}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="asgDesc" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Problem Statement & Guidelines
          </label>
          <textarea
            id="asgDesc"
            rows={3}
            placeholder="Instructions, problem statement, coding parameters, submission rubric..."
            value={assignmentForm.description}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
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
            Publish Assignment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
