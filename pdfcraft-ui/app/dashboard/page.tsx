import React, { useEffect, useState } from "react";
import { useRouter, Link } from "../../lib/router";
import { ApiError, Template, deleteTemplate, listTemplates } from "../../lib/api";
import { useAuth } from "../../lib/authContext";
import { DashboardLayout } from "./layout";
import { TemplateRendererModal } from "../../components/TemplateRendererModal";

function DashboardInner() {
  const router = useRouter();
  const auth = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renderTarget, setRenderTarget] = useState<Template | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { templates } = await listTemplates();
      setTemplates(templates);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        auth.logout();
        router.replace("/login");
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this template? This cannot be undone.")) return;
    try {
      await deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading-lg text-heading-lg text-gray-700 font-semibold tracking-tight">
            Welcome to PdfCraft
          </h1>
          <p className="font-body-sm text-body-sm text-gray-500 mt-1">
            Create HTML templates, fill them with dynamic data, and download PDFs.
          </p>
        </div>
        <Link
          href="/dashboard/templates"
          className="h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-label text-label font-medium transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer self-start"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Template</span>
        </Link>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span className="font-label text-label">Templates</span>
          </div>
          <div className="mt-2 text-heading-lg font-semibold text-gray-700">{templates.length}</div>
        </div>
        <div className="bg-surface-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="material-symbols-outlined text-[18px]">data_object</span>
            <span className="font-label text-label">Variables</span>
          </div>
          <div className="mt-2 text-heading-lg font-semibold text-gray-700">
            {templates.reduce((acc, t) => acc + (t.variables?.length || 0), 0)}
          </div>
        </div>
        <div className="bg-surface-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span className="font-label text-label">Renders</span>
          </div>
          <div className="mt-2 text-heading-lg font-semibold text-gray-700">0</div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-heading text-gray-700 font-semibold">Your Templates</h2>
          <button
            onClick={() => router.push("/dashboard/templates")}
            className="font-label text-label text-brand-600 hover:text-brand-700"
          >
            Manage all →
          </button>
        </div>
        {loading ? (
          <div className="bg-surface-card border border-border rounded-xl p-8 text-center text-gray-500">
            Loading templates...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-body-sm">
            {error}
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-surface-card border border-border rounded-xl p-8 text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[36px] text-gray-300">description</span>
            <p className="text-gray-700 font-medium">No templates yet</p>
            <p className="text-gray-500 text-body-sm">
              Create your first template to start rendering PDFs.
            </p>
            <button
              onClick={() => router.push("/dashboard/templates")}
              className="mt-1 h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-label text-label font-medium transition-colors"
            >
              Create Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.slice(0, 6).map((t) => (
              <div
                key={t.id}
                className="bg-surface-card border border-border rounded-xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-heading text-gray-700 font-semibold truncate">
                    {t.title}
                  </h3>
                  <span className="font-caption text-caption bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                    {t.status}
                  </span>
                </div>
                {t.description && (
                  <p className="text-body-sm text-gray-500 line-clamp-2">{t.description}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {t.variables.slice(0, 4).map((v) => (
                    <span
                      key={v}
                      className="font-caption text-caption bg-brand-50 text-brand-700 px-2 py-0.5 rounded font-mono"
                    >
                      {`{{${v}}}`}
                    </span>
                  ))}
                  {t.variables.length > 4 && (
                    <span className="font-caption text-caption text-gray-500">
                      +{t.variables.length - 4} more
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setRenderTarget(t)}
                    className="h-8 px-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-label text-label flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                    Render
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="h-8 px-3 rounded-lg border border-border hover:bg-surface-hover text-gray-600 font-label text-label flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <TemplateRendererModal
        template={renderTarget}
        isOpen={!!renderTarget}
        onClose={() => setRenderTarget(null)}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardInner />
    </DashboardLayout>
  );
}
