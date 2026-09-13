import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { courseService } from '../../../services/courseService';
import { branchService } from '../../../services/branchService';
import { IS_PREVIEW_MODE, MOCK_COURSES, MOCK_BRANCHES } from '../../../utils/mockData';

export const CreateFeeAccountModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  existingStudents = [],
}) => {
  const [courses, setCourses] = useState(() => (IS_PREVIEW_MODE ? MOCK_COURSES : []));
  const [branches, setBranches] = useState(() => (IS_PREVIEW_MODE ? MOCK_BRANCHES : []));

  const [formData, setFormData] = useState({
    studentUserId: '',
    studentName: '',
    courseId: '',
    courseName: '',
    branchId: '',
    branchName: '',
    totalFee: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      courseService
        .getCoursesOfMyCollege()
        .then((list) => {
          if (Array.isArray(list) && list.length > 0) {
            setCourses(list);
          } else if (IS_PREVIEW_MODE) {
            setCourses(MOCK_COURSES);
          }
        })
        .catch(() => {
          if (IS_PREVIEW_MODE) setCourses(MOCK_COURSES);
        });

      branchService
        .getBranchesOfMyCollege()
        .then((list) => {
          if (Array.isArray(list) && list.length > 0) {
            setBranches(list);
          } else if (IS_PREVIEW_MODE) {
            setBranches(MOCK_BRANCHES);
          }
        })
        .catch(() => {
          if (IS_PREVIEW_MODE) setBranches(MOCK_BRANCHES);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCourseChange = (e) => {
    const cid = e.target.value;
    const course = courses.find((c) => (c.courseId || c.id) === cid);
    setFormData((prev) => ({
      ...prev,
      courseId: cid,
      courseName: course ? course.courseName : '',
    }));
  };

  const handleBranchChange = (e) => {
    const bid = e.target.value;
    const branch = branches?.find((b) => (b.branchId || b.id) === bid);
    setFormData((prev) => ({
      ...prev,
      branchId: bid,
      branchName: branch ? branch.branchName : '',
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.studentUserId.trim()) {
      errs.studentUserId = 'Student ID / User ID is required.';
    }
    if (!formData.studentName.trim()) {
      errs.studentName = 'Student name is required.';
    }
    const fee = Number(formData.totalFee);
    if (!formData.totalFee || isNaN(fee) || fee < 0) {
      errs.totalFee = 'Total fee must be a non-negative number.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      studentUserId: formData.studentUserId.trim(),
      studentName: formData.studentName.trim(),
      courseId: formData.courseId || null,
      courseName: formData.courseName || null,
      branchId: formData.branchId || null,
      branchName: formData.branchName || null,
      totalFee: Number(formData.totalFee),
    });
  };

  const handleClose = () => {
    setFormData({
      studentUserId: '',
      studentName: '',
      courseId: '',
      courseName: '',
      branchId: '',
      branchName: '',
      totalFee: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Student Fee Account"
      subtitle="Initialize academic fee ledger for an enrolled student"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student User ID & Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Student User ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.studentUserId}
              onChange={(e) => {
                setFormData({ ...formData, studentUserId: e.target.value });
                if (errors.studentUserId) setErrors({ ...errors, studentUserId: undefined });
              }}
              placeholder="e.g. STU-2026-088"
              className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-hidden focus:ring-2 transition ${
                errors.studentUserId
                  ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400'
                  : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
              }`}
            />
            {errors.studentUserId && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.studentUserId}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Student Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => {
                setFormData({ ...formData, studentName: e.target.value });
                if (errors.studentName) setErrors({ ...errors, studentName: undefined });
              }}
              placeholder="e.g. Anjali Gupta"
              className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-hidden focus:ring-2 transition ${
                errors.studentName
                  ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400'
                  : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
              }`}
            />
            {errors.studentName && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.studentName}</p>
            )}
          </div>
        </div>

        {/* Academic Program (Course) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Degree / Course
          </label>
          <select
            value={formData.courseId}
            onChange={handleCourseChange}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
          >
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c.courseId || c.id} value={c.courseId || c.id}>
                {c.courseName} {c.courseCode ? `(${c.courseCode})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Branch / Department */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Branch / Specialization
          </label>
          <select
            value={formData.branchId}
            onChange={handleBranchChange}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
          >
            <option value="">-- Select Branch --</option>
            {branches?.map((b) => (
              <option key={b.branchId || b.id} value={b.branchId || b.id}>
                {b.branchName}
              </option>
            ))}
          </select>
        </div>

        {/* Total Fee Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Annual / Total Prescribed Fee (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.totalFee}
              onChange={(e) => {
                setFormData({ ...formData, totalFee: e.target.value });
                if (errors.totalFee) setErrors({ ...errors, totalFee: undefined });
              }}
              placeholder="e.g. 125000"
              className={`w-full pl-7 pr-3 py-2 text-xs border rounded-lg focus:outline-hidden focus:ring-2 transition ${
                errors.totalFee
                  ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400'
                  : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
              }`}
            />
          </div>
          {errors.totalFee && <p className="text-[11px] text-rose-600 mt-1">{errors.totalFee}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Create Fee Account
          </Button>
        </div>
      </form>
    </Modal>
  );
};
