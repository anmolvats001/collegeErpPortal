import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CollegeLogo } from '../../components/common/CollegeLogo';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import {
  User,
  KeyRound,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Phone,
  Mail,
} from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { requestOtp, verifyOtp, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Step 1: Send OTP to user's registered email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError('Please enter your Institutional User ID');
      return;
    }

    setError('');
    setIsLoading(true);

    const result = await requestOtp(userId.trim());
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage('A verification OTP has been dispatched to your registered email address.');
      setStep(2);
    } else {
      setError(result.message);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the OTP sent to your email');
      return;
    }

    setError('');
    setIsLoading(true);

    const result = await verifyOtp(userId.trim(), otp.trim());
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage('OTP successfully validated. You may now specify a new password.');
      setStep(3);
    } else {
      setError(result.message);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please complete both password fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsLoading(true);

    const result = await resetPassword(userId.trim(), newPassword);
    setIsLoading(false);

    if (result.success) {
      setStep(4);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col justify-between text-slate-800">
      {/* Compact Institutional Topbar */}
      <header className="bg-[#0f2942] text-white border-b border-slate-700 px-6 h-14 flex items-center shadow-xs">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between gap-4">
          <CollegeLogo size={30} variant="light" />

          <div className="hidden sm:flex items-center gap-5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="text-blue-300" />
              <span>Helpdesk: +91 (011) 2345-6789</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail size={13} className="text-blue-300" />
              <span>erp-support@college.edu</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto w-full p-4 my-auto">
        <div className="bg-white border border-slate-200 rounded shadow-sm p-6 sm:p-8">
          {/* Card Header */}
          <div className="text-center border-b border-slate-200 pb-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center mx-auto mb-2.5">
              <KeyRound size={20} />
            </div>
            <h1 className="text-base font-bold text-slate-900">Password Recovery</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Institutional Account Access Recovery Portal
            </p>
          </div>

          {/* Progress Indicators */}
          {step < 4 && (
            <div className="flex items-center justify-between mb-6 px-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    step >= 1 ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  1
                </span>
                <span className={step === 1 ? 'font-bold text-blue-900' : 'text-slate-500'}>
                  User ID
                </span>
              </div>
              <div className="w-8 h-[1px] bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    step >= 2 ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  2
                </span>
                <span className={step === 2 ? 'font-bold text-blue-900' : 'text-slate-500'}>
                  Verify OTP
                </span>
              </div>
              <div className="w-8 h-[1px] bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    step >= 3 ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  3
                </span>
                <span className={step === 3 ? 'font-bold text-blue-900' : 'text-slate-500'}>
                  New Key
                </span>
              </div>
            </div>
          )}

          {/* Error Message Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && step < 4 && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Step 1: Enter User ID */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp}>
              <p className="text-xs text-slate-600 mb-4">
                Enter your institutional User ID or Registration Number. A one-time verification code will be sent to your registered email address.
              </p>

              <Input
                id="userId"
                label="User ID / Registration No."
                type="text"
                placeholder="e.g. admin or 2024CS101"
                icon={User}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />

              <div className="mt-5 space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="w-full py-2.5 text-sm"
                >
                  Send Verification OTP
                </Button>

                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-blue-800 py-1"
                >
                  <ArrowLeft size={14} />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: Enter & Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <p className="text-xs text-slate-600 mb-4">
                Please enter the verification OTP sent to your registered institutional email for User ID <strong>{userId}</strong>.
              </p>

              <Input
                id="otp"
                label="6-Digit Verification OTP"
                type="text"
                placeholder="Enter 6-digit code"
                icon={ShieldCheck}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              <div className="mt-5 space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="w-full py-2.5 text-sm"
                >
                  Validate OTP Code
                </Button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="text-slate-500 hover:text-slate-800"
                  >
                    Change User ID
                  </button>

                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={isLoading}
                    className="text-blue-800 hover:underline font-semibold"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <p className="text-xs text-slate-600 mb-4">
                Enter your new password below. Ensure it is at least 6 characters long.
              </p>

              <Input
                id="newPassword"
                label="New Password"
                type="password"
                placeholder="Enter new password"
                icon={Lock}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                id="confirmPassword"
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <div className="mt-5">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="w-full py-2.5 text-sm"
                >
                  Update Password
                </Button>
              </div>
            </form>
          )}

          {/* Step 4: Success Message */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-base font-bold text-slate-900">Password Changed Successfully</h2>
              <p className="text-xs text-slate-600">
                Your credentials for account <strong>{userId}</strong> have been updated. You can now sign in using your new password.
              </p>

              <div className="pt-2">
                <Button
                  onClick={() => navigate('/login')}
                  variant="primary"
                  className="w-full py-2.5 text-sm"
                >
                  Proceed to Sign In
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 text-xs py-3 px-6 text-center border-t border-slate-700">
        <p>© {new Date().getFullYear()} College ERP System. Secure Password Recovery Service.</p>
      </footer>
    </div>
  );
};
