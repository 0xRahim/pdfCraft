import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Reveal } from "./Reveal";

/* ---------- small presentational pieces (DOM mock-ups, no assets) ---------- */

const CodeLine: React.FC<{ children: React.ReactNode; indent?: number }> = ({ children, indent = 0 }) => (
  <div className="font-mono text-[12px] leading-[20px] text-gray-600 whitespace-nowrap" style={{ paddingLeft: indent * 14 }}>
    {children}
  </div>
);

const VarChip: React.FC<{ label: string }> = ({ label }) => (
  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-100">
    {`{{${label}}}`}
  </span>
);

const StageCard: React.FC<{
  kicker: string;
  title: string;
  icon: string;
  accent?: boolean;
  children: React.ReactNode;
}> = ({ kicker, title, icon, accent, children }) => (
  <div
    className={`rounded-2xl border bg-surface-card p-4 text-left shadow-[0_8px_32px_rgba(44,44,42,0.10)] ${
      accent ? "border-brand-400/50" : "border-border"
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="font-caption text-[10px] font-semibold tracking-widest text-gray-400">{kicker}</span>
      <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-600"}`}>
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
      </span>
    </div>
    <div className="font-mono text-[12px] text-gray-500 mb-2">{title}</div>
    {children}
  </div>
);

const HtmlBody: React.FC = () => (
  <>
    <div className="flex flex-col gap-1 py-1">
      <CodeLine><span className="text-gray-400">&lt;h1&gt;</span> Bill for <VarChip label="customer" /> <span className="text-gray-400">&lt;/h1&gt;</span></CodeLine>
      <CodeLine><span className="text-gray-400">&lt;p&gt;</span> Amount <VarChip label="amount" /> <span className="text-gray-400">&lt;/p&gt;</span></CodeLine>
      <CodeLine><span className="text-gray-400">&lt;p&gt;</span> Due <VarChip label="due_date" /> <span className="text-gray-400">&lt;/p&gt;</span></CodeLine>
    </div>
    <div className="mt-3 flex items-center gap-1.5 font-caption text-caption text-gray-500">
      <span className="material-symbols-outlined text-[14px] text-success-500">check_circle</span>
      <span>No JavaScript — XSS scan passed</span>
    </div>
  </>
);

const DATA_ROWS: Array<[string, string]> = [
  ["customer", "Acme Corp"],
  ["amount", "$1,240.00"],
  ["due_date", "Nov 01, 2026"],
];

const DataBody: React.FC<{ filled: boolean }> = ({ filled }) => (
  <>
    <div className="flex flex-col gap-1.5 py-1">
      {DATA_ROWS.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between gap-2 font-mono text-[12px]">
          <span className="text-brand-700">“{k}”</span>
          <span className="text-gray-700">{filled ? `“${v}”` : <span className="text-gray-300">“······”</span>}</span>
        </div>
      ))}
    </div>
    <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
      <div className={`h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500 ${filled ? "w-full" : "w-1/4"}`} />
    </div>
    <div className="mt-1.5 font-caption text-caption text-gray-500">
      {filled ? "Placeholders filled & escaped" : "Filling placeholders…"}
    </div>
  </>
);

const PdfBody: React.FC = () => (
  <>
    <div className="bg-surface-page border border-border rounded-lg p-3">
      <div className="font-heading text-[14px] font-semibold text-gray-700">Bill for Acme Corp</div>
      <div className="mt-1 font-body text-[12px] text-gray-500">Amount: $1,240.00 · Due Nov 01, 2026</div>
      <div className="mt-2 h-px bg-border" />
      <div className="mt-2 flex items-center justify-between">
        <span className="font-caption text-caption text-gray-400">A4 · 1 page · 41 KB</span>
        <span className="w-6 h-6 rounded-full bg-success-500 text-white flex items-center justify-center">
          <span className="material-symbols-outlined text-[14px]">check</span>
        </span>
      </div>
    </div>
    <div className="mt-3 h-9 rounded-lg bg-brand-500 text-white font-label text-label font-medium flex items-center justify-center gap-1.5">
      <span className="material-symbols-outlined text-[16px]">download</span>
      <span>Download PDF</span>
    </div>
  </>
);

/* ---------- scroll-driven stage ---------- */

const STEPS = [
  { n: "01", title: "Design the template", sub: "Write HTML once, drop in {{variables}} anywhere." },
  { n: "02", title: "Fill dynamic data", sub: "Send JSON per document — values are escaped & safe." },
  { n: "03", title: "Get the PDF", sub: "Print-ready A4 in seconds, via UI or API token." },
];

function AnimatedCard({
  highlight,
  lift,
  children,
}: {
  highlight: MotionValue<number>;
  lift: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div style={{ opacity: highlight, y: lift }} className="w-[300px] shrink-0">
      {children}
    </motion.div>
  );
}

export const PipelineDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // With reduced motion, freeze the story at its final (filled) state.
  const end = useTransform(scrollYProgress, () => 1);
  const p = reduce ? end : scrollYProgress;

  const fillB = useTransform(p, [0.32, 0.62], [0, 1]);
  const fillC = useTransform(p, [0.6, 0.92], [0, 1]);
  const filledB = useTransform(fillB, (v) => v > 0.6);
  const hlA = useTransform(p, [0, 0.12, 0.4], [1, 1, 0.45]);
  const hlB = useTransform(p, [0.18, 0.34, 0.62, 0.78], [0.45, 1, 1, 0.45]);
  const hlC = useTransform(p, [0.5, 0.68, 1], [0.45, 1, 1]);
  const liftOf = (hl: MotionValue<number>) => useTransform(hl, [0.35, 1], [14, 0]);
  const dotLeft = useTransform(p, [0.05, 0.95], ["4%", "96%"]);
  const stepA = useTransform(p, [0, 0.3], [1, 0.35]);
  const stepB = useTransform(p, [0.25, 0.4, 0.6, 0.75], [0.35, 1, 1, 0.35]);
  const stepC = useTransform(p, [0.55, 0.72], [0.35, 1]);
  const pdfScale = useTransform(fillC, [0, 1], [0.94, 1]);

  return (
    <section id="how-it-works" className="relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-20 md:pt-28 pb-8 text-center">
        <Reveal>
          <p className="font-label text-label font-semibold tracking-widest text-brand-600 uppercase">How it works</p>
          <h2 className="mt-2 font-heading font-semibold tracking-tight text-gray-700 text-[30px] leading-[36px] md:text-[42px] md:leading-[48px]">
            HTML in. Data in. PDF out.
          </h2>
          <p className="mt-3 max-w-xl mx-auto font-body text-body-lg text-gray-500">
            Scroll to watch a template transform into a finished document.
          </p>
        </Reveal>
      </div>

      {/* desktop sticky stage */}
      <div ref={ref} className="relative hidden md:block h-[260vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-8">
          <div className="w-full max-w-5xl">
            <div className="h-1 rounded-full bg-gray-150 overflow-hidden mb-10">
              <motion.div style={{ scaleX: p }} className="h-full w-full origin-left bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />
            </div>
            <div className="relative">
              <div className="absolute top-1/2 left-[6%] right-[6%] h-px bg-border-strong/60" aria-hidden="true" />
              <motion.div
                style={{ left: dotLeft }}
                aria-hidden="true"
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-brand-500 shadow-[0_0_0_6px_rgba(108,99,208,0.18)]"
              />
              <div className="relative flex items-start justify-between gap-6">
                <AnimatedCard highlight={hlA} lift={liftOf(hlA)}>
                  <StageCard kicker="STEP 1 · TEMPLATE" title="invoice.html" icon="code">
                    <HtmlBody />
                  </StageCard>
                </AnimatedCard>
                <AnimatedCard highlight={hlB} lift={liftOf(hlB)}>
                  <StageCard kicker="STEP 2 · DYNAMIC DATA" title="data.json" icon="data_object">
                    <AnimatedDataBody filled={filledB} />
                  </StageCard>
                </AnimatedCard>
                <motion.div style={{ opacity: hlC, y: liftOf(hlC), scale: pdfScale }} className="w-[300px] shrink-0">
                  <StageCard kicker="STEP 3 · RENDERED PDF" title="invoice.pdf" icon="picture_as_pdf" accent>
                    <PdfBody />
                  </StageCard>
                </motion.div>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[stepA, stepB, stepC].map((o, i) => (
                <motion.div key={STEPS[i].n} style={{ opacity: o }} className="text-left">
                  <div className="font-mono text-[12px] text-brand-600 font-semibold">{STEPS[i].n}</div>
                  <div className="mt-1 font-heading text-heading-sm text-gray-700 font-semibold">{STEPS[i].title}</div>
                  <div className="mt-1 font-body text-body-sm text-gray-500">{STEPS[i].sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* mobile static fallback */}
      <div className="md:hidden px-4 pb-4 flex flex-col gap-4 max-w-md mx-auto">
        <StageCard kicker="STEP 1 · TEMPLATE" title="invoice.html" icon="code">
          <HtmlBody />
        </StageCard>
        <div className="flex justify-center text-gray-300" aria-hidden="true">
          <span className="material-symbols-outlined">arrow_downward</span>
        </div>
        <StageCard kicker="STEP 2 · DYNAMIC DATA" title="data.json" icon="data_object">
          <DataBody filled />
        </StageCard>
        <div className="flex justify-center text-gray-300" aria-hidden="true">
          <span className="material-symbols-outlined">arrow_downward</span>
        </div>
        <StageCard kicker="STEP 3 · RENDERED PDF" title="invoice.pdf" icon="picture_as_pdf" accent>
          <PdfBody />
        </StageCard>
        <div className="flex flex-col gap-3 mt-2">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-surface-card border border-border rounded-xl p-4 text-left">
              <div className="font-mono text-[12px] text-brand-600 font-semibold">{s.n}</div>
              <div className="mt-1 font-heading text-heading-sm text-gray-700 font-semibold">{s.title}</div>
              <div className="mt-1 font-body text-body-sm text-gray-500">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

function AnimatedDataBody({ filled }: { filled: MotionValue<boolean> }) {
  const showFilled = useTransform(filled, (v) => (v ? 1 : 0));
  const showEmpty = useTransform(filled, (v) => (v ? 0 : 1));
  const bar = useTransform(filled, (v) => (v ? "100%" : "25%"));
  const caption = useTransform(filled, (v) => (v ? 1 : 0));
  return (
    <>
      <div className="flex flex-col gap-1.5 py-1">
        {DATA_ROWS.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-2 font-mono text-[12px]">
            <span className="text-brand-700 min-w-0 truncate">“{k}”</span>
            <span className="grid shrink-0 text-right text-gray-700">
              <motion.span style={{ opacity: showEmpty }} className="col-start-1 row-start-1 whitespace-nowrap text-gray-300">“······”</motion.span>
              <motion.span style={{ opacity: showFilled }} className="col-start-1 row-start-1 whitespace-nowrap">“{v}”</motion.span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <motion.div style={{ width: bar }} className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" />
      </div>
      <div className="grid mt-1.5 font-caption text-caption text-gray-500">
        <motion.span style={{ opacity: showEmpty }} className="col-start-1 row-start-1 whitespace-nowrap">Filling placeholders…</motion.span>
        <motion.span style={{ opacity: caption }} className="col-start-1 row-start-1 whitespace-nowrap">Placeholders filled &amp; escaped</motion.span>
      </div>
    </>
  );
}
