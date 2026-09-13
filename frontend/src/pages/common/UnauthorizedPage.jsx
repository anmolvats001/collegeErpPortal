import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ShieldAlert, Home } from 'lucide-react';

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-700 mb-4">
        <ShieldAlert size={28} />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h1>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        You do not possess the required institutional permissions or roles to access this module. Please contact your administrator if you believe this is in error.
      </p>
      <Link to="/">
        <Button variant="secondary" icon={Home}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
