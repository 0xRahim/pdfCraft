import { Router } from "express";
import { z } from "zod";
import {
  getDb,
  toPublicTemplate,
  toPublicTemplateWithHtml,
  type DbTemplate,
} from "../db.ts";
import { authMiddleware } from "../auth.ts";
import { assertNoActiveContent } from "../sanitize.ts";
import {
  createApiToken,
  deleteApiTokensForTemplate,
  listApiTokens,
  revokeApiToken,
} from "../apiTokens.ts";

export const templatesRouter = Router();

const statusEnum = z.enum(["active", "draft", "archived"]);

const createSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  variables: z.array(z.string().trim().min(1)).optional().default([]),
  html: z.string().min(1, "HTML is required"),
  status: statusEnum.optional().default("active"),
});

const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  variables: z.array(z.string().trim().min(1)).optional(),
  html: z.string().min(1).optional(),
  status: statusEnum.optional(),
});

templatesRouter.use(authMiddleware);

templatesRouter.get("/", (req, res) => {
  const db = getDb();
  const rows = db
    .query("SELECT * FROM templates ORDER BY createdAt DESC")
    .all() as DbTemplate[];
  return res.json({ templates: rows.map(toPublicTemplate) });
});

templatesRouter.get("/:id", (req, res) => {
  const db = getDb();
  const row = db.query("SELECT * FROM templates WHERE id = ?").get(req.params.id) as DbTemplate | null;
  if (!row) return res.status(404).json({ message: "Template not found" });
  return res.json({ template: toPublicTemplateWithHtml(row) });
});

templatesRouter.post("/", (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message || "Invalid input" });
  }
  const xss = assertNoActiveContent(parsed.data.html);
  if (!xss.ok) {
    return res.status(400).json({ message: `JavaScript is not allowed in templates: ${xss.reason}` });
  }
  const db = getDb();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const variables = [...new Set(parsed.data.variables.map((v) => v.trim()).filter(Boolean))];
  const description = parsed.data.description?.trim() ? parsed.data.description.trim() : null;
  db.query(
    "INSERT INTO templates (id, title, description, variables, html, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    id,
    parsed.data.title.trim(),
    description,
    JSON.stringify(variables),
    parsed.data.html,
    parsed.data.status,
    now,
    now
  );
  const row = db.query("SELECT * FROM templates WHERE id = ?").get(id) as DbTemplate;
  return res.status(201).json({ template: toPublicTemplate(row) });
});

templatesRouter.put("/:id", (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message || "Invalid input" });
  }
  const db = getDb();
  const row = db.query("SELECT * FROM templates WHERE id = ?").get(req.params.id) as DbTemplate | null;
  if (!row) return res.status(404).json({ message: "Template not found" });
  const now = new Date().toISOString();
  const title = parsed.data.title !== undefined ? parsed.data.title.trim() : row.title;
  if (!title) return res.status(400).json({ message: "Title is required" });
  const description =
    parsed.data.description !== undefined
      ? parsed.data.description.trim() || null
      : row.description;
  const variables =
    parsed.data.variables !== undefined
      ? [...new Set(parsed.data.variables.map((v) => v.trim()).filter(Boolean))]
      : JSON.parse(row.variables);
  const html = parsed.data.html !== undefined ? parsed.data.html : row.html;
  if (parsed.data.html !== undefined) {
    const xssUpdate = assertNoActiveContent(parsed.data.html);
    if (!xssUpdate.ok) {
      return res.status(400).json({ message: `JavaScript is not allowed in templates: ${xssUpdate.reason}` });
    }
  }
  const status = parsed.data.status ?? row.status;
  db.query(
    "UPDATE templates SET title = ?, description = ?, variables = ?, html = ?, status = ?, updatedAt = ? WHERE id = ?"
  ).run(title, description, JSON.stringify(variables), html, status, now, row.id);
  const finalRow = db.query("SELECT * FROM templates WHERE id = ?").get(row.id) as DbTemplate;
  return res.json({ template: toPublicTemplate(finalRow) });
});

const tokenNameSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
});

// POST /:id/tokens — create a per-template API token (plaintext returned once)
templatesRouter.post("/:id/tokens", (req, res) => {
  const db = getDb();
  const row = db.query("SELECT * FROM templates WHERE id = ?").get(req.params.id) as DbTemplate | null;
  if (!row) return res.status(404).json({ message: "Template not found" });
  const parsed = tokenNameSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message || "Invalid input" });
  }
  const { row: tokenRow, plaintext } = createApiToken(row.id, parsed.data.name.trim());
  return res.status(201).json({ token: { ...tokenRow, token: plaintext } });
});

// GET /:id/tokens — list token metadata (never plaintext)
templatesRouter.get("/:id/tokens", (req, res) => {
  const db = getDb();
  const row = db.query("SELECT * FROM templates WHERE id = ?").get(req.params.id) as DbTemplate | null;
  if (!row) return res.status(404).json({ message: "Template not found" });
  return res.json({ tokens: listApiTokens(row.id) });
});

// DELETE /:id/tokens/:tokenId — revoke a token
templatesRouter.delete("/:id/tokens/:tokenId", (req, res) => {
  const db = getDb();
  const row = db.query("SELECT * FROM templates WHERE id = ?").get(req.params.id) as DbTemplate | null;
  if (!row) return res.status(404).json({ message: "Template not found" });
  const ok = revokeApiToken(row.id, req.params.tokenId);
  if (!ok) return res.status(404).json({ message: "Token not found" });
  return res.status(204).send();
});

templatesRouter.delete("/:id", (req, res) => {
  const db = getDb();
  const row = db.query("SELECT id FROM templates WHERE id = ?").get(req.params.id) as {
    id: string;
  } | null;
  if (!row) return res.status(404).json({ message: "Template not found" });
  db.query("DELETE FROM templates WHERE id = ?").run(req.params.id);
  deleteApiTokensForTemplate(req.params.id);
  return res.status(204).send();
});
