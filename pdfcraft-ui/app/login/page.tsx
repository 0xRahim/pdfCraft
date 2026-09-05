import React, { useState } from 'react';
import { useRouter, Link } from '../../lib/router';
import { LOGO_URL } from '../../data/mockData';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('name@company.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 600);
    }, 800);
  };

  const handleOAuthClick = (provider: string) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }, 600);
  };

  return (
    <div className="bg-surface-page font-body text-on-surface antialiased min-h-screen flex flex-col justify-center items-center py-space-12 px-space-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex items-center gap-space-2 mb-space-8">
          <img
            alt="PdfCraft Logo"
            className="h-9 w-auto object-contain"
            src={LOGO_URL}
          />
          <span className="font-heading-lg text-heading-lg text-gray-700 tracking-tight font-semibold">
            PdfCraft
          </span>
        </div>

        {/* Main Login Card */}
        <main className="w-full bg-surface-card border border-border rounded-xl p-space-8 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col w-full">
            <div className="flex flex-col text-center mb-space-6">
              <div className="inline-flex items-center justify-center gap-space-2 mb-space-2">
                <span className="inline-flex items-center px-space-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-label text-label">
                  <span className="material-symbols-outlined text-[14px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bolt
                  </span>
                  v2.4 Engine Live
                </span>
              </div>
              <h1 className="font-heading-lg text-heading-lg text-gray-700 font-semibold tracking-tight">
                Sign in to PdfCraft
              </h1>
              <p className="font-body-sm text-body-sm text-gray-500 mt-space-1">
                Automate and render PDFs from templates with dynamic placeholders
              </p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-space-3 mb-space-5">
              <button
                type="button"
                onClick={() => handleOAuthClick('Google')}
                className="group flex items-center justify-center gap-space-2 h-9 px-space-3 bg-gray-0 rounded-lg shadow-sm hover:bg-surface-hover transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-700 font-label text-label cursor-pointer border border-border"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4" />
                  <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853" />
                  <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05" />
                  <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthClick('GitHub')}
                className="group flex items-center justify-center gap-space-2 h-9 px-space-3 bg-gray-0 rounded-lg shadow-sm hover:bg-surface-hover transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-700 font-label text-label cursor-pointer border border-border"
              >
                <svg className="w-4 h-4 shrink-0 fill-gray-700" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-space-4">
              <div className="w-full h-px bg-gray-150"></div>
              <span className="absolute bg-surface-card px-space-3 font-caption text-caption uppercase tracking-wider text-gray-400 font-medium">
                Or continue with email
              </span>
            </div>

            {/* Email / Password Form */}
            <form className="flex flex-col gap-space-4 mt-space-2" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-space-1">
                <label className="font-label text-label text-gray-600" htmlFor="workEmail">
                  Work Email
                </label>
                <div className="relative flex items-center">
                  <input
                    id="workEmail"
                    className="w-full h-9 px-space-3 bg-gray-0 text-gray-700 font-body text-body rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-150 border border-border"
                    placeholder="name@company.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-space-1">
                <div className="flex items-center justify-between">
                  <label className="font-label text-label text-gray-600" htmlFor="accountPassword">
                    Password
                  </label>
                  <a
                    className="font-label text-label text-brand-500 hover:text-brand-600 hover:underline transition-colors duration-150"
                    href="#forgot"
                    onClick={(e) => { e.preventDefault(); alert('Password reset link sent to ' + email); }}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="accountPassword"
                    className="w-full h-9 pl-space-3 pr-10 bg-gray-0 text-gray-700 font-body text-body rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-150 border border-border"
                    placeholder="••••••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    aria-label="Toggle password visibility"
                    className="absolute right-0 pr-space-3 flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors cursor-pointer"
                    id="togglePasswordBtn"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-space-2 pt-space-1">
                <input
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 focus:ring-offset-0 bg-gray-0 cursor-pointer accent-brand-500"
                  id="rememberDevice"
                  type="checkbox"
                />
                <label className="font-body-sm text-body-sm text-gray-600 select-none cursor-pointer" htmlFor="rememberDevice">
                  Remember this device for 30 days
                </label>
              </div>

              <button
                className={`mt-space-2 w-full h-10 px-space-4 font-label text-label rounded-lg font-medium shadow-sm transition-all duration-150 flex items-center justify-center gap-space-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 cursor-pointer ${
                  isSuccess
                    ? 'bg-success-600 text-white'
                    : 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-gray-0'
                }`}
                disabled={isAuthenticating}
                id="submitBtn"
                type="submit"
              >
                {isAuthenticating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Redirecting to Dashboard...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-space-6 pt-space-4 flex flex-col items-center gap-space-3">
              <div className="w-full flex items-center gap-space-2 px-space-3 py-space-2 rounded-lg bg-surface-container-low text-gray-500 border border-border">
                <span className="material-symbols-outlined text-success-500 text-[18px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
                <span className="font-caption text-caption leading-tight text-gray-600">
                  Protected by SOC2 Type II compliance &amp; enterprise grade 256-bit encryption.
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-gray-500 text-center">
                Don't have an account?{' '}
                <Link
                  className="text-brand-500 hover:text-brand-600 font-medium hover:underline transition-colors duration-150 ml-1"
                  href="/signup"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </main>

        <div className="mt-space-6 text-center font-caption text-caption text-gray-400">
          © 2024 PdfCraft Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
