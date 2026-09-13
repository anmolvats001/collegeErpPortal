import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'primary', subtext }) => {
  const colorMap = {
    primary: 'border-l-4 border-l-blue-800 bg-white',
    accent: 'border-l-4 border-l-sky-700 bg-white',
    success: 'border-l-4 border-l-emerald-700 bg-white',
    warning: 'border-l-4 border-l-amber-600 bg-white',
  };

  const iconBgMap = {
    primary: 'bg-blue-50 text-blue-800',
    accent: 'bg-sky-50 text-sky-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
  };

  return (
    <div
      className={`border border-slate-200 rounded shadow-sm p-4 flex items-center justify-between ${
        colorMap[color] || colorMap.primary
      }`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">{value}</h2>
        {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded flex items-center justify-center ${iconBgMap[color] || iconBgMap.primary}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
};
