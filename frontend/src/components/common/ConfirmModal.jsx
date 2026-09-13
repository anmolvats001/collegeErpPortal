import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, AlertCircle } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Institutional Action',
  subtitle = 'Please review carefully before proceeding.',
  message = 'Are you certain you wish to proceed with this operation?',
  warning = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            {isDestructive ? <AlertTriangle size={20} /> : <AlertCircle size={20} />}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800 leading-relaxed">{message}</p>
            {warning && (
              <p className="text-[11px] text-red-700 bg-red-50 border border-red-200 rounded p-2 mt-2 leading-tight">
                <strong>Important:</strong> {warning}
              </p>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs"
          >
            {cancelText}
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className="text-xs"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
