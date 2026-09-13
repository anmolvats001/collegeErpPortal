import React from 'react';

export const Badge = ({ children, variant = 'primary', icon: Icon, className = '' }) => {
  const variantStyles = {
    primary: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    light: 'bg-white/20 text-white border-white/40',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded border ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};
