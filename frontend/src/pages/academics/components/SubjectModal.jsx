import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';

export const SubjectModal = ({
  isOpen,
  onClose,
  isEditing,
  isLoading,
  subjectForm,
  setSubjectForm,
  courses,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Subject: ${subjectForm.subjectName}` : 'Register Curriculum Subject'}
      subtitle="Define course title, regulatory code, credit system, and parent program."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="subjectCourseSelect" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Parent Degree Program
          </label>
          <select
            id="subjectCourseSelect"
            value={subjectForm.courseId}
            onChange={(e) => setSubjectForm({ ...subjectForm, courseId: e.target.value })}
            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">Select Degree Program</option>
            {courses.map((c) => (
              <option key={c.courseId} value={c.courseId}>
                {c.courseCode} - {c.courseName}
              </option>
            ))}
          </select>
        </div>

        <Input
          id="subjectNameInput"
          label="Subject Title"
          type="text"
          placeholder="e.g. Data Structures & Algorithms"
          value={subjectForm.subjectName}
          onChange={(e) => setSubjectForm({ ...subjectForm, subjectName: e.target.value })}
          required
        />

        <div className="grid grid-cols-3 gap-3">
          <Input
            id="subjectCodeInput"
            label="Subject Code"
            type="text"
            placeholder="e.g. CS-301"
            value={subjectForm.subjectCode}
            onChange={(e) => setSubjectForm({ ...subjectForm, subjectCode: e.target.value.toUpperCase() })}
            required
          />
          <Input
            id="subjectCreditsInput"
            label="Credit Units"
            type="number"
            min={1}
            max={10}
            value={subjectForm.credits}
            onChange={(e) => setSubjectForm({ ...subjectForm, credits: e.target.value })}
            required
          />
          <Input
            id="subjectSemesterInput"
            label="Semester"
            type="number"
            min={1}
            max={12}
            value={subjectForm.semester}
            onChange={(e) => setSubjectForm({ ...subjectForm, semester: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="subjectDesc" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Syllabus Outline & Laboratory Units
          </label>
          <textarea
            id="subjectDesc"
            rows={3}
            placeholder="Unit breakdown, lecture modules, lab practicals..."
            value={subjectForm.description}
            onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
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
            {isEditing ? 'Save Updates' : 'Register Subject'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
