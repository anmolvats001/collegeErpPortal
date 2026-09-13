import React, { useState } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { AlertCircle } from 'lucide-react';

const REASON_PRESETS = [
  'Invalid UTR / Transaction ID provided',
  'Amount does not match bank settlement records',
  'Blurry or unreadable payment voucher screenshot',
  'Duplicate submission for already verified transaction',
  'Payment made to incorrect college account',
];

export const RejectPaymentModal = ({ isOpen, onClose, payment, onConfirm, isSubmitting }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!payment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a justification for rejecting this payment.');
      return;
    }
    setError('');
    onConfirm(payment.id, reason.trim());
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reject Payment Submission"
      subtitle={`Transaction ID: ${payment.transactionIds}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 text-amber-600 mt-0.5" />
          <span>
            Rejecting this payment will notify the student and mark the record as REJECTED. The student's fee account will not be credited.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Quick Reason Presets
          </label>
          <div className="flex flex-wrap gap-1.5">
            {REASON_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setReason(preset);
                  setError('');
                }}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition text-left ${
                  reason === preset
                    ? 'bg-rose-50 border-rose-400 text-rose-800 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Rejection Justification <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            placeholder="Specify why this payment voucher was rejected..."
            className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-hidden focus:ring-2 transition ${
              error
                ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400'
                : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
            }`}
          />
          {error && <p className="text-[11px] text-rose-600 mt-1">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" isLoading={isSubmitting}>
            Confirm Rejection
          </Button>
        </div>
      </form>
    </Modal>
  );
};
