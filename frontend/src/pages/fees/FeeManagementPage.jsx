import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import { feeService } from '../../services/feeService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { AlertBanner } from '../../components/common/AlertBanner';
import { SubmitPaymentModal } from './components/SubmitPaymentModal';
import { ReceiptPreviewModal } from './components/ReceiptPreviewModal';
import { RejectPaymentModal } from './components/RejectPaymentModal';
import { CreateFeeAccountModal } from './components/CreateFeeAccountModal';
import { EditFeeAccountModal } from './components/EditFeeAccountModal';
import { FeeWindowModal } from './components/FeeWindowModal';
import { FeeClearanceSlipModal } from './components/FeeClearanceSlipModal';
import {
  CreditCard,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Calendar,
  Eye,
  Check,
  X,
  Printer,
  FileText,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const FeeManagementPage = () => {
  const { user, isStudent, isCollegeAdmin, isMainAdmin, hasPermission } = useAuth();
  const { activeCollegeName } = useTenant();

  // Role permissions
  const canCreateFee = isMainAdmin || isCollegeAdmin || hasPermission('CREATE_FEE');
  const canUpdateFee = isMainAdmin || isCollegeAdmin || hasPermission('UPDATE_FEE');
  const canManageWindows =
    isMainAdmin || isCollegeAdmin || hasPermission('OPEN_FEE_FORM') || hasPermission('UPDATE_FEE_FORM') || hasPermission('MANAGE_FEE_WINDOWS');
  const canApprovePayment =
    isMainAdmin || isCollegeAdmin || hasPermission('APPROVE_FEE_FORM') || hasPermission('VERIFY_FEE_PAYMENT');
  const canRejectPayment =
    isMainAdmin || isCollegeAdmin || hasPermission('REJECT_FEE_FORM');

  // Active view tab for Admin: 'ACCOUNTS' | 'PAYMENTS' | 'WINDOWS'
  const [activeTab, setActiveTab] = useState('ACCOUNTS');

  // Data states
  const [feeAccounts, setFeeAccounts] = useState([]);
  const [myFee, setMyFee] = useState(null);
  const [payments, setPayments] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [windows, setWindows] = useState([]);
  const [windowStatus, setWindowStatus] = useState({ open: false });
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [selectedFeeAccount, setSelectedFeeAccount] = useState(null);

  const [isWindowModalOpen, setIsWindowModalOpen] = useState(false);
  const [selectedWindow, setSelectedWindow] = useState(null);

  const [previewPayment, setPreviewPayment] = useState(null);
  const [rejectPaymentTarget, setRejectPaymentTarget] = useState(null);
  const [isClearanceSlipOpen, setIsClearanceSlipOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial data based on role
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Always check fee window status
      const winStatus = await feeService.getFeeWindowStatus();
      setWindowStatus(winStatus || { open: false });

      if (isStudent) {
        // Student view data
        const [feeRes, myPaysRes] = await Promise.all([
          feeService.getMyFee(user?.userId),
          feeService.getMyPayments(user?.userId),
        ]);
        setMyFee(feeRes);
        setMyPayments(myPaysRes || []);
      } else {
        // Admin / Accounts Officer view data
        const [accountsRes, paymentsRes, windowsRes] = await Promise.all([
          feeService.getFeeAccounts(),
          feeService.getAllPayments(),
          feeService.getFeeWindows(),
        ]);
        setFeeAccounts(accountsRes || []);
        setPayments(paymentsRes || []);
        setWindows(windowsRes || []);
      }
    } catch (err) {
      console.error('Error loading fee portal data:', err);
      setAlert({
        type: 'danger',
        message: 'Could not load fee records. Showing local cached records if available.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isStudent, user?.userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Admin KPI metrics
  const stats = useMemo(() => {
    const totalCollectible = feeAccounts.reduce((acc, f) => acc + (Number(f.totalFee) || 0), 0);
    const totalCollected = feeAccounts.reduce((acc, f) => acc + (Number(f.paidAmount) || 0), 0);
    const totalRemaining = feeAccounts.reduce((acc, f) => acc + (Number(f.remainingAmount) || 0), 0);
    const pendingVerifications = payments.filter((p) => p.status === 'PENDING').length;
    const activeWindowsCount = windows.filter((w) => w.active).length;

    return {
      totalCollectible,
      totalCollected,
      totalRemaining,
      pendingVerifications,
      activeWindowsCount,
    };
  }, [feeAccounts, payments, windows]);

  // Filtered Fee Accounts (Admin)
  const filteredAccounts = useMemo(() => {
    return feeAccounts.filter((account) => {
      const matchSearch =
        searchTerm === '' ||
        account.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.studentUserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.branchName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === 'ALL' || account.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [feeAccounts, searchTerm, statusFilter]);

  // Filtered Payments (Admin)
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        searchTerm === '' ||
        p.transactionIds?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.studentUserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.remarks?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === 'ALL' || p.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  // Handlers
  const handleStudentSubmitPayment = async (payload) => {
    setIsSubmitting(true);
    try {
      const newPayment = await feeService.submitPayment(payload);
      setAlert({
        type: 'success',
        message: 'Your payment voucher was successfully submitted for institutional verification!',
      });
      setIsSubmitModalOpen(false);
      // Refresh
      await loadData();
    } catch (err) {
      console.error('Error submitting payment:', err);
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to submit payment voucher.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateFeeAccount = async (payload) => {
    setIsSubmitting(true);
    try {
      await feeService.createFeeAccount(payload);
      setAlert({
        type: 'success',
        message: `Student fee account initialized for ${payload.studentName}!`,
      });
      setIsCreateAccountModalOpen(false);
      await loadData();
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to create fee account.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFeeAccount = async (id, totalFee) => {
    setIsSubmitting(true);
    try {
      await feeService.updateFeeAccount(id, totalFee);
      setAlert({
        type: 'success',
        message: 'Student fee ledger successfully updated!',
      });
      setIsEditAccountModalOpen(false);
      setSelectedFeeAccount(null);
      await loadData();
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to update fee ledger.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveWindow = async (windowData) => {
    setIsSubmitting(true);
    try {
      if (selectedWindow) {
        await feeService.updateFeeWindow(selectedWindow.id, windowData);
        setAlert({
          type: 'success',
          message: 'Fee collection window updated successfully!',
        });
      } else {
        await feeService.createFeeWindow(windowData);
        setAlert({
          type: 'success',
          message: 'New fee collection window scheduled and published!',
        });
      }
      setIsWindowModalOpen(false);
      setSelectedWindow(null);
      await loadData();
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to save fee window.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprovePayment = async (paymentId) => {
    try {
      await feeService.approvePayment(paymentId);
      setAlert({
        type: 'success',
        message: 'Payment verified and approved! Student fee balance has been credited.',
      });
      await loadData();
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to approve payment.',
      });
    }
  };

  const handleRejectPayment = async (paymentId, reason) => {
    setIsSubmitting(true);
    try {
      await feeService.rejectPayment(paymentId, reason);
      setAlert({
        type: 'success',
        message: 'Payment rejected. Student ledger was not credited.',
      });
      setRejectPaymentTarget(null);
      await loadData();
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to reject payment.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
      case 'APPROVED':
        return <Badge variant="success" icon={CheckCircle2}>{status}</Badge>;
      case 'PARTIALLY_PAID':
        return <Badge variant="warning" icon={Clock}>PARTIAL</Badge>;
      case 'PENDING':
        return <Badge variant="warning" icon={Clock}>PENDING</Badge>;
      case 'OVERDUE':
      case 'REJECTED':
        return <Badge variant="danger" icon={XCircle}>{status}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Alert */}
      {alert && (
        <AlertBanner
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 shadow-xs">
              <CreditCard size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {isStudent ? 'My Fee Ledger & Payment Desk' : 'Fee Accounts & Financial Bureau'}
              </h1>
              <p className="text-xs text-slate-500">
                {isStudent
                  ? 'Track semester dues, upload transaction proofs, and download official fee clearance receipts'
                  : 'Manage student fee ledgers, review incoming payment vouchers, and schedule collection windows'}
              </p>
            </div>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={loadData}
            isLoading={isLoading}
            title="Refresh Ledger"
          >
            Refresh
          </Button>

          {isStudent ? (
            <>
              {myFee && (
                <Button
                  variant="secondary"
                  icon={Printer}
                  onClick={() => setIsClearanceSlipOpen(true)}
                >
                  Clearance Slip
                </Button>
              )}
              <Button
                variant="primary"
                icon={DollarSign}
                onClick={() => setIsSubmitModalOpen(true)}
                disabled={!windowStatus.open}
              >
                Submit Payment
              </Button>
            </>
          ) : (
            <>
              {canManageWindows && (
                <Button
                  variant="secondary"
                  icon={Calendar}
                  onClick={() => {
                    setSelectedWindow(null);
                    setIsWindowModalOpen(true);
                  }}
                >
                  Schedule Window
                </Button>
              )}
              {canCreateFee && (
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => setIsCreateAccountModalOpen(true)}
                >
                  Create Fee Account
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Collection Window Status Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          windowStatus.open
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full shrink-0 ${
              windowStatus.open ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {windowStatus.open ? 'Fee Collection Window Active' : 'Fee Collection Window Closed'}
              </span>
              {windowStatus.open && (
                <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  OPEN
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5 opacity-90">
              {windowStatus.open
                ? `${windowStatus.formName || 'Regular Session'} — Payment submissions open until ${
                    windowStatus.closeAt ? new Date(windowStatus.closeAt).toLocaleString('en-IN') : 'announced deadline'
                  }`
                : 'Payment submissions are currently paused. Contact the Accounts Bureau or wait for the next session window to open.'}
            </p>
          </div>
        </div>

        {isStudent && windowStatus.open && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
          >
            Pay Now
          </Button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* STUDENT VIEW */}
      {/* ========================================================================= */}
      {isStudent && (
        <div className="space-y-6">
          {/* Student Balance Card */}
          {myFee ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Student Fee Account
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                    {myFee.studentName || user?.userName}
                  </h2>
                  <p className="text-xs text-slate-500">
                    ID: <span className="font-semibold text-slate-700">{myFee.studentUserId}</span> • Program:{' '}
                    <span className="font-semibold text-slate-700">{myFee.courseName}</span> (
                    {myFee.branchName})
                  </p>
                </div>
                <div>{getStatusBadge(myFee.status)}</div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-600">Payment Clearance Progress</span>
                  <span className="text-blue-700">
                    {myFee.totalFee > 0
                      ? Math.round((Number(myFee.paidAmount) / Number(myFee.totalFee)) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        myFee.totalFee > 0
                          ? Math.min(
                              100,
                              Math.round((Number(myFee.paidAmount) / Number(myFee.totalFee)) * 100)
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Stat Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <span className="text-xs font-medium text-slate-500 block">Total Prescribed Fee</span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">
                    ₹{Number(myFee.totalFee || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                  <span className="text-xs font-medium text-emerald-700 block">Paid Amount</span>
                  <span className="text-xl font-black text-emerald-700 mt-1 block">
                    ₹{Number(myFee.paidAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100">
                  <span className="text-xs font-medium text-rose-700 block">Remaining Due</span>
                  <span className="text-xl font-black text-rose-700 mt-1 block">
                    ₹{Number(myFee.remainingAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
              <AlertCircle size={36} className="mx-auto text-slate-400 mb-2" />
              <p className="font-semibold text-slate-700">No Fee Account Found</p>
              <p className="text-xs mt-1">
                Your student fee account has not been initialized yet. Please contact the Accounts Bureau.
              </p>
            </div>
          )}

          {/* Student Payment Ledger */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Payment Submission Ledger</h3>
                <p className="text-xs text-slate-500">History of payments submitted by you</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Total Submissions: {myPayments.length}
              </span>
            </div>

            {myPayments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No payment transactions submitted yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Transaction / UTR</th>
                      <th className="px-4 py-3">Submitted At</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3">Remarks</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Proof Voucher</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 font-mono font-semibold text-slate-800">
                          {p.transactionIds}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {p.submittedAt ? new Date(p.submittedAt).toLocaleString('en-IN') : '-'}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{p.paymentMethod}</td>
                        <td className="px-4 py-3 text-slate-500 max-w-[180px] truncate">
                          {p.remarks || '-'}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          ₹{Number(p.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-center">{getStatusBadge(p.status)}</td>
                        <td className="px-4 py-3 text-center">
                          {p.proofImages?.length > 0 ? (
                            <button
                              onClick={() => setPreviewPayment(p)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-semibold inline-flex items-center gap-1 hover:underline"
                            >
                              <Eye size={13} /> View Proof ({p.proofImages.length})
                            </button>
                          ) : (
                            <span className="text-slate-400">None</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN & FINANCE VIEW */}
      {/* ========================================================================= */}
      {!isStudent && (
        <div className="space-y-6">
          {/* Financial Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Collectible"
              value={`₹${stats.totalCollectible.toLocaleString('en-IN')}`}
              icon={DollarSign}
              variant="default"
              subtitle={`${feeAccounts.length} enrolled student accounts`}
            />
            <StatCard
              title="Total Collected"
              value={`₹${stats.totalCollected.toLocaleString('en-IN')}`}
              icon={TrendingUp}
              variant="success"
              subtitle={`${
                stats.totalCollectible > 0
                  ? Math.round((stats.totalCollected / stats.totalCollectible) * 100)
                  : 0
              }% collection rate`}
            />
            <StatCard
              title="Outstanding Dues"
              value={`₹${stats.totalRemaining.toLocaleString('en-IN')}`}
              icon={Clock}
              variant="warning"
              subtitle="Pending student balances"
            />
            <StatCard
              title="Verification Queue"
              value={stats.pendingVerifications}
              icon={AlertCircle}
              variant={stats.pendingVerifications > 0 ? 'warning' : 'default'}
              subtitle={`${stats.activeWindowsCount} active collection window(s)`}
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => {
                setActiveTab('ACCOUNTS');
                setStatusFilter('ALL');
              }}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                activeTab === 'ACCOUNTS'
                  ? 'border-blue-600 text-blue-700 bg-blue-50/30'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Fee Accounts Directory ({feeAccounts.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('PAYMENTS');
                setStatusFilter('ALL');
              }}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition relative ${
                activeTab === 'PAYMENTS'
                  ? 'border-blue-600 text-blue-700 bg-blue-50/30'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Payment Verification Queue ({payments.length})
              {stats.pendingVerifications > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                  {stats.pendingVerifications}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('WINDOWS');
                setStatusFilter('ALL');
              }}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                activeTab === 'WINDOWS'
                  ? 'border-blue-600 text-blue-700 bg-blue-50/30'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Collection Windows ({windows.length})
            </button>
          </div>

          {/* Search & Filter Bar (for Accounts & Payments tabs) */}
          {activeTab !== 'WINDOWS' && (
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    activeTab === 'ACCOUNTS'
                      ? 'Search student name, ID, or course...'
                      : 'Search transaction ID or student...'
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                >
                  <option value="ALL">All Statuses</option>
                  {activeTab === 'ACCOUNTS' ? (
                    <>
                      <option value="PENDING">PENDING</option>
                      <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
                      <option value="PAID">PAID</option>
                      <option value="OVERDUE">OVERDUE</option>
                    </>
                  ) : (
                    <>
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: FEE ACCOUNTS DIRECTORY */}
          {/* ========================================================================= */}
          {activeTab === 'ACCOUNTS' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Student Name & ID</th>
                      <th className="px-4 py-3">Course / Branch</th>
                      <th className="px-4 py-3 text-right">Total Prescribed</th>
                      <th className="px-4 py-3 text-right">Paid</th>
                      <th className="px-4 py-3 text-right">Balance Due</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAccounts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                          No matching student fee accounts found.
                        </td>
                      </tr>
                    ) : (
                      filteredAccounts.map((account) => (
                        <tr key={account.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-900">{account.studentName}</p>
                            <p className="text-[11px] font-mono text-slate-500">
                              {account.studentUserId}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-slate-800">{account.courseName || '-'}</p>
                            <p className="text-[11px] text-slate-500">{account.branchName || '-'}</p>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-900">
                            ₹{Number(account.totalFee).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-600">
                            ₹{Number(account.paidAmount).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-rose-600">
                            ₹{Number(account.remainingAmount).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {getStatusBadge(account.status)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {canUpdateFee && (
                                <button
                                  onClick={() => {
                                    setSelectedFeeAccount(account);
                                    setIsEditAccountModalOpen(true);
                                  }}
                                  className="px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-50 rounded border border-blue-200 transition"
                                >
                                  Edit Total
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PAYMENT VERIFICATION QUEUE */}
          {/* ========================================================================= */}
          {activeTab === 'PAYMENTS' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Transaction / UTR</th>
                      <th className="px-4 py-3">Student User ID</th>
                      <th className="px-4 py-3">Submitted Date</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Proof Voucher</th>
                      <th className="px-4 py-3 text-right">Scrutiny Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                          No payment transactions matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">
                            {p.transactionIds}
                            {p.remarks && (
                              <span className="block font-sans font-normal text-[11px] text-slate-500 truncate max-w-[200px]">
                                {p.remarks}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-800">{p.studentUserId}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {p.submittedAt ? new Date(p.submittedAt).toLocaleDateString('en-IN') : '-'}
                          </td>
                          <td className="px-4 py-3 text-slate-700">{p.paymentMethod}</td>
                          <td className="px-4 py-3 text-right font-black text-slate-900 text-sm">
                            ₹{Number(p.amount).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 text-center">{getStatusBadge(p.status)}</td>
                          <td className="px-4 py-3 text-center">
                            {p.proofImages?.length > 0 ? (
                              <button
                                onClick={() => setPreviewPayment(p)}
                                className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 hover:underline"
                              >
                                <Eye size={13} /> View ({p.proofImages.length})
                              </button>
                            ) : (
                              <span className="text-slate-400">No Proof</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {p.status === 'PENDING' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                {canApprovePayment && (
                                  <button
                                    onClick={() => handleApprovePayment(p.id)}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs transition flex items-center gap-1"
                                    title="Approve and Credit Ledger"
                                  >
                                    <Check size={12} /> Approve
                                  </button>
                                )}
                                {canRejectPayment && (
                                  <button
                                    onClick={() => setRejectPaymentTarget(p)}
                                    className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold shadow-xs transition flex items-center gap-1"
                                    title="Reject Payment"
                                  >
                                    <X size={12} /> Reject
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">
                                Reviewed {p.reviewedBy ? `by ${p.reviewedBy}` : ''}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: COLLECTION WINDOWS */}
          {/* ========================================================================= */}
          {activeTab === 'WINDOWS' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Fee Submission Windows</h3>
                  <p className="text-xs text-slate-500">
                    Active windows define the exact calendar interval when students can submit vouchers
                  </p>
                </div>
                {canManageWindows && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Plus}
                    onClick={() => {
                      setSelectedWindow(null);
                      setIsWindowModalOpen(true);
                    }}
                  >
                    Add Window
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {windows.length === 0 ? (
                  <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
                    No fee collection windows scheduled yet.
                  </div>
                ) : (
                  windows.map((win) => (
                    <div
                      key={win.id}
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{win.formName}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              win.active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {win.active ? 'Active' : 'Archived'}
                          </span>
                        </div>

                        <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-slate-400" />
                            <span>
                              <strong>Opens:</strong>{' '}
                              {win.openAt ? new Date(win.openAt).toLocaleString('en-IN') : '-'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-slate-400" />
                            <span>
                              <strong>Closes:</strong>{' '}
                              {win.closeAt ? new Date(win.closeAt).toLocaleString('en-IN') : '-'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {canManageWindows && (
                        <div className="pt-3 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => {
                              setSelectedWindow(win);
                              setIsWindowModalOpen(true);
                            }}
                            className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
                          >
                            Edit Window Settings
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Student Submit Payment Proof Modal */}
      <SubmitPaymentModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleStudentSubmitPayment}
        isSubmitting={isSubmitting}
        studentFee={myFee}
        currentUser={user}
      />

      {/* Receipt / Proof Lightbox Preview Modal */}
      <ReceiptPreviewModal
        isOpen={Boolean(previewPayment)}
        onClose={() => setPreviewPayment(null)}
        payment={previewPayment}
      />

      {/* Admin Reject Payment Modal */}
      <RejectPaymentModal
        isOpen={Boolean(rejectPaymentTarget)}
        onClose={() => setRejectPaymentTarget(null)}
        payment={rejectPaymentTarget}
        onConfirm={handleRejectPayment}
        isSubmitting={isSubmitting}
      />

      {/* Admin Create Student Fee Account Modal */}
      <CreateFeeAccountModal
        isOpen={isCreateAccountModalOpen}
        onClose={() => setIsCreateAccountModalOpen(false)}
        onSubmit={handleCreateFeeAccount}
        isSubmitting={isSubmitting}
      />

      {/* Admin Edit Total Fee Modal */}
      <EditFeeAccountModal
        isOpen={isEditAccountModalOpen}
        onClose={() => {
          setIsEditAccountModalOpen(false);
          setSelectedFeeAccount(null);
        }}
        onSubmit={handleUpdateFeeAccount}
        isSubmitting={isSubmitting}
        feeAccount={selectedFeeAccount}
      />

      {/* Admin Schedule Window Modal */}
      <FeeWindowModal
        isOpen={isWindowModalOpen}
        onClose={() => {
          setIsWindowModalOpen(false);
          setSelectedWindow(null);
        }}
        onSubmit={handleSaveWindow}
        isSubmitting={isSubmitting}
        initialWindow={selectedWindow}
      />

      {/* Student Printable Fee Clearance Slip Modal */}
      <FeeClearanceSlipModal
        isOpen={isClearanceSlipOpen}
        onClose={() => setIsClearanceSlipOpen(false)}
        studentFee={myFee}
        payments={myPayments}
        collegeName={activeCollegeName}
      />
    </div>
  );
};
