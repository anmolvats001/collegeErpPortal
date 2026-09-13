import React from 'react';

export const Input = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label} {required && <span className="text-red-600 font-bold">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <span className="absolute left-3 text-slate-400 pointer-events-none">
            <Icon size={18} />
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full py-2.5 text-sm bg-white border rounded shadow-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition ${
            Icon ? 'pl-10 pr-3' : 'px-3'
          } ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-0.5">{error}</p>
      )}
    </div>
  );
};
