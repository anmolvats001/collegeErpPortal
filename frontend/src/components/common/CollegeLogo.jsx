import React from 'react';

export const CollegeLogo = ({ size = 36, className = '', variant = 'dark', showText = true }) => {
  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer Shield with refined border */}
        <path
          d="M24 4L7 11V23C7 33.2 14.2 42.6 24 45C33.8 42.6 41 33.2 41 23V11L24 4Z"
          fill={isLight ? '#ffffff' : '#1e3a8a'}
          stroke={isLight ? '#93c5fd' : '#1e40af'}
          strokeWidth="1.5"
        />

        {/* Inner Shield Inset */}
        <path
          d="M24 7.5L10 13.3V23C10 31.4 15.9 39.1 24 41.2C32.1 39.1 38 31.4 38 23V13.3L24 7.5Z"
          fill={isLight ? '#f0f7ff' : '#0f2942'}
        />

        {/* Academic Open Book */}
        <path
          d="M24 28V21M24 21C22.2 19.8 19.7 19.3 17 19.5C14.5 19.7 12.5 20.6 12 21V30.5C12.5 30.1 14.5 29.2 17 29C19.7 28.8 22.2 29.3 24 30.5M24 21C25.8 19.8 28.3 19.3 31 19.5C33.5 19.7 35.5 20.6 36 21V30.5C35.5 30.1 33.5 29.2 31 29C28.3 28.8 25.8 29.3 24 30.5"
          stroke={isLight ? '#1e3a8a' : '#93c5fd'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Academic Star / Torch of Excellence */}
        <polygon
          points="24,11 25.5,14.5 29,14.5 26,17 27.5,20.5 24,18 20.5,20.5 22,17 19,14.5 22.5,14.5"
          fill="#f59e0b"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-bold tracking-tight text-sm ${
              isLight ? 'text-white' : 'text-slate-900'
            }`}
          >
            COLLEGE<span className="text-blue-500 font-extrabold ml-0.5">ERP</span>
          </span>
          <span
            className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${
              isLight ? 'text-blue-200' : 'text-slate-500'
            }`}
          >
            Academic Portal
          </span>
        </div>
      )}
    </div>
  );
};
