import React, { useState } from "react";
import { useRouter, Link } from "../../lib/router";
import { useAuth } from "../../lib/authContext";
import { ApiError } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      await auth.register(email.trim(), password);
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Registration failed";
      setError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-page font-body text-on-surface antialiased min-h-screen flex flex-col justify-center items-center py-space-12 px-space-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="flex items-center gap-space-2 mb-space-8">
          <span className="w-9 h-9 rounded-lg bg-brand-500 text-white flex items-center justify-center font-heading font-semibold">
            P
          </span>
          <span className="font-heading-lg text-heading-lg text-gray-700 tracking-tight font-semibold">
            PdfCraft
          </span>
        </div>

        <main className="w-full bg-surface-card border border-border rounded-xl p-space-8 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col w-full">
            <div className="flex flex-col text-center mb-space-6">
              <h1 className="font-heading-lg text-heading-lg text-gray-700 font-semibold tracking-tight">
                Create your PdfCraft account
              </h1>
              <p className="font-body-sm text-body-sm text-gray-500 mt-space-1">
                Render PDFs from templates with dynamic placeholders.
              </p>
            </div>

            <form className="flex flex-col gap-space-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-space-1">
                <label className="font-label text-label text-gray-600" htmlFor="email">
                  Work Email
                </label>
                <input
                  id="email"
                  className="w-full h-9 px-space-3 bg-gray-0 text-gray-700 font-body text-body rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-150 border border-border"
                  placeholder="name@company.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-space-1">
                <label className="font-label text-label text-gray-600" htmlFor="password">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    className="w-full h-9 pl-space-3 pr-10 bg-gray-0 text-gray-700 font-body text-body rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-150 border border-border"
                    placeholder="Minimum 8 characters"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    aria-label="Toggle password visibility"
                    className="absolute right-0 pr-space-3 flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors cursor-pointer"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-space-1">
                <label className="font-label text-label text-gray-600" htmlFor="confirm">
                  Confirm Password
                </label>
                <input
                  id="confirm"
                  className="w-full h-9 px-space-3 bg-gray-0 text-gray-700 font-body text-body rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-150 border border-border"
                  placeholder="Repeat your password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className="px-space-3 py-space-2 rounded-lg bg-red-50 text-red-700 text-body-sm border border-red-200">
                  {error}
                </div>
              )}

              <button
                className="mt-space-2 w-full h-10 px-space-4 font-label text-label rounded-lg font-medium shadow-sm transition-all duration-150 flex items-center justify-center gap-space-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 cursor-pointer bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <p className="mt-space-6 text-center font-caption text-caption text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
