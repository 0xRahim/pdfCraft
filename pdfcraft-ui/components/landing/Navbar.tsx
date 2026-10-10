import React, { useEffect, useState } from "react";
import { Link } from "../../lib/router";
import { useAuth } from "../../lib/authContext";
import { GITHUB_URL, GitHubIcon } from "./GitHubIcon";
import { isVercelHost } from "../../lib/host";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#api", label: "API" },
  { href: "#self-host", label: "Self-host" },
];

export const Navbar: React.FC = () => {
  const auth = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface-card/85 backdrop-blur-md border-b border-border shadow-[0_1px_12px_rgba(44,44,42,0.06)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
          </span>
          <span className="font-heading text-heading text-gray-700 font-semibold tracking-tight">
            PdfCraft
          </span>
          <span className="hidden sm:inline font-caption text-caption text-brand-700 bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded font-medium">
            Open source
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-lg font-label text-label text-gray-600 hover:text-gray-700 hover:bg-surface-hover transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="h-9 px-3 rounded-lg border border-border bg-surface-card hover:bg-surface-hover text-gray-700 font-label text-label hidden sm:flex items-center gap-1.5 transition-colors"
          >
            <GitHubIcon />
            <span>Star</span>
          </a>
          {!isVercelHost() && (
            <Link
              href={auth.isAuthenticated ? "/dashboard" : "/register"}
              className="h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-label text-label font-medium transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>{auth.isAuthenticated ? "Open app" : "Start free"}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
