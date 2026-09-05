import React, { useState } from 'react';
import { useRouter, Link } from '../../lib/router';
import { LOGO_URL } from '../../data/mockData';

export default function SignupPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState('Elena Vance');
  const [email, setEmail] = useState('elena@company.com');
  const [password, setPassword] = useState('SecurePass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [useCase, setUseCase] = useState('invoicing');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength calculation
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const score = (hasLength ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSymbol ? 1 : 0);

  const getStrengthText = () => {
    if (password.length === 0) return { label: 'Min. 8 characters', color: 'text-gray-400' };
    if (score === 1) return { label: 'Weak', color: 'text-danger-400 font-medium' };
    if (score === 2) return { label: 'Fair', color: 'text-warning-600 font-medium' };
    return { label: 'Strong', color: 'text-brand-600 font-medium' };
  };

  const strength = getStrengthText();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 800);
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

        {/* Main Signup Card */}
        <main className="w-full bg-surface-card border border-border rounded-xl p-space-8 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col w-full">
            <div className="flex flex-col text-center mb-space-6">
              <div className="inline-flex items-center justify-center self-center gap-space-1 px-space-2 py-0.5 mb-space-3 bg-brand-50 text-brand-600 rounded-full font-caption text-caption font-medium tracking-normal">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  bolt
                </span>
                <span>14-day free trial • 500 API renders</span>
              </div>
              <h1 className="font-heading-lg text-heading-lg text-gray-700 tracking-tight font-semibold mb-space-1">
                Start creating PDF templates today
              </h1>
              <p className="font-body-sm text-body-sm text-gray-500">
                No credit card required. Instant sandbox &amp; API keys.
              </p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-space-3 mb-space-5">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex items-center justify-center gap-space-2 h-9 px-space-3 bg-surface-card hover:bg-surface-hover text-gray-700 font-label text-label rounded-xl shadow-sm transition-colors duration-150 active:bg-gray-100 border border-border cursor-pointer"
              >
                <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" fill="#4285F4" />
                  <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.41 7.37 24 12 24z" fill="#34A853" />
                  <path d="M5.28 14.27A7.05 7.05 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.26A11.967 11.967 0 0 0 0 12c0 1.92.45 3.74 1.26 5.42l4.02-3.15z" fill="#FBBC05" />
                  <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.59 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex items-center justify-center gap-space-2 h-9 px-space-3 bg-surface-card hover:bg-surface-hover text-gray-700 font-label text-label rounded-xl shadow-sm transition-colors duration-150 active:bg-gray-100 border border-border cursor-pointer"
              >
                <svg aria-hidden="true" className="w-4 h-4 fill-current text-gray-700" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-space-5">
              <div className="w-full h-px bg-gray-150"></div>
              <span className="absolute px-space-3 bg-surface-card font-caption text-caption text-gray-400 uppercase tracking-wider">
                Or sign up with work email
              </span>
            </div>

            {/* Registration Form */}
            <form className="flex flex-col gap-space-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-space-1">
                <label className="font-label text-label text-gray-600" htmlFor="fullname">
                  Full Name
                </label>
                <input
                  id="fullname"
                  className="h-9 px-space-3 bg-gray-0 text-gray-700 font-body text-body rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow duration-150 border border-border"
                  placeholder="Elena Vance"
                  required
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-space-1">
                <label className="font-label text-label text-gray-600" htmlFor="email">
                  Work Email
                </label>
                <input
                  id="email"
                  className="h-9 px-space-3 bg-gray-0 text-gray-700 font-body text-body rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow duration-150 border border-border"
                  placeholder="elena@company.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-space-1">
                <div className="flex items-center justify-between">
                  <label className="font-label text-label text-gray-600" htmlFor="password">
                    Password
                  </label>
                  <span className={`font-caption text-caption ${strength.color}`}>
                    {strength.label}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    className="w-full h-9 pl-space-3 pr-9 bg-gray-0 text-gray-700 font-body text-body rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow duration-150 border border-border"
                    placeholder="••••••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    aria-label="Toggle password visibility"
                    className="absolute right-2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 flex items-center cursor-pointer"
                    id="toggle-pwd"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {/* 3-segment strength bar */}
                <div className="w-full bg-gray-150 h-1 rounded-full overflow-hidden mt-1.5 flex gap-1">
                  <div
                    className={`h-full flex-1 transition-colors duration-200 ${
                      score >= 1 ? (score === 1 ? 'bg-danger-400' : score === 2 ? 'bg-warning-400' : 'bg-brand-500') : 'bg-gray-300'
                    }`}
                  ></div>
                  <div
                    className={`h-full flex-1 transition-colors duration-200 ${
                      score >= 2 ? (score === 2 ? 'bg-warning-400' : 'bg-brand-500') : 'bg-gray-300'
                    }`}
                  ></div>
                  <div
                    className={`h-full flex-1 transition-colors duration-200 ${
                      score >= 3 ? 'bg-brand-500' : 'bg-gray-300'
                    }`}
                  ></div>
                </div>

                {/* Requirements list */}
                <div className="grid grid-cols-3 gap-1 pt-1">
                  <div className={`flex items-center gap-1 font-caption text-caption ${hasLength ? 'text-success-600 font-medium' : 'text-gray-400'}`}>
                    <span className={`material-symbols-outlined text-[13px] ${hasLength ? 'text-success-600' : 'text-gray-300'}`}>
                      {hasLength ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>8+ chars</span>
                  </div>
                  <div className={`flex items-center gap-1 font-caption text-caption ${hasNumber ? 'text-success-600 font-medium' : 'text-gray-400'}`}>
                    <span className={`material-symbols-outlined text-[13px] ${hasNumber ? 'text-success-600' : 'text-gray-300'}`}>
                      {hasNumber ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>1+ number</span>
                  </div>
                  <div className={`flex items-center gap-1 font-caption text-caption ${hasSymbol ? 'text-success-600 font-medium' : 'text-gray-400'}`}>
                    <span className={`material-symbols-outlined text-[13px] ${hasSymbol ? 'text-success-600' : 'text-gray-300'}`}>
                      {hasSymbol ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>1+ symbol</span>
                  </div>
                </div>
              </div>

              {/* Primary Use Case Dropdown */}
              <div className="flex flex-col gap-space-1">
                <label className="font-label text-label text-gray-600" htmlFor="use-case">
                  Primary Use Case
                </label>
                <div className="relative flex items-center">
                  <select
                    id="use-case"
                    className="w-full h-9 pl-space-3 pr-8 bg-gray-0 text-gray-700 font-body text-body rounded-xl shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition-shadow duration-150 border border-border"
                    required
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                  >
                    <option value="" disabled>Select primary template scenario</option>
                    <option value="invoicing">Invoicing &amp; Receipts</option>
                    <option value="contracts">Contracts &amp; Legal Agreements</option>
                    <option value="certificates">Certificates &amp; Badges</option>
                    <option value="reports">Reports &amp; Analytics</option>
                    <option value="marketing">Automated Marketing Docs</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-2.5 text-gray-400 text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-space-2 pt-1">
                <input
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-brand-500 bg-gray-0 rounded-lg focus:ring-brand-500 focus:ring-offset-0 transition-colors cursor-pointer accent-brand-500"
                  id="terms"
                  required
                  type="checkbox"
                />
                <label className="font-body-sm text-body-sm text-gray-500 leading-snug cursor-pointer select-none" htmlFor="terms">
                  I agree to the <a className="text-brand-500 hover:text-brand-600 font-medium underline underline-offset-2" href="#">Terms of Service</a> and <a className="text-brand-500 hover:text-brand-600 font-medium underline underline-offset-2" href="#">Privacy Policy</a>.
                </label>
              </div>

              <button
                className="w-full h-10 mt-1 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-gray-0 font-label text-body font-semibold rounded-xl shadow-sm transition-all duration-150 flex items-center justify-center gap-space-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 cursor-pointer"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Setting up workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Create Your Free Account</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Testimonial Quote */}
            <div className="mt-space-6 p-space-3 bg-surface-page rounded-xl flex items-start gap-space-3 border border-border">
              <span className="material-symbols-outlined text-brand-500 text-[20px] mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                format_quote
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="font-caption text-caption text-gray-600 italic leading-relaxed">
                  “PdfCraft cut our monthly invoice generation time from 6 hours to 4 seconds.”
                </p>
                <span className="font-caption text-caption text-gray-400 font-medium">
                  — Head of Engineering at Datatape
                </span>
              </div>
            </div>

            <div className="mt-space-5 text-center font-body-sm text-body-sm text-gray-500">
              Already have an account?{' '}
              <Link
                className="text-brand-500 hover:text-brand-600 font-medium underline underline-offset-2 ml-1"
                href="/login"
              >
                Sign in
              </Link>
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
