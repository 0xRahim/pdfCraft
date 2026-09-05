import React, { useState } from 'react';
import { useRouter } from '../../../lib/router';
import { INITIAL_MY_TEMPLATES, INITIAL_BLUEPRINTS } from '../../../data/mockData';
import { Template, Blueprint } from '../../../types';
import { TemplateRendererModal } from '../../../components/TemplateRendererModal';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>(INITIAL_MY_TEMPLATES);
  const [blueprints] = useState<Blueprint[]>(INITIAL_BLUEPRINTS);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBlueprintCategory, setSelectedBlueprintCategory] = useState('All');
  const [activeModalTemplate, setActiveModalTemplate] = useState<Template | null>(null);
  const [cloneNotification, setCloneNotification] = useState<string | null>(null);

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.variables.some((v) => v.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleClone = (bp: Blueprint) => {
    const newTemplate: Template = {
      id: `tmpl_${Date.now()}`,
      title: bp.title.length > 22 ? bp.title.slice(0, 19) + '...' : bp.title,
      description: bp.description,
      version: 'v1.0',
      status: 'Active',
      variables: bp.tags.map((t) => `{{${t.toLowerCase().replace(/[^a-z0-9]/g, '_')}}}`),
      renders: '0',
      updatedAt: 'Just now',
      previewType: bp.previewVariant === 'invoice' ? 'invoice' : bp.previewVariant === 'contract' ? 'contract' : 'shipping',
      category: 'Invoices',
    };
    setTemplates([newTemplate, ...templates]);
    setCloneNotification(`Cloned "${bp.title}" into your workspace!`);
    setTimeout(() => setCloneNotification(null), 3000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {cloneNotification && (
        <div className="fixed top-16 right-8 z-50 bg-gray-700 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-gray-600 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-success-500 text-[18px]">check_circle</span>
          <span className="font-label text-label">{cloneNotification}</span>
        </div>
      )}

      {/* Header with Search and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading-lg text-heading-lg text-gray-700 font-semibold tracking-tight">
              PDF Templates Catalog
            </h1>
            <span className="font-caption text-caption bg-brand-50 text-brand-700 px-2 py-0.5 rounded font-mono font-medium">
              18 Active
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-gray-500 mt-1">
            Build, edit, and bind dynamic variables to vector PDF templates with automatic schema checks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/dashboard')}
            className="h-8 px-3 rounded-lg border border-border hover:bg-surface-hover text-gray-700 font-label text-label flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Dashboard Overview</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/builder')}
            className="h-8 px-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-label text-label font-medium transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_box</span>
            <span>Create Template</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-card border border-border rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 w-full md:w-auto">
          {['All', 'Invoices', 'Contracts', 'Logistics', 'Tickets'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-label text-label transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-50 text-brand-600 font-medium'
                  : 'text-gray-600 hover:bg-surface-hover hover:text-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-gray-400 pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter templates or {{tags}}..."
            className="w-full h-8 pl-8 pr-3 text-body-sm bg-surface-page border border-border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-surface-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-brand-400 hover:shadow-sm transition-all group"
          >
            <div>
              {/* Mini preview canvas */}
              <div
                onClick={() => setActiveModalTemplate(template)}
                className="h-32 rounded-lg bg-surface-page border border-border flex items-center justify-center p-3 relative overflow-hidden mb-3.5 cursor-pointer group-hover:border-brand-300 transition-colors"
              >
                {template.previewType === 'invoice' ? (
                  <div className="w-20 h-24 bg-white rounded shadow-xs border border-gray-200 p-2 flex flex-col gap-1.5 group-hover:scale-105 transition-transform">
                    <div className="w-6 h-1.5 bg-brand-500 rounded-xs"></div>
                    <div className="w-14 h-1 bg-gray-200 rounded-xs"></div>
                    <div className="w-10 h-1 bg-gray-200 rounded-xs"></div>
                    <div className="mt-auto flex justify-between items-center">
                      <div className="w-4 h-1 bg-gray-300 rounded-xs"></div>
                      <div className="w-4 h-1.5 bg-success-500 rounded-xs"></div>
                    </div>
                  </div>
                ) : template.previewType === 'contract' ? (
                  <div className="w-20 h-24 bg-white rounded shadow-xs border border-gray-200 p-2 flex flex-col gap-1.5 group-hover:scale-105 transition-transform">
                    <div className="w-8 h-1.5 bg-gray-700 rounded-xs"></div>
                    <div className="w-16 h-1 bg-gray-200 rounded-xs"></div>
                    <div className="w-14 h-1 bg-gray-200 rounded-xs"></div>
                    <div className="w-12 h-1 bg-gray-200 rounded-xs"></div>
                    <div className="mt-auto border-t border-dashed border-gray-300 pt-1 flex justify-between items-center">
                      <span className="material-symbols-outlined text-[10px] text-brand-500">draw</span>
                      <div className="w-6 h-1 bg-gray-400 rounded-xs"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-16 bg-white rounded shadow-xs border border-gray-200 p-2 flex items-center justify-between group-hover:scale-105 transition-transform">
                    <div className="flex flex-col gap-1">
                      <div className="w-10 h-1.5 bg-warning-600 rounded-xs"></div>
                      <div className="w-8 h-1 bg-gray-300 rounded-xs"></div>
                      <div className="w-12 h-1 bg-gray-200 rounded-xs"></div>
                    </div>
                    <span className="material-symbols-outlined text-[20px] text-gray-700">qr_code_2</span>
                  </div>
                )}
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-white/90 border border-border font-caption text-[11px] text-gray-500 font-mono">
                  {template.version}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading-sm text-heading-sm text-gray-700 font-medium group-hover:text-brand-600 transition-colors">
                    {template.title}
                  </h3>
                  <p className="font-caption text-caption text-gray-400 mt-1 line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Dynamic Variables list */}
              <div className="mt-3 flex flex-wrap gap-1">
                {template.variables.slice(0, 3).map((v) => (
                  <span
                    key={v}
                    className="font-caption text-[10px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                  >
                    {v}
                  </span>
                ))}
                {template.variables.length > 3 && (
                  <span className="font-caption text-[10px] font-mono bg-gray-100 text-gray-500 px-1 py-0.5 rounded">
                    +{template.variables.length - 3}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between font-caption text-caption text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success-500"></span>
                <span>{template.renders} renders</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/dashboard/builder')}
                  className="hover:text-brand-600 font-label text-label cursor-pointer"
                >
                  Edit Schema
                </button>
                <span className="text-gray-300">•</span>
                <button
                  onClick={() => setActiveModalTemplate(template)}
                  className="hover:text-brand-600 font-label text-label text-brand-600 font-medium cursor-pointer"
                >
                  Test Render
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Community Blueprints Section */}
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-heading text-gray-700 font-semibold">
              Community PDF Blueprints
            </h2>
            <p className="font-body-sm text-body-sm text-gray-500">
              One-click clone vector-optimized templates into your workspace.
            </p>
          </div>
          <div className="flex items-center gap-1">
            {['All', 'Legal', 'Finance', 'Logistics'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedBlueprintCategory(cat)}
                className={`px-2.5 py-1 rounded text-caption font-label cursor-pointer ${
                  selectedBlueprintCategory === cat
                    ? 'bg-brand-50 text-brand-600 font-medium'
                    : 'text-gray-500 hover:bg-surface-hover'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {blueprints
            .filter(
              (bp) =>
                selectedBlueprintCategory === 'All' ||
                bp.category === selectedBlueprintCategory
            )
            .map((bp) => (
              <div
                key={bp.id}
                className="bg-surface-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-brand-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-caption text-[11px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded font-mono">
                      {bp.category}
                    </span>
                    <span className="font-caption text-[11px] text-gray-400">
                      ★ {bp.downloads} installs
                    </span>
                  </div>
                  <h3 className="font-heading-sm text-heading-sm text-gray-700 font-medium">
                    {bp.title}
                  </h3>
                  <p className="font-caption text-caption text-gray-500 mt-1">
                    {bp.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {bp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-caption text-[10px] bg-surface-page border border-border text-gray-600 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className="font-caption text-caption text-gray-400">by {bp.author}</span>
                  <button
                    onClick={() => handleClone(bp)}
                    className="h-7 px-2.5 rounded bg-brand-50 hover:bg-brand-100 text-brand-700 font-label text-caption font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    <span>Clone Template</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Render Preview Modal */}
      <TemplateRendererModal
        template={activeModalTemplate}
        isOpen={Boolean(activeModalTemplate)}
        onClose={() => setActiveModalTemplate(null)}
      />
    </div>
  );
}
