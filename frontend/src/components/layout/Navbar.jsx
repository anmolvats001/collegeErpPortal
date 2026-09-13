import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import { Link } from 'react-router-dom';
import { LogOut, Building2, User, ChevronDown } from 'lucide-react';
import { Badge } from '../common/Badge';
import { TenantSelectorModal } from '../common/TenantSelectorModal';
import { IS_PREVIEW_MODE } from '../../utils/mockData';

export const Navbar = () => {
  const { user, logout, isMainAdmin, isCollegeAdmin, isTeacher, isStudent, switchPreviewRole } = useAuth();
  const { activeCollegeName, activeCollegeId, activeModules } = useTenant();
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsTenantModalOpen(true)}
          className="flex items-center gap-2 text-slate-900 font-bold hover:bg-slate-50 px-2 py-1 rounded transition border border-transparent hover:border-slate-200"
          title="Click to switch institutional campus"
        >
          <Building2 size={20} className="text-blue-800 shrink-0" />
          <span className="text-sm font-semibold truncate max-w-xs md:max-w-md">
            {activeCollegeName || (isMainAdmin ? 'System Administration' : 'College Portal')}
          </span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        {activeCollegeId && (
          <Badge variant="neutral">
            {activeCollegeId.replace('COL-', '').slice(0, 10)}
          </Badge>
        )}

        <Badge variant="primary">
          {activeModules?.length || 0} Modules Active
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Preview Switcher */}
        {IS_PREVIEW_MODE && switchPreviewRole && (
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5">View As:</span>
            <button
              onClick={() => switchPreviewRole('ADMIN')}
              className={`px-2.5 py-1 rounded font-medium transition text-xs ${
                (isMainAdmin || isCollegeAdmin) && !isTeacher && !isStudent
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => switchPreviewRole('TEACHER')}
              className={`px-2.5 py-1 rounded font-medium transition text-xs ${
                isTeacher
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              Teacher
            </button>
            <button
              onClick={() => switchPreviewRole('STUDENT')}
              className={`px-2.5 py-1 rounded font-medium transition text-xs ${
                isStudent
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              Student
            </button>
          </div>
        )}
        <Link
          to="/profile"
          className="flex items-center gap-3 border-r border-slate-200 pr-4 hover:opacity-80 transition"
          title="View Profile"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700">
            <User size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">{user?.userId || 'Guest User'}</span>
            <span className="text-[11px] font-medium text-slate-500">
              {user?.roles?.[0]?.replace('ROLE_', '') || 'STAFF'}
            </span>
          </div>
        </Link>

        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-red-700 hover:bg-red-50 border border-slate-300 rounded transition"
          title="Sign Out"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>

      <TenantSelectorModal
        isOpen={isTenantModalOpen}
        onClose={() => setIsTenantModalOpen(false)}
      />
    </header>
  );
};
