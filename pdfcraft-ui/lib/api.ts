const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) || "http://localhost:3000";

const TOKEN_KEY = "pdfcraft_token";
const USER_KEY = "pdfcraft_user";

export interface ApiUser {
  id: string;
  email: string;
}

export type TemplateStatus = "active" | "draft" | "archived";

export interface Template {
  id: string;
  title: string;
  description?: string;
  variables: string[];
  status: TemplateStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateWithHtml extends Template {
  html: string;
}

export interface CreateTemplateInput {
  title: string;
  description?: string;
  variables?: string[];
  html: string;
  status?: TemplateStatus;
}

export interface UpdateTemplateInput {
  title?: string;
  description?: string;
  variables?: string[];
  html?: string;
  status?: TemplateStatus;
}

export interface RenderResponse {
  downloadUrl: string;
  file: string;
  size: number;
}

export interface ApiToken {
  id: string;
  templateId: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface CreatedApiToken extends ApiToken {
  /** Plaintext secret — returned ONLY once at creation. Store it securely. */
  token: string;
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): ApiUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ApiUser;
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: ApiUser): void {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredSession(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(fn: (() => void) | null): void {
  unauthorizedHandler = fn;
}

function isAuthPath(path: string): boolean {
  return path.startsWith("/api/auth/");
}

function notifyUnauthorized(path: string, status: number): void {
  if (status === 401 && !isAuthPath(path) && unauthorizedHandler) {
    unauthorizedHandler();
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body: unknown = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const errBody = (typeof body === "object" && body !== null ? body : {}) as {
      error?: string;
      message?: string;
      details?: unknown;
    };
    const message = errBody.message || errBody.error || `Request failed (${res.status})`;
    notifyUnauthorized(path, res.status);
    throw new ApiError(res.status, body, message);
  }
  return body as T;
}

export async function login(email: string, password: string): Promise<{ token: string; user: ApiUser }> {
  return request<{ token: string; user: ApiUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, password: string): Promise<{ token: string; user: ApiUser }> {
  return request<{ token: string; user: ApiUser }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function listTemplates(): Promise<{ templates: Template[] }> {
  return request<{ templates: Template[] }>("/api/templates");
}

export async function getTemplate(id: string): Promise<{ template: TemplateWithHtml }> {
  return request<{ template: TemplateWithHtml }>(`/api/templates/${encodeURIComponent(id)}`);
}

export async function createTemplate(input: CreateTemplateInput): Promise<{ template: Template }> {
  return request<{ template: Template }>("/api/templates", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateTemplate(
  id: string,
  input: UpdateTemplateInput
): Promise<{ template: Template }> {
  return request<{ template: Template }>(`/api/templates/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteTemplate(id: string): Promise<void> {
  await request<unknown>(`/api/templates/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function listApiTokens(templateId: string): Promise<{ tokens: ApiToken[] }> {
  return request<{ tokens: ApiToken[] }>(`/api/templates/${encodeURIComponent(templateId)}/tokens`);
}

export async function createApiToken(
  templateId: string,
  name: string
): Promise<{ token: CreatedApiToken }> {
  return request<{ token: CreatedApiToken }>(`/api/templates/${encodeURIComponent(templateId)}/tokens`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function revokeApiToken(templateId: string, tokenId: string): Promise<void> {
  await request<unknown>(
    `/api/templates/${encodeURIComponent(templateId)}/tokens/${encodeURIComponent(tokenId)}`,
    { method: "DELETE" }
  );
}

export function buildPublicRenderUrl(templateId: string): string {
  return `${API_BASE}/api/public/render/${encodeURIComponent(templateId)}`;
}

export function buildPublicRendersBase(): string {
  return `${API_BASE}/api/public/renders`;
}

export async function renderTemplate(
  id: string,
  data: Record<string, string>
): Promise<RenderResponse> {
  return request<RenderResponse>(`/api/render/${encodeURIComponent(id)}`, {
    method: "POST",
    body: JSON.stringify({ data }),
  });
}

export function buildRenderFileUrl(file: string): string {
  return `${API_BASE}/api/renders/${encodeURIComponent(file)}`;
}

export async function downloadRenderFile(
  file: string,
  suggestedName?: string
): Promise<void> {
  const token = getStoredToken();
  const res = await fetch(buildRenderFileUrl(file), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    notifyUnauthorized(`/api/renders/${file}`, res.status);
    throw new ApiError(res.status, null, `Download failed (${res.status})`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = suggestedName || file;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
