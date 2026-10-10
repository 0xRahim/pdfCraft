import React, { useMemo, useState } from "react";
import type { TemplateWithHtml } from "../lib/api";

/* ---------- shared helpers (client mirror; backend is authoritative) ---------- */

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function extractPlaceholders(html: string): string[] {
  const out: string[] = [];
  const re = /{{\s*([A-Za-z0-9_.-]+)\s*}}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    if (!out.includes(m[1])) out.push(m[1]);
  }
  return out;
}

export function buildDefaultSamples(keys: string[]): Record<string, string> {
  const samples: Record<string, string> = {};
  for (const k of keys) samples[k] = `Sample ${k}`;
  return samples;
}

export function applySampleData(html: string, data: Record<string, string>): string {
  let out = html;
  for (const [key, value] of Object.entries(data)) {
    const re = new RegExp(`{{\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*}}`, "g");
    out = out.replace(re, escapeHtml(value ?? ""));
  }
  return out;
}

/** Lightweight client-side mirror of the backend no-JS policy (instant feedback only). */
export function checkNoActiveContent(html: string): { ok: boolean; reason?: string } {
  const s = html.replace(/&#x([0-9a-fA-F]+);?/g, (_, h) => {
    try {
      return String.fromCharCode(parseInt(h, 16));
    } catch {
      return "";
    }
  });
  const tags = ["script", "iframe", "frame", "frameset", "object", "embed", "applet", "base", "link", "meta", "form"];
  for (const tag of tags) {
    if (new RegExp(`<\\s*/?\\s*${tag}[\\s>/]`, "i").test(s)) {
      return { ok: false, reason: `Forbidden <${tag}> tag is not allowed (no JavaScript).` };
    }
  }
  if (/<[^>]+\s+on\w+\s*=/i.test(s)) {
    return { ok: false, reason: "Event handler attributes (e.g. onclick, onload) are not allowed." };
  }
  if (/(href|src|xlink:href|action|formaction)\s*=\s*["']?\s*(javascript|vbscript|data:text\/html)/i.test(s)) {
    return { ok: false, reason: "Dangerous URL scheme (javascript:/vbscript:/data:) is not allowed." };
  }
  if (/expression\s*\(/i.test(s) || /-moz-binding/i.test(s)) {
    return { ok: false, reason: "CSS expression() is not allowed." };
  }
  return { ok: true };
}

/* ---------- sandboxed iframe preview (JS can never execute here) ---------- */

export const TemplatePreview: React.FC<{ html: string; className?: string }> = ({ html, className }) => (
  <iframe
    title="Template preview"
    sandbox=""
    srcDoc={html}
    className={className ?? "w-full h-[420px] bg-white rounded-lg border border-border"}
  />
);

/* ---------- editable sample-data grid ---------- */

export const SampleDataEditor: React.FC<{
  samples: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}> = ({ samples, onChange }) => {
  const keys = Object.keys(samples);
  if (keys.length === 0) {
    return <p className="text-caption text-gray-400">No variables detected in this template.</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {keys.map((k) => (
        <div key={k} className="flex flex-col gap-1">
          <label className="font-label text-label text-gray-600">
            <code className="font-mono text-caption text-brand-600">{`{{${k}}}`}</code>
          </label>
          <input
            type="text"
            value={samples[k] ?? ""}
            onChange={(e) => onChange({ ...samples, [k]: e.target.value })}
            className="h-9 px-3 rounded-lg border border-border bg-gray-0 text-gray-700 font-body text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder={`Sample value for ${k}`}
          />
        </div>
      ))}
    </div>
  );
};

/* ---------- read-only preview modal for existing templates ---------- */

interface PreviewModalProps {
  template: TemplateWithHtml | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TemplatePreviewModal: React.FC<PreviewModalProps> = ({ template, isOpen, onClose }) => {
  const placeholders = useMemo(
    () => (template ? extractPlaceholders(template.html) : []),
    [template?.html]
  );
  const declared = template?.variables || [];
  const allKeys = useMemo(
    () => [...new Set([...declared, ...placeholders])],
    [template?.id, template?.html]
  );
  const [samples, setSamples] = useState<Record<string, string> | null>(null);
  const effective = samples ?? buildDefaultSamples(allKeys);
  const rendered = useMemo(
    () => (template ? applySampleData(template.html, effective) : ""),
    [template?.html, effective]
  );
  const check = useMemo(() => checkNoActiveContent(template?.html ?? ""), [template?.html]);

  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-surface-card rounded-2xl border border-border shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="font-heading text-heading text-gray-700 font-semibold">
              Preview: {template.title}
            </h2>
            <p className="font-caption text-caption text-gray-500">
              Rendered with sample data. JavaScript never executes in preview.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSamples(null);
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close preview"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="px-6 py-4 flex-1 overflow-y-auto flex flex-col gap-4">
          {!check.ok && (
            <div className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-body-sm border border-red-200">
              Blocked: {check.reason} This template cannot be saved until it is removed.
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-label text-label text-gray-600">Sample data</h3>
              <button
                type="button"
                onClick={() => setSamples(buildDefaultSamples(allKeys))}
                className="font-label text-label text-brand-600 hover:text-brand-700"
              >
                Reset samples
              </button>
            </div>
            <SampleDataEditor samples={effective} onChange={setSamples} />
          </div>
          <div>
            <h3 className="font-label text-label text-gray-600 mb-2">Preview</h3>
            <TemplatePreview html={rendered} />
          </div>
        </div>
        <div className="px-6 py-3 border-t border-border flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              setSamples(null);
              onClose();
            }}
            className="h-9 px-4 rounded-lg border border-border hover:bg-surface-hover text-gray-700 font-label text-label"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
