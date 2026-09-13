import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { GitBranch } from 'lucide-react';

export const BranchModal = ({
  isOpen,
  onClose,
  isEditing = false,
  isLoading = false,
  formData,
  setFormData,
  courses = [],
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Branch: ${formData.branchName}` : 'Add Specialization Branch'}
      subtitle="Associate an academic discipline with a parent degree program."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="branchCourseSelect" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Parent Degree Program
          </label>
          <select
            id="branchCourseSelect"
            value={formData.courseId}
            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
            disabled={isEditing}
            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">Select Parent Course</option>
            {courses.map((c) => (
              <option key={c.courseId} value={c.courseId}>
                {c.courseCode} - {c.courseName}
              </option>
            ))}
          </select>
        </div>

        <Input
          id="branchNameInput"
          label="Branch / Discipline Title"
          type="text"
          placeholder="e.g. Computer Science & Engineering"
          icon={GitBranch}
          value={formData.branchName}
          onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
          required
        />

        <Input
          id="branchCodeInput"
          label="Branch Code (e.g. CSE, ECE, ME)"
          type="text"
          placeholder="e.g. CSE"
          value={formData.branchCode}
          onChange={(e) => setFormData({ ...formData, branchCode: e.target.value.toUpperCase() })}
          required
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="branchDesc" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Discipline Syllabus Scope
          </label>
          <textarea
            id="branchDesc"
            rows={3}
            placeholder="Outline departmental specializations and technical domains..."
            value={formData.branchDescription}
            onChange={(e) => setFormData({ ...formData, branchDescription: e.target.value })}
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
            {isEditing ? 'Save Updates' : 'Add Branch'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
