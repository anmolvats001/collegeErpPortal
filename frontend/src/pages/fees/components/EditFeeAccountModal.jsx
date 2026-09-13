import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';

export const EditFeeAccountModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  feeAccount,
}) => {
  const [totalFee, setTotalFee] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (feeAccount) {
      setTotalFee(feeAccount.totalFee != null ? String(feeAccount.totalFee) : '');
      setError('');
    }
  }, [feeAccount]);

  if (!feeAccount) return null;

  const paid = Number(feeAccount.paidAmount || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fee = Number(totalFee);
    if (!totalFee || isNaN(fee) || fee < 0) {
      setError('Total fee must be a valid positive amount.');
      return;
    }
    if (fee < paid) {
      setError(`Total fee cannot be less than the already collected amount of ₹${paid.toLocaleString('en-IN')}.`);
      return;
    }

    setError('');
    onSubmit(feeAccount.id, fee);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Total Prescribed Fee"
      subtitle={`Student: ${feeAccount.studentName} (${feeAccount.studentUserId})`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current status summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Already Paid:</span>
            <p className="font-bold text-emerald-600 text-sm">
              ₹{paid.toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Current Status:</span>
            <p className="font-bold uppercase text-slate-700 text-sm">
              {feeAccount.status}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            New Total Prescribed Fee (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
            <input
              type="number"
              step="0.01"
              min={paid}
              value={totalFee}
              onChange={(e) => {
                setTotalFee(e.target.value);
                if (error) setError('');
              }}
              className={`w-full pl-7 pr-3 py-2 text-xs border rounded-lg focus:outline-hidden focus:ring-2 transition ${
                error
                  ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400'
                  : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
              }`}
            />
          </div>
          {error && <p className="text-[11px] text-rose-600 mt-1">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Update Fee Ledger
          </Button>
        </div>
      </form>
    </Modal>
  );
};
