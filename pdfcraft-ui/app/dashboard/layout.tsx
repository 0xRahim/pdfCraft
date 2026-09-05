import React, { useState } from 'react';
import { useRouter, usePathname, Link } from '../../lib/router';
import { AVATAR_URL } from '../../data/mockData';
import { QuickSearchModal } from '../../components/QuickSearchModal';
import { TemplateRendererModal } from '../../components/TemplateRendererModal';
import { INITIAL_MY_TEMPLATES } from '../../data/mockData';
import { Template } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeModalTemplate, setActiveModalTemplate] = useState<Template | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const getBreadcrumbs = () => {
    if (pathname.includes('/integrations')) {
      return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-label font-label text-body-sm">
          <span className="text-gray-400">App</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">Automation &amp; Settings</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium">Integrations &amp; API Keys</span>
        </nav>
      );
    }
    if (pathname.includes('/settings')) {
      return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-label font-label text-body-sm">
          <span className="text-gray-400">App</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">Automation &amp; Settings</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium">Settings</span>
        </nav>
      );
    }
    if (pathname.includes('/templates')) {
      return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-label font-label text-body-sm">
          <span className="text-gray-400">App</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">Workspace</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium">Templates</span>
        </nav>
      );
    }
    if (pathname.includes('/builder')) {
      return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-label font-label text-body-sm">
          <span className="text-gray-400">App</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">Workspaces</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium">Template Builder</span>
        </nav>
      );
    }
    return (
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-label font-label text-body-sm">
        <span className="text-gray-400">App</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium">Workspace</span>
      </nav>
    );
  };

  const handleGlobalAction = () => {
    if (pathname.includes('/settings')) {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }, 600);
    } else if (pathname.includes('/integrations')) {
      router.push('/dashboard/integrations?modal=connect');
    } else {
      setActiveModalTemplate(INITIAL_MY_TEMPLATES[0]);
    }
  };

  const getActionButton = () => {
    if (pathname.includes('/settings')) {
      return (
        <button
          onClick={handleGlobalAction}
          className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-label text-label transition-colors shadow-sm cursor-pointer"
          type="button"
        >
          {isSaving ? (
            <>
              <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
              <span>Saving...</span>
            </>
          ) : saveSuccess ? (
            <>
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Saved</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Save Changes</span>
            </>
          )}
        </button>
      );
    }
    if (pathname.includes('/integrations')) {
      return (
        <button
          onClick={handleGlobalAction}
          className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-label text-label transition-colors shadow-sm cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Connect App</span>
        </button>
      );
    }
    if (pathname.includes('/builder')) {
      return (
        <button
          onClick={() => setActiveModalTemplate(INITIAL_MY_TEMPLATES[0])}
          className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-label text-label transition-colors shadow-sm cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">play_arrow</span>
          <span>Test Render</span>
        </button>
      );
    }
    return (
      <button
        onClick={() => setActiveModalTemplate(INITIAL_MY_TEMPLATES[0])}
        className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-label text-label transition-colors shadow-sm cursor-pointer"
        type="button"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
        <span>New Template</span>
      </button>
    );
  };

  return (
    <div className="bg-surface-page font-body text-on-surface antialiased min-h-screen flex">
      {/* Left Persistent Sidebar (240px wide) */}
      <aside className="w-[240px] bg-surface-card border-r border-border h-screen sticky top-0 flex flex-col justify-between shrink-0 z-40 select-none">
        <div className="flex flex-col">
          {/* Brand Logo Header */}
          <div className="h-[56px] flex items-center px-4 border-b border-border gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand-500 text-white font-bold text-sm shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading-sm text-heading-sm text-gray-700 tracking-tight font-semibold">
                PdfCraft
              </span>
              <span className="font-caption text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono font-medium">
                v2.4
              </span>
            </div>
          </div>

          {/* Navigation Group 1: Workspaces */}
          <div className="px-3 pt-4">
            <div className="px-2 mb-2">
              <span className="font-caption text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                Workspaces
              </span>
            </div>
            <nav className="flex flex-col gap-1">
              <Link
                href="/dashboard"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-label transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-brand-50 text-brand-600 font-medium shadow-xs'
                    : 'text-gray-600 hover:bg-surface-hover hover:text-gray-700'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={pathname === '/dashboard' ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  grid_view
                </span>
                <span>Dashboard</span>
              </Link>

              <Link
                href="/dashboard/templates"
                className={`flex items-center justify-between px-3 py-2 rounded-lg font-label text-label transition-colors ${
                  pathname.startsWith('/dashboard/templates')
                    ? 'bg-brand-50 text-brand-600 font-medium shadow-xs'
                    : 'text-gray-600 hover:bg-surface-hover hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={pathname.startsWith('/dashboard/templates') ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    description
                  </span>
                  <span>Templates</span>
                </div>
                <span className="font-caption text-caption bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                  18
                </span>
              </Link>

              <Link
                href="/dashboard/builder"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-label transition-colors ${
                  pathname === '/dashboard/builder'
                    ? 'bg-brand-50 text-brand-600 font-medium shadow-xs'
                    : 'text-gray-600 hover:bg-surface-hover hover:text-gray-700'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-gray-500">dashboard_customize</span>
                <span>Template Builder</span>
              </Link>

              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-label text-gray-400 hover:bg-surface-hover hover:text-gray-600 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px] text-gray-400">folder_open</span>
                <span>Documents &amp; Generates</span>
              </div>

              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-label text-gray-400 hover:bg-surface-hover hover:text-gray-600 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px] text-gray-400">data_object</span>
                <span>Placeholders &amp; Variables</span>
              </div>
            </nav>
          </div>

          {/* Navigation Group 2: Automation & Settings */}
          <div className="px-3 pt-5">
            <div className="px-2 mb-2">
              <span className="font-caption text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                Automation &amp; Settings
              </span>
            </div>
            <nav className="flex flex-col gap-1">
              <Link
                href="/dashboard/integrations"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-label transition-colors ${
                  pathname.includes('/integrations')
                    ? 'bg-brand-50 text-brand-600 font-medium shadow-xs'
                    : 'text-gray-600 hover:bg-surface-hover hover:text-gray-700'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={pathname.includes('/integrations') ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  hub
                </span>
                <span>Integrations</span>
              </Link>

              <Link
                href="/dashboard/integrations?tab=keys"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-label text-gray-600 hover:bg-surface-hover hover:text-gray-700 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-gray-500">key</span>
                <span>API Keys &amp; Logs</span>
              </Link>

              <Link
                href="/dashboard/settings"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-label transition-colors ${
                  pathname.includes('/settings')
                    ? 'bg-brand-50 text-brand-600 font-medium shadow-xs'
                    : 'text-gray-600 hover:bg-surface-hover hover:text-gray-700'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={pathname.includes('/settings') ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  settings
                </span>
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Pinned User Profile Footer */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-hover transition-colors">
            <img
              alt="Elena Vance"
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-border"
              src={AVATAR_URL}
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label text-label text-gray-700 truncate font-medium">Elena Vance</span>
              <span className="font-caption text-caption text-gray-400 truncate">elena@pdfcraft.io</span>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="text-gray-400 hover:text-danger-600 transition-colors flex items-center p-1 rounded hover:bg-white cursor-pointer"
              title="Logout / Sign In Screen"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Canvas Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Persistent Topbar (56px) */}
        <header className="h-[56px] bg-surface-card border-b border-border sticky top-0 z-30 flex items-center justify-between px-8 shrink-0">
          {getBreadcrumbs()}

          {/* Global Controls & Actions */}
          <div className="flex items-center gap-4">
            {/* ⌘K Quick Search */}
            <div
              onClick={() => setIsSearchOpen(true)}
              className="relative flex items-center cursor-pointer group"
            >
              <span className="material-symbols-outlined absolute left-2.5 text-[16px] text-gray-400 group-hover:text-brand-500 pointer-events-none">
                search
              </span>
              <input
                readOnly
                className="w-64 h-8 pl-8 pr-10 font-body-sm text-body-sm bg-surface-page border border-border rounded-lg text-gray-700 placeholder-gray-400 cursor-pointer group-hover:border-brand-500 transition-all"
                placeholder="Search templates, docs..."
                type="text"
              />
              <kbd className="absolute right-2 font-caption text-[10px] bg-surface-card border border-border px-1.5 py-0.5 rounded text-gray-400 font-mono">
                ⌘K
              </kbd>
            </div>

            <a
              className="font-label text-label text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
              href="#docs"
              onClick={(e) => { e.preventDefault(); alert('PdfCraft API Documentation v2.4 (OpenAPI 3.1 & SDKs: Node.js, Python, Go, Ruby)'); }}
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span>Docs</span>
            </a>

            <button
              className="relative p-1 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              type="button"
              onClick={() => alert('Notifications: 2 webhook dispatch retries completed successfully.')}
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-surface-card"></span>
            </button>

            {getActionButton()}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 bg-surface-page p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <TemplateRendererModal
        template={activeModalTemplate}
        isOpen={Boolean(activeModalTemplate)}
        onClose={() => setActiveModalTemplate(null)}
      />
    </div>
  );
};
