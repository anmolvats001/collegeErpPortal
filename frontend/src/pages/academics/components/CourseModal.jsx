import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { GraduationCap } from 'lucide-react';

export const CourseModal = ({
  isOpen,
  onClose,
  isEditing = false,
  isLoading = false,
  formData,
  setFormData,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Program: ${formData.courseName}` : 'Register Degree Program'}
      subtitle="Establish curriculum course parameters, duration, and semester framework."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="courseNameInput"
          label="Degree Program Name"
          type="text"
          placeholder="e.g. Bachelor of Technology (B.Tech)"
          icon={GraduationCap}
          value={formData.courseName}
          onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
          required
        />

        <Input
          id="courseCodeInput"
          label="Program Code (Uppercase)"
          type="text"
          placeholder="e.g. BTECH or MBA"
          value={formData.courseCode}
          onChange={(e) => setFormData({ ...formData, courseCode: e.target.value.toUpperCase() })}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="durationInput"
            label="Duration (Years)"
            type="number"
            min={1}
            max={6}
            value={formData.durationInYears}
            onChange={(e) => setFormData({ ...formData, durationInYears: e.target.value })}
            required
          />
          <Input
            id="semestersInput"
            label="Total Semesters"
            type="number"
            min={1}
            max={12}
            value={formData.totalSemesters}
            onChange={(e) => setFormData({ ...formData, totalSemesters: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="courseDesc" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Curriculum Accreditation & Description
          </label>
          <textarea
            id="courseDesc"
            rows={3}
            placeholder="Outline educational aims, regulatory affiliations, and graduation criteria..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            {isEditing ? 'Save Changes' : 'Register Program'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
