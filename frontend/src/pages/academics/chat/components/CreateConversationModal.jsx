import React, { useState } from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Button } from '../../../../components/common/Button';
import { Hash, School, AlertCircle } from 'lucide-react';

export const CreateConversationModal = ({
  isOpen,
  onClose,
  onSubmit,
  classes = [],
  existingClassIds = [],
}) => {
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Filter out classes that already have a channel
  const availableClasses = classes.filter((c) => !existingClassIds.includes(c.id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClassId) {
      setError('Please select a class cohort.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit(selectedClassId);
      setSelectedClassId('');
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create channel.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Class Chat Channel" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-slate-500">
          Create an official communication channel for students and teachers enrolled in a
          specific academic class cohort.
        </p>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Select Class Cohort <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setError('');
            }}
            required
            className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">-- Choose an academic class --</option>
            {availableClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.className || cls.name || `Class ${cls.id}`} (Sem {cls.semester || 1}, Sec{' '}
                {cls.section || 'A'})
              </option>
            ))}
          </select>
          {availableClasses.length === 0 && (
            <p className="text-[11px] text-amber-600 mt-1">
              All registered classes already have active chat channels.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={!selectedClassId || isSubmitting}
            icon={Hash}
          >
            Create Channel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
