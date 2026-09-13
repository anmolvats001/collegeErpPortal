import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';

export const ClassModal = ({
  isOpen,
  onClose,
  isEditing,
  isLoading,
  classForm,
  setClassForm,
  branches,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Class Section: ${classForm.className}` : 'Create Class Cohort Section'}
      subtitle="Establish section parameters, parent specialization branch, and term year."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="classBranchSelect" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Specialization Branch / Discipline
          </label>
          <select
            id="classBranchSelect"
            value={classForm.branchId}
            onChange={(e) => setClassForm({ ...classForm, branchId: e.target.value })}
            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b.branchId} value={b.branchId}>
                {b.branchCode} - {b.branchName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="classNameInput"
            label="Class Cohort Name"
            type="text"
            placeholder="e.g. CSE-3A or MBA-FIN-1"
            value={classForm.className}
            onChange={(e) => setClassForm({ ...classForm, className: e.target.value })}
            required
          />
          <Input
            id="classSectionInput"
            label="Section Identifier"
            type="text"
            placeholder="e.g. A or B"
            value={classForm.section}
            onChange={(e) => setClassForm({ ...classForm, section: e.target.value.toUpperCase() })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="classSemesterInput"
            label="Semester"
            type="number"
            min={1}
            max={12}
            value={classForm.semester}
            onChange={(e) => setClassForm({ ...classForm, semester: e.target.value })}
            required
          />
          <Input
            id="classYearInput"
            label="Academic Year"
            type="number"
            min={2020}
            max={2035}
            value={classForm.academicYear}
            onChange={(e) => setClassForm({ ...classForm, academicYear: e.target.value })}
            required
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
            {isEditing ? 'Save Section' : 'Create Section'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
