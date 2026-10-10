import { createHash, randomBytes } from "node:crypto";
import type { NextFunction, Response } from "express";
import { getDb, toPublicApiToken, type DbApiToken, type PublicApiToken } from "./db.ts";
import type { AuthRequest } from "./auth.ts";

export const TOKEN_PREFIX = "pct_";

export function hashToken(plaintext: string): string {
  return createHash("sha256").update(plaintext).digest("hex");
}

export function generateTokenPair(): { plaintext: string; tokenHash: string; prefix: string } {
  const random = randomBytes(32).toString("base64url");
  const plaintext = `${TOKEN_PREFIX}${random}`;
  return { plaintext, tokenHash: hashToken(plaintext), prefix: plaintext.slice(0, 12) };
}

export function createApiToken(templateId: string, name: string): { row: PublicApiToken; plaintext: string } {
  const db = getDb();
  const { plaintext, tokenHash, prefix } = generateTokenPair();
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  db.query(
    "INSERT INTO api_tokens (id, templateId, name, tokenHash, prefix, createdAt) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, templateId, name, tokenHash, prefix, createdAt);
  const row = db.query("SELECT * FROM api_tokens WHERE id = ?").get(id) as DbApiToken;
  return { row: toPublicApiToken(row), plaintext };
}

export function listApiTokens(templateId: string): PublicApiToken[] {
  const db = getDb();
  const rows = db
    .query("SELECT * FROM api_tokens WHERE templateId = ? ORDER BY createdAt DESC")
    .all(templateId) as DbApiToken[];
  return rows.map(toPublicApiToken);
}

export function revokeApiToken(templateId: string, tokenId: string): boolean {
  const db = getDb();
  const row = db
    .query("SELECT id FROM api_tokens WHERE id = ? AND templateId = ?")
    .get(tokenId, templateId) as { id: string } | null;
  if (!row) return false;
  db.query("DELETE FROM api_tokens WHERE id = ?").run(tokenId);
  return true;
}

export function deleteApiTokensForTemplate(templateId: string): void {
  getDb().query("DELETE FROM api_tokens WHERE templateId = ?").run(templateId);
}

export interface TokenAuthRequest extends AuthRequest {
  apiToken?: DbApiToken;
}

/**
 * Authenticates per-template API tokens (Bearer pct_...).
 * Strictly separated from JWT auth: JWTs are rejected here.
 */
export function tokenAuthMiddleware(req: TokenAuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const plaintext = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!plaintext) {
    return res.status(401).json({ message: "Missing API token. Use: Authorization: Bearer <token>" });
  }
  if (!plaintext.startsWith(TOKEN_PREFIX)) {
    return res.status(401).json({ message: "Invalid API token" });
  }
  const db = getDb();
  const row = db
    .query("SELECT * FROM api_tokens WHERE tokenHash = ?")
    .get(hashToken(plaintext)) as DbApiToken | null;
  if (!row) {
    return res.status(401).json({ message: "Invalid or revoked API token" });
  }
  req.apiToken = row;
  db.query("UPDATE api_tokens SET lastUsedAt = ? WHERE id = ?").run(new Date().toISOString(), row.id);
  return next();
}
