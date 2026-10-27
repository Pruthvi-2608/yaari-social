import React, { useState } from 'react';
import { Mail, Key, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

export default function LoginModal({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const data = await api.login(email.trim(), password);
      if (data?.user) {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1a17] via-[#181614] to-[#12100e] flex items-center justify-center p-4 sm:p-6 relative">
      <div className="bg-white rounded-3xl max-w-md w-full p-7 sm:p-9 space-y-6 shadow-2xl border border-charcoal-900/10 animate-fade-in relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-ivory-100 border border-charcoal-900/10 p-2.5 mx-auto flex items-center justify-center shadow-sm">
            <img
              src="/brand/yaari-social-logo.png"
              alt="Yaari Social"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal-900">
            Admin Portal Login
          </h2>
          <p className="text-xs text-charcoal-600 font-light max-w-xs mx-auto">
            Sign in with your administrator credentials to manage Yaari Social Cafe.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="leading-snug">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-charcoal-700 font-semibold mb-1">Admin Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-taupe-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yaaricafe@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-charcoal-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-taupe-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ivory-50 border border-charcoal-900/10 text-charcoal-900 focus:outline-none focus:border-coffee-500 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="flex items-center justify-between pt-2 border-t border-charcoal-900/10 text-[11px] text-taupe-500">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-charcoal-600 hover:text-coffee-600 transition-colors font-medium"
          >
            <ArrowLeft size={12} />
            <span>Customer Website</span>
          </a>
          <span>Protected Session</span>
        </div>
      </div>
    </div>
  );
}
