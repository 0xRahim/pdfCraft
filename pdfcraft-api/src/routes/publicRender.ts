import { Router, type Response, type NextFunction } from "express";
import { z } from "zod";
import { existsSync, mkdirSync, statSync, createReadStream } from "node:fs";
import { join, basename } from "node:path";
import { getDb, type DbTemplate } from "../db.ts";
import { tokenAuthMiddleware, type TokenAuthRequest } from "../apiTokens.ts";
import { applyVariables, sanitizeForRender } from "../sanitize.ts";
import { getBrowser } from "../browser.ts";

export const publicRenderRouter = Router();

function renderDir(): string {
  const dir = process.env.RENDER_DIR || "./storage/renders";
  mkdirSync(dir, { recursive: true });
  return dir;
}

// Simple in-memory rate limit: 30 renders / min per token.
const hits = new Map<string, number[]>();
function renderRateLimit(req: TokenAuthRequest, res: Response, next: NextFunction) {
  const key = req.apiToken?.id ?? req.ip ?? "unknown";
  const now = Date.now();
  const windowStart = now - 60_000;
  const arr = (hits.get(key) ?? []).filter((t) => t > windowStart);
  if (arr.length >= 30) {
    return res.status(429).json({ message: "Rate limit exceeded. Try again in a minute." });
  }
  arr.push(now);
  hits.set(key, arr);
  return next();
}

const renderSchema = z.object({
  data: z.record(z.string(), z.string()).optional().default({}),
});

function getTemplateOr404(id: string): DbTemplate | null {
  const db = getDb();
  return db.query("SELECT * FROM templates WHERE id = ?").get(id) as DbTemplate | null;
}

function parseVariables(row: DbTemplate): string[] {
  try {
    const v = JSON.parse(row.variables);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

// POST /api/public/render/:templateId — generate a PDF with an API token.
// Body: { data: { varName: value } } -> { downloadUrl, file, size }
publicRenderRouter.post(
  "/api/public/render/:templateId",
  tokenAuthMiddleware,
  renderRateLimit,
  async (req: TokenAuthRequest, res) => {
    const parsed = renderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input: data must be an object" });
    }
    // Token is locked to a single template.
    if (req.apiToken!.templateId !== req.params.templateId) {
      return res.status(403).json({ message: "This token is not authorized for this template" });
    }
    const row = getTemplateOr404(req.params.templateId);
    if (!row) return res.status(404).json({ message: "Template not found" });
    if (row.status !== "active") {
      return res.status(403).json({ message: "Template is not active" });
    }

    const variables = parseVariables(row);
    const data = parsed.data.data;
    const missing = variables.filter((v) => !(data[v] ?? "").trim());
    if (missing.length > 0) {
      return res.status(400).json({ missing, error: "Missing required variables", message: "Missing required variables" });
    }

    // Defense-in-depth: strip active content, then substitute escaped values.
    const html = applyVariables(sanitizeForRender(row.html), data);
    const file = `${crypto.randomUUID()}.pdf`;
    const outPath = join(renderDir(), file);

    try {
      const browser = await getBrowser();
      const page = await browser.newPage();
      try {
        // PDFs don't need JS — disabling it neutralizes any sanitizer bypass during render.
        await page.setJavaScriptEnabled(false);
        await page.setContent(html, { waitUntil: "networkidle0", timeout: 15000 });
        await page.pdf({ path: outPath, format: "A4", printBackground: true });
      } finally {
        await page.close().catch(() => {});
      }
    } catch (e) {
      console.error("Public PDF render failed", e);
      return res.status(500).json({ message: "Failed to render PDF" });
    }

    let size = 0;
    try {
      size = statSync(outPath).size;
    } catch {
      return res.status(500).json({ message: "Failed to render PDF" });
    }

    getDb()
      .query("INSERT INTO renders (file, templateId, size, createdAt) VALUES (?, ?, ?, ?)")
      .run(file, row.id, size, new Date().toISOString());

    return res.json({ downloadUrl: `/api/public/renders/${file}`, file, size });
  }
);

// GET /api/public/renders/:file — download the generated PDF with the same API token.
publicRenderRouter.get("/api/public/renders/:file", tokenAuthMiddleware, (req: TokenAuthRequest, res) => {
  const raw = req.params.file || "";
  const file = basename(raw);
  if (!file || !/^[A-Za-z0-9._-]+\.pdf$/i.test(file)) {
    return res.status(404).json({ message: "Render not found" });
  }
  // Token can only fetch files rendered for its own template.
  const db = getDb();
  const entry = db.query("SELECT file FROM renders WHERE file = ? AND templateId = ?").get(
    file,
    req.apiToken!.templateId
  ) as { file: string } | null;
  if (!entry) return res.status(404).json({ message: "Render not found" });
  const full = join(renderDir(), file);
  if (!existsSync(full)) return res.status(404).json({ message: "Render not found" });
  const size = statSync(full).size;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Length", String(size));
  res.setHeader("Content-Disposition", `attachment; filename="${file}"`);
  return createReadStream(full).pipe(res);
});
