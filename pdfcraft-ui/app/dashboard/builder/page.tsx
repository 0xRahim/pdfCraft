import React, { useState } from 'react';
import { useRouter } from '../../../lib/router';
import { TemplateRendererModal } from '../../../components/TemplateRendererModal';
import { INITIAL_MY_TEMPLATES } from '../../../data/mockData';

export default function TemplateBuilderPage() {
  const router = useRouter();
  const [templateName, setTemplateName] = useState('Commercial Tax Invoice v3.2');
  const [activeTab, setActiveTab] = useState<'editor' | 'json' | 'preview'>('editor');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isSaved, setIsSaved] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Template block items
  const [blocks, setBlocks] = useState([
    { id: '1', type: 'header', content: 'COMMERCIAL TAX INVOICE', align: 'left', size: 'text-2xl', color: '#2C2C2A' },
    { id: '2', type: 'meta', label: 'Invoice Number', placeholder: '{{invoice_id}}', value: 'INV-2024-8849' },
    { id: '3', type: 'meta', label: 'Issue Date', placeholder: '{{issue_date}}', value: 'Nov 18, 2024' },
    { id: '4', type: 'meta', label: 'Due Date', placeholder: '{{due_date}}', value: 'Dec 18, 2024' },
    { id: '5', type: 'section', title: 'Billed To', placeholder: '{{client_company}}', value: 'Datatape Global Inc.' },
    { id: '6', type: 'table', placeholder: '{{items_table}}', description: 'Itemized billing table with VAT calculation' },
    { id: '7', type: 'total', label: 'Total Due', placeholder: '{{vat_total}}', value: '$1,420.00 USD' },
    { id: '8', type: 'signature', label: 'Digital Signoff', placeholder: '{{authorized_signature}}', status: 'Sealed & Valid' },
  ]);

  const [selectedBlockId, setSelectedBlockId] = useState<string>('2');

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  const addBlock = (type: string) => {
    const newId = String(Date.now());
    const newBlock = {
      id: newId,
      type,
      label: `New ${type.toUpperCase()}`,
      placeholder: `{{custom_${type}_${blocks.length + 1}}}`,
      value: 'Sample dynamic value',
      content: 'New content block',
      align: 'left',
      size: 'text-sm',
      color: '#2C2C2A',
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newId);
    setIsSaved(false);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    setIsSaved(false);
  };

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto h-[calc(100vh-120px)]">
      {/* Builder Top Bar */}
      <div className="flex items-center justify-between bg-surface-card border border-border rounded-xl px-4 py-2.5 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
            title="Back to Templates"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={templateName}
              onChange={(e) => {
                setTemplateName(e.target.value);
                setIsSaved(false);
              }}
              className="font-heading-sm text-heading-sm font-semibold text-gray-700 bg-transparent border-b border-transparent hover:border-border focus:border-brand-500 focus:outline-none px-1 py-0.5"
            />
            <span className="font-caption text-[11px] font-mono bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded">
              v3.2
            </span>
            <span className="font-caption text-[11px] text-gray-400">
              {isSaved ? 'All changes saved' : 'Unsaved changes'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-surface-page border border-border rounded-lg px-2 py-1 text-caption text-gray-600 gap-2">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 15))}
              className="hover:text-gray-900 cursor-pointer font-bold"
            >
              -
            </button>
            <span className="font-mono">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
              className="hover:text-gray-900 cursor-pointer font-bold"
            >
              +
            </button>
          </div>

          <button
            onClick={() => setShowPreviewModal(true)}
            className="h-8 px-3 rounded-lg border border-border hover:bg-gray-100 text-gray-700 font-label text-label font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>Render Preview</span>
          </button>

          <button
            onClick={() => {
              setIsSaved(true);
              alert('Template schema v3.2 compiled and synced to live rendering nodes!');
            }}
            className="h-8 px-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-label text-label font-medium shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Save &amp; Compile</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio Layout */}
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Left: Component Toolbox (3 cols) */}
        <div className="col-span-3 bg-surface-card border border-border rounded-xl p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <span className="font-label text-label font-semibold text-gray-700 uppercase tracking-wider block">
              Elements Palette
            </span>
            <div className="grid grid-cols-1 gap-2">
              {[
                { type: 'text', label: 'Text Block', icon: 'title', desc: 'Heading or body paragraph' },
                { type: 'meta', label: 'Dynamic Placeholder', icon: 'data_object', desc: 'Bound to JSON payload keys' },
                { type: 'table', label: 'Repeating Table', icon: 'table_chart', desc: 'Maps arrays into rows' },
                { type: 'barcode', label: 'Barcode / QR Matrix', icon: 'qr_code', desc: 'Code128, QR, PDF417' },
                { type: 'signature', label: 'Signature Anchor', icon: 'draw', desc: 'DocuSign / PDF cert' },
                { type: 'image', label: 'Logo / Image Asset', icon: 'image', desc: 'Vector SVG or high-res PNG' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => addBlock(item.type)}
                  className="w-full text-left p-2.5 rounded-lg border border-border hover:border-brand-400 hover:bg-surface-hover transition-all flex items-start gap-2.5 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  </div>
                  <div>
                    <span className="font-label text-label text-gray-700 font-medium block">
                      {item.label}
                    </span>
                    <span className="font-caption text-caption text-gray-400">
                      {item.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border font-caption text-caption text-gray-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Click any element to add it to the active canvas page.</span>
          </div>
        </div>

        {/* Center: A4 PDF Stage Canvas (6 cols) */}
        <div className="col-span-6 bg-surface-page border border-border rounded-xl p-6 overflow-y-auto flex justify-center items-start">
          <div
            className="w-full max-w-[520px] bg-white border border-gray-300 rounded-lg shadow-lg p-8 font-body transition-transform duration-150 origin-top"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* Header branding */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-brand-500 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
                  </div>
                  <span className="font-bold text-gray-800 text-[14px]">PdfCraft Automated Engine</span>
                </div>
                <span className="font-caption text-[10px] text-gray-400 block mt-1 font-mono">
                  Schema: {templateName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[12px] font-bold text-gray-700 font-mono">OFFICIAL INVOICE</span>
                <span className="text-[10px] text-gray-400 block">Standard 400 DPI</span>
              </div>
            </div>

            {/* Document Dynamic Blocks */}
            <div className="space-y-3">
              {blocks.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBlockId(b.id)}
                  className={`p-2.5 rounded border transition-all cursor-pointer relative group ${
                    selectedBlockId === b.id
                      ? 'border-brand-500 ring-2 ring-brand-100 bg-brand-50/20'
                      : 'border-dashed border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-caption text-[10px] uppercase font-semibold text-gray-400">
                      {b.type}
                    </span>
                    {b.placeholder && (
                      <span className="font-mono text-[10px] text-brand-600 bg-brand-50 px-1 rounded">
                        {b.placeholder}
                      </span>
                    )}
                  </div>

                  <div className="text-body-sm font-medium text-gray-800">
                    {b.content || b.value || b.description || b.label}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBlock(b.id);
                    }}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-danger-600 p-0.5 rounded transition-opacity cursor-pointer"
                    title="Delete element"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                  </button>
                </div>
              ))}
            </div>

            {/* PDF Watermark / Footer */}
            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400">
              <span className="font-mono">Page 1 of 1 • Vector PDF</span>
              <span>DocuSign Qualified Electronic Signature</span>
            </div>
          </div>
        </div>

        {/* Right: Element Properties Inspector (3 cols) */}
        <div className="col-span-3 bg-surface-card border border-border rounded-xl p-4 flex flex-col justify-between overflow-y-auto">
          {selectedBlock ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="font-label text-label font-semibold text-gray-700 uppercase tracking-wider">
                  Block Inspector
                </span>
                <span className="font-caption text-[11px] bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded font-mono">
                  #{selectedBlock.id}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label text-label text-gray-600">Dynamic Key Binding</label>
                  <input
                    type="text"
                    value={selectedBlock.placeholder || ''}
                    onChange={(e) => {
                      setBlocks(
                        blocks.map((b) =>
                          b.id === selectedBlock.id ? { ...b, placeholder: e.target.value } : b
                        )
                      );
                      setIsSaved(false);
                    }}
                    className="h-8 px-2.5 font-mono text-[12px] bg-surface-page border border-border rounded-lg text-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label text-label text-gray-600">Default Sample Value</label>
                  <input
                    type="text"
                    value={selectedBlock.value || selectedBlock.content || ''}
                    onChange={(e) => {
                      setBlocks(
                        blocks.map((b) =>
                          b.id === selectedBlock.id
                            ? { ...b, value: e.target.value, content: e.target.value }
                            : b
                        )
                      );
                      setIsSaved(false);
                    }}
                    className="h-8 px-2.5 font-body text-body-sm bg-surface-page border border-border rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label text-label text-gray-600">Text Alignment</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => {
                          setBlocks(
                            blocks.map((b) =>
                              b.id === selectedBlock.id ? { ...b, align } : b
                            )
                          );
                          setIsSaved(false);
                        }}
                        className={`h-7 rounded border text-caption capitalize cursor-pointer ${
                          selectedBlock.align === align
                            ? 'bg-brand-50 border-brand-400 text-brand-600 font-medium'
                            : 'border-border text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label text-label text-gray-600">Font Size</label>
                  <select
                    value={selectedBlock.size || 'text-sm'}
                    onChange={(e) => {
                      setBlocks(
                        blocks.map((b) =>
                          b.id === selectedBlock.id ? { ...b, size: e.target.value } : b
                        )
                      );
                      setIsSaved(false);
                    }}
                    className="h-8 px-2 bg-surface-page border border-border rounded-lg text-caption text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                  >
                    <option value="text-xs">Caption (11px)</option>
                    <option value="text-sm">Body (13px)</option>
                    <option value="text-base">Subheading (16px)</option>
                    <option value="text-xl">Heading (20px)</option>
                    <option value="text-2xl">Display (24px)</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400 font-body-sm">
              Select an element from the document canvas to inspect properties.
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="w-full h-8 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-label text-label font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Test Render</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Preview Modal */}
      <TemplateRendererModal
        template={INITIAL_MY_TEMPLATES[0]}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />
    </div>
  );
}
