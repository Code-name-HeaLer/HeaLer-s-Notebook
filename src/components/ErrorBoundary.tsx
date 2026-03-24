import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let displayError = "An unexpected error occurred.";
      
      try {
        // Try to parse Firestore JSON error
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error) {
            displayError = `Database Error: ${parsed.error}`;
            if (parsed.error.includes('permission')) {
              displayError = "Access Denied: You don't have permission to perform this action. Please ensure you are logged in as an admin.";
            }
          }
        }
      } catch (e) {
        // Not a JSON error, use raw message if safe
        displayError = this.state.error?.message || displayError;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center space-y-6">
            <div className="inline-flex p-4 bg-red-500/20 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">System Error</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                {displayError}
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-all text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Connection</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
