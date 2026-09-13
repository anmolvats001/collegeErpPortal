import React from 'react';

export const Loader = ({ message = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-800 rounded-full animate-spin" />
      {message && <span className="text-sm font-medium text-slate-600">{message}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        {content}
      </div>
    );
  }

  return content;
};
