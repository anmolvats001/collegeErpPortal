import React from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Button } from '../../../../components/common/Button';
import { Badge } from '../../../../components/common/Badge';
import { CollegeLogo } from '../../../../components/common/CollegeLogo';
import { Calendar, Clock, Printer, User, ShieldCheck } from 'lucide-react';

export const NoticeDetailModal = ({ isOpen, onClose, notice }) => {
  if (!notice) return null;

  const isExpired = notice.expiryDate && new Date(notice.expiryDate) < new Date();
  const isActive = notice.active !== false && !isExpired;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Institutional Circular" maxWidth="max-w-2xl">
      <div className="space-y-4">
        {/* Formal University Circular Header */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CollegeLogo size={36} />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Official Circular / Bulletin
              </p>
              <h3 className="text-xs font-bold text-slate-800">
                Delhi Institute of Engineering & Technology
              </h3>
            </div>
          </div>

          <Badge variant={isActive ? 'success' : isExpired ? 'secondary' : 'danger'}>
            {isActive ? 'Official & Active' : isExpired ? 'Expired' : 'Archived'}
          </Badge>
        </div>

        {/* Notice Content */}
        <div className="space-y-3 pt-2">
          <h1 className="text-base font-bold text-slate-900 leading-snug">
            {notice.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 py-1 border-y border-slate-100">
            <div className="flex items-center gap-1">
              <Calendar size={13} className="text-slate-400" />
              <span>
                Issued on:{' '}
                <strong className="text-slate-700">
                  {notice.publishDate ? new Date(notice.publishDate).toLocaleString() : 'Immediate'}
                </strong>
              </span>
            </div>

            {notice.expiryDate && (
              <div className="flex items-center gap-1">
                <Clock size={13} className="text-slate-400" />
                <span>
                  Valid Till:{' '}
                  <strong className="text-slate-700">
                    {new Date(notice.expiryDate).toLocaleDateString()}
                  </strong>
                </span>
              </div>
            )}

            {notice.author && (
              <div className="flex items-center gap-1">
                <User size={13} className="text-slate-400" />
                <span>
                  By: <strong className="text-slate-700">{notice.author}</strong>
                </span>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed pt-2">
            {notice.description}
          </div>
        </div>

        {/* Sign-off Seal */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
            <ShieldCheck size={16} />
            <span>Digitally Verified by College Administration</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handlePrint} icon={Printer} className="text-xs">
              Print Notice
            </Button>
            <Button variant="primary" onClick={onClose} className="text-xs">
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
