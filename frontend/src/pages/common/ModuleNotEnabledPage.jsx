import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../hooks/useTenant';
import { Layers, ShieldAlert, ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const ModuleNotEnabledPage = ({ moduleCode = 'MODULE', moduleTitle = 'Microservice Module' }) => {
  const navigate = useNavigate();
  const { activeCollegeName, activeCollegeId } = useTenant();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded shadow-sm p-6 text-center">
        <div className="w-14 h-14 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <Layers size={28} />
        </div>

        <div className="inline-flex items-center gap-1 bg-amber-100/70 text-amber-900 border border-amber-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2">
          <ShieldAlert size={12} />
          <span>Module Code: {moduleCode}</span>
        </div>

        <h1 className="text-lg font-bold text-slate-900">Module Subscription Required</h1>

        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          The <strong>{moduleTitle}</strong> capability is currently not enabled for{' '}
          <strong>{activeCollegeName || activeCollegeId || 'this institution'}</strong>.
        </p>

        <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 border border-slate-200 rounded p-2.5">
          Autonomous colleges can subscribe to individual ERP microservices. To activate this module, please contact the Central Platform Super Administrator or enable it under <strong>College Registry &gt; Modules</strong>.
        </p>

        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
            className="text-xs"
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            icon={Building2}
            onClick={() => navigate('/colleges')}
            className="text-xs"
          >
            Campus Registry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModuleNotEnabledPage;
