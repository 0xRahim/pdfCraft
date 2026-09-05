import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { TemplateRendererModal } from '../../components/TemplateRendererModal';
import { INITIAL_MY_TEMPLATES } from '../../data/mockData';
import { Template } from '../../types';

interface GenerationRecord {
  id: string;
  documentTitle: string;
  templateName: string;
  trigger: 'API' | 'Webhook' | 'Manual';
  variables: { label: string; isError?: boolean }[];
  extraVarsCount?: number;
  timestamp: string;
  status: 'Success' | 'Processing' | 'Failed';
  payload: Record<string, any>;
}

const INITIAL_GENERATIONS: GenerationRecord[] = [
  {
    id: 'gen_8bf29c30e',
    documentTitle: 'Monthly Invoice #INV-2024-889',
    templateName: 'Tax Invoice Classic',
    trigger: 'API',
    variables: [{ label: '{{invoice_no}}' }],
    extraVarsCount: 2,
    timestamp: 'Just now',
    status: 'Success',
    payload: {
      invoice_no: 'INV-2024-889',
      issue_date: '2024-11-18',
      due_date: '2024-12-18',
      client_company: 'Acme Corp Inc.',
      vat_total: '$1,420.00 USD',
      render_vector_qr: true,
    },
  },
  {
    id: 'gen_14da07bc4',
    documentTitle: 'Employment Contract - M. Rivera',
    templateName: 'Executive Agreement',
    trigger: 'Webhook',
    variables: [{ label: '{{name}}' }, { label: '{{role}}' }],
    timestamp: '3m ago',
    status: 'Success',
    payload: {
      name: 'Manuel Rivera',
      role: 'Staff Infrastructure Architect',
      effective_date: '2024-12-01',
      salary: '$185,000 / yr',
      signoff_state: 'Pending Counter-Signature',
    },
  },
  {
    id: 'gen_8091dd211',
    documentTitle: 'Certificate of Completion - React',
    templateName: 'Event Ticket & QR Badge',
    trigger: 'Manual',
    variables: [{ label: '{{student_id}}' }],
    timestamp: '8m ago',
    status: 'Processing',
    payload: {
      student_id: 'STU-9941-R',
      student_name: 'Elena Vance',
      course_name: 'Full-Stack Vector Engine Architecture',
      issue_authority: 'PdfCraft Academy',
    },
  },
  {
    id: 'gen_228fa40a7',
    documentTitle: 'Quarterly Financial Summary Q3',
    templateName: 'Executive Agreement',
    trigger: 'API',
    variables: [{ label: '{{fiscal_yr}}' }],
    extraVarsCount: 4,
    timestamp: '22m ago',
    status: 'Success',
    payload: {
      fiscal_yr: 'FY2024-Q3',
      revenue: '$4,280,000',
      ebitda_margin: '34.2%',
      prepared_by: 'Global Financial Accounting',
    },
  },
  {
    id: 'gen_ff9012a93',
    documentTitle: 'Shipping Slip #PK-99120',
    templateName: 'Tax Invoice Classic',
    trigger: 'Webhook',
    variables: [{ label: 'Missing {{tracking}}', isError: true }],
    timestamp: '47m ago',
    status: 'Failed',
    payload: {
      order_id: 'PK-99120',
      warehouse_id: 'WH-US-EAST',
      recipient: 'Datatape Global Logistics',
      error_message: 'Field {{tracking}} was null or undefined in webhook payload.',
    },
  },
];

export default function DashboardPage() {
  const router = useRouter();

  // Generations table state
  const [generations, setGenerations] = useState<GenerationRecord[]>(INITIAL_GENERATIONS);
  const [triggerFilter, setTriggerFilter] = useState('All Triggers');
  const [selectedPayloadRecord, setSelectedPayloadRecord] = useState<GenerationRecord | null>(null);
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<Template | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [isRunningDryRun, setIsRunningDryRun] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Integrations active toggles
  const [integrationStates, setIntegrationStates] = useState({
    stripe: true,
    zapier: true,
    webhook: true,
    salesforce: false,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopySnippet = () => {
    const snippet = `{\n  "invoice_id": "INV-2024-889",\n  "recipient": "Acme Corp Inc.",\n  "items_count": 4,\n  "currency": "USD",\n  "render_vector_qr": true\n}`;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    showToast('JSON payload test snippet copied to clipboard');
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleExecuteDryRun = () => {
    setIsRunningDryRun(true);
    setTimeout(() => {
      setIsRunningDryRun(false);
      showToast('Payload dry-run passed: 100% placeholder keys resolved in 284ms');
      setActivePreviewTemplate(INITIAL_MY_TEMPLATES[0]);
    }, 800);
  };

  const handleReRun = (id: string) => {
    setGenerations((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: 'Processing' as const } : g))
    );
    showToast(`Re-running compilation pipeline for ${id}...`);
    setTimeout(() => {
      setGenerations((prev) =>
        prev.map((g) =>
          g.id === id
            ? {
                ...g,
                status: 'Success' as const,
                timestamp: 'Just now',
                variables:
                  g.id === 'gen_ff9012a93'
                    ? [{ label: '{{tracking}}' }, { label: '{{order_id}}' }]
                    : g.variables,
              }
            : g
        )
      );
      showToast(`Document ${id} successfully rendered and cached to edge CDN`);
    }, 1200);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,ID,Document,Template,Trigger,Status,Timestamp\n' +
      generations
        .map(
          (g) =>
            `"${g.id}","${g.documentTitle}","${g.templateName}","${g.trigger}","${g.status}","${g.timestamp}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'pdfcraft-generations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported recent generates to CSV');
  };

  const filteredGenerations = generations.filter((g) => {
    if (triggerFilter === 'REST API') return g.trigger === 'API';
    if (triggerFilter === 'Webhook') return g.trigger === 'Webhook';
    if (triggerFilter === 'Manual UI') return g.trigger === 'Manual';
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto gap-space-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-4 right-4 sm:left-auto sm:right-8 z-50 max-w-sm sm:ml-auto bg-gray-700 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 border border-gray-600 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-success-500 text-[18px] shrink-0">check_circle</span>
          <span className="font-label text-label break-words">{toastMessage}</span>
        </div>
      )}

      {/* Page Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-4 pb-space-6 border-b border-border">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-2">
            <h1 className="font-heading-lg text-heading-lg text-gray-700 font-semibold tracking-tight">
              Dashboard Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-caption text-caption font-medium bg-success-50 text-success-600">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse"></span>
              Engine Live
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-gray-500 mt-space-1 max-w-prose">
            Monitor PDF generations, active templates, and connected integrations across workspaces.
          </p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-4 pt-space-6">
        {/* Metric 1 */}
        <div className="bg-surface-card border border-border rounded-xl p-space-4 flex flex-col justify-between shadow-sm hover:border-border-strong transition-all">
          <div className="flex items-start justify-between">
            <span className="font-label text-label text-gray-500">Total PDFs Generated</span>
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            </span>
          </div>
          <div className="mt-space-3 flex items-end justify-between">
            <span className="font-display text-display text-gray-700 tracking-tight font-semibold">
              142,850
            </span>
            <div className="h-6 w-20 flex items-end gap-1 shrink-0">
              <span className="w-1.5 bg-brand-100 rounded-t h-2"></span>
              <span className="w-1.5 bg-brand-100 rounded-t h-3"></span>
              <span className="w-1.5 bg-brand-100 rounded-t h-4"></span>
              <span className="w-1.5 bg-brand-100 rounded-t h-3"></span>
              <span className="w-1.5 bg-brand-400 rounded-t h-5"></span>
              <span className="w-1.5 bg-brand-500 rounded-t h-6"></span>
            </div>
          </div>
          <div className="mt-space-2 flex items-center gap-space-1">
            <span className="inline-flex items-center text-[11px] font-medium text-success-600 bg-success-50 px-1.5 py-0.5 rounded">
              <span className="material-symbols-outlined text-[13px] mr-0.5">trending_up</span>
              +14.2%
            </span>
            <span className="font-caption text-caption text-gray-400">vs last month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-card border border-border rounded-xl p-space-4 flex flex-col justify-between shadow-sm hover:border-border-strong transition-all">
          <div className="flex items-start justify-between">
            <span className="font-label text-label text-gray-500">Active Templates</span>
            <span className="p-1.5 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">style</span>
            </span>
          </div>
          <div className="mt-space-3 flex items-baseline gap-space-2">
            <span className="font-display text-display text-gray-700 tracking-tight font-semibold">
              38
            </span>
            <span className="font-caption text-caption px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
              4 drafts
            </span>
          </div>
          <div className="mt-space-2 flex items-center gap-space-1">
            <span className="inline-flex items-center text-[11px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
              +3 added
            </span>
            <span className="font-caption text-caption text-gray-400">past 14 days</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-card border border-border rounded-xl p-space-4 flex flex-col justify-between shadow-sm hover:border-border-strong transition-all">
          <div className="flex items-start justify-between">
            <span className="font-label text-label text-gray-500">Render Success Rate</span>
            <span className="p-1.5 rounded-lg bg-success-50 text-success-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            </span>
          </div>
          <div className="mt-space-3 flex items-baseline justify-between">
            <span className="font-display text-display text-gray-700 tracking-tight font-semibold">
              99.94%
            </span>
            <span className="font-caption text-caption font-mono text-gray-500">p95: 310ms</span>
          </div>
          <div className="mt-space-2 flex items-center gap-space-1">
            <span className="inline-flex items-center text-[11px] font-medium text-success-600 bg-success-50 px-1.5 py-0.5 rounded">
              +0.02%
            </span>
            <span className="font-caption text-caption text-gray-400">zero downtime</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-card border border-border rounded-xl p-space-4 flex flex-col justify-between shadow-sm hover:border-border-strong transition-all">
          <div className="flex items-start justify-between">
            <span className="font-label text-label text-gray-500">Connected Integrations</span>
            <span className="p-1.5 rounded-lg bg-info-50 text-info-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </span>
          </div>
          <div className="mt-space-3 flex items-center gap-space-2">
            <span className="font-display text-display text-gray-700 tracking-tight font-semibold">
              9 Active
            </span>
            <div className="flex -space-x-1 items-center shrink-0">
              <span className="w-4 h-4 rounded-full bg-brand-500 border border-surface-card flex items-center justify-center text-[8px] text-gray-0 font-bold">
                S
              </span>
              <span className="w-4 h-4 rounded-full bg-warning-400 border border-surface-card flex items-center justify-center text-[8px] text-gray-0 font-bold">
                Z
              </span>
              <span className="w-4 h-4 rounded-full bg-info-400 border border-surface-card flex items-center justify-center text-[8px] text-gray-0 font-bold">
                W
              </span>
            </div>
          </div>
          <div className="mt-space-2 flex items-center gap-space-1">
            <span className="w-2 h-2 rounded-full bg-success-500"></span>
            <span className="font-caption text-caption text-gray-500 font-medium">
              All webhooks responding &lt;200ms
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="pt-space-4 pb-space-6">
        <div className="bg-surface-card border border-border rounded-xl p-space-3 flex flex-wrap items-center justify-between gap-space-2 shadow-xs">
          <div className="flex items-center gap-space-2 pl-space-1">
            <span className="font-label text-label font-semibold text-gray-600 uppercase tracking-wider">
              Quick Actions:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-space-2">
            <button
              onClick={() => router.push('/dashboard/builder')}
              className="inline-flex items-center gap-1.5 px-space-3 py-1.5 rounded-lg bg-gray-50 hover:bg-surface-hover border border-border font-label text-label text-gray-700 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-brand-500">code_blocks</span>
              <span>Upload HTML/CSS Template</span>
            </button>
            <button
              onClick={handleExecuteDryRun}
              className="inline-flex items-center gap-1.5 px-space-3 py-1.5 rounded-lg bg-gray-50 hover:bg-surface-hover border border-border font-label text-label text-gray-700 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-info-600">data_object</span>
              <span>Test Dynamic Payload</span>
            </button>
            <button
              onClick={() => showToast('Dispatched batch PDF queue: 25 documents processing across 4 parallel render pods')}
              className="inline-flex items-center gap-1.5 px-space-3 py-1.5 rounded-lg bg-gray-50 hover:bg-surface-hover border border-border font-label text-label text-gray-700 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-warning-600">batch_prediction</span>
              <span>Run Batch PDF Run</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/integrations?tab=logs')}
              className="inline-flex items-center gap-1.5 px-space-3 py-1.5 rounded-lg bg-gray-50 hover:bg-surface-hover border border-border font-label text-label text-gray-700 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-gray-500">monitoring</span>
              <span>View API Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-6 min-w-0">
          {/* Recent PDF Generates Table */}
          <div className="bg-surface-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-space-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-space-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-heading text-gray-700 font-semibold">
                    Recent PDF Generates
                  </h2>
                  <span className="font-caption text-caption bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                    Live Sync
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-gray-500">
                  Real-time compilation logs and trigger tracking.
                </p>
              </div>

              <div className="flex items-center gap-space-2">
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-2 text-[15px] text-gray-400 pointer-events-none">
                    filter_alt
                  </span>
                  <select
                    value={triggerFilter}
                    onChange={(e) => setTriggerFilter(e.target.value)}
                    className="h-8 pl-7 pr-7 font-label text-label bg-surface-page border border-border rounded-lg text-gray-700 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer"
                  >
                    <option>All Triggers</option>
                    <option>REST API</option>
                    <option>Webhook</option>
                    <option>Manual UI</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-1.5 text-[16px] text-gray-400 pointer-events-none">
                    expand_more
                  </span>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="h-8 px-2.5 rounded-lg bg-surface-page border border-border hover:bg-surface-hover text-gray-600 flex items-center gap-1 font-label text-label transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">file_download</span>
                  <span>CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-page border-b border-border text-gray-500 font-label text-label">
                    <th className="py-space-3 px-space-4 font-medium">Document &amp; ID</th>
                    <th className="py-space-3 px-space-3 font-medium">Template</th>
                    <th className="py-space-3 px-space-3 font-medium">Trigger</th>
                    <th className="py-space-3 px-space-3 font-medium">Variables</th>
                    <th className="py-space-3 px-space-3 font-medium">Timestamp</th>
                    <th className="py-space-3 px-space-3 font-medium">Status</th>
                    <th className="py-space-3 px-space-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-body-sm text-body-sm">
                  {filteredGenerations.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-hover transition-colors group">
                      <td className="py-space-3 px-space-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700 group-hover:text-brand-600 transition-colors">
                            {item.documentTitle}
                          </span>
                          <span className="font-caption text-caption text-gray-400 font-mono">
                            {item.id}
                          </span>
                        </div>
                      </td>

                      <td className="py-space-3 px-space-3 text-gray-600">{item.templateName}</td>

                      <td className="py-space-3 px-space-3">
                        {item.trigger === 'API' && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 font-caption text-caption font-medium">
                            <span className="material-symbols-outlined text-[12px]">api</span>
                            API
                          </span>
                        )}
                        {item.trigger === 'Webhook' && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-info-50 text-info-600 font-caption text-caption font-medium">
                            <span className="material-symbols-outlined text-[12px]">webhook</span>
                            Webhook
                          </span>
                        )}
                        {item.trigger === 'Manual' && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-warning-50 text-warning-600 font-caption text-caption font-medium">
                            <span className="material-symbols-outlined text-[12px]">touch_app</span>
                            Manual
                          </span>
                        )}
                      </td>

                      <td className="py-space-3 px-space-3">
                        <div className="flex items-center gap-1 flex-wrap max-w-[140px]">
                          {item.variables.map((v, i) => (
                            <span
                              key={i}
                              className={`font-caption text-caption font-mono px-1 py-0.5 rounded ${
                                v.isError
                                  ? 'bg-danger-50 text-danger-600 font-semibold'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {v.label}
                            </span>
                          ))}
                          {item.extraVarsCount && (
                            <span className="font-caption text-caption font-mono bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                              +{item.extraVarsCount}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-space-3 px-space-3 text-gray-500 font-mono text-[12px]">
                        {item.timestamp}
                      </td>

                      <td className="py-space-3 px-space-3">
                        {item.status === 'Success' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded font-caption text-caption font-medium bg-success-50 text-success-600">
                            Success
                          </span>
                        )}
                        {item.status === 'Processing' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-caption text-caption font-medium bg-warning-50 text-warning-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-warning-400 animate-pulse"></span>
                            Processing
                          </span>
                        )}
                        {item.status === 'Failed' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded font-caption text-caption font-medium bg-danger-50 text-danger-600">
                            Failed
                          </span>
                        )}
                      </td>

                      <td className="py-space-3 px-space-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {item.status === 'Success' && (
                            <button
                              onClick={() => setActivePreviewTemplate(INITIAL_MY_TEMPLATES[0])}
                              className="p-1 rounded text-gray-400 hover:text-brand-500 hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Download / View PDF"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">download</span>
                            </button>
                          )}
                          {item.status === 'Processing' && (
                            <button
                              onClick={() => handleReRun(item.id)}
                              className="p-1 rounded text-gray-400 hover:text-brand-500 hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Reload / Re-run"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">sync</span>
                            </button>
                          )}
                          {item.status === 'Failed' && (
                            <button
                              onClick={() => handleReRun(item.id)}
                              className="p-1 rounded text-gray-400 hover:text-danger-600 hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Re-run with fixed payload"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">refresh</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedPayloadRecord(item)}
                            className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                            title="View Payload"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">code</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-space-3 bg-surface-card border-t border-border flex items-center justify-between font-label text-label text-gray-500">
              <span>Showing {filteredGenerations.length} of 1,420 entries today</span>
              <div className="flex items-center gap-1">
                <button
                  className="px-2 py-1 rounded border border-border bg-surface-page hover:bg-surface-hover text-gray-600 disabled:opacity-50 cursor-not-allowed"
                  disabled
                  type="button"
                >
                  Previous
                </button>
                <button
                  onClick={() => showToast('Page 2: Loading historical compilation archives...')}
                  className="px-2 py-1 rounded border border-border bg-surface-page hover:bg-surface-hover text-gray-700 cursor-pointer"
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Popular PDF Templates */}
          <div className="flex flex-col gap-space-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-heading text-gray-700 font-semibold">
                  Popular PDF Templates
                </h2>
                <p className="font-body-sm text-body-sm text-gray-500">
                  Most requested production templates this billing cycle.
                </p>
              </div>
              <button
                onClick={() => router.push('/dashboard/templates')}
                className="font-label text-label text-brand-600 hover:text-brand-700 font-medium flex items-center gap-0.5 cursor-pointer"
              >
                <span>View all 38</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-4">
              {/* Card 1: Tax Invoice Classic */}
              <div
                onClick={() => setActivePreviewTemplate(INITIAL_MY_TEMPLATES[0])}
                className="bg-surface-card border border-border rounded-xl p-space-4 flex flex-col justify-between shadow-sm hover:border-brand-500 transition-all group cursor-pointer"
              >
                <div>
                  <div className="h-28 rounded-lg bg-surface-page border border-border flex items-center justify-center p-space-3 relative overflow-hidden mb-space-3">
                    <div className="w-20 h-24 bg-surface-card rounded shadow-sm border border-border-strong p-2 flex flex-col gap-1.5 group-hover:scale-105 transition-transform">
                      <div className="w-6 h-1.5 bg-brand-500 rounded-sm"></div>
                      <div className="w-14 h-1 bg-gray-200 rounded-sm"></div>
                      <div className="w-10 h-1 bg-gray-200 rounded-sm"></div>
                      <div className="mt-auto flex justify-between items-center">
                        <div className="w-4 h-1 bg-gray-300 rounded-sm"></div>
                        <div className="w-4 h-1.5 bg-success-500 rounded-sm"></div>
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-surface-card border border-border font-caption text-caption text-gray-500">
                      v3.2
                    </span>
                  </div>
                  <h3 className="font-heading-sm text-heading-sm text-gray-700 font-medium group-hover:text-brand-600 transition-colors">
                    Tax Invoice Classic
                  </h3>
                  <p className="font-caption text-caption text-gray-500 mt-1">
                    International VAT compliance &amp; multi-currency calculation engine.
                  </p>
                </div>
                <div className="mt-space-4 pt-space-3 border-t border-border flex items-center justify-between font-caption text-caption text-gray-500">
                  <span className="font-mono">8 vars • 42.1k gens</span>
                  <span className="text-gray-400">2d ago</span>
                </div>
              </div>

              {/* Card 2: Executive Agreement */}
              <div
                onClick={() => setActivePreviewTemplate(INITIAL_MY_TEMPLATES[1])}
                className="bg-surface-card border border-border rounded-xl p-space-4 flex flex-col justify-between shadow-sm hover:border-brand-500 transition-all group cursor-pointer"
              >
                <div>
                  <div className="h-28 rounded-lg bg-surface-page border border-border flex items-center justify-center p-space-3 relative overflow-hidden mb-space-3">
                    <div className="w-20 h-24 bg-surface-card rounded shadow-sm border border-border-strong p-2 flex flex-col gap-1.5 group-hover:scale-105 transition-transform">
                      <div className="w-8 h-1.5 bg-gray-700 rounded-sm"></div>
                      <div className="w-16 h-1 bg-gray-200 rounded-sm"></div>
                      <div className="w-14 h-1 bg-gray-200 rounded-sm"></div>
                      <div className="w-12 h-1 bg-gray-200 rounded-sm"></div>
                      <div className="mt-auto border-t border-dashed border-gray-300 pt-1 flex justify-between items-center">
                        <span className="material-symbols-outlined text-[12px] text-brand-500">draw</span>
                        <div className="w-6 h-1 bg-gray-400 rounded-sm"></div>
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-surface-card border border-border font-caption text-caption text-gray-500">
                      v1.8
                    </span>
                  </div>
                  <h3 className="font-heading-sm text-heading-sm text-gray-700 font-medium group-hover:text-brand-600 transition-colors">
                    Executive Agreement
                  </h3>
                  <p className="font-caption text-caption text-gray-500 mt-1">
                    Multi-page legally formatted contracts with DocuSign anchor tags.
                  </p>
                </div>
                <div className="mt-space-4 pt-space-3 border-t border-border flex items-center justify-between font-caption text-caption text-gray-500">
                  <span className="font-mono">14 vars • 18.4k gens</span>
                  <span className="text-gray-400">5d ago</span>
                </div>
              </div>

              {/* Card 3: Event Ticket & QR Badge */}
              <div
                onClick={() => setActivePreviewTemplate(INITIAL_MY_TEMPLATES[2])}
                className="bg-surface-card border border-border rounded-xl p-space-4 flex flex-col justify-between shadow-sm hover:border-brand-500 transition-all group cursor-pointer"
              >
                <div>
                  <div className="h-28 rounded-lg bg-surface-page border border-border flex items-center justify-center p-space-3 relative overflow-hidden mb-space-3">
                    <div className="w-24 h-16 bg-surface-card rounded shadow-sm border border-border-strong p-2 flex items-center justify-between group-hover:scale-105 transition-transform">
                      <div className="flex flex-col gap-1">
                        <div className="w-10 h-1.5 bg-warning-600 rounded-sm"></div>
                        <div className="w-8 h-1 bg-gray-300 rounded-sm"></div>
                        <div className="w-12 h-1 bg-gray-200 rounded-sm"></div>
                      </div>
                      <span className="material-symbols-outlined text-[24px] text-gray-700">qr_code_2</span>
                    </div>
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-surface-card border border-border font-caption text-caption text-gray-500">
                      v2.0
                    </span>
                  </div>
                  <h3 className="font-heading-sm text-heading-sm text-gray-700 font-medium group-hover:text-brand-600 transition-colors">
                    Event Ticket &amp; QR Badge
                  </h3>
                  <p className="font-caption text-caption text-gray-500 mt-1">
                    High-dpi vector rendering for thermal printers and live event passes.
                  </p>
                </div>
                <div className="mt-space-4 pt-space-3 border-t border-border flex items-center justify-between font-caption text-caption text-gray-500">
                  <span className="font-mono">5 vars • 31.9k gens</span>
                  <span className="text-gray-400">1w ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-6 min-w-0">
          {/* Integrations Status */}
          <div className="bg-surface-card border border-border rounded-xl shadow-sm p-space-4 flex flex-col gap-space-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-2">
                <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">hub</span>
                </span>
                <div>
                  <h2 className="font-heading-sm text-heading-sm text-gray-700 font-semibold">
                    Integrations Status
                  </h2>
                  <span className="font-caption text-caption text-gray-400">Automated PDF Dispatch</span>
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard/integrations')}
                className="h-7 px-2 rounded-lg bg-surface-page hover:bg-surface-hover border border-border text-gray-700 font-label text-label flex items-center gap-1 transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                <span>Connect</span>
              </button>
            </div>

            <div className="flex flex-col divide-y divide-border">
              {/* Stripe */}
              <div className="py-space-3 first:pt-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 font-bold font-mono text-sm">
                    St
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label text-label font-medium text-gray-700">Stripe Invoicing</span>
                    <span className="font-caption text-caption text-gray-400">Auto-render paid receipts</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded font-caption text-caption font-medium bg-success-50 text-success-600">
                    Live
                  </span>
                  <input
                    type="checkbox"
                    checked={integrationStates.stripe}
                    onChange={(e) => {
                      setIntegrationStates({ ...integrationStates, stripe: e.target.checked });
                      showToast(`Stripe Invoicing ${e.target.checked ? 'activated' : 'paused'}`);
                    }}
                    className="w-4 h-4 accent-brand-500 cursor-pointer rounded"
                  />
                </div>
              </div>

              {/* Zapier */}
              <div className="py-space-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center text-warning-600 font-bold font-mono text-sm">
                    Zp
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label text-label font-medium text-gray-700">Zapier Automation</span>
                    <span className="font-caption text-caption text-gray-400">Form payload trigger</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded font-caption text-caption font-medium bg-success-50 text-success-600">
                    Active
                  </span>
                  <input
                    type="checkbox"
                    checked={integrationStates.zapier}
                    onChange={(e) => {
                      setIntegrationStates({ ...integrationStates, zapier: e.target.checked });
                      showToast(`Zapier automation trigger ${e.target.checked ? 'activated' : 'paused'}`);
                    }}
                    className="w-4 h-4 accent-brand-500 cursor-pointer rounded"
                  />
                </div>
              </div>

              {/* REST Outbound Webhook */}
              <div className="py-space-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-info-50 flex items-center justify-center text-info-600 font-mono text-sm">
                    <span className="material-symbols-outlined text-[18px]">webhook</span>
                  </div>
                  <div className="flex flex-col min-w-0 max-w-[160px]">
                    <span className="font-label text-label font-medium text-gray-700 truncate">
                      REST Outbound Webhook
                    </span>
                    <span className="font-caption text-caption text-gray-400 font-mono truncate">
                      api.company.com/v1/pdf
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-caption text-caption font-mono text-gray-400">180ms</span>
                  <input
                    type="checkbox"
                    checked={integrationStates.webhook}
                    onChange={(e) => {
                      setIntegrationStates({ ...integrationStates, webhook: e.target.checked });
                      showToast(`Outbound webhook endpoint ${e.target.checked ? 'listening' : 'paused'}`);
                    }}
                    className="w-4 h-4 accent-brand-500 cursor-pointer rounded"
                  />
                </div>
              </div>

              {/* Salesforce & Airtable */}
              <div className="py-space-3 last:pb-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 font-mono text-sm">
                    <span className="material-symbols-outlined text-[18px]">database</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label text-label font-medium text-gray-700">Salesforce &amp; Airtable</span>
                    <span className="font-caption text-caption text-gray-400">Sync CRM document records</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded font-caption text-caption font-medium bg-gray-100 text-gray-600">
                    {integrationStates.salesforce ? 'Active' : 'Paused'}
                  </span>
                  <input
                    type="checkbox"
                    checked={integrationStates.salesforce}
                    onChange={(e) => {
                      setIntegrationStates({ ...integrationStates, salesforce: e.target.checked });
                      showToast(`CRM Document Sync ${e.target.checked ? 'resumed' : 'paused'}`);
                    }}
                    className="w-4 h-4 accent-brand-500 cursor-pointer rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Placeholders Health */}
          <div className="bg-surface-card border border-border rounded-xl shadow-sm p-space-4 flex flex-col gap-space-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-2">
                <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">data_object</span>
                </span>
                <div>
                  <h2 className="font-heading-sm text-heading-sm text-gray-700 font-semibold">
                    Placeholders Health
                  </h2>
                  <span className="font-caption text-caption text-gray-400">JSON Schema Verification</span>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-caption text-caption font-medium bg-success-50 text-success-600">
                99.6% Matched
              </span>
            </div>

            <div className="flex flex-col gap-space-2">
              <div className="flex items-center justify-between font-label text-label">
                <span className="text-gray-600">Payload Integrity</span>
                <span className="font-mono text-gray-700 font-medium">1,418 / 1,424</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: '99.6%' }}></div>
              </div>
              <div className="flex items-center justify-between font-caption text-caption text-gray-400">
                <span>0 critical schema errors</span>
                <span>6 nullable fallbacks</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-caption text-caption font-semibold uppercase tracking-wider text-gray-400">
                  Live JSON Payload Test
                </span>
                <button
                  onClick={handleCopySnippet}
                  className="font-caption text-caption text-brand-600 cursor-pointer hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[12px]">
                    {copiedSnippet ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedSnippet ? 'Copied!' : 'Copy snippet'}</span>
                </button>
              </div>

              <div className="p-space-3 rounded-lg bg-surface-page border border-border font-mono text-[11px] leading-relaxed text-gray-700 overflow-x-auto select-all">
                <span className="text-gray-400">{'{'}</span>
                <br />
                &nbsp;&nbsp;<span className="text-brand-600">"invoice_id"</span>:{' '}
                <span className="text-gray-700">"INV-2024-889"</span>,<br />
                &nbsp;&nbsp;<span className="text-brand-600">"recipient"</span>:{' '}
                <span className="text-gray-700">"Acme Corp Inc."</span>,<br />
                &nbsp;&nbsp;<span className="text-brand-600">"items_count"</span>:{' '}
                <span className="text-warning-600">4</span>,<br />
                &nbsp;&nbsp;<span className="text-brand-600">"currency"</span>:{' '}
                <span className="text-gray-700">"USD"</span>,<br />
                &nbsp;&nbsp;<span className="text-brand-600">"render_vector_qr"</span>:{' '}
                <span className="text-success-600">true</span>
                <br />
                <span className="text-gray-400">{'}'}</span>
              </div>
            </div>

            <button
              onClick={handleExecuteDryRun}
              disabled={isRunningDryRun}
              className="w-full h-8 rounded-lg bg-gray-50 hover:bg-surface-hover border border-border text-gray-700 font-label text-label flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              type="button"
            >
              {isRunningDryRun ? (
                <>
                  <span className="material-symbols-outlined text-[16px] text-brand-500 animate-spin">
                    sync
                  </span>
                  <span>Compiling schema...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px] text-gray-500">play_circle</span>
                  <span>Execute Payload Dry-Run</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Payload Inspection Modal */}
      {selectedPayloadRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-space-4">
          <div className="bg-surface-card border border-border rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-space-4 border-b border-border flex items-center justify-between gap-space-3 shrink-0">
              <div className="flex items-center gap-space-2 min-w-0">
                <span className="material-symbols-outlined text-brand-500 text-[20px] shrink-0">data_object</span>
                <div className="min-w-0">
                  <h3 className="font-heading-sm text-heading-sm text-gray-800 font-semibold">
                    Generation Payload
                  </h3>
                  <span className="font-caption text-caption text-gray-400 font-mono truncate block">
                    {selectedPayloadRecord.id} • {selectedPayloadRecord.templateName}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPayloadRecord(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-space-4 flex flex-col gap-space-4 overflow-y-auto">
              <div className="flex items-center justify-between text-caption font-label text-gray-500">
                <span>Trigger Source: {selectedPayloadRecord.trigger}</span>
                <span className="font-mono text-gray-400">{selectedPayloadRecord.timestamp}</span>
              </div>

              <div className="bg-surface-page border border-border rounded-lg p-space-4 font-mono text-[12px] leading-relaxed text-gray-800 overflow-x-auto max-h-64 select-all">
                <pre>{JSON.stringify(selectedPayloadRecord.payload, null, 2)}</pre>
              </div>
            </div>

            <div className="p-space-4 pt-space-3 border-t border-border flex items-center justify-end gap-space-2 shrink-0">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedPayloadRecord.payload, null, 2));
                  showToast('Payload JSON copied to clipboard');
                }}
                className="h-8 px-3 rounded-lg border border-border hover:bg-surface-hover text-gray-700 font-label text-label flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">content_copy</span>
                <span>Copy JSON</span>
              </button>
              <button
                onClick={() => {
                  setSelectedPayloadRecord(null);
                  setActivePreviewTemplate(INITIAL_MY_TEMPLATES[0]);
                }}
                className="h-8 px-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-label text-label font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px]">visibility</span>
                <span>Render Sample Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render Document Modal */}
      <TemplateRendererModal
        template={activePreviewTemplate}
        isOpen={Boolean(activePreviewTemplate)}
        onClose={() => setActivePreviewTemplate(null)}
      />
    </div>
  );
}