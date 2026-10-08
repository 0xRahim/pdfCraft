import React, { useEffect, useState } from "react";
import { useRouter, Link } from "../../../lib/router";
import {
  ApiError,
  CreateTemplateInput,
  Template,
  TemplateWithHtml,
  UpdateTemplateInput,
  createTemplate,
  deleteTemplate,
  getTemplate,
  listTemplates,
  updateTemplate,
} from "../../../lib/api";
import { useAuth } from "../../../lib/authContext";
import { DashboardLayout } from "../layout";
import { TemplateRendererModal } from "../../../components/TemplateRendererModal";

const STARTER_HTML = `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /><title>Template</title></head>
  <body>
    <h1>Hello {{placeholder_1}}</h1>
    <p>This is a sample template. Use {{placeholder_2}} anywhere in the HTML.</p>
  </body>
</html>`;

function TemplatesInner() {
  const router = useRouter();
  const auth = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<TemplateWithHtml | null>(null);
  const [creating, setCreating] = useState(false);
  const [renderTarget, setRenderTarget] = useState<Template | null>(null);
  const [busy, setBusy] = useState(false);

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

  const filtered = templates.filter((t) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q) ||
      t.variables.some((v) => v.toLowerCase().includes(q))
    );
  });

  const openEdit = async (t: Template) => {
    setBusy(true);
    try {
      const { template } = await getTemplate(t.id);
      setEditing(template);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to load template");
    } finally {
      setBusy(false);
    }
  };

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
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading-lg text-heading-lg text-gray-700 font-semibold tracking-tight">
            Templates
          </h1>
          <p className="font-body-sm text-body-sm text-gray-500 mt-1">
            Manage your HTML templates and render them into PDFs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="h-8 px-3 rounded-lg border border-border hover:bg-surface-hover text-gray-700 font-label text-label flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Dashboard</span>
          </Link>
          <button
            onClick={() => setCreating(true)}
            className="h-8 px-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-label text-label font-medium transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Template</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-card border border-border rounded-xl p-3 flex items-center gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-gray-400 pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title, description, or variable name..."
            className="w-full h-8 pl-8 pr-3 text-body-sm bg-surface-page border border-border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-500"
          />
        </div>
        <span className="font-caption text-caption text-gray-500">
          {filtered.length} of {templates.length}
        </span>
      </div>

      {loading ? (
        <div className="bg-surface-card border border-border rounded-xl p-8 text-center text-gray-500">
          Loading templates...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-body-sm">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-card border border-border rounded-xl p-12 text-center flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[40px] text-gray-300">description</span>
          {templates.length === 0 ? (
            <>
              <p className="text-gray-700 font-medium">No templates yet</p>
              <p className="text-gray-500 text-body-sm">Create your first template to render PDFs.</p>
              <button
                onClick={() => setCreating(true)}
                className="mt-2 h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-label text-label font-medium"
              >
                Create Template
              </button>
            </>
          ) : (
            <p className="text-gray-500 text-body-sm">No templates match your filter.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
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
                {t.variables.length === 0 ? (
                  <span className="text-caption text-gray-400">No variables</span>
                ) : (
                  t.variables.slice(0, 5).map((v) => (
                    <span
                      key={v}
                      className="font-caption text-caption bg-brand-50 text-brand-700 px-2 py-0.5 rounded font-mono"
                    >
                      {`{{${v}}}`}
                    </span>
                  ))
                )}
                {t.variables.length > 5 && (
                  <span className="font-caption text-caption text-gray-500">
                    +{t.variables.length - 5} more
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
                  onClick={() => openEdit(t)}
                  disabled={busy}
                  className="h-8 px-3 rounded-lg border border-border hover:bg-surface-hover text-gray-700 font-label text-label flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="h-8 px-3 rounded-lg border border-border hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-gray-600 font-label text-label flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">delete</span>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <TemplateFormModal
          mode="create"
          onClose={() => setCreating(false)}
          onSaved={(t) => {
            setCreating(false);
            setTemplates((prev) => [t, ...prev]);
          }}
        />
      )}

      {editing && (
        <TemplateFormModal
          mode="edit"
          template={editing}
          onClose={() => setEditing(null)}
          onSaved={(t) => {
            setEditing(null);
            setTemplates((prev) => prev.map((x) => (x.id === t.id ? t : x)));
          }}
        />
      )}

      <TemplateRendererModal
        template={renderTarget}
        isOpen={!!renderTarget}
        onClose={() => setRenderTarget(null)}
      />
    </div>
  );
}

interface TemplateFormProps {
  mode: "create" | "edit";
  template?: TemplateWithHtml;
  onClose: () => void;
  onSaved: (t: Template) => void;
}

function TemplateFormModal({ mode, template, onClose, onSaved }: TemplateFormProps) {
  const [title, setTitle] = useState(template?.title || "");
  const [description, setDescription] = useState(template?.description || "");
  const [variablesRaw, setVariablesRaw] = useState((template?.variables || ["placeholder_1"]).join(", "));
  const [html, setHtml] = useState(template?.html || STARTER_HTML);
  const [status, setStatus] = useState<Template["status"]>(template?.status || "active");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const variables = variablesRaw
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      if (mode === "create") {
        const input: CreateTemplateInput = {
          title: title.trim(),
          description: description.trim() || undefined,
          variables,
          html,
          status,
        };
        const { template: created } = await createTemplate(input);
        onSaved(created);
      } else {
        const input: UpdateTemplateInput = {
          title: title.trim(),
          description: description.trim() || undefined,
          variables,
          html,
          status,
        };
        const { template: updated } = await updateTemplate(template!.id, input);
        onSaved(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-surface-card rounded-2xl border border-border shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-heading text-heading text-gray-700 font-semibold">
            {mode === "create" ? "New Template" : `Edit: ${template?.title}`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-6 py-4 flex-1 overflow-y-auto flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label text-label text-gray-600">Title *</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-border bg-gray-0 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Invoice Template"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label text-label text-gray-600">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Template["status"])}
                  className="h-9 px-3 rounded-lg border border-border bg-gray-0 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label text-label text-gray-600">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-gray-0 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Optional short description"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label text-label text-gray-600">Variables</label>
              <input
                value={variablesRaw}
                onChange={(e) => setVariablesRaw(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-gray-0 text-gray-700 font-mono text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="comma, separated, names"
              />
              <p className="text-caption text-gray-500">
                Comma-separated names used inside <code className="font-mono">{`{{name}}`}</code> placeholders.
              </p>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-h-[200px]">
              <label className="font-label text-label text-gray-600">HTML</label>
              <textarea
                required
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                spellCheck={false}
                className="flex-1 min-h-[260px] px-3 py-2 rounded-lg border border-border bg-surface-page text-gray-700 font-mono text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="<!DOCTYPE html>..."
              />
            </div>
            {error && (
              <div className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-body-sm border border-red-200">
                {error}
              </div>
            )}
          </div>
          <div className="px-6 py-3 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg border border-border hover:bg-surface-hover text-gray-700 font-label text-label"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-label text-label font-medium disabled:opacity-60"
            >
              {submitting ? "Saving..." : mode === "create" ? "Create" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <DashboardLayout>
      <TemplatesInner />
    </DashboardLayout>
  );
}
