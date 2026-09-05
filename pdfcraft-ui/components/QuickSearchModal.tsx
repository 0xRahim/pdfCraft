import React, { useState, useEffect } from 'react';
import { useRouter } from '../lib/router';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const searchItems = [
    { title: 'Commercial Tax Invoice v3.2', category: 'Templates', path: '/dashboard', icon: 'description' },
    { title: 'SaaS B2B Service Agreement v1.8', category: 'Templates', path: '/dashboard', icon: 'description' },
    { title: 'Shipping Slip & Barcode Label v2.1', category: 'Templates', path: '/dashboard', icon: 'qr_code' },
    { title: 'Employee Offer Letter v0.9', category: 'Templates', path: '/dashboard', icon: 'badge' },
    { title: 'Zapier Webhook Mappings', category: 'Integrations', path: '/dashboard/integrations', icon: 'hub' },
    { title: 'Make / Integromat Scenarios', category: 'Integrations', path: '/dashboard/integrations', icon: 'hub' },
    { title: 'API Keys & Secrets Audit', category: 'API Keys', path: '/dashboard/integrations?tab=keys', icon: 'key' },
    { title: 'Account Profile & 2FA', category: 'Settings', path: '/dashboard/settings', icon: 'person' },
    { title: 'Billing & Monthly Quota', category: 'Settings', path: '/dashboard/settings', icon: 'credit_card' },
    { title: 'Team Members & Permissions', category: 'Settings', path: '/dashboard/settings', icon: 'group' },
    { title: 'Visual Template Builder', category: 'Builder', path: '/dashboard/builder', icon: 'dashboard_customize' },
  ];

  const filtered = query.trim() === ''
    ? searchItems
    : searchItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-surface-card rounded-xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search input header */}
        <div className="flex items-center px-4 py-3 border-b border-border gap-3">
          <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates, integrations, settings..."
            className="w-full bg-transparent text-gray-700 font-body text-body focus:outline-none placeholder:text-gray-400"
          />
          <kbd className="font-caption text-[11px] bg-gray-100 border border-border px-1.5 py-0.5 rounded text-gray-500 font-mono">
            ESC
          </kbd>
        </div>

        {/* Search results list */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border/50">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-gray-400 font-body-sm">
              No matching results found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  router.push(item.path);
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-brand-50 text-brand-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  </div>
                  <span className="font-label text-label text-gray-700 group-hover:text-brand-600 font-medium">
                    {item.title}
                  </span>
                </div>
                <span className="font-caption text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                  {item.category}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-surface-page border-t border-border flex items-center justify-between font-caption text-caption text-gray-400">
          <span>Use <strong>↑↓</strong> to navigate, <strong>Enter</strong> to select</span>
          <span className="text-brand-600 font-medium">PdfCraft v2.4 Search</span>
        </div>
      </div>
    </div>
  );
};
