import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = () => process.env.JWT_SECRET || "dev-pdfcraft-secret-change-me";
const JWT_EXPIRES_IN = () => process.env.JWT_EXPIRES_IN || "7d";

export interface AuthPayload {
  sub: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export function signToken(id: string, email: string): string {
  return jwt.sign({ sub: id, email }, JWT_SECRET(), {
    expiresIn: JWT_EXPIRES_IN() as jwt.SignOptions["expiresIn"],
  });
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET()) as AuthPayload & { sub: string };
    req.user = { sub: payload.sub, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export async function seedDemoUser() {
  const { getDb } = await import("./db.ts");
  const db = getDb();
  const email = (process.env.DEMO_EMAIL || "demo@pdfcraft.dev").trim().toLowerCase();
  const password = process.env.DEMO_PASSWORD || "Demo1234!";
  const existing = db.query("SELECT id FROM users WHERE email = ?").get(email) as
    | { id: string }
    | null;
  if (existing) return;
  const id = crypto.randomUUID();
  const hash = await Bun.password.hash(password);
  db.query("INSERT INTO users (id, email, password_hash, createdAt) VALUES (?, ?, ?, ?)").run(
    id,
    email,
    hash,
    new Date().toISOString()
  );
  console.log(`Seeded demo user ${email}`);
}
