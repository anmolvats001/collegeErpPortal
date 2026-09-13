import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import {
  IS_PREVIEW_MODE,
  MOCK_ADMISSION_APPLICATIONS,
  MOCK_ADMISSION_DOCUMENTS,
} from '../utils/mockData';

// Local mutable state for mock session interactions
let localApplications = [...MOCK_ADMISSION_APPLICATIONS];
let localDocuments = [...MOCK_ADMISSION_DOCUMENTS];

export const admissionService = {
  /**
   * Get institutional admissions dashboard statistics
   * GET /api/v1/admission/dashboard
   */
  getDashboard: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMISSION.DASHBOARD);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const total = localApplications.length;
        const submitted = localApplications.filter((a) => a.status === 'SUBMITTED').length;
        const underReview = localApplications.filter((a) => a.status === 'UNDER_REVIEW').length;
        const approved = localApplications.filter((a) => a.status === 'APPROVED').length;
        const rejected = localApplications.filter((a) => a.status === 'REJECTED').length;
        return {
          totalApplications: total,
          submitted,
          underReview,
          approved,
          rejected,
        };
      }
      throw err;
    }
  },

  /**
   * List paginated admission applications with optional status filter
   * GET /api/v1/admission/applications
   */
  getApplications: async ({ page = 0, size = 50, status = null } = {}) => {
    try {
      const params = { page, size };
      if (status && status !== 'ALL') {
        params.status = status;
      }
      const response = await apiClient.get(API_ENDPOINTS.ADMISSION.APPLICATIONS, { params });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        let filtered = [...localApplications];
        if (status && status !== 'ALL') {
          filtered = filtered.filter((a) => a.status === status);
        }
        return {
          content: filtered,
          totalElements: filtered.length,
          totalPages: 1,
          size,
          number: page,
        };
      }
      throw err;
    }
  },

  /**
   * Get a single admission application by UUID
   * GET /api/v1/admission/applications/{id}
   */
  getApplicationById: async (id) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ADMISSION.APPLICATIONS}/${id}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const found = localApplications.find((a) => a.id === id);
        if (!found) throw new Error('Application not found');
        return found;
      }
      throw err;
    }
  },

  /**
   * Move application to UNDER_REVIEW
   * PATCH /api/v1/admission/applications/{id}/review
   */
  reviewApplication: async (id) => {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.ADMISSION.APPLICATIONS}/${id}/review`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const index = localApplications.findIndex((a) => a.id === id);
        if (index === -1) throw new Error('Application not found');
        const updated = {
          ...localApplications[index],
          status: 'UNDER_REVIEW',
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'ADM-OFFICER',
        };
        localApplications[index] = updated;
        return updated;
      }
      throw err;
    }
  },

  /**
   * Approve application
   * PATCH /api/v1/admission/applications/{id}/approve
   */
  approveApplication: async (id) => {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.ADMISSION.APPLICATIONS}/${id}/approve`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const index = localApplications.findIndex((a) => a.id === id);
        if (index === -1) throw new Error('Application not found');
        const updated = {
          ...localApplications[index],
          status: 'APPROVED',
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'ADM-OFFICER',
          rejectionReason: null,
        };
        localApplications[index] = updated;
        return updated;
      }
      throw err;
    }
  },

  /**
   * Reject application with reason
   * PATCH /api/v1/admission/applications/{id}/reject
   */
  rejectApplication: async (id, reason) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.ADMISSION.APPLICATIONS}/${id}/reject`,
        { reason }
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const index = localApplications.findIndex((a) => a.id === id);
        if (index === -1) throw new Error('Application not found');
        const updated = {
          ...localApplications[index],
          status: 'REJECTED',
          rejectionReason: reason,
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'ADM-OFFICER',
        };
        localApplications[index] = updated;
        return updated;
      }
      throw err;
    }
  },

  /**
   * Get documents for an application
   * GET /api/v1/admission/applications/{id}/documents
   */
  getDocuments: async (applicationId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.ADMISSION.APPLICATIONS}/${applicationId}/documents`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return localDocuments.filter((d) => d.applicationId === applicationId);
      }
      throw err;
    }
  },

  /**
   * Add a document to an application
   * POST /api/v1/admission/applications/{id}/documents
   */
  addDocument: async (applicationId, docData) => {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.ADMISSION.APPLICATIONS}/${applicationId}/documents`,
        docData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newDoc = {
          id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          applicationId,
          documentType: docData.documentType,
          fileName: docData.fileName || 'Uploaded_Document.pdf',
          fileUrl: docData.fileUrl || 'https://example.com/docs/file.pdf',
          uploadedAt: new Date().toISOString(),
          verified: docData.verified || false,
        };
        localDocuments.push(newDoc);
        return newDoc;
      }
      throw err;
    }
  },

  /**
   * Verify or unverify a candidate document
   * PATCH /api/v1/admission/documents/{id}/verify
   */
  verifyDocument: async (documentId, verified = true) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.ADMISSION.BASE}/documents/${documentId}/verify`,
        null,
        { params: { verified } }
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const index = localDocuments.findIndex((d) => d.id === documentId);
        if (index !== -1) {
          localDocuments[index] = { ...localDocuments[index], verified };
          return localDocuments[index];
        }
        return { id: documentId, verified };
      }
      throw err;
    }
  },

  /**
   * Publicly track application by application number or email
   * GET /api/v1/admission/public/track/{query}
   */
  trackApplication: async (query) => {
    try {
      const trimmed = (query || '').trim();
      const response = await apiClient.get(
        `${API_ENDPOINTS.ADMISSION.PUBLIC_TRACK}/${encodeURIComponent(trimmed)}`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const q = (query || '').trim().toLowerCase();
        const found = localApplications.find(
          (a) =>
            a.applicationNumber?.toLowerCase() === q ||
            a.id?.toLowerCase() === q ||
            a.email?.toLowerCase() === q
        );
        if (!found) {
          throw new Error(
            `No admission application found matching "${query}". Please check your application reference or email.`
          );
        }
        return found;
      }
      throw err;
    }
  },

  /**
   * Publicly get documents for tracked application
   * GET /api/v1/admission/public/track/{query}/documents
   */
  trackDocuments: async (query) => {
    try {
      const trimmed = (query || '').trim();
      const response = await apiClient.get(
        `${API_ENDPOINTS.ADMISSION.PUBLIC_TRACK}/${encodeURIComponent(trimmed)}/documents`
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const q = (query || '').trim().toLowerCase();
        const found = localApplications.find(
          (a) =>
            a.applicationNumber?.toLowerCase() === q ||
            a.id?.toLowerCase() === q ||
            a.email?.toLowerCase() === q
        );
        if (found) {
          return localDocuments.filter((d) => d.applicationId === found.id);
        }
        return [];
      }
      throw err;
    }
  },

  /**
   * Submit public application by college code
   * POST /api/v1/admission/public/code/{collegeCode}/apply
   */
  applyByCode: async (collegeCode, applicationData) => {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.ADMISSION.PUBLIC_APPLY_CODE}/${collegeCode}/apply`,
        applicationData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newApp = {
          id: `adm-app-${Date.now()}`,
          applicationNumber: `ADM-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          collegeCode: collegeCode || 'COLLEGE',
          collegeId: applicationData.collegeId || 'COL-DELHI-001',
          applicantName: applicationData.applicantName,
          email: applicationData.email,
          phoneNumber: applicationData.phoneNumber,
          gender: applicationData.gender || 'NOT_SPECIFIED',
          dateOfBirth: applicationData.dateOfBirth,
          fatherName: applicationData.fatherName,
          motherName: applicationData.motherName,
          address: applicationData.address,
          courseId: applicationData.courseId,
          courseName: applicationData.courseName,
          branchId: applicationData.branchId,
          branchName: applicationData.branchName,
          previousQualification: applicationData.previousQualification,
          previousInstitution: applicationData.previousInstitution,
          previousPercentage: Number(applicationData.previousPercentage) || 0,
          status: 'SUBMITTED',
          submittedAt: new Date().toISOString(),
          reviewedAt: null,
          reviewedBy: null,
          rejectionReason: null,
        };
        localApplications.unshift(newApp);
        return newApp;
      }
      throw err;
    }
  },

  /**
   * Submit public application by college ID
   * POST /api/v1/admission/public/id/{collegeId}/apply
   */
  applyById: async (collegeId, applicationData) => {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.ADMISSION.PUBLIC_APPLY_ID}/${collegeId}/apply`,
        applicationData
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return admissionService.applyByCode('COLLEGE', { ...applicationData, collegeId });
      }
      throw err;
    }
  },
};
