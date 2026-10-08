import { Router } from "express";
import { z } from "zod";
import { getDb } from "../db.ts";
import { signToken } from "../auth.ts";

export const authRouter = Router();

const credentialsSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

authRouter.post("/login", async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message || "Invalid input" });
  }
  const email = parsed.data.email.toLowerCase();
  const db = getDb();
  const row = db.query("SELECT id, email, password_hash FROM users WHERE email = ?").get(email) as {
    id: string;
    email: string;
    password_hash: string;
  } | null;
  if (!row) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const ok = await Bun.password.verify(parsed.data.password, row.password_hash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = signToken(row.id, row.email);
  return res.json({ token, user: { id: row.id, email: row.email } });
});

authRouter.post("/register", async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message || "Invalid input" });
  }
  const email = parsed.data.email.toLowerCase();
  const db = getDb();
  const existing = db.query("SELECT id FROM users WHERE email = ?").get(email) as {
    id: string;
  } | null;
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }
  const id = crypto.randomUUID();
  const hash = await Bun.password.hash(parsed.data.password);
  db.query("INSERT INTO users (id, email, password_hash, createdAt) VALUES (?, ?, ?, ?)").run(
    id,
    email,
    hash,
    new Date().toISOString()
  );
  const token = signToken(id, email);
  return res.status(201).json({ token, user: { id, email } });
});
