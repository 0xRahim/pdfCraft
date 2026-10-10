import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "../../lib/router";
import { useAuth } from "../../lib/authContext";
import { GITHUB_URL, GitHubIcon } from "./GitHubIcon";
import { isVercelHost } from "../../lib/host";

const STATS = [
  { icon: "open_in_new", title: "100% open source", sub: "MIT licensed, self-hostable" },
  { icon: "shield", title: "No-JS safe rendering", sub: "XSS-hardened pipeline" },
  { icon: "key", title: "Token API included", sub: "Render PDFs from any app" },
];

export const Hero: React.FC = () => {
  const auth = useAuth();
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative overflow-hidden">
      {/* backdrop mesh + grid, brand tints only */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(560px 320px at 12% 8%, rgba(108,99,208,0.14), transparent 70%), radial-gradient(640px 360px at 88% 18%, rgba(127,119,221,0.12), transparent 70%), radial-gradient(700px 420px at 50% 110%, rgba(108,99,208,0.10), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(44,44,42,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(44,44,42,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(720px 420px at 50% 0%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(720px 420px at 50% 0%, black 30%, transparent 75%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-16 md:pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 h-8 pl-2 pr-3 rounded-full bg-surface-card border border-border shadow-sm mb-6"
        >
          <span className="relative flex w-2 h-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
          </span>
          <span className="font-label text-label text-gray-600">
            Free &amp; open source · MIT · Self-host in minutes
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-semibold tracking-tight text-gray-700 text-[40px] leading-[44px] md:text-[64px] md:leading-[68px]"
        >
          Turn HTML templates
          <br />
          into <span className="text-brand-600">pixel-perfect PDFs</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-2xl mx-auto font-body text-body-lg md:text-[17px] md:leading-[26px] text-gray-500"
        >
          Design reusable templates with <code className="font-mono text-[13px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded">{"{{variables}}"}</code>,
          fill them with dynamic data, and download print-ready documents — or generate bills
          programmatically with per-template API tokens.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          {!isVercelHost() && (
            <Link
              href={auth.isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-label text-label font-medium transition-colors shadow-[0_4px_16px_rgba(108,99,208,0.35)] flex items-center justify-center gap-2"
            >
              <span>{auth.isAuthenticated ? "Open the app" : "Start crafting — it's free"}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          )}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto h-11 px-6 rounded-xl border border-border-strong bg-surface-card hover:bg-surface-hover text-gray-700 font-label text-label font-medium transition-colors flex items-center justify-center gap-2"
          >
            <GitHubIcon />
            <span>Star on GitHub</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left"
        >
          {STATS.map((s) => (
            <div
              key={s.title}
              className="flex items-center gap-3 bg-surface-card border border-border rounded-xl px-4 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            >
              <span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
              </span>
              <span>
                <span className="block font-label text-label text-gray-700 font-semibold">{s.title}</span>
                <span className="block font-caption text-caption text-gray-500">{s.sub}</span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
