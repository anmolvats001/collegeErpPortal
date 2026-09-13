import React, { useState, useEffect } from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Button } from '../../../../components/common/Button';
import { Bell, AlertCircle } from 'lucide-react';

export const CreateNoticeModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    publishDate: '',
    expiryDate: '',
    author: 'Dean of Academic Affairs',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        publishDate: initialData.publishDate ? initialData.publishDate.substring(0, 16) : '',
        expiryDate: initialData.expiryDate ? initialData.expiryDate.substring(0, 16) : '',
        author: initialData.author || 'Dean of Academic Affairs',
      });
    } else {
      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(now.getMonth() + 1);

      setFormData({
        title: '',
        description: '',
        publishDate: now.toISOString().substring(0, 16),
        expiryDate: nextMonth.toISOString().substring(0, 16),
        author: 'Dean of Academic Affairs',
      });
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a circular title.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please provide circular details/body.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onSubmit({
        ...formData,
        publishDate: formData.publishDate ? `${formData.publishDate}:00` : new Date().toISOString(),
        expiryDate: formData.expiryDate ? `${formData.expiryDate}:00` : null,
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to publish circular.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Academic Circular' : 'Publish New Academic Notice'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notice Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Schedule for End-Term Practical Examinations"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Issuing Department / Authority <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Controller of Examinations or Dean of Academics"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Circular Body / Announcement Details <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            required
            placeholder="Provide comprehensive instructions, dates, guidelines, or notices for faculty and students..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Publish Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={formData.publishDate}
              onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Expiry Date & Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            icon={Bell}
          >
            {initialData ? 'Update Notice' : 'Broadcast Notice'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
