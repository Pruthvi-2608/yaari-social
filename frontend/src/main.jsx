import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical rendering error in React:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 bg-white rounded-3xl shadow-xl border border-charcoal-900/10 space-y-4">
            <h2 className="font-serif text-2xl text-red-600">Something interrupted display</h2>
            <p className="text-xs text-charcoal-600 font-mono bg-red-50 p-3 rounded-xl border border-red-200">
              {this.state.error?.message || String(this.state.error)}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-full bg-[#7E5B42] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#684934] transition-colors"
            >
              Refresh Website
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
