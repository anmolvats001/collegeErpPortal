import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { admissionService } from '../../../services/admissionService';
import { fileUploadService } from '../../../services/fileUploadService';
import {
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  MapPin,
  CheckCircle,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Upload,
  ExternalLink,
  ShieldAlert,
  Award,
  Loader2,
} from 'lucide-react';

const STATUS_BADGE = {
  SUBMITTED: { label: 'Submitted / New', variant: 'warning', icon: Clock },
  UNDER_REVIEW: { label: 'Under Review', variant: 'info', icon: Clock },
  APPROVED: { label: 'Approved (Admitted)', variant: 'success', icon: CheckCircle },
  REJECTED: { label: 'Rejected', variant: 'danger', icon: XCircle },
};

export const ApplicationDetailModal = ({
  isOpen,
  onClose,
  application,
  onReview,
  onApprove,
  onOpenRejectModal,
  onEnroll,
  canUpdate = true,
  canApprove = true,
  canReject = true,
  isProcessing = false,
}) => {
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newDocData, setNewDocData] = useState({
    documentType: '12TH_MARKSHEET',
    fileName: '',
    fileUrl: '',
  });

  useEffect(() => {
    if (isOpen && application?.id) {
      loadDocuments(application.id);
    }
  }, [isOpen, application?.id]);

  const loadDocuments = async (appId) => {
    setIsLoadingDocs(true);
    try {
      const docs = await admissionService.getDocuments(appId);
      setDocuments(Array.isArray(docs) ? docs : []);
    } catch {
      setDocuments([]);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    setUploadProgress(0);

    try {
      const uploadRes = await fileUploadService.uploadFile(
        file,
        { folder: 'admissions/documents', entityType: 'ADMISSION_DOCUMENT', entityId: application.id },
        (percent) => setUploadProgress(percent)
      );

      setNewDocData((prev) => ({
        ...prev,
        fileName: file.name,
        fileUrl: uploadRes.secureUrl || uploadRes.url || `https://example.com/docs/${file.name}`,
      }));
    } catch (err) {
      console.error('File upload failed:', err);
      // Fallback to local blob
      const localUrl = URL.createObjectURL(file);
      setNewDocData((prev) => ({
        ...prev,
        fileName: file.name,
        fileUrl: localUrl,
      }));
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleAddDocSubmit = async (e) => {
    e.preventDefault();
    if (!newDocData.fileName.trim()) return;
    try {
      const added = await admissionService.addDocument(application.id, {
        ...newDocData,
        fileUrl: newDocData.fileUrl || `https://example.com/docs/${newDocData.fileName}`,
      });
      setDocuments((prev) => [...prev, added]);
      setIsAddingDoc(false);
      setNewDocData({ documentType: '12TH_MARKSHEET', fileName: '', fileUrl: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVerify = async (docId, currentVerified) => {
    try {
      const nextVerified = !currentVerified;
      await admissionService.verifyDocument(docId, nextVerified);
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, verified: nextVerified } : d))
      );
    } catch (err) {
      console.error('Failed to update verification status', err);
    }
  };

  if (!application) return null;

  const currentStatus = STATUS_BADGE[application.status] || STATUS_BADGE.SUBMITTED;
  const StatusIcon = currentStatus.icon;

  const isOpenForDecision =
    application.status === 'SUBMITTED' || application.status === 'UNDER_REVIEW';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Admission Dossier: ${application.applicationNumber}`}
      subtitle={`Candidate: ${application.applicantName} • College: ${application.collegeCode || 'Central Campus'}`}
      maxWidth="max-w-3xl"
    >
      <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
        {/* Header Hero Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-lg">
              {application.applicantName?.charAt(0) || 'A'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">{application.applicantName}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>App #{application.applicationNumber}</span>
                <span>•</span>
                <span>Submitted {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Recent'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                application.status === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : application.status === 'REJECTED'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : application.status === 'UNDER_REVIEW'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {currentStatus.label}
            </span>
          </div>
        </div>

        {/* Rejection Notice Banner if Rejected */}
        {application.status === 'REJECTED' && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Application Rejected</p>
              <p className="text-xs text-rose-700 mt-1">
                <strong>Reason:</strong> {application.rejectionReason || 'Administrative decision.'}
              </p>
              {application.reviewedAt && (
                <p className="text-[11px] text-rose-500 mt-1">
                  Reviewed on {new Date(application.reviewedAt).toLocaleString()} by {application.reviewedBy || 'Admissions Officer'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Merit & Program Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-lg">
            <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
              Applied Program
            </p>
            <p className="text-sm font-bold text-slate-800 line-clamp-1">{application.courseName || 'General Degree'}</p>
            <p className="text-xs text-slate-600 mt-0.5">{application.branchName || 'Standard Track'}</p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-lg">
            <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              Academic Merit Score
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-emerald-700">
                {application.previousPercentage ? `${application.previousPercentage}%` : 'N/A'}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">aggregate</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 truncate">{application.previousQualification || 'Qualifying Exam'}</p>
          </div>

          <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-lg">
            <p className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider mb-1">
              Previous Alma Mater
            </p>
            <p className="text-xs font-bold text-slate-800 line-clamp-1">
              {application.previousInstitution || 'Not Specified'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">High School / College Board</p>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Personal Information */}
          <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <User className="w-4 h-4 text-blue-600" />
              Candidate Profile
            </h4>
            <div className="text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-800">{application.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Phone:</span>
                <span className="font-semibold text-slate-800">{application.phoneNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Gender:</span>
                <span className="font-semibold text-slate-800">{application.gender || 'Not specified'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Date of Birth:</span>
                <span className="font-semibold text-slate-800">
                  {application.dateOfBirth ? new Date(application.dateOfBirth).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Address:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[200px] truncate">
                  {application.address || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Guardian & Family */}
          <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              Guardian & Family Details
            </h4>
            <div className="text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Father's Name:</span>
                <span className="font-semibold text-slate-800">{application.fatherName || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Mother's Name:</span>
                <span className="font-semibold text-slate-800">{application.motherName || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">College Code:</span>
                <span className="font-semibold text-slate-800">{application.collegeCode || 'Main Campus'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Decision By:</span>
                <span className="font-semibold text-slate-800">
                  {application.reviewedBy || (isOpenForDecision ? 'Pending Review' : 'Admissions Dept')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Documents Section */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              Candidate Verification Documents ({documents.length})
            </h4>
            {!isAddingDoc && (
              <button
                type="button"
                onClick={() => setIsAddingDoc(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                Attach Document
              </button>
            )}
          </div>

          {/* Add Document Inline Form */}
          {isAddingDoc && (
            <form onSubmit={handleAddDocSubmit} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
              <p className="font-semibold text-slate-700">Attach Official Certificate / Record</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Document Category</label>
                  <select
                    value={newDocData.documentType}
                    onChange={(e) => setNewDocData({ ...newDocData, documentType: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded bg-white border-slate-300 text-xs"
                  >
                    <option value="10TH_MARKSHEET">10th Marksheet</option>
                    <option value="12TH_MARKSHEET">12th Marksheet</option>
                    <option value="AADHAAR_CARD">Aadhaar Card / ID Proof</option>
                    <option value="TRANSFER_CERTIFICATE">Transfer Certificate</option>
                    <option value="CHARACTER_CERTIFICATE">Character Certificate</option>
                    <option value="MIGRATION_CERTIFICATE">Migration Certificate</option>
                    <option value="CASTE_CERTIFICATE">Caste / Category Certificate</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Select File (PDF or Image)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileSelect}
                      className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {isUploadingFile && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Uploading document...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}
                  {newDocData.fileName && !isUploadingFile && (
                    <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready: {newDocData.fileName}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1 border-t border-slate-200">
                <Button type="button" size="sm" variant="outline" onClick={() => setIsAddingDoc(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" variant="primary" disabled={!newDocData.fileName || isUploadingFile}>
                  Save Document
                </Button>
              </div>
            </form>
          )}

          {/* Document list */}
          {isLoadingDocs ? (
            <p className="text-xs text-slate-500 py-2">Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center italic">
              No verification certificates attached yet.
            </p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-slate-800 truncate">{doc.fileName}</p>
                      <p className="text-[11px] text-slate-500">
                        {doc.documentType.replace(/_/g, ' ')} • Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleVerify(doc.id, doc.verified)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition flex items-center gap-1 ${
                        doc.verified
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      }`}
                      title={doc.verified ? 'Click to unverify' : 'Click to verify document'}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {doc.verified ? 'Verified' : 'Verify'}
                    </button>
                    <a
                      href={doc.fileUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-slate-500 hover:text-blue-600 rounded"
                      title="View file"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Workflow Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
            Close Dossier
          </Button>

          {/* If APPROVED, show 1-click student registration */}
          {application?.status === 'APPROVED' && onEnroll && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="primary"
                onClick={() => onEnroll(application)}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <GraduationCap className="w-4 h-4" />
                Enroll Candidate as Student
              </Button>
            </div>
          )}

          {isOpenForDecision && (
            <div className="flex items-center gap-2">
              {/* If SUBMITTED, can move to UNDER_REVIEW */}
              {application.status === 'SUBMITTED' && canUpdate && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onReview(application.id)}
                  isLoading={isProcessing}
                >
                  Move to Under Review
                </Button>
              )}

              {/* Reject */}
              {canReject && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => onOpenRejectModal(application)}
                  disabled={isProcessing}
                >
                  Reject Application
                </Button>
              )}

              {/* Approve */}
              {canApprove && (
                <Button
                  type="button"
                  variant="success"
                  onClick={() => onApprove(application.id)}
                  isLoading={isProcessing}
                >
                  Approve Candidate
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
