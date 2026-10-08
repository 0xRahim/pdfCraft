import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

let db: Database | null = null;

export function getDb(): Database {
  if (db) return db;
  const url = process.env.DATABASE_URL || "./data/pdfcraft.db";
  mkdirSync(dirname(url), { recursive: true });
  db = new Database(url, { create: true });
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      variables TEXT NOT NULL DEFAULT '[]',
      html TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','draft','archived')),
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS renders (
      file TEXT PRIMARY KEY,
      templateId TEXT NOT NULL,
      size INTEGER NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
  return db;
}

export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  createdAt: string;
}

export interface DbTemplate {
  id: string;
  title: string;
  description: string | null;
  variables: string;
  html: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type TemplateStatus = "active" | "draft" | "archived";

export interface PublicTemplate {
  id: string;
  title: string;
  description?: string;
  variables: string[];
  status: TemplateStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PublicTemplateWithHtml extends PublicTemplate {
  html: string;
}

export function toPublicTemplate(row: DbTemplate): PublicTemplate {
  const t: PublicTemplate = {
    id: row.id,
    title: row.title,
    variables: safeParseVars(row.variables),
    status: row.status as TemplateStatus,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
  if (row.description) t.description = row.description;
  return t;
}

export function toPublicTemplateWithHtml(row: DbTemplate): PublicTemplateWithHtml {
  return { ...toPublicTemplate(row), html: row.html };
}

function safeParseVars(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
