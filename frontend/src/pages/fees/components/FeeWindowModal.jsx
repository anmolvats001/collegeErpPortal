import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';

export const FeeWindowModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialWindow = null,
}) => {
  const [formData, setFormData] = useState({
    formName: '',
    openAt: '',
    closeAt: '',
    active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialWindow) {
      setFormData({
        formName: initialWindow.formName || '',
        openAt: initialWindow.openAt ? initialWindow.openAt.substring(0, 16) : '',
        closeAt: initialWindow.closeAt ? initialWindow.closeAt.substring(0, 16) : '',
        active: initialWindow.active ?? true,
      });
    } else {
      const now = new Date();
      const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      setFormData({
        formName: '',
        openAt: now.toISOString().substring(0, 16),
        closeAt: oneMonthLater.toISOString().substring(0, 16),
        active: true,
      });
    }
    setErrors({});
  }, [initialWindow, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.formName.trim()) {
      errs.formName = 'Window title / form name is required.';
    }
    if (!formData.openAt) {
      errs.openAt = 'Open date and time is required.';
    }
    if (!formData.closeAt) {
      errs.closeAt = 'Close date and time is required.';
    }
    if (formData.openAt && formData.closeAt) {
      const open = new Date(formData.openAt);
      const close = new Date(formData.closeAt);
      if (close <= open) {
        errs.closeAt = 'Close date/time must be strictly after Open date/time.';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      formName: formData.formName.trim(),
      openAt: formData.openAt.length === 16 ? `${formData.openAt}:00` : formData.openAt,
      closeAt: formData.closeAt.length === 16 ? `${formData.closeAt}:00` : formData.closeAt,
      active: Boolean(formData.active),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialWindow ? 'Edit Collection Window' : 'Schedule Fee Collection Window'}
      subtitle="Define submission window during which students can submit payment vouchers"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Window Name / Form Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.formName}
            onChange={(e) => {
              setFormData({ ...formData, formName: e.target.value });
              if (errors.formName) setErrors({ ...errors, formName: undefined });
            }}
            placeholder="e.g. Even Semester 2026 Regular Tuition Fee Window"
            className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-hidden focus:ring-2 transition ${
              errors.formName
                ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400'
                : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
            }`}
          />
          {errors.formName && <p className="text-[11px] text-rose-600 mt-1">{errors.formName}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Opening Date & Time <span className="text-rose-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.openAt}
              onChange={(e) => {
                setFormData({ ...formData, openAt: e.target.value });
                if (errors.openAt) setErrors({ ...errors, openAt: undefined });
              }}
              className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-hidden focus:ring-2 transition ${
                errors.openAt
                  ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400'
                  : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
              }`}
            />
            {errors.openAt && <p className="text-[11px] text-rose-600 mt-1">{errors.openAt}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Closing Date & Time <span className="text-rose-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.closeAt}
              onChange={(e) => {
                setFormData({ ...formData, closeAt: e.target.value });
                if (errors.closeAt) setErrors({ ...errors, closeAt: undefined });
              }}
              className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-hidden focus:ring-2 transition ${
                errors.closeAt
                  ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400'
                  : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
              }`}
            />
            {errors.closeAt && <p className="text-[11px] text-rose-600 mt-1">{errors.closeAt}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="windowActiveToggle"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="windowActiveToggle" className="text-xs font-medium text-slate-700 cursor-pointer select-none">
            Active and accepting payment submissions immediately (if within date range)
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {initialWindow ? 'Save Window Changes' : 'Publish Collection Window'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
