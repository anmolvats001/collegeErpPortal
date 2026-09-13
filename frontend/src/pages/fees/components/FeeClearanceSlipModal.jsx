import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Printer, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { CollegeLogo } from '../../../components/common/CollegeLogo';

export const FeeClearanceSlipModal = ({
  isOpen,
  onClose,
  studentFee,
  payments = [],
  collegeName = 'Delhi Institute of Engineering & Technology',
}) => {
  if (!studentFee) return null;

  const total = Number(studentFee.totalFee || 0);
  const paid = Number(studentFee.paidAmount || 0);
  const remaining = Number(studentFee.remainingAmount || 0);
  const isCleared = remaining === 0 && total > 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Institutional Fee Clearance Slip"
      subtitle="Official fee clearance statement and transaction transcript"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Printable Document Container */}
        <div
          id="fee-clearance-document"
          className="border border-slate-300 rounded-lg p-6 bg-white shadow-xs text-slate-800 space-y-5 print:border-none print:shadow-none print:p-0"
        >
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CollegeLogo size={40} variant="dark" showText={false} />
              <div>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  {collegeName}
                </h2>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Office of the Bursar & Academic Accounts Bureau
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block">
                REF: CLR-{studentFee.id?.substring(0, 8).toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-slate-600">
                Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Document Title & Status Stamp */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Fee Clearance Certificate & Ledger
              </h3>
              <p className="text-xs text-slate-500">Academic Year 2026-2027</p>
            </div>

            <div>
              {isCleared ? (
                <div className="border-2 border-emerald-600 text-emerald-700 px-3 py-1 rounded font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-xs rotate-[-2deg]">
                  <ShieldCheck size={16} /> Fees Fully Cleared
                </div>
              ) : (
                <div className="border-2 border-amber-500 text-amber-700 px-3 py-1 rounded font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                  <Clock size={16} /> Partial Dues Pending
                </div>
              )}
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Student Name</span>
              <span className="font-bold text-slate-800">{studentFee.studentName || 'Student'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Student User ID</span>
              <span className="font-bold text-slate-800">{studentFee.studentUserId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Program / Course</span>
              <span className="font-semibold text-slate-800">{studentFee.courseName || 'Engineering Track'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Branch / Dept</span>
              <span className="font-semibold text-slate-800">{studentFee.branchName || 'Computer Science'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Account Status</span>
              <span className="font-bold uppercase text-blue-700">{studentFee.status}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Verification Date</span>
              <span className="font-semibold text-slate-800">
                {new Date().toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>

          {/* Financial Balance Summary */}
          <div className="grid grid-cols-3 gap-3 text-center border-y border-slate-200 py-3">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Prescribed Fee</p>
              <p className="text-base font-bold text-slate-900">
                ₹{total.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Amount Paid</p>
              <p className="text-base font-bold text-emerald-600">
                ₹{paid.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Outstanding Balance</p>
              <p className={`text-base font-bold ${remaining > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                ₹{remaining.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Payment Receipts Ledger */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Payment Transactions on Record
            </h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Transaction ID / UTR</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Method</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-slate-400">
                        No transactions recorded.
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr key={p.id}>
                        <td className="px-3 py-2 font-mono text-[11px] text-slate-700">{p.transactionIds}</td>
                        <td className="px-3 py-2 text-slate-600">
                          {p.submittedAt ? new Date(p.submittedAt).toLocaleDateString('en-IN') : '-'}
                        </td>
                        <td className="px-3 py-2 text-slate-700">{p.paymentMethod}</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-900">
                          ₹{Number(p.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              p.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Institutional Signature Footer */}
          <div className="pt-8 grid grid-cols-2 text-center text-xs text-slate-500">
            <div>
              <div className="w-36 border-b border-slate-400 mx-auto mb-1"></div>
              <span>Student Signature</span>
            </div>
            <div>
              <div className="w-36 border-b border-slate-400 mx-auto mb-1 font-signature text-slate-800 font-serif italic">
                Dr. R. Sharma
              </div>
              <span>Authorized Bursar / Accounts Officer</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint} icon={Printer}>
            Print Clearance Slip
          </Button>
        </div>
      </div>
    </Modal>
  );
};
