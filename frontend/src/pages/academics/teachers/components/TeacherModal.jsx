import React from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Input } from '../../../../components/common/Input';
import { Button } from '../../../../components/common/Button';

export const TeacherModal = ({
  isOpen,
  onClose,
  isEditing,
  isLoading,
  teacherForm,
  setTeacherForm,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Faculty: ${teacherForm.firstName} ${teacherForm.lastName}` : 'Register Teaching Faculty Member'}
      subtitle="Establish institutional faculty credentials, academic department, and contact information."
      maxWidth="max-w-xl"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="tchFirstName"
            label="First Name"
            type="text"
            placeholder="e.g. Sunita"
            value={teacherForm.firstName}
            onChange={(e) => setTeacherForm({ ...teacherForm, firstName: e.target.value })}
            required
          />
          <Input
            id="tchLastName"
            label="Last Name"
            type="text"
            placeholder="e.g. Verma"
            value={teacherForm.lastName}
            onChange={(e) => setTeacherForm({ ...teacherForm, lastName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="tchEmployeeId"
            label="Employee ID / Faculty Code"
            type="text"
            placeholder="e.g. EMP-CS-01"
            value={teacherForm.employeeId}
            onChange={(e) => setTeacherForm({ ...teacherForm, employeeId: e.target.value.toUpperCase() })}
            required
          />
          <Input
            id="tchQualification"
            label="Highest Academic Qualification"
            type="text"
            placeholder="e.g. Ph.D. in Computer Science"
            value={teacherForm.qualification}
            onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="tchDesignation" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Academic Designation
            </label>
            <select
              id="tchDesignation"
              value={teacherForm.designation}
              onChange={(e) => setTeacherForm({ ...teacherForm, designation: e.target.value })}
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              <option value="Professor & HOD">Professor & HOD</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Senior Lecturer">Senior Lecturer</option>
              <option value="Visiting Faculty">Visiting Faculty</option>
            </select>
          </div>

          <Input
            id="tchDepartment"
            label="Department / School"
            type="text"
            placeholder="e.g. Computer Science & Engineering"
            value={teacherForm.department}
            onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="tchEmail"
            label="Institutional Email"
            type="email"
            placeholder="faculty@college.edu"
            value={teacherForm.email}
            onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
            required
          />
          <Input
            id="tchPhone"
            label="Contact Phone Number"
            type="tel"
            placeholder="10-digit mobile"
            value={teacherForm.phoneNumber}
            onChange={(e) => setTeacherForm({ ...teacherForm, phoneNumber: e.target.value })}
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
            {isEditing ? 'Save Changes' : 'Register Faculty'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
