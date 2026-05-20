# PXcanvas

> Content wireframe-ready trong vài phút.

Web app local-only cho UI/UX designer. Input: link website tham khảo hoặc mô tả yêu cầu. Output: sitemap canvas edit được + file `.md` content wireframe-ready paste thẳng vào Figma.

**Trạng thái:** Phase 1/10 — Foundation. Xem `MVP-plan.md`.

---

## Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- (Khuyến nghị) [Claude Code](https://claude.ai/code) đã cài + `claude login` — để dùng AI không cần API key

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

---

## AI Provider

App hỗ trợ 2 mode (cấu hình trong Settings):

| Mode | Khi nào dùng | Setup |
|---|---|---|
| **Claude Agent SDK** (default) | Đã cài Claude Code + `claude login` | Không cần làm gì thêm |
| **Anthropic API key** (fallback) | Chưa có Claude Code | Điền key vào `.env.local` hoặc Settings |

---

## Scripts

```bash
npm run dev      # Chạy dev server (localhost:3000)
npm run build    # Build production
npm run lint     # ESLint check
npm run typecheck # TypeScript check (tsc --noEmit)
```

---

## Folder Structure

```
src/app/          — Next.js pages + API routes
src/components/   — React components
src/lib/          — Zustand stores, types, AI provider, utils
prompts/          — 5 AI prompt files (edit qua Claude Code)
docs/             — Architecture, data model, conventions
_reference/       — Villa T content (pilot data, đừng sửa)
pages-output/     — Default output folder cho generated .md files
```

Chi tiết: `CLAUDE.md` (dành cho AI/contributors).

---

## Workflow

```
[Input URL / mô tả] → [UX Analysis] → [Sitemap Canvas] → [Brand Voice] → [Generate Content .md]
```

4 steps, mỗi step có AI assist. Output cuối là file `.md` paste vào Figma.
