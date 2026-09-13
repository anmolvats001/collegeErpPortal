import React from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Input } from '../../../../components/common/Input';
import { Button } from '../../../../components/common/Button';

export const StudentModal = ({
  isOpen,
  onClose,
  isEditing,
  isLoading,
  studentForm,
  setStudentForm,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Student: ${studentForm.firstName} ${studentForm.lastName}` : 'Enroll New Student Candidate'}
      subtitle="Register official academic identity, contact details, and parent/guardian information."
      maxWidth="max-w-xl"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="stuFirstName"
            label="First Name"
            type="text"
            placeholder="e.g. Rahul"
            value={studentForm.firstName}
            onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
            required
          />
          <Input
            id="stuLastName"
            label="Last Name"
            type="text"
            placeholder="e.g. Mehta"
            value={studentForm.lastName}
            onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="stuEnrollment"
            label="Enrollment Number"
            type="text"
            placeholder="e.g. EN2026CS001"
            value={studentForm.enrollmentNumber}
            onChange={(e) => setStudentForm({ ...studentForm, enrollmentNumber: e.target.value.toUpperCase() })}
            required
          />
          <Input
            id="stuRollNumber"
            label="Class Roll Number (Optional)"
            type="text"
            placeholder="e.g. CS-01"
            value={studentForm.rollNumber}
            onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value.toUpperCase() })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="stuEmail"
            label="Institutional Email"
            type="email"
            placeholder="student@college.edu"
            value={studentForm.email}
            onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
            required
          />
          <Input
            id="stuPhone"
            label="Student Phone Number"
            type="tel"
            placeholder="10-digit mobile"
            value={studentForm.phoneNumber}
            onChange={(e) => setStudentForm({ ...studentForm, phoneNumber: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="stuGender" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Gender
            </label>
            <select
              id="stuGender"
              value={studentForm.gender}
              onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="stuBloodGroup" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Blood Group
            </label>
            <select
              id="stuBloodGroup"
              value={studentForm.bloodGroup}
              onChange={(e) => setStudentForm({ ...studentForm, bloodGroup: e.target.value })}
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="stuGuardianName"
            label="Parent / Guardian Name"
            type="text"
            placeholder="e.g. Sh. S. K. Mehta"
            value={studentForm.guardianName}
            onChange={(e) => setStudentForm({ ...studentForm, guardianName: e.target.value })}
          />
          <Input
            id="stuGuardianPhone"
            label="Guardian Emergency Contact"
            type="tel"
            placeholder="10-digit mobile"
            value={studentForm.guardianPhoneNumber}
            onChange={(e) => setStudentForm({ ...studentForm, guardianPhoneNumber: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="stuAddress" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Residential Address
          </label>
          <textarea
            id="stuAddress"
            rows={2}
            placeholder="Permanent or local address..."
            value={studentForm.address}
            onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
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
            {isEditing ? 'Save Changes' : 'Register Student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
