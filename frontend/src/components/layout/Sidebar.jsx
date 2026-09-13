import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Bell,
  ChevronLeft,
  ChevronRight,
  School,
  BookOpen,
  Users,
  User,
  LogIn,
  KeyRound,
  ShieldCheck,
  Layers,
  UserCheck,
  FileText,
  MessagesSquare,
  Award,
  Megaphone,
} from 'lucide-react';
import { CollegeLogo } from '../common/CollegeLogo';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isMainAdmin, isCollegeAdmin, isTeacher, isStudent, hasPermission, hasAnyPermission } = useAuth();
  const { hasModule } = useTenant();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard, show: true },
    {
      label: 'User Directory',
      path: '/users',
      icon: Users,
      show: isMainAdmin || isCollegeAdmin || hasAnyPermission(['VIEW_ALL_COLLEGE_USER', 'VIEW_USER', 'CREATE_USER']),
    },
    {
      label: 'Roles & Access',
      path: '/roles',
      icon: ShieldCheck,
      show: isMainAdmin || isCollegeAdmin || hasAnyPermission(['VIEW_ROLE', 'CREATE_ROLE', 'ASSIGN_ROLE', 'ASSIGN_PERMISSION']),
    },
    {
      label: 'College Registry',
      path: '/colleges',
      icon: Building2,
      show: isMainAdmin,
    },
    {
      label: 'Module Registry',
      path: '/modules',
      icon: Layers,
      show: isMainAdmin,
    },
    {
      label: 'My Profile',
      path: '/profile',
      icon: User,
      show: true,
    },
    {
      label: 'Admissions',
      path: '/admissions',
      icon: GraduationCap,
      show: (isMainAdmin || isCollegeAdmin || hasAnyPermission(['VIEW_ADMISSION', 'APPROVE_ADMISSION'])) && hasModule('ADMISSION'),
    },
    {
      label: 'Courses & Branches',
      path: '/academics',
      icon: School,
      show: (isMainAdmin || isCollegeAdmin || isTeacher || hasPermission('MANAGE_CLASSES')) && hasModule('CLASS'),
    },
    {
      label: 'Class Sections',
      path: '/classes',
      icon: Users,
      show: (isMainAdmin || isCollegeAdmin || isTeacher || hasPermission('MANAGE_CLASSES')) && hasModule('CLASS'),
    },
    {
      label: 'Subject Catalog',
      path: '/subjects',
      icon: BookOpen,
      show: (isMainAdmin || isCollegeAdmin || isTeacher || isStudent || hasPermission('MANAGE_CLASSES')) && hasModule('CLASS'),
    },
    {
      label: 'Student Directory',
      path: '/students',
      icon: GraduationCap,
      show: (isMainAdmin || isCollegeAdmin || isTeacher || hasAnyPermission(['MANAGE_CLASSES', 'VIEW_ALL_COLLEGE_USER'])) && hasModule('CLASS'),
    },
    {
      label: 'Faculty & Teaching',
      path: '/teachers',
      icon: UserCheck,
      show: (isMainAdmin || isCollegeAdmin || isTeacher || hasAnyPermission(['MANAGE_CLASSES', 'VIEW_ALL_COLLEGE_USER'])) && hasModule('CLASS'),
    },
    {
      label: 'Attendance',
      path: '/attendance',
      icon: CalendarCheck,
      show: (isMainAdmin || isCollegeAdmin || isTeacher || isStudent || hasAnyPermission(['MARK_ATTENDANCE', 'TAKE_ATTENDANCE', 'VIEW_ATTENDANCE', 'VIEW_MY_ATTENDANCE'])) && hasModule('ATTENDANCE'),
    },
    {
      label: 'Assignments',
      path: '/assignments',
      icon: FileText,
      show: (isMainAdmin || isCollegeAdmin || isTeacher || isStudent || hasAnyPermission(['CREATE_ASSIGNMENT', 'GRADE_ASSIGNMENT', 'SUBMIT_ASSIGNMENT'])) && hasModule('CLASS'),
    },
    {
      label: 'Examinations',
      path: '/exams',
      icon: Award,
      show: (isMainAdmin || isCollegeAdmin || isTeacher || isStudent || hasAnyPermission(['PUBLISH_EXAM', 'VIEW_EXAMS'])) && hasModule('CLASS'),
    },
    {
      label: 'Academic Notices',
      path: '/notices',
      icon: Megaphone,
      show: (isMainAdmin || isCollegeAdmin || isTeacher || isStudent || hasAnyPermission(['POST_NOTICE'])) && hasModule('CLASS'),
    },
    {
      label: 'Class Chat & Calls',
      path: '/chat',
      icon: MessagesSquare,
      show: (isMainAdmin || isCollegeAdmin || isTeacher || isStudent || hasAnyPermission(['CHAT_ACCESS'])) && hasModule('CLASS'),
    },
    {
      label: 'Fee Accounts',
      path: '/fees',
      icon: CreditCard,
      show: (isMainAdmin || isCollegeAdmin || isStudent || hasAnyPermission(['VIEW_FEE', 'VIEW_FEE_FORM', 'CREATE_FEE', 'APPROVE_FEE_FORM', 'VERIFY_FEE_PAYMENT', 'MANAGE_FEE_WINDOWS', 'VIEW_FEES'])) && hasModule('FEE'),
    },
    { label: 'Login Screen', path: '/login', icon: LogIn, show: true },
    { label: 'Forgot Password', path: '/forgot-password', icon: KeyRound, show: true },
  ];

  return (
    <aside
      className={`min-h-screen bg-[#0f2942] text-white flex flex-col transition-all duration-200 sticky top-0 z-50 border-r border-slate-700 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* College Header */}
      <div className={`h-16 flex items-center border-b border-slate-700 transition-all ${
        collapsed ? 'justify-center px-1' : 'px-4 justify-between'
      }`}>
        {!collapsed ? (
          <>
            <CollegeLogo size={30} variant="light" showText={true} />
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-slate-300 hover:text-white p-1.5 rounded hover:bg-slate-800 transition"
              title="Collapse Menu"
            >
              <ChevronLeft size={18} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/80 transition relative group"
            title="Expand Sidebar Menu"
          >
            <CollegeLogo size={28} variant="light" showText={false} />
            <span className="absolute -bottom-0.5 -right-0.5 bg-blue-600 text-white rounded-full p-0.5 shadow-xs opacity-80 group-hover:opacity-100 transition">
              <ChevronRight size={10} />
            </span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-3 flex-1 flex flex-col gap-1">
        {!collapsed && (
          <span className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </span>
        )}
        {navItems
          .filter((item) => item.show)
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded transition ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700 text-[11px] text-slate-400 text-center">
        {!collapsed && <p>© Multi-College ERP</p>}
      </div>
    </aside>
  );
};
