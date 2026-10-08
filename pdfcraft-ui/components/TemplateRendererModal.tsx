import React, { useState } from "react";
import { ApiError, Template, downloadRenderFile, renderTemplate } from "../lib/api";

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
  const [values, setValues] = useState<Record<string, string>>({});
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [lastFile, setLastFile] = useState<string | null>(null);

  if (!isOpen || !template) return null;

  const variables = template.variables || [];

  const updateValue = (key: string, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  const reset = () => {
    setValues({});
    setError(null);
    setMissing([]);
    setLastFile(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleRender = async () => {
    setError(null);
    setMissing([]);
    const payload: Record<string, string> = {};
    for (const key of variables) {
      payload[key] = values[key] ?? "";
    }
    setRendering(true);
    try {
      const res = await renderTemplate(template.id, payload);
      setLastFile(res.file);
      await downloadRenderFile(res.file, `${slugify(template.title)}.pdf`);
    } catch (err) {
      if (err instanceof ApiError) {
        const body = err.body as { missing?: string[]; error?: string } | null;
        if (err.status === 400 && body?.missing) {
          setMissing(body.missing);
          setError("Please fill in all required variables.");
        } else {
          setError(err.message);
        }
      } else {
        setError(err instanceof Error ? err.message : "Render failed");
      }
    } finally {
      setRendering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-surface-card rounded-2xl border border-border shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-heading text-heading text-gray-700 font-semibold">
              {template.title}
            </h3>
            <p className="font-caption text-caption text-gray-500">
              Fill in the variables and generate a PDF.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-surface-hover"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-auto">
          {variables.length === 0 ? (
            <div className="text-body-sm text-gray-500">
              This template has no variables. Click "Generate PDF" to render with empty data.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {variables.map((key) => {
                const isMissing = missing.includes(key);
                return (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="font-label text-label text-gray-600 flex items-center gap-1">
                      <code className="font-mono text-caption text-brand-600">{`{{${key}}}`}</code>
                    </label>
                    <input
                      type="text"
                      value={values[key] ?? ""}
                      onChange={(e) => updateValue(key, e.target.value)}
                      className={`h-9 px-3 rounded-lg border bg-gray-0 text-gray-700 font-body text-body-sm focus:outline-none focus:ring-2 ${
                        isMissing
                          ? "border-red-300 focus:ring-red-400"
                          : "border-border focus:ring-brand-500"
                      }`}
                      placeholder={`Value for ${key}`}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {error && (
            <div className="mt-4 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-body-sm border border-red-200">
              {error}
            </div>
          )}

          {lastFile && !error && (
            <div className="mt-4 px-3 py-2 rounded-lg bg-success-50 text-success-700 text-body-sm border border-success-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>PDF generated and downloaded.</span>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-border flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="h-9 px-4 rounded-lg border border-border hover:bg-surface-hover text-gray-700 font-label text-label"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleRender}
            disabled={rendering}
            className="h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-label text-label font-medium disabled:opacity-60 flex items-center gap-1.5"
          >
            {rendering ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                <span>Rendering...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                <span>Generate PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

function slugify(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "document"
  );
}
