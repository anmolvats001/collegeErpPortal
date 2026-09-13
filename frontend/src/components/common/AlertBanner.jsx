import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const AlertBanner = ({
  type = 'info', // 'success' | 'danger' | 'warning' | 'info'
  message,
  onDismiss,
  className = '',
}) => {
  if (!message) return null;

  const styles = {
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />,
    },
    danger: {
      container: 'bg-red-50 border-red-200 text-red-900',
      icon: <AlertCircle size={16} className="text-red-700 shrink-0" />,
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle size={16} className="text-amber-700 shrink-0" />,
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info size={16} className="text-blue-700 shrink-0" />,
    },
  };

  const current = styles[type] || styles.info;

  return (
    <div
      className={`p-3 rounded text-xs border flex items-center justify-between gap-3 shadow-sm ${current.container} ${className}`}
    >
      <div className="flex items-center gap-2">
        {current.icon}
        <span className="font-medium">{message}</span>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition"
          title="Dismiss Alert"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
