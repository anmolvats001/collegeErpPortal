import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { courseService } from '../../../services/courseService';
import { branchService } from '../../../services/branchService';
import { MOCK_COURSES, MOCK_BRANCHES } from '../../../utils/mockData';
import {
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Building,
  Award,
  AlertCircle,
} from 'lucide-react';

export const CreateApplicationModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);

  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'MALE',
    fatherName: '',
    motherName: '',
    address: '',
    courseId: '',
    courseName: '',
    branchId: '',
    branchName: '',
    previousQualification: 'Senior Secondary (12th CBSE)',
    previousInstitution: '',
    previousPercentage: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadAcademicData();
    }
  }, [isOpen]);

  const loadAcademicData = async () => {
    try {
      const courseList = await courseService.getCoursesOfMyCollege();
      setCourses(Array.isArray(courseList) && courseList.length ? courseList : MOCK_COURSES);
    } catch {
      setCourses(MOCK_COURSES);
    }

    try {
      const branchList = await branchService.getBranchesOfMyCollege();
      setBranches(Array.isArray(branchList) && branchList.length ? branchList : MOCK_BRANCHES);
    } catch {
      setBranches(MOCK_BRANCHES);
    }
  };

  const handleCourseChange = (e) => {
    const cid = e.target.value;
    const selectedCourse = courses.find((c) => (c.courseId || c.id) === cid);
    setFormData((prev) => ({
      ...prev,
      courseId: cid,
      courseName: selectedCourse ? selectedCourse.courseName : '',
      branchId: '',
      branchName: '',
    }));
  };

  const handleBranchChange = (e) => {
    const bid = e.target.value;
    const selectedBranch = branches.find((b) => (b.branchId || b.id) === bid);
    setFormData((prev) => ({
      ...prev,
      branchId: bid,
      branchName: selectedBranch ? selectedBranch.branchName : '',
    }));
  };

  const filteredBranches = branches.filter((b) => {
    if (!formData.courseId) return true;
    return (b.courseId || b.course?.courseId) === formData.courseId;
  });

  const validate = () => {
    const errs = {};
    if (!formData.applicantName.trim()) errs.applicantName = 'Applicant full name is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      errs.email = 'Valid email address is required';
    if (!formData.phoneNumber.trim()) errs.phoneNumber = 'Phone number is required';
    if (!formData.courseId) errs.courseId = 'Please select an academic course';
    if (!formData.previousInstitution.trim())
      errs.previousInstitution = 'Previous institution is required';
    const pct = parseFloat(formData.previousPercentage);
    if (isNaN(pct) || pct < 0 || pct > 100)
      errs.previousPercentage = 'Percentage must be a number between 0 and 100';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const resetAndClose = () => {
    setFormData({
      applicantName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: 'MALE',
      fatherName: '',
      motherName: '',
      address: '',
      courseId: '',
      courseName: '',
      branchId: '',
      branchName: '',
      previousQualification: 'Senior Secondary (12th CBSE)',
      previousInstitution: '',
      previousPercentage: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title="New Admission Application"
      subtitle="Register a direct candidate walk-in or offline application form"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* 1. Candidate Identity */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b pb-1">
            <User className="w-4 h-4 text-blue-600" />
            1. Candidate Personal Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                placeholder="e.g. Vikramaditya Sharma"
                className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-slate-300"
                required
              />
              {errors.applicantName && (
                <p className="text-xs text-red-500 mt-1">{errors.applicantName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. applicant@domain.com"
                className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-slate-300"
                required
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-slate-300"
                required
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full text-sm px-2.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full text-sm px-2.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-slate-300 bg-white"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Father's Name</label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                placeholder="Father / Guardian Name"
                className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Mother's Name</label>
              <input
                type="text"
                value={formData.motherName}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                placeholder="Mother's Name"
                className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-slate-300"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Permanent Residential Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, city, state, postal code"
                className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* 2. Program Choice */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b pb-1">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            2. Applied Degree Course & Discipline
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Degree Program <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.courseId}
                onChange={handleCourseChange}
                className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-slate-300 bg-white"
                required
              >
                <option value="">-- Select Degree Course --</option>
                {courses.map((c) => (
                  <option key={c.courseId || c.id} value={c.courseId || c.id}>
                    {c.courseName} ({c.courseCode})
                  </option>
                ))}
              </select>
              {errors.courseId && <p className="text-xs text-red-500 mt-1">{errors.courseId}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Specialization / Branch
              </label>
              <select
                value={formData.branchId}
                onChange={handleBranchChange}
                disabled={!formData.courseId}
                className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-slate-300 bg-white disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">-- Select Branch (Optional) --</option>
                {filteredBranches.map((b) => (
                  <option key={b.branchId || b.id} value={b.branchId || b.id}>
                    {b.branchName} ({b.branchCode})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3. Academic Background */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b pb-1">
            <Award className="w-4 h-4 text-amber-600" />
            3. Qualifying Academic Merit
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Previous Qualification
              </label>
              <input
                type="text"
                value={formData.previousQualification}
                onChange={(e) => setFormData({ ...formData, previousQualification: e.target.value })}
                placeholder="e.g. Senior Secondary (12th)"
                className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                School / Institution <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.previousInstitution}
                onChange={(e) => setFormData({ ...formData, previousInstitution: e.target.value })}
                placeholder="e.g. Delhi Public School"
                className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-slate-300"
                required
              />
              {errors.previousInstitution && (
                <p className="text-xs text-red-500 mt-1">{errors.previousInstitution}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Aggregate Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.previousPercentage}
                onChange={(e) => setFormData({ ...formData, previousPercentage: e.target.value })}
                placeholder="e.g. 92.5"
                className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-slate-300"
                required
              />
              {errors.previousPercentage && (
                <p className="text-xs text-red-500 mt-1">{errors.previousPercentage}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={resetAndClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};
