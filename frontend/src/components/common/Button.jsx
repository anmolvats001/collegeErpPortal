import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  isLoading = false,
  icon: Icon,
  onClick,
  className = '',
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-blue-800 text-white hover:bg-blue-900 border-blue-800 shadow-sm',
    secondary: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-sm',
    outline: 'bg-transparent text-blue-800 hover:bg-blue-50 border-blue-300',
    danger: 'bg-red-700 text-white hover:bg-red-800 border-red-700 shadow-sm',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded border transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
};
