import React, { useState } from "react";
import { Reveal } from "./Reveal";
import { GITHUB_URL, GitHubIcon } from "./GitHubIcon";

const BLOCKS = [
  {
    label: "1 · Clone the repo",
    command: "git clone https://github.com/0xRahim/pdfCraft.git\ncd pdfCraft",
  },
  {
    label: "2 · Run the API  →  http://localhost:3001",
    command: "cd pdfcraft-api\nbun install\nbun run dev",
  },
  {
    label: "3 · Run the UI  →  http://localhost:3000",
    command: "cd pdfcraft-ui\nnpm install\nnpm run dev",
  },
];

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* ignore */
        }
      }}
      className="h-7 px-2.5 rounded-md text-gray-100 hover:bg-white/10 font-label text-label transition-colors flex items-center gap-1 shrink-0"
      aria-label="Copy command"
    >
      <span className="material-symbols-outlined text-[14px]">{copied ? "check" : "content_copy"}</span>
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
};

export const SelfHost: React.FC = () => (
  <section id="self-host" className="relative">
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
      <Reveal className="text-center">
        <p className="font-label text-label font-semibold tracking-widest text-brand-600 uppercase">Open source</p>
        <h2 className="mt-2 font-heading font-semibold tracking-tight text-gray-700 text-[30px] leading-[36px] md:text-[42px] md:leading-[48px]">
          Free forever. Run it yourself.
        </h2>
        <p className="mt-3 max-w-xl mx-auto font-body text-body-lg text-gray-500">
          PdfCraft is open source under MIT. Clone it, self-host it, hack on it — your data never
          has to leave your machine.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
        <Reveal className="lg:col-span-3">
          <div className="h-full rounded-2xl overflow-hidden border border-gray-600 shadow-[0_16px_48px_rgba(44,44,42,0.20)] flex flex-col">
            <div className="flex items-center gap-1.5 bg-gray-700 px-4 py-2.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-danger-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-success-500" />
              <span className="ml-2 font-mono text-[12px] text-gray-300">terminal</span>
            </div>
            <div className="bg-gray-700 border-t border-white/10 p-5 flex flex-col gap-5">
              {BLOCKS.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-label text-label text-gray-300 font-medium">{b.label}</span>
                    <CopyButton text={b.command} />
                  </div>
                  <pre className="font-mono text-[12.5px] leading-[20px] text-gray-100 bg-black/25 rounded-lg p-3 overflow-x-auto whitespace-pre">
                    {b.command}
                  </pre>
                </div>
              ))}
              <p className="font-caption text-caption text-gray-300">
                Demo login is pre-filled: <span className="font-mono">demo@pdfcraft.dev</span> /{" "}
                <span className="font-mono">Demo1234!</span>
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-brand-100 bg-gradient-to-b from-brand-50 to-surface-card p-8 flex flex-col justify-center text-center">
            <span className="mx-auto w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-[0_8px_24px_rgba(108,99,208,0.4)]">
              <GitHubIcon className="w-[24px] h-[24px]" />
            </span>
            <h3 className="mt-4 font-heading text-heading text-gray-700 font-semibold">
              Star, fork, contribute
            </h3>
            <p className="mt-2 font-body text-body-sm text-gray-500">
              Issues and pull requests are welcome. If PdfCraft saves you an afternoon of PDF pain,
              a star keeps the project going.
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-6 h-11 px-6 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-label text-label font-medium transition-colors inline-flex items-center justify-center gap-2"
            >
              <GitHubIcon />
              <span>0xRahim / pdfCraft</span>
            </a>
            <span className="mt-3 font-caption text-caption text-gray-500">MIT licensed · free for commercial use</span>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
