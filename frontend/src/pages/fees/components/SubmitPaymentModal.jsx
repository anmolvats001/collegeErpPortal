import React, { useState } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { fileUploadService } from '../../../services/fileUploadService';
import { Upload, X, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';

const PAYMENT_METHODS = [
  { value: 'UPI', label: 'UPI (GPay / PhonePe / Paytm / BHIM)' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer (NEFT / RTGS / IMPS)' },
  { value: 'ONLINE', label: 'Net Banking / Online Gateway' },
  { value: 'CARD', label: 'Credit / Debit Card' },
  { value: 'CASH', label: 'Cash Challan at Accounts Bureau' },
];

export const SubmitPaymentModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  studentFee,
  currentUser,
}) => {
  const remaining = studentFee ? Number(studentFee.remainingAmount) : 0;

  const [formData, setFormData] = useState({
    amount: remaining > 0 ? remaining : '',
    paymentMethod: 'UPI',
    transactionIds: '',
    remarks: '',
    email: currentUser?.email || '',
  });

  const [proofUrls, setProofUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    try {
      for (const file of files) {
        const res = await fileUploadService.uploadFile(
          file,
          {
            folder: 'fees/receipts',
            ownerId: currentUser?.userId || 'student',
            entityType: 'FEE_PAYMENT',
          },
          (progress) => setUploadProgress(progress)
        );

        const url = res.secureUrl || res.fileUrl || res.url;
        if (url) {
          setProofUrls((prev) => [...prev, url]);
        }
      }
      setErrors((prev) => ({ ...prev, proofImages: undefined }));
    } catch (err) {
      console.error('Failed to upload proof image:', err);
      setErrors((prev) => ({
        ...prev,
        proofImages: 'Failed to upload proof document. Please try again.',
      }));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const removeProof = (index) => {
    setProofUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    const amt = Number(formData.amount);

    if (!formData.amount || isNaN(amt) || amt <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than ₹0.';
    } else if (remaining > 0 && amt > remaining) {
      newErrors.amount = `Amount cannot exceed current outstanding balance of ₹${remaining.toLocaleString('en-IN')}.`;
    }

    if (!formData.transactionIds.trim()) {
      newErrors.transactionIds = 'UTR or Transaction reference ID is mandatory.';
    }

    if (proofUrls.length === 0) {
      newErrors.proofImages = 'Please upload at least one payment proof voucher or screenshot.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      transactionIds: formData.transactionIds.trim(),
      remarks: formData.remarks.trim(),
      email: formData.email?.trim() || undefined,
      proofImages: proofUrls,
      studentUserId: currentUser?.userId || studentFee?.studentUserId,
    });
  };

  const handleClose = () => {
    setFormData({
      amount: remaining > 0 ? remaining : '',
      paymentMethod: 'UPI',
      transactionIds: '',
      remarks: '',
      email: currentUser?.email || '',
    });
    setProofUrls([]);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Submit Fee Payment Voucher"
      subtitle="Upload receipt and transaction details for institutional verification"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Outstanding Dues Banner */}
        {studentFee && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <p className="text-slate-500 font-medium">Total Fee</p>
              <p className="font-bold text-slate-800">
                ₹{Number(studentFee.totalFee || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Paid So Far</p>
              <p className="font-bold text-emerald-600">
                ₹{Number(studentFee.paidAmount || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Remaining Due</p>
              <p className="font-bold text-rose-600">
                ₹{remaining.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
              <input
                type="number"
                step="0.01"
                min="1"
                value={formData.amount}
                onChange={(e) => {
                  setFormData({ ...formData, amount: e.target.value });
                  if (errors.amount) setErrors({ ...errors, amount: undefined });
                }}
                placeholder="e.g. 50000"
                className={`w-full pl-7 pr-3 py-2 text-xs border rounded-lg focus:outline-hidden focus:ring-2 transition ${
                  errors.amount
                    ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400'
                    : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.amount && <p className="text-[11px] text-rose-600 mt-1">{errors.amount}</p>}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Method <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transaction ID / UTR */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Transaction Ref / UTR / Receipt Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.transactionIds}
            onChange={(e) => {
              setFormData({ ...formData, transactionIds: e.target.value });
              if (errors.transactionIds) setErrors({ ...errors, transactionIds: undefined });
            }}
            placeholder="e.g. UTR-HDFC-99281726 or UPI Ref 38291048291"
            className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-hidden focus:ring-2 transition ${
              errors.transactionIds
                ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400'
                : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
            }`}
          />
          {errors.transactionIds && (
            <p className="text-[11px] text-rose-600 mt-1">{errors.transactionIds}</p>
          )}
        </div>

        {/* Proof Document Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Payment Proof Voucher / Screenshot <span className="text-rose-500">*</span>
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-blue-400 transition bg-slate-50/50">
            <input
              type="file"
              id="proof-file-input"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            <label
              htmlFor="proof-file-input"
              className="cursor-pointer flex flex-col items-center justify-center gap-1 text-slate-600"
            >
              <Upload size={24} className="text-blue-600" />
              <span className="text-xs font-semibold text-slate-800">
                Click to upload payment receipt or screenshot
              </span>
              <span className="text-[10px] text-slate-400">
                PNG, JPG, JPEG or PDF (Max 10MB)
              </span>
            </label>
          </div>

          {isUploading && (
            <div className="mt-2">
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Uploading to Cloud Storage...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {errors.proofImages && (
            <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.proofImages}
            </p>
          )}

          {/* Uploaded Previews */}
          {proofUrls.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {proofUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group border border-slate-200 rounded-lg overflow-hidden w-20 h-20 bg-slate-100 flex items-center justify-center"
                >
                  <img
                    src={url}
                    alt="Proof Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=200';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeProof(idx)}
                    className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 shadow-sm opacity-90 hover:opacity-100 transition"
                    title="Remove"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Remarks / Payment Notes (Optional)
          </label>
          <input
            type="text"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            placeholder="e.g. Tuition fee semester 3 instalment 1"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isUploading}>
            Submit Payment Proof
          </Button>
        </div>
      </form>
    </Modal>
  );
};
