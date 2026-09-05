import React, { useState } from 'react';
import { Template } from '../types';

interface TemplateRendererModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateRendererModal: React.FC<TemplateRendererModalProps> = ({
  template,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !template) return null;

  const [variables, setVariables] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    template.variables.forEach((v) => {
      const cleanKey = v.replace(/[{}]/g, '');
      if (cleanKey === 'invoice_id') init[cleanKey] = 'INV-2024-8849';
      else if (cleanKey === 'items_table') init[cleanKey] = 'Standard License (10 Seats)';
      else if (cleanKey === 'vat_total') init[cleanKey] = '$1,420.00';
      else if (cleanKey === 'company_name') init[cleanKey] = 'Datatape Global Corp';
      else if (cleanKey === 'term_months') init[cleanKey] = '24 Months';
      else if (cleanKey === 'sign_date') init[cleanKey] = 'Nov 18, 2024';
      else if (cleanKey === 'tracking_no') init[cleanKey] = 'TRK-9921-081-US';
      else if (cleanKey === 'weight_kg') init[cleanKey] = '2.4 kg';
      else if (cleanKey === 'candidate_name') init[cleanKey] = 'Alex Reynolds';
      else if (cleanKey === 'base_salary') init[cleanKey] = '$185,000 / yr';
      else if (cleanKey === 'equity_units') init[cleanKey] = '12,000 ISOs';
      else init[cleanKey] = 'Sample Value';
    });
    return init;
  });

  const [isRendering, setIsRendering] = useState(false);
  const [renderSuccess, setRenderSuccess] = useState(false);

  const handleRender = () => {
    setIsRendering(true);
    setTimeout(() => {
      setIsRendering(false);
      setRenderSuccess(true);
      setTimeout(() => setRenderSuccess(false), 2500);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-surface-card rounded-2xl border border-border shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-page">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-heading text-gray-700 font-semibold">{template.title}</h3>
                <span className="font-caption text-[11px] font-mono bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded font-medium">
                  {template.version}
                </span>
                <span className="font-caption text-[11px] bg-success-50 text-success-600 px-2 py-0.5 rounded-full font-medium">
                  {template.status}
                </span>
              </div>
              <p className="font-caption text-caption text-gray-400">{template.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content split view: Left inputs, Right Live PDF Sheet */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Left panel: Variable Bindings */}
          <div className="md:col-span-5 p-6 border-r border-border overflow-y-auto bg-surface-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label text-label font-semibold text-gray-700 uppercase tracking-wider">
                Variable Bindings
              </span>
              <span className="font-caption text-caption text-brand-600 font-medium">
                {Object.keys(variables).length} active placeholders
              </span>
            </div>

            <div className="space-y-3">
              {template.variables.map((placeholder) => {
                const key = placeholder.replace(/[{}]/g, '');
                return (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="font-caption text-caption font-mono text-brand-600 font-medium flex items-center gap-1">
                      <span>{placeholder}</span>
                    </label>
                    <input
                      type="text"
                      value={variables[key] || ''}
                      onChange={(e) => setVariables({ ...variables, [key]: e.target.value })}
                      className="h-8 px-3 rounded-lg border border-border-strong bg-surface-page text-gray-700 font-body text-body-sm focus:border-brand-500 focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-caption text-gray-400 mb-3">
                <span>Output Format: <strong>PDF (Vector)</strong></span>
                <span>Engine: <strong>Chromium 400dpi</strong></span>
              </div>
              <button
                onClick={handleRender}
                disabled={isRendering}
                className="w-full h-9 rounded-lg bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-label text-label font-medium transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isRendering ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    <span>Rendering PDF Payload...</span>
                  </>
                ) : renderSuccess ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] text-success-50">check</span>
                    <span>Render Generated (48ms)</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    <span>Trigger Render Test</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right panel: Live Sheet Preview */}
          <div className="md:col-span-7 p-6 bg-surface-page flex flex-col items-center justify-center overflow-y-auto">
            <div className="w-full max-w-sm bg-white border border-gray-300 rounded-lg shadow-md p-6 font-body text-gray-700 space-y-4">
              {/* Document Header */}
              <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-brand-500"></div>
                    <span className="font-semibold text-[13px] text-gray-800">PdfCraft Auto-Render</span>
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Template ID: {template.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-gray-700 block">
                    {variables['invoice_id'] || variables['tracking_no'] || '#DOC-2024'}
                  </span>
                  <span className="text-[10px] text-gray-400">Date: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Dynamic Content Body */}
              <div className="space-y-2 text-body-sm">
                <div className="bg-gray-50 p-2 rounded border border-gray-100 text-[11px]">
                  <span className="text-gray-400 block uppercase tracking-wider text-[9px] font-semibold">Entity / Recipient</span>
                  <span className="font-medium text-gray-800">{variables['company_name'] || variables['candidate_name'] || 'Acme Global Client'}</span>
                </div>

                <div className="border border-gray-200 rounded p-3 space-y-1 text-[11px]">
                  <div className="flex justify-between text-gray-500">
                    <span>Description / Items</span>
                    <span>Total / Unit</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-800 pt-1 border-t border-gray-100">
                    <span>{variables['items_table'] || 'Enterprise Rendering Cloud'}</span>
                    <span className="font-mono text-brand-600">{variables['vat_total'] || variables['base_salary'] || '$1,420.00'}</span>
                  </div>
                </div>

                {variables['term_months'] && (
                  <div className="flex justify-between text-[11px] text-gray-500 px-1">
                    <span>Term Duration:</span>
                    <span className="font-medium text-gray-800">{variables['term_months']}</span>
                  </div>
                )}
                {variables['weight_kg'] && (
                  <div className="flex justify-between text-[11px] text-gray-500 px-1">
                    <span>Package Weight:</span>
                    <span className="font-medium text-gray-800">{variables['weight_kg']}</span>
                  </div>
                )}
              </div>

              {/* Barcode / Stamp footer */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-400">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-success-500">verified</span>
                  <span>Digitally Sealed &amp; Signed</span>
                </div>
                <span className="font-mono text-[9px] bg-gray-100 px-1 py-0.5 rounded">SHA256: 99a4c1</span>
              </div>
            </div>

            <span className="font-caption text-caption text-gray-400 mt-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">info</span>
              Preview dynamically reflects variable inputs above
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
