import React, { useEffect, useState } from "react";
import {
  ApiError,
  ApiToken,
  Template,
  buildPublicRenderUrl,
  buildPublicRendersBase,
  createApiToken,
  listApiTokens,
  revokeApiToken,
} from "../lib/api";

interface ApiTokenModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export const ApiTokenModal: React.FC<ApiTokenModalProps> = ({ template, isOpen, onClose }) => {
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState<"secret" | "curl" | null>(null);

  useEffect(() => {
    if (!isOpen || !template) return;
    setTokens([]);
    setError(null);
    setNewSecret(null);
    setName("");
    setCopied(null);
    const load = async () => {
      setLoading(true);
      try {
        const { tokens } = await listApiTokens(template.id);
        setTokens(tokens);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tokens");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen, template?.id]);

  if (!isOpen || !template) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setCreating(true);
    try {
      const { token } = await createApiToken(template.id, name.trim());
      setTokens((prev) => [
        { id: token.id, templateId: token.templateId, name: token.name, prefix: token.prefix, createdAt: token.createdAt, lastUsedAt: token.lastUsedAt },
        ...prev,
      ]);
      setNewSecret(token.token);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create token");
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (tokenId: string, tokenName: string) => {
    if (!window.confirm(`Revoke token "${tokenName}"? Integrations using it will stop working immediately.`)) return;
    setError(null);
    try {
      await revokeApiToken(template.id, tokenId);
      setTokens((prev) => prev.filter((t) => t.id !== tokenId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke token");
    }
  };

  const copy = async (text: string, which: "secret" | "curl") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError("Copy failed — select the text manually.");
    }
  };

  const sampleData = Object.fromEntries((template.variables || []).map((v) => [v, `<${v}>`]));
  const curl = [
    `# 1. Generate a bill (PDF) for template "${template.id}"`,
    `curl -X POST "${buildPublicRenderUrl(template.id)}" \\`,
    `  -H "Authorization: Bearer <PASTE_TOKEN_HERE>" \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '${JSON.stringify({ data: sampleData })}'`,
    ``,
    `# -> { "downloadUrl": "/api/public/renders/<file>.pdf", "file": "<file>.pdf", "size": 12345 }`,
    ``,
    `# 2. Download the PDF with the SAME token`,
    `curl "${buildPublicRendersBase()}/<file>.pdf" \\`,
    `  -H "Authorization: Bearer <PASTE_TOKEN_HERE>" -o bill.pdf`,
  ].join("\n");

  const errMsg = (err: unknown) => (err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Request failed");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-surface-card rounded-2xl border border-border shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-heading text-heading text-gray-700 font-semibold">
              API Access: {template.title}
            </h3>
            <p className="font-caption text-caption text-gray-500">
              Tokens are locked to this template. Generate a PDF and fetch it from your own apps.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-surface-hover"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-auto flex flex-col gap-5">
          {newSecret && (
            <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-amber-800 font-label text-label">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span>Copy this secret now — it will never be shown again.</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-body-sm bg-white border border-amber-200 rounded-lg px-3 py-2 break-all text-gray-800">
                  {newSecret}
                </code>
                <button
                  type="button"
                  onClick={() => copy(newSecret, "secret")}
                  className="h-9 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-label text-label shrink-0"
                >
                  {copied === "secret" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}

          <section className="flex flex-col gap-2">
            <h4 className="font-label text-label text-gray-700 font-medium">Tokens ({tokens.length})</h4>
            <form onSubmit={handleCreate} className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Token name, e.g. billing-service"
                maxLength={80}
                className="flex-1 h-9 px-3 rounded-lg border border-border bg-gray-0 text-gray-700 font-body text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={creating || !name.trim()}
                className="h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-label text-label font-medium disabled:opacity-60 shrink-0"
              >
                {creating ? "Creating..." : "Create token"}
              </button>
            </form>
            {loading ? (
              <p className="text-body-sm text-gray-500">Loading tokens...</p>
            ) : tokens.length === 0 ? (
              <p className="text-body-sm text-gray-500">
                No tokens yet. Create one above to let an external app generate PDFs from this template.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {tokens.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-border bg-surface-page"
                  >
                    <div className="min-w-0">
                      <div className="font-label text-label text-gray-700 truncate">{t.name}</div>
                      <div className="font-mono text-caption text-gray-500 truncate">
                        {t.prefix}••••••••
                      </div>
                      <div className="text-caption text-gray-400">
                        Created {formatDate(t.createdAt)}
                        {t.lastUsedAt ? ` · Last used ${formatDate(t.lastUsedAt)}` : " · Never used"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRevoke(t.id, t.name).catch((e) => setError(errMsg(e)))}
                      className="h-8 px-3 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 font-label text-label shrink-0"
                    >
                      Revoke
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-label text-label text-gray-700 font-medium">Integrate in your app</h4>
              <button
                type="button"
                onClick={() => copy(curl, "curl")}
                className="h-8 px-3 rounded-lg border border-border hover:bg-surface-hover text-gray-600 font-label text-label"
              >
                {copied === "curl" ? "Copied!" : "Copy example"}
              </button>
            </div>
            <ol className="text-body-sm text-gray-600 flex flex-col gap-1 list-decimal list-inside">
              <li>
                <code className="font-mono text-caption bg-gray-100 px-1 rounded">POST</code> dynamic values to{" "}
                <code className="font-mono text-caption bg-gray-100 px-1 rounded break-all">{buildPublicRenderUrl(template.id)}</code>{" "}
                with <code className="font-mono text-caption bg-gray-100 px-1 rounded">Authorization: Bearer &lt;token&gt;</code>.
              </li>
              <li>
                Read <code className="font-mono text-caption bg-gray-100 px-1 rounded">downloadUrl</code> from the response and{" "}
                <code className="font-mono text-caption bg-gray-100 px-1 rounded">GET</code> it with the same token to fetch the PDF bill.
              </li>
              {(template.variables || []).length > 0 && (
                <li>
                  Required variables:{" "}
                  {template.variables.map((v) => (
                    <code key={v} className="font-mono text-caption bg-brand-50 text-brand-700 px-1 rounded mr-1">{`{{${v}}}`}</code>
                  ))}
                </li>
              )}
            </ol>
            <pre className="font-mono text-caption bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto whitespace-pre">
              {curl}
            </pre>
          </section>

          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-body-sm border border-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-border flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg border border-border hover:bg-surface-hover text-gray-700 font-label text-label"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
