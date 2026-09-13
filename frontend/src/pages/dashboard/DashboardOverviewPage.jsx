import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { StudentDashboardView } from './components/StudentDashboardView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import {
  Building2,
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  School,
  FileCheck,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardOverviewPage = () => {
  const { user, isMainAdmin, isCollegeAdmin, isTeacher, isStudent } = useAuth();
  const { activeCollegeName, activeCollegeId } = useTenant();

  // Role-Specific Views
  if (isStudent && !isTeacher && !isCollegeAdmin && !isMainAdmin) {
    return <StudentDashboardView user={user} activeCollegeName={activeCollegeName} />;
  }

  if (isTeacher && !isCollegeAdmin && !isMainAdmin) {
    return <TeacherDashboardView user={user} activeCollegeName={activeCollegeName} />;
  }

  const microservices = [
    { name: 'API Gateway', port: '8080', path: '/api/v1/...', status: 'Operational', desc: 'Central routing' },
    { name: 'Core Service', port: '8082', path: '/api/v1/core', status: 'Operational', desc: 'Authentication & Tenants' },
    { name: 'Class Service', port: '8083', path: '/api/v1/class', status: 'Operational', desc: 'Classes, Attendance & Exams' },
    { name: 'Admission Service', port: '8084', path: '/api/v1/admission', status: 'Operational', desc: 'Public Admission Workflow' },
    { name: 'Fee Service', port: '8085', path: '/api/v1/fee', status: 'Operational', desc: 'Accounts & Payment Forms' },
    { name: 'Notification Service', port: '8086', path: '/api/notifications', status: 'Operational', desc: 'Kafka Email Dispatcher' },
    { name: 'Cloudinary Service', port: '8087', path: '/api/files', status: 'Operational', desc: 'Document Storage' },
  ];

  return (
    <div className="space-y-6">
      {/* College Institutional Title Bar */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900">
              Welcome, {user?.userId || 'Authorized User'}
            </h1>
            <Badge variant="primary">
              {user?.roles?.[0]?.replace('ROLE_', '') || 'FACULTY'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {activeCollegeName ? (
              <span>College Affiliation: <strong>{activeCollegeName}</strong></span>
            ) : (
              <span>Multi-Tenant Centralized Administration Portal</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isMainAdmin && (
            <Link
              to="/colleges"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded transition"
            >
              <Building2 size={15} />
              <span>College Registry</span>
            </Link>
          )}
          {(isMainAdmin || isCollegeAdmin) && (
            <Link
              to="/admissions"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition"
            >
              <GraduationCap size={15} />
              <span>Admissions</span>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isMainAdmin && (
          <StatCard
            title="Institutions"
            value="Active"
            icon={Building2}
            color="primary"
            subtext="Tenant isolation enabled"
          />
        )}
        <StatCard
          title="Academic Classes"
          value="Configured"
          icon={School}
          color="accent"
          subtext="Class Service connected"
        />
        <StatCard
          title="Attendance Portal"
          value="Available"
          icon={CalendarCheck}
          color="success"
          subtext="Faculty marking active"
        />
        <StatCard
          title="Fee Counter"
          value="Enabled"
          icon={CreditCard}
          color="warning"
          subtext="Payment verification ready"
        />
      </div>

      {/* Microservice Gateway Health Overview */}
      <Card
        title="Microservice Architecture & Gateway Status"
        subtitle="Gateway active on port 8080 routing to domain services"
      >
        <div className="table-container overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Service Domain</th>
                <th className="py-2.5 px-4">Port</th>
                <th className="py-2.5 px-4">Route Prefix</th>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {microservices.map((svc) => (
                <tr key={svc.name} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{svc.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">:{svc.port}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{svc.path}</td>
                  <td className="py-3 px-4 text-slate-500">{svc.desc}</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">{svc.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
