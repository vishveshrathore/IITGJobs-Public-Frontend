import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log to an error reporting service here
    // console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="text-lg font-semibold mb-2">Something went wrong</div>
            <div className="text-sm text-slate-300 mb-4">Please refresh the page. If the issue persists, contact support.</div>
            <button className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500" onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
