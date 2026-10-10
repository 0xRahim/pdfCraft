import React from "react";
import { Link } from "../../lib/router";
import { Reveal } from "./Reveal";

const FEATURES = [
  {
    icon: "description",
    title: "Reusable HTML templates",
    body: "Author once with {{variables}}, organize by status, and keep every version editable. Starter markup included.",
  },
  {
    icon: "visibility",
    title: "Live preview with sample data",
    body: "See exactly what recipients get. Auto-filled sample values render in a fully sandboxed, script-free frame.",
  },
  {
    icon: "shield",
    title: "XSS defense built in",
    body: "Templates are scanned on save — no scripts, event handlers, or javascript: URLs. Renders run with JS disabled.",
  },
  {
    icon: "picture_as_pdf",
    title: "One-click PDF rendering",
    body: "Fill the variables, hit Generate, and download a print-ready A4 PDF with backgrounds preserved.",
  },
  {
    icon: "key",
    title: "Per-template API tokens",
    body: "Give each integration its own revocable token. POST data, get back a download link for the finished bill.",
  },
  {
    icon: "speed",
    title: "Made for automation",
    body: "Rate-limited public endpoints, missing-variable validation, and copy-paste curl docs for every template.",
  },
];

export const Features: React.FC = () => (
  <section id="features" className="relative">
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
      <Reveal className="text-center">
        <p className="font-label text-label font-semibold tracking-widest text-brand-600 uppercase">Features</p>
        <h2 className="mt-2 font-heading font-semibold tracking-tight text-gray-700 text-[30px] leading-[36px] md:text-[42px] md:leading-[48px]">
          Everything you need to ship documents
        </h2>
        <p className="mt-3 max-w-xl mx-auto font-body text-body-lg text-gray-500">
          From first template to automated billing pipeline — without leaving your stack.
        </p>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={Math.min(i * 0.06, 0.3)}>
            <div className="h-full bg-surface-card border border-border rounded-2xl p-6 hover:shadow-[0_8px_28px_rgba(44,44,42,0.08)] hover:-translate-y-0.5 transition-all duration-300">
              <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">{f.icon}</span>
              </span>
              <h3 className="mt-4 font-heading text-heading-sm text-gray-700 font-semibold">{f.title}</h3>
              <p className="mt-1.5 font-body text-body-sm text-gray-500">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="text-center mt-8">
        <Link
          href="/register"
          className="inline-flex h-10 px-5 rounded-xl border border-border-strong bg-surface-card hover:bg-surface-hover text-gray-700 font-label text-label font-medium transition-colors items-center gap-2"
        >
          <span>Try them all free</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </Reveal>
    </div>
  </section>
);
