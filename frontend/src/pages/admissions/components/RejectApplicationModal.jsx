import React, { useState } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { AlertTriangle, AlertCircle } from 'lucide-react';

const REASON_PRESETS = [
  'Minimum academic cutoff percentage not satisfied for selected program.',
  'Mandatory verification documents (10th/12th marksheets) incomplete or illegible.',
  'Seat quota filled to capacity for this academic intake session.',
  'Does not fulfill age or subject prerequisites for the selected discipline.',
];

export const RejectApplicationModal = ({
  isOpen,
  onClose,
  application,
  onConfirmReject,
  isProcessing = false,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!application) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a specific reason for rejecting this admission application.');
      return;
    }
    setError('');
    onConfirmReject(application.id, reason.trim());
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
      title="Reject Admission Application"
      subtitle={`Application: ${application.applicationNumber} • ${application.applicantName}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Formal Rejection Notice</p>
            <p className="text-xs text-red-700 mt-1">
              Rejecting will mark this application as REJECTED in the central registry and dispatch
              an automated email notification with your specified reason to the candidate.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Select Common Reason or Type Custom:
          </label>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {REASON_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setReason(preset);
                  setError('');
                }}
                className="text-xs text-left px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-700 transition"
              >
                {preset}
              </button>
            ))}
          </div>

          <textarea
            rows={4}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (e.target.value.trim()) setError('');
            }}
            placeholder="Type administrative rationale for rejecting this candidate..."
            className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
          {error && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            isLoading={isProcessing}
            disabled={!reason.trim() || isProcessing}
          >
            Confirm Rejection
          </Button>
        </div>
      </form>
    </Modal>
  );
};
