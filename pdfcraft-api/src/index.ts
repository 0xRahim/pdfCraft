import "dotenv/config";
import express from "express";
import cors from "cors";
import { getDb } from "./db.ts";
import { seedDemoUser } from "./auth.ts";
import { authRouter } from "./routes/auth.ts";
import { templatesRouter } from "./routes/templates.ts";
import { renderRouter } from "./routes/render.ts";

const app = express();
const PORT = Number(process.env.PORT || 3001);

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, true);
    },
    credentials: false,
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Exact routes expected by pdfcraft-ui/lib/api.ts
app.use("/api/auth", authRouter);
app.use("/api/templates", templatesRouter);
// renderRouter handles both POST /api/render/:id and GET /api/renders/:file
app.use("/api/render", renderRouter);
app.use("/api/renders", renderRouter);

// JSON 404 for unknown /api routes (keeps ApiError.message working)
app.use("/api", (_req, res) => res.status(404).json({ message: "Not found" }));

// Global error handler — always JSON
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

getDb();
await seedDemoUser();

app.listen(PORT, () => {
  console.log(`pdfcraft-api listening on http://localhost:${PORT}`);
});
