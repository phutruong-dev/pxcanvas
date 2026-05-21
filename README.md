# PXcanvas

> Content wireframe-ready trong vài phút.

Web app local-only cho UI/UX designer. Input: link website tham khảo hoặc mô tả yêu cầu. Output: sitemap canvas edit được + file `.md` content wireframe-ready paste thẳng vào Figma.

**Trạng thái:** MVP 1.0.0 — 10/10 phases complete. Xem `MVP-plan.md` và `CHANGELOG.md`.

---

## Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- (Khuyến nghị) [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) đã cài + `claude login` — để dùng AI không cần API key

---

## Setup

```bash
# 1. Clone / download project
cd web-content-app

# 2. Cài dependencies
npm install

# 3. (Tùy chọn) Copy env file nếu dùng API key
cp .env.local.example .env.local
# → Điền ANTHROPIC_API_KEY nếu không dùng Claude Code

# 4. Chạy app
npm run dev
# → Mở http://localhost:3000
```

Lần đầu chạy: nếu không detect Claude Code và chưa có API key → first-run wizard sẽ hiện để config.

---

## AI Provider

App hỗ trợ 2 mode (cấu hình trong Settings → AI Provider):

| Mode | Khi nào dùng | Setup |
|---|---|---|
| **Claude Code SDK** (default, Mode A) | Đã cài Claude Code + `claude login` | Auto-detect, không cần làm gì |
| **Anthropic API key** (Mode B) | Chưa có Claude Code | Settings → API key → Test connection |

Model mặc định: `claude-sonnet-4-6` (đủ tốt + rẻ). Có thể đổi sang Opus 4.7 hoặc Haiku 4.5 trong Settings.

---

## Scripts

| Command | Mục đích |
|---|---|
| `npm run dev` | Chạy dev server (localhost:3000) |
| `npm run build` | Build production |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |

---

## Workflow (4 steps)

```
Step 1: Input & UX Analysis  →  AI suggests improvements (US-001)
Step 2: Sitemap Canvas       →  React Flow, edit pages, drag re-parent (US-002/3/10)
Step 3: Brand Voice          →  Extract tone/principles/blacklist (US-004)
Step 4: Generate Content     →  Batch .md per page + write to folder / export ZIP (US-005/11/12)
```

Mỗi step auto-save sang localStorage (1s debounce). Reload preserves state.

---

## Folder Structure

```
src/app/          — Next.js pages (Home, Settings, /project/[id]/step-N) + API routes
src/components/   — React components per step + shared + ui (shadcn primitives)
src/lib/
  ├── ai/         — Provider abstraction + prompt loader
  ├── store/      — Zustand stores (projects, workflow, settings, undo-redo)
  ├── types/      — All TypeScript types
  ├── utils/      — Sitemap layout, debounce, JSON extract
  └── hooks/      — useSitemapMutations
prompts/          — 5 AI prompt files (edit với editor bất kỳ, app pick up live)
docs/             — Architecture, data model, conventions, decisions, troubleshooting
_reference/       — Villa T content (pilot data — read-only)
pages-output/     — Default output folder cho generated .md files
logs/             — ai-calls.jsonl (when debug logging enabled)
```

Chi tiết: `CLAUDE.md` (AI entry point) và `docs/architecture.md`.

---

## Settings (S-06)

`/settings` cho 3 mục:

- **AI Provider** — Mode A/B toggle, masked API key, model select, debug logging toggle, Test connection
- **Output Folder** — Absolute path cho `.md` writes. "Ensure folder" để tự tạo
- **Prompt Files** — Status 5 files + "Restore default" per file / all

---

## Export & Import

- **Export ZIP** (Step 4 → button "Export ZIP"): `{project}.pxcanvas.zip` chứa `meta.json + sitemap.json + brand-voice.json + brand-voice.md + pages/*.md`
- **Import ZIP** (Home → "Import" button): Upload ZIP đã export → tạo project mới + load full state

---

## Troubleshooting

Xem `docs/troubleshooting.md` cho danh sách triệu chứng + nguyên nhân + fix.

---

## License

Private project, MVP. Adjust theo needs.
