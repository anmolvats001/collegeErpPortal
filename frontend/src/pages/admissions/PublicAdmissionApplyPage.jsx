import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { admissionService } from '../../services/admissionService';
import { courseService } from '../../services/courseService';
import { branchService } from '../../services/branchService';
import { collegeService } from '../../services/collegeService';
import {
  MOCK_COLLEGES,
  MOCK_COURSES,
  MOCK_BRANCHES,
} from '../../utils/mockData';
import { CollegeLogo } from '../../components/common/CollegeLogo';
import { Button } from '../../components/common/Button';
import { fileUploadService } from '../../services/fileUploadService';
import {
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Building,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Upload,
  Paperclip,
  Trash2,
  File,
  Search,
  Clock,
  XCircle,
} from 'lucide-react';

export const PublicAdmissionApplyPage = () => {
  const { collegeCode: routeCollegeCode } = useParams();
  const navigate = useNavigate();

  // Reference Data
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);

  // Selected State
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [errorBanner, setErrorBanner] = useState('');
  const [attachedDocuments, setAttachedDocuments] = useState([]);

  // Mode & Tracking State
  const [activeView, setActiveView] = useState('APPLY'); // 'APPLY' | 'TRACK'
  const [trackQuery, setTrackQuery] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackedApplication, setTrackedApplication] = useState(null);
  const [trackedDocuments, setTrackedDocuments] = useState([]);
  const [trackError, setTrackError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    collegeCode: routeCollegeCode || 'DIET-DELHI',
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
    agreeTerms: false,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadInitialData();
  }, [routeCollegeCode]);

  const loadInitialData = async () => {
    // 1. Load Colleges
    let loadedColleges = MOCK_COLLEGES;
    try {
      const res = await collegeService.getAllColleges(0, 50);
      const list = res?.colleges?.content || res?.content || (Array.isArray(res) ? res : null);
      if (Array.isArray(list) && list.length > 0) loadedColleges = list;
    } catch {
      loadedColleges = MOCK_COLLEGES;
    }
    setColleges(loadedColleges);

    // Determine current college
    const activeCode = routeCollegeCode || formData.collegeCode || 'DIET-DELHI';
    const found =
      loadedColleges.find((c) => c.collegeCode === activeCode) || loadedColleges[0];
    setSelectedCollege(found);
    if (found) {
      setFormData((prev) => ({ ...prev, collegeCode: found.collegeCode }));
    }

    // 2. Load Courses
    try {
      const courseList = await courseService.getCoursesOfMyCollege();
      setCourses(Array.isArray(courseList) && courseList.length ? courseList : MOCK_COURSES);
    } catch {
      setCourses(MOCK_COURSES);
    }

    // 3. Load Branches
    try {
      const branchList = await branchService.getBranchesOfMyCollege();
      setBranches(Array.isArray(branchList) && branchList.length ? branchList : MOCK_BRANCHES);
    } catch {
      setBranches(MOCK_BRANCHES);
    }
  };

  const handleCollegeChange = (e) => {
    const code = e.target.value;
    const col = colleges.find((c) => c.collegeCode === code);
    setSelectedCollege(col || null);
    setFormData((prev) => ({
      ...prev,
      collegeCode: code,
      courseId: '',
      courseName: '',
      branchId: '',
      branchName: '',
    }));
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

  const handleDocumentAttach = (docType, file) => {
    if (!file) return;
    const newDoc = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      documentType: docType,
      file,
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(1) + ' KB',
      fileUrl: URL.createObjectURL(file),
    };
    setAttachedDocuments((prev) => {
      const filtered = prev.filter((d) => d.documentType !== docType);
      return [...filtered, newDoc];
    });
  };

  const handleDocumentRemove = (docType) => {
    setAttachedDocuments((prev) => prev.filter((d) => d.documentType !== docType));
  };

  const validate = () => {
    const errs = {};
    if (!formData.applicantName.trim()) errs.applicantName = 'Full legal name is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      errs.email = 'Valid personal email address is required for communication';
    if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 8)
      errs.phoneNumber = 'Valid 10-digit mobile number is required';
    if (!formData.courseId) errs.courseId = 'Please select your desired academic program';
    if (!formData.previousInstitution.trim())
      errs.previousInstitution = 'Previous school / college board name is required';

    const pct = parseFloat(formData.previousPercentage);
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      errs.previousPercentage = 'Aggregate percentage must be a valid number between 1.0 and 100.0';
    }

    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must certify the accuracy of your academic declarations';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setErrorBanner('');

    try {
      const collegeCodeToSubmit = formData.collegeCode || selectedCollege?.collegeCode || 'DIET-DELHI';
      // 1. Submit Application
      const response = await admissionService.applyByCode(collegeCodeToSubmit, {
        applicantName: formData.applicantName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender,
        fatherName: formData.fatherName.trim() || null,
        motherName: formData.motherName.trim() || null,
        address: formData.address.trim() || null,
        courseId: formData.courseId,
        courseName: formData.courseName,
        branchId: formData.branchId || null,
        branchName: formData.branchName || null,
        previousQualification: formData.previousQualification,
        previousInstitution: formData.previousInstitution.trim(),
        previousPercentage: parseFloat(formData.previousPercentage),
      });

      // 2. Upload and attach verification documents
      if (attachedDocuments.length > 0) {
        for (const doc of attachedDocuments) {
          try {
            let finalUrl = doc.fileUrl;
            if (doc.file) {
              const uploadRes = await fileUploadService.uploadFile(doc.file, {
                folder: 'admissions/public-applications',
                entityType: 'ADMISSION_DOCUMENT',
                entityId: response.id,
              });
              finalUrl = uploadRes.secureUrl || uploadRes.url || finalUrl;
            }
            await admissionService.addDocument(response.id, {
              documentType: doc.documentType,
              fileName: doc.fileName,
              fileUrl: finalUrl,
            });
          } catch (docErr) {
            console.warn('Document attach warning:', docErr);
          }
        }
      }

      setSubmissionSuccess(response);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorBanner(
        err?.response?.data?.message ||
          'Failed to submit admission application. Please check your details and retry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e, directQuery = null) => {
    if (e) e.preventDefault();
    const query = (directQuery !== null ? directQuery : trackQuery).trim();
    if (!query) return;

    if (directQuery !== null) {
      setTrackQuery(directQuery);
    }

    setIsTracking(true);
    setTrackError('');
    setTrackedApplication(null);
    setTrackedDocuments([]);

    try {
      const app = await admissionService.trackApplication(query);
      setTrackedApplication(app);
      try {
        const docs = await admissionService.trackDocuments(query);
        setTrackedDocuments(Array.isArray(docs) ? docs : []);
      } catch {
        setTrackedDocuments([]);
      }
    } catch (err) {
      setTrackError(
        err?.response?.data?.message ||
          err?.message ||
          `No admission application found matching "${query}". Please check your application reference or email.`
      );
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between">
      {/* 1. Public Top Navigation Bar */}
      <header className="bg-[#0f2942] text-white border-b border-slate-700 h-16 px-6 flex items-center shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CollegeLogo size={32} variant="light" />
            <div className="hidden sm:block">
              <span className="text-xs text-blue-300 font-semibold tracking-wider uppercase block">
                Academic Intake Portal
              </span>
              <span className="text-sm font-bold text-white">Central Admissions (Session 2026–27)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-800/90 text-slate-200 hover:bg-slate-700 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Login to ERP Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12 flex-1">
        {/* Navigation Tabs: Apply vs Track */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-slate-200/90 p-1 rounded-xl flex items-center gap-1 shadow-inner border border-slate-300 max-w-md w-full">
            <button
              type="button"
              onClick={() => {
                setActiveView('APPLY');
                setTrackError('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeView === 'APPLY'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Submit Application</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView('TRACK');
                setErrorBanner('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeView === 'TRACK'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Track Status</span>
            </button>
          </div>
        </div>

        {activeView === 'APPLY' && (
          <>
            {/* Error Alert */}
            {errorBanner && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-3 shadow-xs">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Application Submission Error</p>
                  <p className="mt-0.5">{errorBanner}</p>
                </div>
              </div>
            )}

        {/* 3. Success Screen / Digital Acknowledgment Slip */}
        {submissionSuccess ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden animate-fadeIn">
            {/* Celebration Banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-8 text-center relative">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 ring-8 ring-white/10">
                <CheckCircle2 className="w-9 h-9 text-emerald-300" />
              </div>
              <h2 className="text-2xl font-black">Application Submitted Successfully!</h2>
              <p className="text-emerald-100 text-xs mt-1 max-w-md mx-auto">
                Your admission application has been registered into the central institutional
                scrutiny registry.
              </p>
            </div>

            {/* Application Reference Card */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Official Application Reference Number
                  </span>
                  <span className="text-2xl font-mono font-extrabold text-blue-700 tracking-wider">
                    {submissionSuccess.applicationNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-xs font-semibold inline-block">
                    Status: SUBMITTED (Under Scrutiny)
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Submitted on: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Dossier Summary Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-700 border-b border-slate-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Candidate Registration Summary</span>
                </div>
                <div className="divide-y divide-slate-100 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                    <span className="text-slate-500">Applicant Name:</span>
                    <span className="font-bold text-slate-900 sm:col-span-2">
                      {submissionSuccess.applicantName}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                    <span className="text-slate-500">Email Address:</span>
                    <span className="font-semibold text-slate-800 sm:col-span-2">
                      {submissionSuccess.email}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                    <span className="text-slate-500">Mobile Phone:</span>
                    <span className="font-semibold text-slate-800 sm:col-span-2">
                      {submissionSuccess.phoneNumber}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                    <span className="text-slate-500">Selected Institution:</span>
                    <span className="font-bold text-blue-800 sm:col-span-2">
                      {selectedCollege?.collegeName || submissionSuccess.collegeCode}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                    <span className="text-slate-500">Applied Degree Program:</span>
                    <span className="font-bold text-slate-900 sm:col-span-2">
                      {submissionSuccess.courseName}
                      {submissionSuccess.branchName && (
                        <span className="font-normal text-slate-600 block text-[11px]">
                          Track: {submissionSuccess.branchName}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                    <span className="text-slate-500">Qualifying Merit Score:</span>
                    <span className="font-bold text-emerald-700 sm:col-span-2">
                      {submissionSuccess.previousPercentage}% ({submissionSuccess.previousQualification})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                    <span className="text-slate-500">Attached Verification Documents:</span>
                    <span className="font-semibold text-slate-800 sm:col-span-2">
                      {attachedDocuments.length > 0 ? (
                        <div className="space-y-1.5">
                          {attachedDocuments.map((d) => (
                            <div key={d.id} className="flex items-center gap-2 text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="font-bold">{d.fileName}</span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                ({d.documentType.replace(/_/g, ' ')})
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No verification certificates attached</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Steps Notification Card */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-2">
                <p className="font-bold flex items-center gap-1.5 text-blue-800">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  What Happens Next?
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 text-[11px]">
                  <li>
                    An automated acknowledgment email has been dispatched to{' '}
                    <strong>{submissionSuccess.email}</strong>.
                  </li>
                  <li>
                    The Admissions Scrutiny Committee will verify your eligibility against the program
                    cutoff matrix.
                  </li>
                  <li>
                    Upon approval, you will receive your provisional allotment letter and fee deposit
                    schedule via email.
                  </li>
                </ol>
              </div>

              {/* Print & Return Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Print Acknowledgment Slip
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSubmissionSuccess(null);
                      setFormData({
                        collegeCode: selectedCollege?.collegeCode || 'DIET-DELHI',
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
                        agreeTerms: false,
                      });
                    }}
                  >
                    Submit Another Application
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      setActiveView('TRACK');
                      handleTrackSubmit(null, submissionSuccess.applicationNumber);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
                  >
                    <Search className="w-4 h-4" />
                    Track Application Status
                  </Button>

                  <Link to="/login">
                    <Button variant="outline" className="border-slate-300 hover:bg-slate-50 text-slate-700">
                      ERP Portal Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 4. Multi-Section Public Application Form */
          <div className="space-y-6">
            {/* Hero Header */}
            <div className="p-6 md:p-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl shadow-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-400/40 text-blue-200 text-xs font-semibold mb-3">
                <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
                <span>Centralized University Application Session 2026–2027</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Online Application for Academic Admissions
              </h1>
              <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-2xl leading-relaxed">
                Welcome prospective scholar. Please fill out the formal admission registration form
                below to apply for undergraduate and postgraduate disciplines across our affiliated
                colleges.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION 1: Institution & Academic Choice */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>1. Select Affiliated Institution & Academic Program</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* College Selector */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Choose College / Institute <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.collegeCode}
                      onChange={handleCollegeChange}
                      className="w-full text-xs px-3 py-2.5 border rounded-lg border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                      required
                    >
                      {colleges.map((col) => (
                        <option key={col.collegeId || col.id} value={col.collegeCode}>
                          {col.collegeName} ({col.collegeCode}) • {col.collegeCity || 'Campus'}
                        </option>
                      ))}
                    </select>
                    {selectedCollege && (
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        {selectedCollege.collegeDescription || 'Accredited Academic Institution'}
                      </p>
                    )}
                  </div>

                  {/* Degree Course */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Degree Program <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.courseId}
                      onChange={handleCourseChange}
                      className="w-full text-xs px-3 py-2.5 border rounded-lg border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    >
                      <option value="">-- Choose Degree Program --</option>
                      {courses.map((c) => (
                        <option key={c.courseId || c.id} value={c.courseId || c.id}>
                          {c.courseName} ({c.courseCode})
                        </option>
                      ))}
                    </select>
                    {formErrors.courseId && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.courseId}</p>
                    )}
                  </div>

                  {/* Branch / Specialization */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Branch / Specialization
                    </label>
                    <select
                      value={formData.branchId}
                      onChange={handleBranchChange}
                      disabled={!formData.courseId}
                      className="w-full text-xs px-3 py-2.5 border rounded-lg border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      <option value="">-- Core / General Track --</option>
                      {filteredBranches.map((b) => (
                        <option key={b.branchId || b.id} value={b.branchId || b.id}>
                          {b.branchName} ({b.branchCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Candidate Personal Information */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>2. Candidate Identity & Contact Details</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Applicant Full Name (as per 10th certificate) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vikramaditya Sharma"
                      value={formData.applicantName}
                      onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                    {formErrors.applicantName && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.applicantName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. vikram.sharma@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                    {formErrors.email && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876501234"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                    {formErrors.phoneNumber && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.phoneNumber}</p>
                    )}
                  </div>

                  {/* DOB & Gender */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full text-xs px-2.5 py-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full text-xs px-2.5 py-2.5 border rounded-lg border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Father's Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Father's / Guardian's Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Father's full name"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Mother's Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mother's Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Mother's full name"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Permanent Address */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Permanent Residential Address
                    </label>
                    <input
                      type="text"
                      placeholder="House/Plot no., Street, City, State, PIN code"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Qualifying Academic Merit */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>3. Prior Academic Qualifications & Percentage</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Qualifying Examination
                    </label>
                    <select
                      value={formData.previousQualification}
                      onChange={(e) =>
                        setFormData({ ...formData, previousQualification: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2.5 border rounded-lg border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Senior Secondary (12th CBSE)">Senior Secondary (12th CBSE)</option>
                      <option value="Senior Secondary (12th ISC)">Senior Secondary (12th ISC)</option>
                      <option value="Senior Secondary (State Board)">Senior Secondary (State Board)</option>
                      <option value="Polytechnic Diploma">Polytechnic / Technical Diploma</option>
                      <option value="Bachelor of Science (B.Sc)">Bachelor of Science (B.Sc)</option>
                      <option value="Bachelor of Commerce (B.Com)">Bachelor of Commerce (B.Com)</option>
                      <option value="Other Equivalent Degree">Other Equivalent Degree</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      School / Junior College Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Delhi Public School, R.K. Puram"
                      value={formData.previousInstitution}
                      onChange={(e) =>
                        setFormData({ ...formData, previousInstitution: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                    {formErrors.previousInstitution && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.previousInstitution}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Aggregate Percentage (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="e.g. 94.6"
                      value={formData.previousPercentage}
                      onChange={(e) =>
                        setFormData({ ...formData, previousPercentage: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-900"
                      required
                    />
                    {formErrors.previousPercentage && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.previousPercentage}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 4: Upload Verification Certificates & Documents */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-1">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Upload className="w-4 h-4 text-purple-600" />
                    <span>4. Attach Certificates & Verification Documents</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">PDF, JPG, PNG (Max 10MB per file)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Slot 1: 10th Marksheet */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        10th Standard Marksheet / Passing Certificate
                      </span>
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Required
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Proof of Date of Birth & Secondary School examination
                    </p>

                    {attachedDocuments.find((d) => d.documentType === '10TH_MARKSHEET') ? (
                      <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-emerald-900 truncate">
                            {attachedDocuments.find((d) => d.documentType === '10TH_MARKSHEET').fileName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDocumentRemove('10TH_MARKSHEET')}
                          className="text-rose-600 hover:text-rose-800 p-1 shrink-0"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleDocumentAttach('10TH_MARKSHEET', e.target.files?.[0])}
                        className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                      />
                    )}
                  </div>

                  {/* Slot 2: 12th Marksheet */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        12th Standard Marksheet / Scorecard
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Required
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Qualifying examination merit verification for cutoff screening
                    </p>

                    {attachedDocuments.find((d) => d.documentType === '12TH_MARKSHEET') ? (
                      <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-emerald-900 truncate">
                            {attachedDocuments.find((d) => d.documentType === '12TH_MARKSHEET').fileName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDocumentRemove('12TH_MARKSHEET')}
                          className="text-rose-600 hover:text-rose-800 p-1 shrink-0"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleDocumentAttach('12TH_MARKSHEET', e.target.files?.[0])}
                        className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                      />
                    )}
                  </div>

                  {/* Slot 3: Aadhaar Card / ID Proof */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        Government Photo ID (Aadhaar / Passport)
                      </span>
                      <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        Identity Check
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Photo identity and permanent address verification
                    </p>

                    {attachedDocuments.find((d) => d.documentType === 'AADHAAR_CARD') ? (
                      <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-emerald-900 truncate">
                            {attachedDocuments.find((d) => d.documentType === 'AADHAAR_CARD').fileName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDocumentRemove('AADHAAR_CARD')}
                          className="text-rose-600 hover:text-rose-800 p-1 shrink-0"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleDocumentAttach('AADHAAR_CARD', e.target.files?.[0])}
                        className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                      />
                    )}
                  </div>

                  {/* Slot 4: Transfer Certificate / Migration */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        Transfer Certificate (TC) / Migration
                      </span>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        Optional
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Can be submitted now or during physical campus registration
                    </p>

                    {attachedDocuments.find((d) => d.documentType === 'TRANSFER_CERTIFICATE') ? (
                      <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-emerald-900 truncate">
                            {attachedDocuments.find((d) => d.documentType === 'TRANSFER_CERTIFICATE').fileName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDocumentRemove('TRANSFER_CERTIFICATE')}
                          className="text-rose-600 hover:text-rose-800 p-1 shrink-0"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) =>
                          handleDocumentAttach('TRANSFER_CERTIFICATE', e.target.files?.[0])
                        }
                        className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 5: Declaration & Consent */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="agreeTerms" className="cursor-pointer select-none">
                    <strong>Applicant Declaration:</strong> I hereby declare that the information
                    furnished above is true, complete, and verifiable against my original academic
                    certificates. I understand that any false representation will result in immediate
                    cancellation of my application and forfeiture of candidature.
                  </label>
                </div>
                {formErrors.agreeTerms && (
                  <p className="text-xs text-red-500 font-medium">{formErrors.agreeTerms}</p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-slate-400">
                    Need assistance? Contact Central Admissions at{' '}
                    <span className="text-blue-600 font-semibold">admissions@college.edu</span>
                  </p>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md rounded-xl"
                  >
                    Submit Admission Application
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
          </>
        )}

        {/* Track Application View */}
        {activeView === 'TRACK' && (
          <div className="space-y-6">
            {/* Search Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="text-center max-w-lg mx-auto mb-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-100">
                  <Search className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Track Admission Status</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your official Application Reference Number or registered candidate email
                  address to check your real-time scrutiny status.
                </p>
              </div>

              <form onSubmit={handleTrackSubmit} className="max-w-xl mx-auto space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={trackQuery}
                      onChange={(e) => setTrackQuery(e.target.value)}
                      placeholder="e.g. ADM-2026-00101 or applicant@email.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isTracking}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Track Status
                  </Button>
                </div>

                {/* Quick Sample Test Chips */}
                <div className="pt-2 text-center">
                  <span className="text-[11px] text-slate-400 font-medium block mb-2">
                    Quick test records:
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => handleTrackSubmit(null, 'ADM-2026-00101')}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-full text-[11px] font-semibold transition cursor-pointer"
                    >
                      Vikram (Approved)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTrackSubmit(null, 'ADM-2026-00103')}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-full text-[11px] font-semibold transition cursor-pointer"
                    >
                      Karan (Under Review)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTrackSubmit(null, 'ADM-2026-00102')}
                      className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-full text-[11px] font-semibold transition cursor-pointer"
                    >
                      Pooja (Submitted)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTrackSubmit(null, 'ADM-2026-00104')}
                      className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-full text-[11px] font-semibold transition cursor-pointer"
                    >
                      Ananya (Rejected)
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Error Message */}
            {trackError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-3 shadow-xs animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Application Not Found</p>
                  <p className="mt-0.5">{trackError}</p>
                  <p className="text-[11px] text-rose-600 mt-2">
                    Tip: Verify your reference number or contact central admissions helpdesk at{' '}
                    <span className="font-semibold underline">admissions@college.edu</span>.
                  </p>
                </div>
              </div>
            )}

            {/* Tracked Record Result */}
            {trackedApplication && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden animate-fadeIn space-y-6 pb-6">
                {/* Status Hero Banner */}
                <div
                  className={`p-6 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4 ${
                    trackedApplication.status === 'APPROVED'
                      ? 'bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900'
                      : trackedApplication.status === 'REJECTED'
                      ? 'bg-gradient-to-r from-rose-900 via-red-800 to-rose-900'
                      : trackedApplication.status === 'UNDER_REVIEW'
                      ? 'bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900'
                      : 'bg-gradient-to-r from-amber-700 via-orange-800 to-amber-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 ring-4 ring-white/10">
                      {trackedApplication.status === 'APPROVED' ? (
                        <CheckCircle2 className="w-8 h-8 text-emerald-300" />
                      ) : trackedApplication.status === 'REJECTED' ? (
                        <XCircle className="w-8 h-8 text-rose-300" />
                      ) : (
                        <Clock className="w-8 h-8 text-amber-300" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">
                        Institutional Admission Status
                      </span>
                      <h3 className="text-xl font-black">
                        {trackedApplication.status === 'APPROVED'
                          ? 'Admission Offer Approved'
                          : trackedApplication.status === 'REJECTED'
                          ? 'Application Not Selected'
                          : trackedApplication.status === 'UNDER_REVIEW'
                          ? 'Under Administrative Scrutiny'
                          : 'Application Registered'}
                      </h3>
                      <p className="text-xs opacity-90 mt-0.5">
                        Reference Number: <span className="font-mono font-bold">{trackedApplication.applicationNumber}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 text-center sm:text-right shrink-0">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-slate-900 shadow-sm inline-block">
                      {trackedApplication.status.replace(/_/g, ' ')}
                    </span>
                    <p className="text-[10px] opacity-75 mt-1">
                      Submitted: {trackedApplication.submittedAt ? new Date(trackedApplication.submittedAt).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                </div>

                {/* 3-Step Timeline Stepper */}
                <div className="px-6 sm:px-8">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {/* Step 1: Submission */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold mb-1 shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-800">1. Submitted</span>
                        <span className="text-[10px] text-slate-500">
                          {trackedApplication.submittedAt ? new Date(trackedApplication.submittedAt).toLocaleDateString() : 'Received'}
                        </span>
                      </div>

                      {/* Step 2: Scrutiny */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 shadow-xs ${
                            trackedApplication.status === 'SUBMITTED'
                              ? 'bg-slate-200 text-slate-500'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {trackedApplication.status === 'SUBMITTED' ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-bold text-slate-800">2. Scrutiny</span>
                        <span className="text-[10px] text-slate-500">
                          {trackedApplication.status === 'SUBMITTED' ? 'In Queue' : 'Reviewed'}
                        </span>
                      </div>

                      {/* Step 3: Final Decision */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 shadow-xs ${
                            trackedApplication.status === 'APPROVED'
                              ? 'bg-emerald-600 text-white'
                              : trackedApplication.status === 'REJECTED'
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {trackedApplication.status === 'APPROVED' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : trackedApplication.status === 'REJECTED' ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-bold text-slate-800">3. Decision</span>
                        <span className="text-[10px] text-slate-500">
                          {trackedApplication.status === 'APPROVED'
                            ? 'Approved'
                            : trackedApplication.status === 'REJECTED'
                            ? 'Rejected'
                            : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dossier Information Grid */}
                <div className="px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Candidate Profile */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-blue-700">
                      <User className="w-3.5 h-3.5" />
                      Candidate Information
                    </p>
                    <div className="space-y-1 text-slate-600">
                      <p><strong className="text-slate-900 font-semibold">Full Legal Name:</strong> {trackedApplication.applicantName}</p>
                      <p><strong className="text-slate-900 font-semibold">Email:</strong> {trackedApplication.email}</p>
                      <p><strong className="text-slate-900 font-semibold">Mobile:</strong> {trackedApplication.phoneNumber}</p>
                      <p><strong className="text-slate-900 font-semibold">Gender / DOB:</strong> {trackedApplication.gender} • {trackedApplication.dateOfBirth || 'Not specified'}</p>
                      <p><strong className="text-slate-900 font-semibold">Guardian:</strong> {trackedApplication.fatherName || trackedApplication.motherName || 'On record'}</p>
                    </div>
                  </div>

                  {/* Program & Merit */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-blue-700">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Program & Merit Evaluation
                    </p>
                    <div className="space-y-1 text-slate-600">
                      <p><strong className="text-slate-900 font-semibold">College Code:</strong> {trackedApplication.collegeCode || 'DIET-DELHI'}</p>
                      <p><strong className="text-slate-900 font-semibold">Degree Program:</strong> {trackedApplication.courseName || 'Undergraduate'}</p>
                      <p><strong className="text-slate-900 font-semibold">Specialization:</strong> {trackedApplication.branchName || 'Core Track'}</p>
                      <p><strong className="text-slate-900 font-semibold">Qualifying Board:</strong> {trackedApplication.previousInstitution || 'Board of Education'}</p>
                      <p><strong className="text-slate-900 font-semibold">Merit Score:</strong> <span className="font-extrabold text-blue-700">{trackedApplication.previousPercentage}%</span></p>
                    </div>
                  </div>
                </div>

                {/* Uploaded Documents Scrutiny */}
                <div className="px-6 sm:px-8 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-500" />
                    Verification Documents Status
                  </h4>

                  {trackedDocuments.length > 0 ? (
                    <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
                      {trackedDocuments.map((doc) => (
                        <div key={doc.id} className="p-3 flex items-center justify-between gap-3 bg-white hover:bg-slate-50">
                          <div className="flex items-center gap-2.5 truncate">
                            <File className="w-4 h-4 text-blue-600 shrink-0" />
                            <div className="truncate">
                              <p className="font-bold text-slate-800 truncate">{doc.fileName}</p>
                              <p className="text-[10px] text-slate-500">{doc.documentType.replace(/_/g, ' ')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                                doc.verified
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : 'bg-amber-50 text-amber-700 border-amber-300'
                              }`}
                            >
                              {doc.verified ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Verified
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  Pending Scrutiny
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                      Standard qualification certificates attached with admission dossier.
                    </div>
                  )}
                </div>

                {/* Rejection Remark (if rejected) */}
                {trackedApplication.status === 'REJECTED' && (
                  <div className="px-6 sm:px-8">
                    <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-rose-800">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        Official Scrutiny Remark
                      </p>
                      <p className="text-slate-700 pl-5">
                        {trackedApplication.rejectionReason ||
                          'Minimum merit cutoff was not achieved for the selected course specialization during this admission cycle.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Approved Next Steps Card */}
                {trackedApplication.status === 'APPROVED' && (
                  <div className="px-6 sm:px-8">
                    <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 space-y-2">
                      <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Next Steps for Admitted Candidates
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1 text-[11px]">
                        <li>Report to campus Central Admissions Cell with original 10th & 12th certificates.</li>
                        <li>Deposit semester academic fees via the college online student fee window.</li>
                        <li>Collect institutional ID card and college ERP login credentials.</li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="px-6 sm:px-8 pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <Printer className="w-4 h-4" />
                    Print Status Slip
                  </Button>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <span>Proceed to ERP Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Central University ERP. Official Admissions Portal.</p>
          <div className="flex gap-4 text-slate-400">
            <span>Eligibility Criteria</span>
            <span>•</span>
            <span>Reservation Quota</span>
            <span>•</span>
            <span>Terms of Admission</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
