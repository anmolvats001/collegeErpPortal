import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import {
  IS_PREVIEW_MODE,
  MOCK_FEES,
  MOCK_FEE_PAYMENTS,
  MOCK_FEE_WINDOWS,
} from '../utils/mockData';

// Local mutable state for realistic preview/offline mode
let localFees = [...MOCK_FEES];
let localPayments = [...MOCK_FEE_PAYMENTS];
let localWindows = [...MOCK_FEE_WINDOWS];

export const feeService = {
  /**
   * Get all student fee accounts for college
   * GET /api/v1/fee
   */
  getFeeAccounts: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FEE.BASE);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return localFees;
      }
      throw err;
    }
  },

  /**
   * Get a single student fee account by UUID
   * GET /api/v1/fee/{id}
   */
  getFeeAccountById: async (id) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.FEE.BASE}/${id}`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const found = localFees.find((f) => f.id === id);
        if (!found) throw new Error('Fee account not found');
        return found;
      }
      throw err;
    }
  },

  /**
   * Get logged-in student's personal fee account
   * GET /api/v1/fee/my
   */
  getMyFee: async (studentUserId = null) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FEE.MY);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        if (studentUserId) {
          const match = localFees.find((f) => f.studentUserId === studentUserId);
          if (match) return match;
        }
        return localFees[0] || null;
      }
      throw err;
    }
  },

  /**
   * Create student fee account
   * POST /api/v1/fee
   */
  createFeeAccount: async (feeData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.FEE.BASE, feeData);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const total = Number(feeData.totalFee) || 0;
        const newFee = {
          id: `fee-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          collegeId: 'COL-DELHI-001',
          studentUserId: feeData.studentUserId,
          studentName: feeData.studentName || 'Student',
          courseId: feeData.courseId || null,
          courseName: feeData.courseName || 'Undergraduate Program',
          branchId: feeData.branchId || null,
          branchName: feeData.branchName || 'Core Track',
          totalFee: total,
          paidAmount: 0,
          remainingAmount: total,
          status: 'PENDING',
        };
        localFees.unshift(newFee);
        return newFee;
      }
      throw err;
    }
  },

  /**
   * Update student fee account total amount
   * PUT /api/v1/fee/{id}
   */
  updateFeeAccount: async (id, totalFee) => {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.FEE.BASE}/${id}`, {
        totalFee: Number(totalFee),
      });
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = localFees.findIndex((f) => f.id === id);
        if (idx === -1) throw new Error('Fee account not found');
        const numTotal = Number(totalFee) || 0;
        const paid = Number(localFees[idx].paidAmount) || 0;
        if (numTotal < paid) {
          throw new Error('Total fee cannot be less than already paid amount');
        }
        const remaining = Math.max(0, numTotal - paid);
        let status = 'PENDING';
        if (remaining === 0) status = 'PAID';
        else if (paid > 0) status = 'PARTIALLY_PAID';

        const updated = {
          ...localFees[idx],
          totalFee: numTotal,
          remainingAmount: remaining,
          status,
        };
        localFees[idx] = updated;
        return updated;
      }
      throw err;
    }
  },

  /**
   * Get all fee form collection windows
   * GET /api/v1/fee/forms
   */
  getFeeWindows: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FEE.FORMS);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return localWindows;
      }
      throw err;
    }
  },

  /**
   * Check if fee payment window is currently active
   * GET /api/v1/fee/forms/status
   */
  getFeeWindowStatus: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FEE.FORM_STATUS);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const now = new Date();
        const activeWindow = localWindows.find((w) => {
          if (!w.active) return false;
          const open = new Date(w.openAt);
          const close = new Date(w.closeAt);
          return now >= open && now <= close;
        });

        if (activeWindow) {
          return {
            open: true,
            windowId: activeWindow.id,
            formName: activeWindow.formName,
            openAt: activeWindow.openAt,
            closeAt: activeWindow.closeAt,
          };
        }
        return {
          open: false,
          windowId: null,
          formName: null,
          openAt: null,
          closeAt: null,
        };
      }
      throw err;
    }
  },

  /**
   * Open / Create a new fee collection window
   * POST /api/v1/fee/forms
   */
  createFeeWindow: async (windowData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.FEE.FORMS, windowData);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newWindow = {
          id: `win-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          formName: windowData.formName,
          openAt: windowData.openAt,
          closeAt: windowData.closeAt,
          active: windowData.active !== undefined ? windowData.active : true,
          createdBy: 'ADM-001',
        };
        localWindows.unshift(newWindow);
        return newWindow;
      }
      throw err;
    }
  },

  /**
   * Update fee collection window
   * PUT /api/v1/fee/forms/{id}
   */
  updateFeeWindow: async (id, windowData) => {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.FEE.FORMS}/${id}`, windowData);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const idx = localWindows.findIndex((w) => w.id === id);
        if (idx === -1) throw new Error('Fee window not found');
        const updated = {
          ...localWindows[idx],
          ...windowData,
        };
        localWindows[idx] = updated;
        return updated;
      }
      throw err;
    }
  },

  /**
   * Get all submitted payments for college (Admin)
   * GET /api/v1/fee/payments
   */
  getAllPayments: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FEE.PAYMENTS);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        return localPayments;
      }
      throw err;
    }
  },

  /**
   * Get student's submitted payments (Student)
   * GET /api/v1/fee/payments/my
   */
  getMyPayments: async (studentUserId = null) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FEE.MY_PAYMENTS);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        if (studentUserId) {
          return localPayments.filter((p) => p.studentUserId === studentUserId);
        }
        return localPayments;
      }
      throw err;
    }
  },

  /**
   * Student submits fee payment form
   * POST /api/v1/fee/payments
   */
  submitPayment: async (paymentData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.FEE.PAYMENTS, paymentData);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const newPayment = {
          id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          studentUserId: paymentData.studentUserId || 'STU-2024-001',
          amount: Number(paymentData.amount),
          paymentMethod: paymentData.paymentMethod || 'UPI',
          transactionIds: paymentData.transactionIds,
          proofImages: paymentData.proofImages || [],
          remarks: paymentData.remarks || 'Student payment voucher submission',
          status: 'PENDING',
          submittedAt: new Date().toISOString(),
          reviewedAt: null,
          reviewedBy: null,
          rejectionReason: null,
        };
        localPayments.unshift(newPayment);
        return newPayment;
      }
      throw err;
    }
  },

  /**
   * Admin approves fee payment
   * PATCH /api/v1/fee/payments/{id}/approve
   */
  approvePayment: async (id) => {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.FEE.PAYMENTS}/${id}/approve`);
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const pIdx = localPayments.findIndex((p) => p.id === id);
        if (pIdx === -1) throw new Error('Payment not found');
        const payment = localPayments[pIdx];
        if (payment.status !== 'PENDING') throw new Error('Only pending payment can be approved');

        const updatedPayment = {
          ...payment,
          status: 'APPROVED',
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'ADM-001',
        };
        localPayments[pIdx] = updatedPayment;

        // Credit student fee account
        const fIdx = localFees.findIndex((f) => f.studentUserId === payment.studentUserId);
        if (fIdx !== -1) {
          const fee = localFees[fIdx];
          const newPaid = Number(fee.paidAmount) + Number(payment.amount);
          const newRemaining = Math.max(0, Number(fee.totalFee) - newPaid);
          let newStatus = 'PENDING';
          if (newRemaining === 0) newStatus = 'PAID';
          else if (newPaid > 0) newStatus = 'PARTIALLY_PAID';

          localFees[fIdx] = {
            ...fee,
            paidAmount: newPaid,
            remainingAmount: newRemaining,
            status: newStatus,
          };
        }

        return updatedPayment;
      }
      throw err;
    }
  },

  /**
   * Admin rejects fee payment with reason
   * PATCH /api/v1/fee/payments/{id}/reject
   */
  rejectPayment: async (id, rejectionReason) => {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.FEE.PAYMENTS}/${id}/reject`,
        { rejectionReason }
      );
      return response.data;
    } catch (err) {
      if (IS_PREVIEW_MODE) {
        const pIdx = localPayments.findIndex((p) => p.id === id);
        if (pIdx === -1) throw new Error('Payment not found');
        const payment = localPayments[pIdx];
        if (payment.status !== 'PENDING') throw new Error('Only pending payment can be rejected');

        const updatedPayment = {
          ...payment,
          status: 'REJECTED',
          rejectionReason,
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'ADM-001',
        };
        localPayments[pIdx] = updatedPayment;
        return updatedPayment;
      }
      throw err;
    }
  },
};
