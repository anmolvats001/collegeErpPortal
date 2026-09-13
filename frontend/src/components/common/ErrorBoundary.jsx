import React, { Component } from 'react';
 import { AlertTriangle, RefreshCw } from 'lucide-react';
 import { Button } from './Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-slate-300 rounded shadow-md p-6 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
              <AlertTriangle size={28} />
            </div>

            <h1 className="text-lg font-bold text-slate-900">Application Error Encountered</h1>
            <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
              An unexpected exception occurred during view rendering. The institutional session remains safe.
            </p>

            {this.state.error && (
              <div className="bg-slate-50 border border-slate-200 rounded p-3 text-left font-mono text-[11px] text-red-800 mb-4 overflow-x-auto max-h-36">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex justify-center gap-3">
              <Button
                variant="primary"
                icon={RefreshCw}
                onClick={this.handleReload}
                className="text-xs"
              >
                Reload Portal
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
