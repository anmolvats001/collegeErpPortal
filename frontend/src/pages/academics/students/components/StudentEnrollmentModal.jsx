import React from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Input } from '../../../../components/common/Input';
import { Button } from '../../../../components/common/Button';

export const StudentEnrollmentModal = ({
  isOpen,
  onClose,
  isLoading,
  enrollmentForm,
  setEnrollmentForm,
  students,
  classes,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll Student in Class Section"
      subtitle="Allocate a candidate to a specific cohort section, academic semester, and term roll number."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="enrollStudentSelect" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Select Student Candidate
          </label>
          <select
            id="enrollStudentSelect"
            value={enrollmentForm.studentId}
            onChange={(e) => setEnrollmentForm({ ...enrollmentForm, studentId: e.target.value })}
            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.studentId} value={s.studentId}>
                {s.firstName} {s.lastName} ({s.enrollmentNumber})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="enrollClassSelect" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Target Class Section Cohort
          </label>
          <select
            id="enrollClassSelect"
            value={enrollmentForm.classId}
            onChange={(e) => setEnrollmentForm({ ...enrollmentForm, classId: e.target.value })}
            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">Select Class Section</option>
            {classes.map((c) => (
              <option key={c.classId} value={c.classId}>
                {c.className} (Sec {c.section} • {c.branchName} • Sem {c.semester})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            id="enrollSemester"
            label="Semester"
            type="number"
            min={1}
            max={12}
            value={enrollmentForm.semester}
            onChange={(e) => setEnrollmentForm({ ...enrollmentForm, semester: e.target.value })}
            required
          />
          <Input
            id="enrollYear"
            label="Academic Year"
            type="number"
            min={2020}
            max={2035}
            value={enrollmentForm.academicYear}
            onChange={(e) => setEnrollmentForm({ ...enrollmentForm, academicYear: e.target.value })}
            required
          />
          <Input
            id="enrollRollNumber"
            label="Section Roll No"
            type="text"
            placeholder="e.g. CS-01"
            value={enrollmentForm.rollNumber}
            onChange={(e) => setEnrollmentForm({ ...enrollmentForm, rollNumber: e.target.value.toUpperCase() })}
          />
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
          <p>
            Enrolling the student links them to the class timetable, teacher roster, attendance register, and exam schedules.
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
            Confirm Enrollment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
