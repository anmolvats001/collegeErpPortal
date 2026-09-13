import React from 'react';

export const Card = ({ children, title, subtitle, action, className = '', ...props }) => {
  return (
    <div
      className={`bg-white border border-slate-200 rounded shadow-sm p-5 ${className}`}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div>
            {title && <h3 className="text-base font-bold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
