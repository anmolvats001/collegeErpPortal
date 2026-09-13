import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { CollegeLogo } from '../../components/common/CollegeLogo';
import { User, Lock, AlertCircle, Phone, Mail, FileText, CheckCircle2, ArrowRight, GraduationCap } from 'lucide-react';

export const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setError('Please enter your Institutional User ID and Password.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const result = await login(userId, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Authentication failed. Please verify your credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col justify-between text-slate-800">
      {/* Compact Institutional Top Header */}
      <header className="bg-[#0f2942] text-white border-b border-slate-700 px-6 h-14 flex items-center shadow-xs">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-4">
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

      {/* Main Login & Announcements Area */}
      <main className="max-w-5xl mx-auto w-full p-4 md:p-8 my-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Notices & Guidelines */}
          <div className="md:col-span-7 space-y-5">
            <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                <FileText size={18} className="text-blue-800" />
                <span>Notice Board & Important Instructions</span>
              </h2>
              <ul className="mt-4 space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <span>
                      <strong>Admissions Active:</strong> Online applications for the 2026–27 academic intake are open for all programs.
                    </span>
                    <div>
                      <Link
                        to="/apply"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded transition"
                      >
                        <span>Apply Online for Admission</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Attendance Policy:</strong> A minimum of 75% attendance in all enrolled courses is mandatory to sit for semester examinations.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Fee Submissions:</strong> Students are requested to submit fee transaction proofs before the scheduled window closing date.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4 text-xs text-blue-900 flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Security Notice</p>
                <p className="text-blue-800 mt-0.5">
                  Do not disclose your login credentials to anyone. The institution will never ask for your password via email or telephone. Always log out after finishing your session.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Formal Login Box */}
          <div className="md:col-span-5">
            <div className="bg-white border border-slate-200 rounded shadow-sm p-6 sm:p-8">
              <div className="border-b border-slate-200 pb-4 mb-5 text-center flex flex-col items-center">
                <CollegeLogo size={36} variant="dark" className="mb-2.5" />
                <h2 className="text-base font-bold text-slate-900">User Authentication</h2>
                <p className="text-xs text-slate-500 mt-0.5">Sign in with your University or Staff Credentials</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <Input
                  id="userId"
                  label="User ID / Registration No."
                  type="text"
                  placeholder="Enter User ID"
                  icon={User}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />

                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter Password"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="flex items-center justify-between -mt-2 mb-4">
                  <span />
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-800 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    className="w-full py-2.5 text-sm"
                  >
                    Log In to Portal
                  </Button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2.5">
                <p className="text-slate-600 font-medium">New student looking to join?</p>
                <Link
                  to="/apply"
                  className="flex items-center justify-center gap-1.5 w-full py-2 px-3 border border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold transition text-xs shadow-xs"
                >
                  <GraduationCap size={15} className="text-emerald-700" />
                  <span>Prospective Student? Apply for Admission</span>
                </Link>
                <p className="text-[11px] text-slate-400">
                  Staff / Faculty needing credentials? Contact your College IT Registrar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-slate-800 text-slate-400 text-xs py-4 px-6 border-t border-slate-700">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} College ERP System. All Rights Reserved.</p>
          <div className="flex gap-4 text-slate-400">
            <span>Academic Regulations</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>IT Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
