import { Router } from "express";
import { z } from "zod";
import { existsSync, mkdirSync, statSync, createReadStream } from "node:fs";
import { join, basename } from "node:path";
import { getDb, type DbTemplate } from "../db.ts";
import { authMiddleware, type AuthRequest } from "../auth.ts";

export const renderRouter = Router();

function renderDir(): string {
  const dir = process.env.RENDER_DIR || "./storage/renders";
  mkdirSync(dir, { recursive: true });
  return dir;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function applyVariables(html: string, data: Record<string, string>): string {
  let out = html;
  for (const [key, value] of Object.entries(data)) {
    const re = new RegExp(`{{\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*}}`, "g");
    out = out.replace(re, escapeHtml(value ?? ""));
  }
  return out;
}

let browserPromise: Promise<import("puppeteer").Browser> | null = null;
async function getBrowser() {
  if (!browserPromise) {
    const puppeteer = await import("puppeteer");
    const executablePath =
      process.env.PUPPETEER_EXECUTABLE_PATH ||
      process.env.CHROME_PATH ||
      "/usr/bin/chromium";
    const { existsSync: exists } = await import("node:fs");
    browserPromise = puppeteer.launch({
      headless: true,
      ...(exists(executablePath) ? { executablePath } : {}),
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
  }
  return browserPromise;
}

const renderSchema = z.object({
  data: z.record(z.string(), z.string()).optional().default({}),
});

// POST /api/render/:id  (auth required)
renderRouter.post("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = renderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input: data must be an object" });
  }
  const db = getDb();
  const row = db.query("SELECT * FROM templates WHERE id = ?").get(req.params.id) as DbTemplate | null;
  if (!row) return res.status(404).json({ message: "Template not found" });

  let variables: string[] = [];
  try {
    const v = JSON.parse(row.variables);
    if (Array.isArray(v)) variables = v.filter((x) => typeof x === "string");
  } catch {
    variables = [];
  }

  const data = parsed.data.data;
  const missing = variables.filter((v) => !(data[v] ?? "").trim());
  if (missing.length > 0) {
    return res.status(400).json({ missing, error: "Missing required variables", message: "Missing required variables" });
  }

  const html = applyVariables(row.html, data);
  const file = `${crypto.randomUUID()}.pdf`;
  const outPath = join(renderDir(), file);

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
      await page.setContent(html, { waitUntil: "networkidle0", timeout: 15000 });
      await page.pdf({ path: outPath, format: "A4", printBackground: true });
    } finally {
      await page.close().catch(() => {});
    }
  } catch (e) {
    console.error("PDF render failed", e);
    return res.status(500).json({ message: "Failed to render PDF" });
  }

  let size = 0;
  try {
    size = statSync(outPath).size;
  } catch {
    return res.status(500).json({ message: "Failed to render PDF" });
  }

  db.query("INSERT INTO renders (file, templateId, size, createdAt) VALUES (?, ?, ?, ?)").run(
    file,
    row.id,
    size,
    new Date().toISOString()
  );

  return res.json({ downloadUrl: `/api/renders/${file}`, file, size });
});

// GET /api/renders/:file — binary PDF (auth required, per frontend downloadRenderFile)
renderRouter.get("/:file", authMiddleware, (req, res) => {
  const raw = req.params.file || "";
  const file = basename(raw);
  if (!file || !/^[A-Za-z0-9._-]+\.pdf$/i.test(file)) {
    return res.status(404).json({ message: "Render not found" });
  }
  const full = join(renderDir(), file);
  if (!existsSync(full)) {
    return res.status(404).json({ message: "Render not found" });
  }
  const size = statSync(full).size;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Length", String(size));
  res.setHeader("Content-Disposition", `attachment; filename="${file}"`);
  return createReadStream(full).pipe(res);
});
