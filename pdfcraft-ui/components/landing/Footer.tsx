import React from "react";
import { Link } from "../../lib/router";
import { GITHUB_URL, GitHubIcon } from "./GitHubIcon";

const COLS = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Templates", href: "/dashboard/templates" },
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/register" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Developer API", href: "#api" },
      { label: "Self-host", href: "#self-host" },
    ],
  },
];

export const Footer: React.FC = () => (
  <footer className="border-t border-border bg-surface-card">
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
          </span>
          <span className="font-heading text-heading text-gray-700 font-semibold tracking-tight">PdfCraft</span>
        </div>
        <p className="mt-3 max-w-sm font-body text-body-sm text-gray-500">
          The open-source way to turn HTML templates and dynamic data into pixel-perfect PDFs —
          in the browser or via API.
        </p>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex h-9 px-3 rounded-lg border border-border hover:bg-surface-hover text-gray-700 font-label text-label items-center gap-2 transition-colors"
        >
          <GitHubIcon className="w-[16px] h-[16px]" />
          <span>Star on GitHub</span>
        </a>
      </div>
      {COLS.map((c) => (
        <div key={c.title}>
          <h4 className="font-label text-label font-semibold tracking-wider text-gray-400 uppercase">{c.title}</h4>
          <ul className="mt-3 flex flex-col gap-2">
            {c.links.map((l) =>
              l.href.startsWith("#") ? (
                <li key={l.label}>
                  <a href={l.href} className="font-body text-body-sm text-gray-600 hover:text-brand-600 transition-colors">
                    {l.label}
                  </a>
                </li>
              ) : (
                <li key={l.label}>
                  <Link href={l.href} className="font-body text-body-sm text-gray-600 hover:text-brand-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-caption text-caption text-gray-400">PdfCraft · Free &amp; open source (MIT)</span>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="font-caption text-caption text-gray-400 hover:text-brand-600 transition-colors font-mono">
          github.com/0xRahim/pdfCraft
        </a>
      </div>
    </div>
  </footer>
);
