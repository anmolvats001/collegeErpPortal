import React from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Input } from '../../../../components/common/Input';
import { Button } from '../../../../components/common/Button';

export const CreateSessionModal = ({
  isOpen,
  onClose,
  isLoading,
  sessionForm,
  setSessionForm,
  teacherSubjects,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Attendance Lecture Session"
      subtitle="Schedule an official class lecture period to take roll call and monitor candidate presence."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="sessionTSSelect" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Course & Class Cohort Allocation
          </label>
          <select
            id="sessionTSSelect"
            value={sessionForm.teacherSubjectId}
            onChange={(e) => setSessionForm({ ...sessionForm, teacherSubjectId: e.target.value })}
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
          id="sessDate"
          label="Attendance Date"
          type="date"
          value={sessionForm.attendanceDate}
          onChange={(e) => setSessionForm({ ...sessionForm, attendanceDate: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="sessStart"
            label="Start Time"
            type="time"
            value={sessionForm.startTime}
            onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
            required
          />
          <Input
            id="sessEnd"
            label="End Time"
            type="time"
            value={sessionForm.endTime}
            onChange={(e) => setSessionForm({ ...sessionForm, endTime: e.target.value })}
            required
          />
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
          <p>
            Creating the session opens an institutional digital register. Faculty and department admins can immediately record presence.
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
            Initialize Session
          </Button>
        </div>
      </form>
    </Modal>
  );
};
