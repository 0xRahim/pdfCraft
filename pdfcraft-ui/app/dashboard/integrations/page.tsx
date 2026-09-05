import React, { useState } from 'react';
import { INITIAL_INTEGRATIONS, INITIAL_WEBHOOKS } from '../../../data/mockData';
import { IntegrationApp, WebhookEndpoint } from '../../../types';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationApp[]>(INITIAL_INTEGRATIONS);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(INITIAL_WEBHOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLiveKey, setShowLiveKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [codeTab, setCodeTab] = useState<'curl' | 'node' | 'python'>('curl');
  const [isAddingWebhook, setIsAddingWebhook] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvent, setNewWebhookEvent] = useState<'render.completed' | 'render.failed'>('render.completed');
  const [pingStatus, setPingStatus] = useState<Record<string, string>>({});

  const liveSecretKey = 'pdfcraft_live_sk_492048102948920194889941';
  const publishableKey = 'pdfcraft_pub_pk_2024_client_b489a29e';

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleListening = (appId: string) => {
    setIntegrations(
      integrations.map((app) =>
        app.id === appId ? { ...app, isListening: !app.isListening } : app
      )
    );
  };

  const handleTestPing = (whId: string) => {
    setPingStatus((prev) => ({ ...prev, [whId]: 'Pinging...' }));
    setTimeout(() => {
      setPingStatus((prev) => ({ ...prev, [whId]: '200 OK (22ms)' }));
      setTimeout(() => {
        setPingStatus((prev) => ({ ...prev, [whId]: '' }));
      }, 3000);
    }, 600);
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl.trim()) return;
    const newWh: WebhookEndpoint = {
      id: `wh_${Date.now()}`,
      eventTrigger: newWebhookEvent,
      endpointUrl: newWebhookUrl.trim(),
      secretKey: `whsec_••••••••${Math.floor(1000 + Math.random() * 9000)}`,
      statusText: '100% (200 OK)',
      statusSuccess: true,
      lastPing: 'Just now',
    };
    setWebhooks([...webhooks, newWh]);
    setNewWebhookUrl('');
    setIsAddingWebhook(false);
  };

  const filteredIntegrations = integrations.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading-lg text-heading-lg text-gray-700 font-semibold tracking-tight">
            Integrations &amp; API Keys
          </h1>
          <p className="font-body-sm text-body-sm text-gray-500 mt-1">
            Connect third-party automation tools or generate secure keys for rendering workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-gray-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search connectors..."
              className="h-8 pl-8 pr-3 bg-surface-card border border-border rounded-lg text-body-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <button
            onClick={() => setIsAddingWebhook(true)}
            className="h-8 px-3.5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-label text-label font-medium rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Webhook</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: No-Code & Automation Connectors */}
      <section className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-heading text-gray-700 font-semibold">
              No-Code &amp; Automation Connectors
            </h2>
            <span className="font-caption text-caption bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">
              4 Active
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-gray-500 mt-0.5">
            Native connectors to automatically stream records, map variables, and generate signed PDFs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIntegrations.map((app) => (
            <div
              key={app.id}
              className="bg-surface-card border border-border rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Connector Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-lg shadow-xs">
                      {app.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading-sm text-heading-sm text-gray-700 font-semibold">
                          {app.name}
                        </h3>
                        <span className="font-caption text-[11px] bg-success-50 text-success-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
                          {app.status}
                        </span>
                      </div>
                      <span className="font-caption text-caption text-gray-400 font-medium">
                        {app.tagline}
                      </span>
                    </div>
                  </div>

                  {app.monthlyRenders && (
                    <span className="font-caption text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono font-medium">
                      {app.monthlyRenders}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="font-body-sm text-body-sm text-gray-600 mt-3 leading-relaxed">
                  {app.description}
                </p>

                {/* Features Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {app.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="font-caption text-[11px] bg-surface-page text-gray-600 px-2 py-0.5 rounded border border-border font-medium flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-brand-500 text-[12px]">check</span>
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer with Toggle / Instance Info & Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
                {app.hasListeningToggle ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleListening(app.id)}
                      className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                        app.isListening ? 'bg-brand-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block w-3.5 h-3.5 bg-white rounded-full transition-transform transform shadow-sm ${
                          app.isListening ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      ></span>
                    </button>
                    <span className="font-caption text-caption text-gray-500 select-none">
                      {app.isListening ? 'Listening to Triggers' : 'Paused'}
                    </span>
                  </div>
                ) : (
                  <span className="font-caption text-[11px] text-gray-400 font-mono">
                    {app.instanceInfo || 'Ready for triggers'}
                  </span>
                )}

                <button
                  onClick={() => alert(`Configuring ${app.name} field mappings and webhook secrets.`)}
                  className="h-7 px-3 bg-gray-100 hover:bg-surface-hover text-gray-700 font-label text-label font-medium rounded-lg border border-border transition-colors cursor-pointer"
                >
                  {app.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Direct API Credentials & SDK Example */}
      <section className="flex flex-col gap-4 pt-4 border-t border-border">
        <div>
          <h2 className="font-heading text-heading text-gray-700 font-semibold">Direct API Credentials</h2>
          <p className="font-body-sm text-body-sm text-gray-500 mt-0.5">
            Authenticate HTTP API requests using standard Bearer authorization headers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Keys list */}
          <div className="lg:col-span-6 bg-surface-card border border-border rounded-xl p-5 space-y-4">
            {/* Live Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-label text-label font-medium text-gray-700 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-brand-600 text-[16px]">lock</span>
                  <span>Secret Live Key (Production)</span>
                </label>
                <span className="font-caption text-[11px] bg-danger-50 text-danger-600 px-2 py-0.2 rounded font-medium">
                  Server-side only
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-9 px-3 bg-surface-page border border-border rounded-lg flex items-center justify-between font-mono text-[12px] text-gray-700">
                  <span>
                    {showLiveKey
                      ? liveSecretKey
                      : 'pdfcraft_live_sk_••••••••••••••••••••9941'}
                  </span>
                  <button
                    onClick={() => setShowLiveKey(!showLiveKey)}
                    className="text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {showLiveKey ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <button
                  onClick={() => handleCopy(liveSecretKey, 'liveKey')}
                  className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-label font-label flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedKey === 'liveKey' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedKey === 'liveKey' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Publishable Token */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="font-label text-label font-medium text-gray-700 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-info-600 text-[16px]">key</span>
                  <span>Publishable Client Token</span>
                </label>
                <span className="font-caption text-[11px] bg-info-50 text-info-600 px-2 py-0.2 rounded font-medium">
                  Client safe
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-9 px-3 bg-surface-page border border-border rounded-lg flex items-center font-mono text-[12px] text-gray-700">
                  <span>{publishableKey}</span>
                </div>
                <button
                  onClick={() => handleCopy(publishableKey, 'pubKey')}
                  className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-label font-label flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedKey === 'pubKey' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedKey === 'pubKey' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Code Snippet */}
          <div className="lg:col-span-6 bg-gray-700 rounded-xl p-5 text-gray-200 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between border-b border-gray-600 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-brand-400 font-semibold">POST /v2/render</span>
                  <span className="text-gray-400 text-[11px]">Render PDF Payload</span>
                </div>
                <div className="flex items-center gap-1">
                  {(['curl', 'node', 'python'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setCodeTab(t)}
                      className={`px-2 py-0.5 text-[11px] font-mono rounded cursor-pointer ${
                        codeTab === t ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <pre className="font-mono text-[12px] text-gray-300 overflow-x-auto leading-relaxed">
                {codeTab === 'curl' && `curl -X POST https://api.pdfcraft.io/v2/render \\
  -H "Authorization: Bearer ${liveSecretKey.slice(0, 22)}..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "template_id": "tmpl_commercial_tax_v3",
    "data": { "invoice_id": "INV-2024-8849", "vat_total": "$1,420.00" }
  }'`}
                {codeTab === 'node' && `import { PdfCraft } from '@pdfcraft/sdk';

const client = new PdfCraft({ apiKey: process.env.PDFCRAFT_API_KEY });
const pdfBuffer = await client.render({
  templateId: 'tmpl_commercial_tax_v3',
  data: { invoice_id: 'INV-2024-8849', vat_total: '$1,420.00' }
});`}
                {codeTab === 'python' && `from pdfcraft import PdfCraftClient

client = PdfCraftClient(api_key="pdfcraft_live_sk_...")
pdf = client.render(
    template_id="tmpl_commercial_tax_v3",
    data={"invoice_id": "INV-2024-8849", "vat_total": "$1,420.00"}
)`}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-600 text-[11px] text-gray-400">
              <span>Avg Latency: ~48ms</span>
              <button
                onClick={() => alert('Copied SDK code snippet to clipboard!')}
                className="text-brand-400 hover:text-brand-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">copy_all</span>
                <span>Copy Snippet</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Active Webhook Endpoints */}
      <section className="flex flex-col gap-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-heading text-gray-700 font-semibold">Active Webhook Endpoints</h2>
            <p className="font-body-sm text-body-sm text-gray-500 mt-0.5">
              Receive signed asynchronous callbacks when batch renders finish or template schemas change.
            </p>
          </div>
        </div>

        {/* New Webhook Modal/Drawer inline */}
        {isAddingWebhook && (
          <form onSubmit={handleAddWebhook} className="bg-surface-card border-2 border-brand-500 rounded-xl p-4 flex flex-col md:flex-row items-end gap-3 animate-in fade-in">
            <div className="flex-1 w-full flex flex-col gap-1">
              <label className="font-label text-label text-gray-600">Endpoint URL (HTTPS Required)</label>
              <input
                type="url"
                required
                placeholder="https://api.yourdomain.com/webhooks/pdfcraft"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                className="h-8 px-3 bg-surface-page border border-border rounded-lg text-body-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div className="w-48 flex flex-col gap-1">
              <label className="font-label text-label text-gray-600">Event Trigger</label>
              <select
                value={newWebhookEvent}
                onChange={(e) => setNewWebhookEvent(e.target.value as any)}
                className="h-8 px-2 bg-surface-page border border-border rounded-lg text-body-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="render.completed">render.completed</option>
                <option value="render.failed">render.failed</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddingWebhook(false)}
                className="h-8 px-3 rounded-lg border border-border text-gray-600 hover:bg-gray-100 font-label text-label cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-8 px-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-label text-label font-medium shadow-sm cursor-pointer"
              >
                Save Endpoint
              </button>
            </div>
          </form>
        )}

        <div className="bg-surface-card border border-border rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-page font-label text-[12px] text-gray-500">
                <th className="py-2.5 px-4">Event Trigger</th>
                <th className="py-2.5 px-4">Endpoint URL</th>
                <th className="py-2.5 px-4">Signing Secret</th>
                <th className="py-2.5 px-4">Health Status</th>
                <th className="py-2.5 px-4">Last Ping</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-body-sm">
              {webhooks.map((wh) => (
                <tr key={wh.id} className="hover:bg-surface-hover transition-colors">
                  <td className="py-3 px-4 font-mono text-[12px] text-brand-600 font-medium">
                    {wh.eventTrigger}
                  </td>
                  <td className="py-3 px-4 font-mono text-[12px] text-gray-700">
                    {wh.endpointUrl}
                  </td>
                  <td className="py-3 px-4 font-mono text-[12px] text-gray-400">
                    {wh.secretKey}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-caption text-[11px] bg-success-50 text-success-600 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
                      {wh.statusText}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-caption text-gray-400">
                    {wh.lastPing}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleTestPing(wh.id)}
                      className="h-7 px-2.5 rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 text-gray-600 font-label text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {pingStatus[wh.id] || 'Send Test Ping'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
