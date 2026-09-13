import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import { admissionService } from '../../services/admissionService';
import { courseService } from '../../services/courseService';
import { studentService } from '../../services/studentService';
import { ApplicationDetailModal } from './components/ApplicationDetailModal';
import { CreateApplicationModal } from './components/CreateApplicationModal';
import { RejectApplicationModal } from './components/RejectApplicationModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { AlertBanner } from '../../components/common/AlertBanner';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  GraduationCap,
  Eye,
  Award,
  AlertCircle,
  FileText,
} from 'lucide-react';

const STATUS_FILTERS = [
  { key: 'ALL', label: 'All Applications' },
  { key: 'SUBMITTED', label: 'Submitted (New)', icon: Clock },
  { key: 'UNDER_REVIEW', label: 'Under Review', icon: Clock },
  { key: 'APPROVED', label: 'Approved (Admitted)', icon: CheckCircle },
  { key: 'REJECTED', label: 'Rejected', icon: XCircle },
];

export const AdmissionManagementPage = () => {
  const { isMainAdmin, isCollegeAdmin, hasPermission, hasAnyPermission } = useAuth();
  const { currentCollege } = useTenant();

  // Permissions
  const canView = isMainAdmin || isCollegeAdmin || hasPermission('VIEW_ADMISSION');
  const canCreate = isMainAdmin || isCollegeAdmin || hasPermission('CREATE_ADMISSION');
  const canUpdate = isMainAdmin || isCollegeAdmin || hasPermission('UPDATE_ADMISSION');
  const canApprove = isMainAdmin || isCollegeAdmin || hasPermission('APPROVE_ADMISSION');
  const canReject = isMainAdmin || isCollegeAdmin || hasPermission('REJECT_ADMISSION');

  // State
  const [applications, setApplications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalApplications: 0,
    submitted: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
  });
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [banner, setBanner] = useState({ show: false, message: '', type: 'info' });

  // Filters
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('');

  // Modals
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [applicationToReject, setApplicationToReject] = useState(null);
  const [confirmApproveAppId, setConfirmApproveAppId] = useState(null);

  useEffect(() => {
    loadData();
  }, [currentCollege?.id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, appsData, courseList] = await Promise.allSettled([
        admissionService.getDashboard(),
        admissionService.getApplications({ size: 100 }),
        courseService.getCoursesOfMyCollege(),
      ]);

      if (statsData.status === 'fulfilled') {
        setDashboardStats(statsData.value);
      }
      if (appsData.status === 'fulfilled') {
        const list = appsData.value?.content || appsData.value || [];
        setApplications(Array.isArray(list) ? list : []);
      }
      if (courseList.status === 'fulfilled') {
        setCourses(Array.isArray(courseList.value) ? courseList.value : []);
      }
    } catch {
      setBanner({
        show: true,
        message: 'Could not connect to live Admission microservice. Running in offline preview mode.',
        type: 'warning',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Status Counts
  const counts = useMemo(() => {
    return {
      ALL: applications.length,
      SUBMITTED: applications.filter((a) => a.status === 'SUBMITTED').length,
      UNDER_REVIEW: applications.filter((a) => a.status === 'UNDER_REVIEW').length,
      APPROVED: applications.filter((a) => a.status === 'APPROVED').length,
      REJECTED: applications.filter((a) => a.status === 'REJECTED').length,
    };
  }, [applications]);

  // Filtered List
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Status Filter
      if (activeStatus !== 'ALL' && app.status !== activeStatus) return false;

      // Course Filter
      if (selectedCourseFilter && (app.courseId || app.courseName) !== selectedCourseFilter) {
        if (app.courseName !== selectedCourseFilter && app.courseId !== selectedCourseFilter) {
          return false;
        }
      }

      // Search Term
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        app.applicantName?.toLowerCase().includes(term) ||
        app.applicationNumber?.toLowerCase().includes(term) ||
        app.email?.toLowerCase().includes(term) ||
        app.phoneNumber?.includes(term) ||
        app.courseName?.toLowerCase().includes(term) ||
        app.previousInstitution?.toLowerCase().includes(term)
      );
    });
  }, [applications, activeStatus, selectedCourseFilter, searchTerm]);

  // Action: Create Application
  const handleCreateApplication = async (formData) => {
    setIsProcessing(true);
    try {
      const created = await admissionService.applyByCode(
        currentCollege?.code || 'DIET-DELHI',
        formData
      );
      if (formData.attachedDocuments?.length) {
        for (const doc of formData.attachedDocuments) {
          try {
            await admissionService.addDocument(created.id, doc);
          } catch (dErr) {
            console.warn('Walk-in document upload warning:', dErr);
          }
        }
      }
      setApplications((prev) => [created, ...prev]);
      setIsCreateModalOpen(false);
      setBanner({
        show: true,
        message: `Application ${created.applicationNumber} registered successfully!`,
        type: 'success',
      });
      // Refresh stats
      admissionService.getDashboard().then((d) => setDashboardStats(d)).catch(() => {});
    } catch {
      setBanner({ show: true, message: 'Failed to create application.', type: 'danger' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Move to Under Review
  const handleReview = async (id) => {
    setIsProcessing(true);
    try {
      const updated = await admissionService.reviewApplication(id);
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
      if (selectedApplication?.id === id) {
        setSelectedApplication((prev) => ({ ...prev, ...updated }));
      }
      setBanner({
        show: true,
        message: `Application moved to UNDER REVIEW.`,
        type: 'info',
      });
      admissionService.getDashboard().then((d) => setDashboardStats(d)).catch(() => {});
    } catch {
      setBanner({ show: true, message: 'Could not update application status.', type: 'danger' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Approve
  const handleApprove = async (id) => {
    setIsProcessing(true);
    try {
      const updated = await admissionService.approveApplication(id);
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
      if (selectedApplication?.id === id) {
        setSelectedApplication((prev) => ({ ...prev, ...updated }));
      }
      setConfirmApproveAppId(null);
      setBanner({
        show: true,
        message: `Candidate admission APPROVED! Offer letter notification dispatched.`,
        type: 'success',
      });
      admissionService.getDashboard().then((d) => setDashboardStats(d)).catch(() => {});
    } catch {
      setBanner({ show: true, message: 'Failed to approve application.', type: 'danger' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Open Reject Modal
  const handleOpenRejectModal = (app) => {
    setApplicationToReject(app);
    setIsRejectModalOpen(true);
  };

  // Action: Confirm Rejection
  const handleConfirmReject = async (id, reason) => {
    setIsProcessing(true);
    try {
      const updated = await admissionService.rejectApplication(id, reason);
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
      if (selectedApplication?.id === id) {
        setSelectedApplication((prev) => ({ ...prev, ...updated }));
      }
      setIsRejectModalOpen(false);
      setApplicationToReject(null);
      setBanner({
        show: true,
        message: `Application rejected with formal notification sent to candidate.`,
        type: 'info',
      });
      admissionService.getDashboard().then((d) => setDashboardStats(d)).catch(() => {});
    } catch {
      setBanner({ show: true, message: 'Failed to reject application.', type: 'danger' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Enroll Candidate as Student in Class Service
  const handleEnrollStudent = async (app) => {
    if (!app) return;
    setIsProcessing(true);
    try {
      const names = (app.applicantName || 'Candidate').trim().split(/\s+/);
      const firstName = names[0] || 'Candidate';
      const lastName = names.slice(1).join(' ') || 'Student';
      const rawNumber = app.applicationNumber
        ? app.applicationNumber.replace(/[^0-9]/g, '').slice(-5)
        : `${Date.now()}`.slice(-5);
      const enrollmentNumber = `ENR-2026-${rawNumber}`;

      await studentService.createStudent({
        userId: `usr-adm-${rawNumber}`,
        enrollmentNumber,
        rollNumber: `ROL-${rawNumber}`,
        firstName,
        lastName,
        email: app.email,
        phoneNumber: app.phoneNumber,
        gender: app.gender || 'MALE',
        dateOfBirth: app.dateOfBirth || '2006-01-01',
        guardianName: app.fatherName || app.motherName || 'Parent / Guardian',
        guardianPhoneNumber: app.phoneNumber,
        address: app.address || 'Candidate Address on File',
        admissionDate: new Date().toISOString().split('T')[0],
      });

      setBanner({
        show: true,
        message: `Candidate ${app.applicantName} enrolled as student successfully! Enrollment ID: ${enrollmentNumber}`,
        type: 'success',
      });
      setIsDetailModalOpen(false);
    } catch (err) {
      setBanner({
        show: true,
        message: err.message || 'Failed to create student profile.',
        type: 'danger',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredApplications.length === 0) return;
    const headers = [
      'Application Number',
      'Applicant Name',
      'Email',
      'Phone',
      'Course',
      'Branch',
      'Percentage',
      'Status',
      'Submission Date',
    ];
    const rows = filteredApplications.map((a) => [
      a.applicationNumber,
      `"${a.applicantName || ''}"`,
      a.email,
      a.phoneNumber,
      `"${a.courseName || ''}"`,
      `"${a.branchName || ''}"`,
      a.previousPercentage || '',
      a.status,
      a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : '',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Admissions_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {banner.show && (
        <AlertBanner
          type={banner.type}
          message={banner.message}
          onClose={() => setBanner({ ...banner, show: false })}
        />
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Academic Intake & Enrollment</span>
          </div>
          <h1 className="text-2xl font-bold">Admissions Management Portal</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-xl">
            Evaluate candidate registrations, inspect qualifying merit percentages, verify
            certificates, and process admissions decisions for central programs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Sync
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={filteredApplications.length === 0}
            className="border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-400" />
            Export CSV
          </Button>

          {canCreate && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Application
            </Button>
          )}
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          onClick={() => setActiveStatus('ALL')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            activeStatus === 'ALL'
              ? 'bg-blue-50 border-blue-300 shadow-sm ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Intake</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {dashboardStats.totalApplications || counts.ALL}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">All registered candidates</p>
        </div>

        <div
          onClick={() => setActiveStatus('SUBMITTED')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            activeStatus === 'SUBMITTED'
              ? 'bg-amber-50 border-amber-300 shadow-sm ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 uppercase">Submitted</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-700 mt-2">
            {dashboardStats.submitted || counts.SUBMITTED}
          </p>
          <p className="text-[11px] text-amber-600 mt-1">Awaiting scrutiny</p>
        </div>

        <div
          onClick={() => setActiveStatus('UNDER_REVIEW')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            activeStatus === 'UNDER_REVIEW'
              ? 'bg-blue-50 border-blue-300 shadow-sm ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 uppercase">Under Review</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-blue-700 mt-2">
            {dashboardStats.underReview || counts.UNDER_REVIEW}
          </p>
          <p className="text-[11px] text-blue-600 mt-1">In committee evaluation</p>
        </div>

        <div
          onClick={() => setActiveStatus('APPROVED')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            activeStatus === 'APPROVED'
              ? 'bg-emerald-50 border-emerald-300 shadow-sm ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase">Approved</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">
            {dashboardStats.approved || counts.APPROVED}
          </p>
          <p className="text-[11px] text-emerald-600 mt-1">Admitted scholars</p>
        </div>

        <div
          onClick={() => setActiveStatus('REJECTED')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            activeStatus === 'REJECTED'
              ? 'bg-rose-50 border-rose-300 shadow-sm ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-rose-700 mt-2">
            {dashboardStats.rejected || counts.REJECTED}
          </p>
          <p className="text-[11px] text-rose-600 mt-1">Ineligible / Quota full</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
          {STATUS_FILTERS.map((tab) => {
            const isActive = activeStatus === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveStatus(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {counts[tab.key] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Inputs */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, app #, email, or school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Degree Programs</option>
              {courses.map((c) => (
                <option key={c.courseId || c.id} value={c.courseName}>
                  {c.courseName}
                </option>
              ))}
            </select>

            {(searchTerm || selectedCourseFilter || activeStatus !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCourseFilter('');
                  setActiveStatus('ALL');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-xs">Loading candidate applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No applications match your filter</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search criteria or register a new candidate.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Application #</th>
                  <th className="py-3 px-4">Candidate Information</th>
                  <th className="py-3 px-4">Applied Program</th>
                  <th className="py-3 px-4">Qualifying Merit</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((app) => {
                  const isOpen = app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW';
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition">
                      {/* App Number */}
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">
                        {app.applicationNumber}
                      </td>

                      {/* Candidate */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs border border-blue-200">
                            {app.applicantName?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{app.applicantName}</p>
                            <p className="text-[11px] text-slate-400">
                              {app.email} • {app.phoneNumber}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Applied Course & Branch */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800 line-clamp-1">{app.courseName || 'General Program'}</p>
                        <p className="text-[11px] text-slate-500">{app.branchName || 'Core Track'}</p>
                      </td>

                      {/* Qualifying Merit */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-800">
                            {app.previousPercentage ? `${app.previousPercentage}%` : 'N/A'}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                            {app.previousInstitution || 'CBSE Board'}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Recent'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : app.status === 'UNDER_REVIEW'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {app.status === 'APPROVED' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : app.status === 'REJECTED' ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Dossier */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedApplication(app);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                            title="View Candidate Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Enroll (if approved) */}
                          {app.status === 'APPROVED' && (
                            <button
                              type="button"
                              onClick={() => handleEnrollStudent(app)}
                              className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded transition flex items-center gap-1"
                              title="Enroll as Registered Student"
                            >
                              <GraduationCap className="w-3 h-3" />
                              Enroll
                            </button>
                          )}

                          {/* Quick Review (if submitted) */}
                          {isOpen && app.status === 'SUBMITTED' && canUpdate && (
                            <button
                              type="button"
                              onClick={() => handleReview(app.id)}
                              className="px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition"
                              title="Move to Under Review"
                            >
                              Review
                            </button>
                          )}

                          {/* Quick Approve (if open) */}
                          {isOpen && canApprove && (
                            <button
                              type="button"
                              onClick={() => setConfirmApproveAppId(app.id)}
                              className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition"
                              title="Approve Candidate"
                            >
                              Approve
                            </button>
                          )}

                          {/* Quick Reject (if open) */}
                          {isOpen && canReject && (
                            <button
                              type="button"
                              onClick={() => handleOpenRejectModal(app)}
                              className="px-2 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition"
                              title="Reject Application"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail & Dossier Modal */}
      <ApplicationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
        onReview={handleReview}
        onApprove={(id) => setConfirmApproveAppId(id)}
        onOpenRejectModal={handleOpenRejectModal}
        onEnroll={handleEnrollStudent}
        canUpdate={canUpdate}
        canApprove={canApprove}
        canReject={canReject}
        isProcessing={isProcessing}
      />

      {/* Create Application Modal */}
      <CreateApplicationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateApplication}
        isSubmitting={isProcessing}
      />

      {/* Reject Application Modal */}
      <RejectApplicationModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setApplicationToReject(null);
        }}
        application={applicationToReject}
        onConfirmReject={handleConfirmReject}
        isProcessing={isProcessing}
      />

      {/* Confirm Approve Modal */}
      <ConfirmModal
        isOpen={!!confirmApproveAppId}
        onClose={() => setConfirmApproveAppId(null)}
        onConfirm={() => handleApprove(confirmApproveAppId)}
        title="Approve Candidate for Admission"
        message="Are you sure you want to approve this candidate? This will officially grant admission status, allocate quota, and dispatch a congratulatory offer letter to the applicant."
        confirmText="Approve Admission"
        confirmVariant="primary"
        isLoading={isProcessing}
      />
    </div>
  );
};
