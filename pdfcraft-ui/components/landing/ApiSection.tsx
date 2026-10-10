import React, { useState } from "react";
import { Link } from "../../lib/router";
import { Reveal } from "./Reveal";

const CURL = `# Generate a bill from your own app — token is locked to one template
curl -X POST "https://your-host/api/public/render/<templateId>" \\
  -H "Authorization: Bearer pct_••••••••" \\
  -H "Content-Type: application/json" \\
  -d '{"data": {"customer": "Acme Corp", "amount": "$1,240.00"}}'

# → { "downloadUrl": "/api/public/renders/<file>.pdf", "size": 41740 }

# Download the finished PDF with the same token
curl "https://your-host/api/public/renders/<file>.pdf" \\
  -H "Authorization: Bearer pct_••••••••" -o bill.pdf`;

export const ApiSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — user can select manually */
    }
  };

  return (
    <section id="api" className="relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <Reveal>
          <p className="font-label text-label font-semibold tracking-widest text-brand-600 uppercase">Developer API</p>
          <h2 className="mt-2 font-heading font-semibold tracking-tight text-gray-700 text-[30px] leading-[36px] md:text-[42px] md:leading-[48px]">
            Bills on autopilot, from any stack
          </h2>
          <p className="mt-3 font-body text-body-lg text-gray-500 max-w-md">
            Create a token per template, send dynamic values, and fetch the PDF download link.
            Tokens never expire — revoke anytime from the dashboard.
          </p>
          <ul className="mt-5 flex flex-col gap-2.5">
            {[
              "Scoped to a single template — least privilege by default",
              "Missing-variable validation with clear 400 errors",
              "Rate-limited, XSS-sanitized, JS-disabled rendering",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 font-body text-body-sm text-gray-600">
                <span className="material-symbols-outlined text-[18px] text-success-500 shrink-0">check_circle</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="mt-6 inline-flex h-10 px-5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-label text-label font-medium transition-colors items-center gap-2"
          >
            <span>Get your API token</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="rounded-2xl overflow-hidden border border-gray-600 shadow-[0_16px_48px_rgba(44,44,42,0.25)]">
            <div className="flex items-center justify-between bg-gray-700 px-4 py-2.5">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-danger-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-warning-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-success-500" />
              </div>
              <button
                type="button"
                onClick={copy}
                className="h-7 px-2.5 rounded-md text-gray-100 hover:bg-white/10 font-label text-label transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <pre className="bg-gray-700 text-gray-100 font-mono text-[12.5px] leading-[20px] p-5 overflow-x-auto whitespace-pre border-t border-white/10">
              {CURL}
            </pre>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
