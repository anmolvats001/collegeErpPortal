import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-6xl font-extrabold text-blue-800 mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        The requested resource or institutional page is not available. Please verify the URL or return to the main dashboard.
      </p>
      <Link to="/">
        <Button variant="primary" icon={Home}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
