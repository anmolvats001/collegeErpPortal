import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { ExternalLink, Download, FileText, CheckCircle2 } from 'lucide-react';

export const ReceiptPreviewModal = ({ isOpen, onClose, payment }) => {
  if (!payment) return null;

  const images = Array.isArray(payment.proofImages) ? payment.proofImages : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Voucher / Receipt Proof"
      subtitle={`Transaction Ref: ${payment.transactionIds || payment.id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Payment Summary Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-slate-500 font-medium">Student User ID:</span>{' '}
            <span className="font-bold text-slate-800">{payment.studentUserId}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Amount:</span>{' '}
            <span className="font-bold text-emerald-700">₹{Number(payment.amount).toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Method:</span>{' '}
            <span className="font-bold text-slate-800">{payment.paymentMethod}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Status:</span>{' '}
            <span className="font-bold uppercase text-blue-700">{payment.status}</span>
          </div>
        </div>

        {payment.remarks && (
          <div className="text-xs text-slate-600 bg-blue-50/50 p-2.5 rounded border border-blue-100">
            <span className="font-semibold text-slate-700">Remarks:</span> {payment.remarks}
          </div>
        )}

        {/* Proof Images / Documents */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Uploaded Proof Documents ({images.length})
          </p>
          {images.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-500">
              No proof attachments uploaded for this transaction.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {images.map((url, idx) => {
                const isPdf = url.toLowerCase().endsWith('.pdf');
                return (
                  <div
                    key={idx}
                    className="relative group border border-slate-200 rounded-lg overflow-hidden bg-slate-900/5 flex flex-col items-center justify-center min-h-[220px]"
                  >
                    {isPdf ? (
                      <div className="p-6 text-center">
                        <FileText size={48} className="mx-auto text-rose-600 mb-2" />
                        <p className="text-xs font-semibold text-slate-700">PDF Document {idx + 1}</p>
                      </div>
                    ) : (
                      <img
                        src={url}
                        alt={`Proof ${idx + 1}`}
                        className="w-full h-56 object-cover transition duration-200 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600';
                        }}
                      />
                    )}

                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white text-slate-800 text-xs font-semibold rounded shadow-md hover:bg-slate-100 flex items-center gap-1.5"
                      >
                        <ExternalLink size={14} /> Open Full View
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {payment.rejectionReason && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800">
            <span className="font-bold">Rejection Reason:</span> {payment.rejectionReason}
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-200">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
