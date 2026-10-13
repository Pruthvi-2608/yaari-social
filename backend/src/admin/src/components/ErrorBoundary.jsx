import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-3xl bg-white border border-red-200 shadow-sm max-w-xl mx-auto my-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <h3 className="font-serif text-xl font-medium text-charcoal-900">
            {this.props.title || 'Something went wrong loading this section'}
          </h3>
          <p className="text-xs text-charcoal-600 font-mono bg-ivory-100 p-3 rounded-xl break-words text-left">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <div className="pt-2">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <RefreshCw size={14} /> Reload Section
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
