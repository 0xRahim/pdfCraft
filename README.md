# PdfCraft

Turn HTML templates and dynamic data into pixel-perfect PDFs — in the browser or via API.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![API: Bun](https://img.shields.io/badge/API-Bun-black.svg)](pdfcraft-api)
[![UI: React 19](https://img.shields.io/badge/UI-React_19-61dafb.svg)](pdfcraft-ui)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/0xRahim/pdfCraft/pulls)

**Repo:** [github.com/0xRahim/pdfCraft](https://github.com/0xRahim/pdfCraft) · Free & open source (MIT) · Self-host in minutes.

## Features

- **Reusable HTML templates** — author once with `{{variables}}`, organize by status (`active` / `draft` / `archived`).
- **Live preview with sample data** — sandboxed, script-free iframe; auto-filled editable samples per variable.
- **XSS defense built in** — templates scanned on save (no `<script>`, event handlers, or `javascript:` URLs); PDF renders run with JavaScript disabled and values HTML-escaped.
- **One-click PDF rendering** — fill variables, generate, download a print-ready A4 PDF.
- **Per-template API tokens** — each integration gets its own revocable `pct_…` token locked to one template. `POST` data → get a PDF download link.
- **Animated landing page** — scroll-driven HTML → data → PDF story at `/`, following the app's design system.

## Quickstart

### Prerequisites

| Tool | Version | Notes |
| ---- | ------- | ----- |
| [Bun](https://bun.sh) | ≥ 1.x | Runs the API |
| [Node.js](https://nodejs.org) | ≥ 22 | Runs the UI |
| Chromium / Chrome | any recent | Used by Puppeteer for PDF rendering (`PUPPETEER_EXECUTABLE_PATH`, falls back to `/usr/bin/chromium`) |

### 1. Clone

```bash
git clone https://github.com/0xRahim/pdfCraft.git
cd pdfCraft
```

### 2. Run the API → http://localhost:3001

```bash
cd pdfcraft-api
bun install
cp .env.example .env   # adjust secrets/paths as needed
bun run dev            # hot-reload; `bun start` for plain run
```

### 3. Run the UI → http://localhost:3000

```bash
cd pdfcraft-ui
npm install
echo 'VITE_API_BASE=http://localhost:3001' > .env.local
npm run dev
```

### 4. Sign in

Demo credentials are seeded automatically and pre-filled on the login page:

- Email: `demo@pdfcraft.dev`
- Password: `Demo1234!`

## Using it

### In the browser

1. **Templates → New Template** — paste HTML with placeholders like `<h1>Bill for {{customer}}</h1>`, declare `customer, amount` as variables.
2. **Preview tab** — check the sandboxed render with auto-generated sample data.
3. **Render** — fill the variables, hit **Generate PDF**, download the file.
4. **API button** (per template card) — create a token and copy the curl example to integrate any app.

### From your own app (API tokens)

```bash
# 1. Create a token in the dashboard (API button on the template card),
#    then generate a bill:
curl -X POST "http://localhost:3001/api/public/render/<templateId>" \
  -H "Authorization: Bearer pct_••••••••" \
  -H "Content-Type: application/json" \
  -d '{"data": {"customer": "Acme Corp", "amount": "$1,240.00"}}'

# → { "downloadUrl": "/api/public/renders/<file>.pdf", "file": "<file>.pdf", "size": 41740 }

# 2. Download the finished PDF with the SAME token:
curl "http://localhost:3001/api/public/renders/<file>.pdf" \
  -H "Authorization: Bearer pct_••••••••" -o bill.pdf
```

## API reference

Base URL defaults to `http://localhost:3001`. All errors are JSON (`{ message }`).

### Auth (public)

| Method & path | Description |
| ------------- | ----------- |
| `POST /api/auth/register` | `{ email, password }` → `{ token, user }` |
| `POST /api/auth/login` | `{ email, password }` → `{ token, user }` |

Session auth: `Authorization: Bearer <jwt>`.

### Templates (JWT)

| Method & path | Description |
| ------------- | ----------- |
| `GET /api/templates` | List templates (no HTML) |
| `GET /api/templates/:id` | Get template incl. HTML |
| `POST /api/templates` | Create (`title`, `html`, `variables?`, `description?`, `status?`); rejects JavaScript with `400` |
| `PUT /api/templates/:id` | Update (same validation) |
| `DELETE /api/templates/:id` | Delete + cascade its API tokens |

### Token management (JWT)

| Method & path | Description |
| ------------- | ----------- |
| `POST /api/templates/:id/tokens` | `{ name }` → token metadata **plus plaintext secret (shown once)** |
| `GET /api/templates/:id/tokens` | List metadata (prefix, created, last-used — never secrets) |
| `DELETE /api/templates/:id/tokens/:tokenId` | Revoke immediately |

### Rendering, signed in (JWT)

| Method & path | Description |
| ------------- | ----------- |
| `POST /api/render/:id` | `{ data }` → `{ downloadUrl, file, size }`; `400` lists missing variables |
| `GET /api/renders/:file` | Download the PDF binary |

### Rendering, external (API token)

| Method & path | Description |
| ------------- | ----------- |
| `POST /api/public/render/:templateId` | Same as JWT render; token must belong to the template (`403` otherwise); only `active` templates |
| `GET /api/public/renders/:file` | Download; scoped to files rendered for the token's template |

Auth: `Authorization: Bearer pct_…`. Rate-limited (30 renders/min per token); revoked/unknown tokens → `401`.

## Project structure

```text
pdfCraft/
├── pdfcraft-api/               # Bun + Express + SQLite API (:3001)
│   └── src/
│       ├── index.ts            # App wiring & route mounts
│       ├── auth.ts             # JWT sessions + demo seed
│       ├── apiTokens.ts        # pct_ token issue / hash / middleware
│       ├── sanitize.ts         # No-JS policy: check + strip + escape
│       ├── browser.ts          # Shared Puppeteer instance
│       ├── db.ts               # bun:sqlite schema (users, templates, renders, api_tokens)
│       └── routes/
│           ├── auth.ts         # /api/auth/*
│           ├── templates.ts    # /api/templates/* incl. token management
│           ├── render.ts       # /api/render/*, /api/renders/* (JWT)
│           └── publicRender.ts # /api/public/* (API token)
├── pdfcraft-ui/                # Vite + React 19 + Tailwind v4 UI (:3000)
│   ├── App.tsx                 # Route table (landing / auth / dashboard)
│   ├── app/
│   │   ├── landing/            # Animated public landing page
│   │   ├── dashboard/          # App shell, overview, templates CRUD
│   │   └── login|register/     # Auth pages
│   ├── components/
│   │   ├── landing/            # Navbar, hero, scroll pipeline, sections
│   │   ├── TemplatePreview.tsx # Sandboxed preview + sample-data editor
│   │   ├── TemplateRendererModal.tsx
│   │   └── ApiTokenModal.tsx   # Token manager + integration docs
│   └── lib/
│       ├── api.ts              # Typed API client
│       ├── authContext.tsx     # Session state
│       └── router.tsx          # Tiny history router
└── README.md / LICENSE
```

## Configuration

### API (`pdfcraft-api/.env`)

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PORT` | `3001` | API listen port |
| `JWT_SECRET` | dev-only placeholder | **Change in production** — signs session tokens |
| `JWT_EXPIRES_IN` | `7d` | Session lifetime |
| `DATABASE_URL` | `./data/pdfcraft.db` | SQLite file (auto-created) |
| `RENDER_DIR` | `./storage/renders` | Generated PDFs on disk |
| `DEMO_EMAIL` / `DEMO_PASSWORD` | `demo@pdfcraft.dev` / `Demo1234!` | Seeded demo login |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed origins |
| `PUPPETEER_EXECUTABLE_PATH` | `/usr/bin/chromium` | System browser; falls back to bundled Chrome |

### UI (`pdfcraft-ui/.env.local`)

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `VITE_API_BASE` | `http://localhost:3001` | API base URL used by the client |

(`GEMINI_API_KEY` / `APP_URL` in `.env.example` only apply to AI-Studio hosting and are optional for self-hosting.)

## Security model

- API secrets are **SHA-256 hashed** — plaintext exists only at creation; lists never expose it.
- Tokens are **single-template scoped**; cross-template render/download is rejected; revoked tokens fail closed.
- Defense in depth for XSS: reject-on-save validation (entity-decoding aware), render-time stripping, escaped variable substitution, sandboxed preview iframe, JS-disabled headless rendering.
- **Known MVP limitation:** templates (and their tokens) are workspace-global — any signed-in user can manage any template. Per-user ownership would need a `templates.userId` migration.

## Scripts

```bash
# API
cd pdfcraft-api && bun run dev      # hot-reload
bun start                           # run
bunx tsc --noEmit                   # typecheck

# UI
cd pdfcraft-ui && npm run dev       # :3000
npm run build && npm run preview    # production build
npx tsc --noEmit                    # typecheck
```

## Contributing

Issues and pull requests are welcome at [github.com/0xRahim/pdfCraft](https://github.com/0xRahim/pdfCraft).
Please keep PRs focused, run both typechecks, and avoid committing secrets or local `data/` / `storage/` files.

## License

MIT © 2026 0xRahim — see [LICENSE](LICENSE). Free for commercial use.
