import React, { useState } from 'react';
import { INITIAL_USER, INITIAL_BILLING, INITIAL_INVOICES, AVATAR_URL } from '../../../data/mockData';
import { UserProfile, BillingDetails, InvoiceRecord } from '../../../types';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'security' | 'billing' | 'env'>('profile');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [billing, setBilling] = useState<BillingDetails>(INITIAL_BILLING);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [is2fa, setIs2fa] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Account profile settings successfully updated.');
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-gray-700 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-gray-600 animate-in fade-in">
          <span className="material-symbols-outlined text-success-500 text-[18px]">check_circle</span>
          <span className="font-label text-label">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-heading-lg text-heading-lg text-gray-700 font-semibold tracking-tight">
          Settings
        </h1>
        <p className="font-body-sm text-body-sm text-gray-500 mt-1">
          Manage workspace identity, team permissions, security configurations, and billing tiers.
        </p>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-b border-border flex items-center gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 font-label text-label font-medium transition-colors border-b-2 -mb-px cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">person</span>
          <span>Account Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`pb-3 font-label text-label font-medium transition-colors border-b-2 -mb-px cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'team'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">group</span>
          <span>Team Members (4)</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 font-label text-label font-medium transition-colors border-b-2 -mb-px cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">shield</span>
          <span>Security &amp; Auth</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`pb-3 font-label text-label font-medium transition-colors border-b-2 -mb-px cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'billing'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">credit_card</span>
          <span>Billing &amp; Usage</span>
        </button>

        <button
          onClick={() => setActiveTab('env')}
          className={`pb-3 font-label text-label font-medium transition-colors border-b-2 -mb-px cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'env'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">terminal</span>
          <span>Environment Keys</span>
        </button>
      </div>

      {/* TAB 1: Account Profile */}
      {activeTab === 'profile' && (
        <div className="flex flex-col gap-6">
          {/* Card: Workspace Identity & Profile */}
          <div className="bg-surface-card border border-border rounded-xl p-6 shadow-xs">
            <h2 className="font-heading text-heading text-gray-700 font-semibold mb-1">
              Workspace Identity &amp; Profile
            </h2>
            <p className="font-body-sm text-body-sm text-gray-500 mb-6">
              Update your personal credentials and publicly visible developer handle.
            </p>

            {/* Avatar Row */}
            <div className="flex items-center gap-5 pb-6 border-b border-border">
              <img
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border border-border shadow-xs"
                src={AVATAR_URL}
              />
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('Avatar upload simulated successfully.')}
                    className="h-8 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-label text-label font-medium transition-colors cursor-pointer"
                  >
                    Upload New Photo
                  </button>
                  <button
                    onClick={() => showToast('Avatar restored to default.')}
                    className="h-8 px-3 rounded-lg text-danger-600 hover:bg-danger-50 font-label text-label font-medium transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <span className="font-caption text-caption text-gray-400">
                  Recommended: Square JPG or PNG, at least 400×400px.
                </span>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              <div className="flex flex-col gap-1">
                <label className="font-label text-label text-gray-600">Full Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="h-9 px-3 bg-surface-page border border-border rounded-lg text-body text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-label text-label text-gray-600">Work Email</label>
                  <span className="font-caption text-[11px] text-success-600 font-medium flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">verified</span> Verified
                  </span>
                </div>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="h-9 px-3 bg-surface-page border border-border rounded-lg text-body text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label text-label text-gray-600">Job Title / Role</label>
                <input
                  type="text"
                  value={user.jobTitle}
                  onChange={(e) => setUser({ ...user, jobTitle: e.target.value })}
                  className="h-9 px-3 bg-surface-page border border-border rounded-lg text-body text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label text-label text-gray-600">Default Timezone</label>
                <select
                  value={user.timezone}
                  onChange={(e) => setUser({ ...user, timezone: e.target.value })}
                  className="h-9 px-2 bg-surface-page border border-border rounded-lg text-body text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="UTC-07:00 (Pacific Time)">UTC-07:00 (Pacific Time - Los Angeles)</option>
                  <option value="UTC-04:00 (Eastern Time)">UTC-04:00 (Eastern Time - New York)</option>
                  <option value="UTC+00:00 (GMT/UTC)">UTC+00:00 (GMT/UTC - London)</option>
                  <option value="UTC+01:00 (CET)">UTC+01:00 (Central European Time - Berlin)</option>
                  <option value="UTC+08:00 (SGT)">UTC+08:00 (Singapore / Tokyo)</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-label text-label font-medium shadow-sm transition-colors cursor-pointer"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>

          {/* Card: Authentication & Session Security */}
          <div className="bg-surface-card border border-border rounded-xl p-6 shadow-xs space-y-5">
            <div>
              <h2 className="font-heading text-heading text-gray-700 font-semibold mb-1">
                Authentication &amp; Session Security
              </h2>
              <p className="font-body-sm text-body-sm text-gray-500">
                Safeguard template revisions and live signing operations with strict factor policies.
              </p>
            </div>

            {/* 2FA Item */}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">phonelink_lock</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label text-label font-medium text-gray-700">
                      Two-Factor Authentication (2FA)
                    </span>
                    <span className="font-caption text-[11px] bg-success-50 text-success-600 px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                  <p className="font-caption text-caption text-gray-400 mt-0.5">
                    Require a TOTP authenticator code on sensitive schema edits and key rotations.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIs2fa(!is2fa)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  is2fa ? 'bg-brand-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`block w-4 h-4 bg-white rounded-full transition-transform transform shadow-sm ${
                    is2fa ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`}
                ></span>
              </button>
            </div>

            {/* SAML SSO Item */}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">security</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label text-label font-medium text-gray-700">
                      Single Sign-On (SAML / Okta)
                    </span>
                    <span className="font-caption text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                      Not Configured
                    </span>
                  </div>
                  <p className="font-caption text-caption text-gray-400 mt-0.5">
                    Enforce company-wide IdP routing via Okta, Azure AD, or Google Workspace.
                  </p>
                </div>
              </div>
              <button
                onClick={() => showToast('Opening SAML 2.0 Identity Provider configuration wizard.')}
                className="h-8 px-3 rounded-lg border border-border hover:bg-gray-100 text-gray-700 font-label text-label font-medium transition-colors cursor-pointer"
              >
                Configure SAML
              </button>
            </div>

            {/* Connected Providers */}
            <div className="pt-2">
              <span className="font-label text-label text-gray-600 block mb-2 font-medium">
                Connected OAuth Identities
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-page">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-brand-600 text-[18px]">account_circle</span>
                    <span className="font-label text-label text-gray-700">Google (elena@pdfcraft.io)</span>
                  </div>
                  <span className="font-caption text-[11px] text-success-600 font-medium">Connected</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-page">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-gray-700 text-[18px]">code</span>
                    <span className="font-label text-label text-gray-700">GitHub (@elenavance)</span>
                  </div>
                  <span className="font-caption text-[11px] text-success-600 font-medium">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Billing & Usage */}
      {activeTab === 'billing' && (
        <div className="flex flex-col gap-6">
          {/* Plan Overview Card */}
          <div className="bg-surface-card border border-border rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-heading text-gray-700 font-semibold">
                    {billing.planName}
                  </h2>
                  <span className="font-caption text-[11px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                    Current Active
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-gray-500 mt-1">
                  ${billing.priceMonthly} / month • Billed {billing.billingCycle} (Next renewal: {billing.renewalDate})
                </p>
                <span className="font-caption text-caption text-gray-400 font-mono mt-1 block">
                  Workspace ID: {billing.workspaceId}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Opening plan upgrade modal.')}
                  className="h-8 px-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-label text-label font-medium shadow-sm transition-colors cursor-pointer"
                >
                  Upgrade Tier
                </button>
                <button
                  onClick={() => showToast('Opening payment method selector.')}
                  className="h-8 px-3 rounded-lg border border-border hover:bg-gray-100 text-gray-700 font-label text-label font-medium transition-colors cursor-pointer"
                >
                  Update Card (•••• 4242)
                </button>
              </div>
            </div>

            {/* Quota Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-body-sm">
                <span className="font-medium text-gray-700">Monthly PDF Render Quota</span>
                <span className="text-gray-500 font-mono">
                  {billing.quotaUsed.toLocaleString()} / {billing.quotaTotal.toLocaleString()} renders ({((billing.quotaUsed / billing.quotaTotal) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${(billing.quotaUsed / billing.quotaTotal) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-caption text-gray-400">
                <span>Resets automatically on {billing.resetDate}</span>
                <span>Burst scaling enabled (+$0.002 / extra render)</span>
              </div>
            </div>
          </div>

          {/* Invoices History */}
          <div className="bg-surface-card border border-border rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-heading text-gray-700 font-semibold">Billing Invoices</h3>
              <button
                onClick={() => showToast('Exporting CSV of billing history...')}
                className="text-brand-600 hover:underline font-label text-label"
              >
                Export CSV
              </button>
            </div>

            <div className="overflow-hidden border border-border rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-page border-b border-border font-label text-[12px] text-gray-500">
                    <th className="py-2.5 px-4">Invoice ID</th>
                    <th className="py-2.5 px-4">Billing Date</th>
                    <th className="py-2.5 px-4">Amount</th>
                    <th className="py-2.5 px-4">Billing Period</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-body-sm">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-surface-hover">
                      <td className="py-3 px-4 font-mono text-[12px] text-gray-700 font-medium">{inv.id}</td>
                      <td className="py-3 px-4 text-gray-600">{inv.billingDate}</td>
                      <td className="py-3 px-4 font-mono text-gray-800 font-medium">{inv.amount}</td>
                      <td className="py-3 px-4 text-gray-500">{inv.period}</td>
                      <td className="py-3 px-4">
                        <span className="font-caption text-[11px] bg-success-50 text-success-600 px-2 py-0.5 rounded-full font-medium">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => showToast(`Downloaded invoice ${inv.id} PDF`)}
                          className="font-label text-[12px] text-brand-600 hover:underline flex items-center justify-end gap-1 ml-auto cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">download</span>
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Team Members */}
      {activeTab === 'team' && (
        <div className="bg-surface-card border border-border rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h2 className="font-heading text-heading text-gray-700 font-semibold">Workspace Collaborators</h2>
              <p className="font-body-sm text-body-sm text-gray-500">4 members with template editing and API deployment privileges.</p>
            </div>
            <button
              onClick={() => showToast('Sent invitation link to new team member.')}
              className="h-8 px-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-label text-label font-medium shadow-sm transition-colors cursor-pointer"
            >
              + Invite Member
            </button>
          </div>

          <div className="divide-y divide-border">
            {[
              { name: 'Elena Vance', email: 'elena@pdfcraft.io', role: 'Workspace Owner', isCurrent: true },
              { name: 'Marcus Thorne', email: 'marcus@pdfcraft.io', role: 'Admin', isCurrent: false },
              { name: 'Sarah Jenkins', email: 'sarah.j@company.org', role: 'Developer', isCurrent: false },
              { name: 'David Kim', email: 'david@company.org', role: 'Viewer', isCurrent: false },
            ].map((member, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-semibold flex items-center justify-center text-[12px]">
                    {member.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-label text-label text-gray-700 font-medium">{member.name}</span>
                      {member.isCurrent && (
                        <span className="font-caption text-[10px] bg-brand-50 text-brand-600 px-1.5 py-0.2 rounded">You</span>
                      )}
                    </div>
                    <span className="font-caption text-caption text-gray-400">{member.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-caption text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                    {member.role}
                  </span>
                  {!member.isCurrent && (
                    <button
                      onClick={() => showToast(`Updated permissions for ${member.name}`)}
                      className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">more_vert</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Security Details */}
      {activeTab === 'security' && (
        <div className="bg-surface-card border border-border rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="font-heading text-heading text-gray-700 font-semibold">Security Audit &amp; Compliance</h2>
          <div className="p-4 rounded-xl bg-surface-page border border-border flex items-start gap-3">
            <span className="material-symbols-outlined text-success-600 text-[24px]">verified_user</span>
            <div>
              <h3 className="font-label text-label font-semibold text-gray-800">SOC 2 Type II Certified Workspace</h3>
              <p className="font-caption text-caption text-gray-500 mt-0.5">
                All templates, render payloads, and signed attachments are encrypted in transit with TLS 1.3 and at rest with AES-256 keys.
              </p>
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <span className="font-label text-label font-medium text-gray-700 block">IP Whitelisting &amp; CIDR Restrictions</span>
                <span className="font-caption text-caption text-gray-400">Restrict render API traffic exclusively to corporate gateways.</span>
              </div>
              <button onClick={() => showToast('IP Whitelisting opened.')} className="h-8 px-3 rounded-lg border border-border text-label font-label text-gray-600 hover:bg-gray-100 cursor-pointer">
                Manage IPs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Environment Keys */}
      {activeTab === 'env' && (
        <div className="bg-surface-card border border-border rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="font-heading text-heading text-gray-700 font-semibold">Environment Variables &amp; Secret Vault</h2>
          <p className="font-body-sm text-body-sm text-gray-500">Inject secret tokens into custom handlebars templates during PDF generation.</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-surface-page font-mono text-[12px]">
              <span className="text-brand-600 font-semibold">STRIPE_SIGNING_SECRET</span>
              <span className="text-gray-400">whsec_live_94819••••••••</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-surface-page font-mono text-[12px]">
              <span className="text-brand-600 font-semibold">DOCUSIGN_INTEGRATION_KEY</span>
              <span className="text-gray-400">ds_live_0942••••••••</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
