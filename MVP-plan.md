# PXcanvas — MVP Implementation Plan

> File theo dõi triển khai MVP. Đọc kèm `PRD.md` (yêu cầu) và `screen.md` (UI).
> Mỗi phase: deliver chạy được + commit + bump `CHANGELOG.md`. Check tick `[x]` khi done.

---

## 🎯 Triết lý triển khai

1. **Docs trước code** — `CLAUDE.md` + `docs/` tạo từ Phase 1, mỗi phase cập nhật phần liên quan.
2. **Types & contracts trước UI** — fix data shape sớm, UI lắp vào.
3. **AI provider abstraction trước feature** — mọi AI call đi qua 1 cổng duy nhất.
4. **Vertical slices** — mỗi phase deliver 1 màn end-to-end (UI + API + state + persist).
5. **Mỗi phase chạy được + commit + bump CHANGELOG**.

---

## 📁 Target folder structure (đạt được cuối Phase 1)

```
web-content-app/
├── CLAUDE.md                    # AI primary entry — rules, conventions, links
├── README.md                    # User setup
├── CHANGELOG.md                 # Version history mỗi phase
├── MVP-plan.md                  # (file này)
├── PRD.md                       # (existing)
├── screen.md                    # (existing)
├── docs/
│   ├── architecture.md          # System layers + data flow
│   ├── data-model.md            # All TS types/interfaces
│   ├── ai-prompts.md            # Prompt files spec + placeholders
│   ├── api-routes.md            # API route inventory + I/O shapes
│   ├── state-management.md      # Zustand stores layout
│   ├── conventions.md           # Naming, imports, Tailwind order
│   ├── troubleshooting.md       # Common errors + fixes
│   └── decisions/               # ADR-lite mini docs
├── prompts/                     # US-015 — 5 file .md, edit qua Claude Code
│   ├── 01-ux-analysis.md
│   ├── 02-sitemap-generate.md
│   ├── 03-brand-voice-extract.md
│   ├── 04-sections-propose.md
│   └── 05-content-generate.md
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx                       # S-00 Home
│   │   ├── settings/page.tsx              # S-06
│   │   ├── project/[id]/
│   │   │   ├── layout.tsx                 # workflow shell
│   │   │   ├── step-1/page.tsx            # S-02
│   │   │   ├── step-2/page.tsx            # S-03
│   │   │   ├── step-3/page.tsx            # S-04
│   │   │   └── step-4/page.tsx            # S-05
│   │   └── api/
│   │       ├── ai/{ux-analysis,sitemap,brand-voice,sections,content,test-connection}/route.ts
│   │       ├── files/{write-content,check-folder,export-zip,import-zip}/route.ts
│   │       └── prompts/ensure-defaults/route.ts
│   ├── components/
│   │   ├── ui/                            # shadcn primitives
│   │   ├── home/, workflow/, step-1..4/, settings/
│   ├── lib/
│   │   ├── ai/{provider,claude-agent,anthropic-api,prompt-loader,detect}.ts
│   │   ├── store/{projects,workflow,settings,undo-redo}.ts
│   │   ├── files/{export-zip,import-zip,png-export}.ts
│   │   ├── types/{project,sitemap,brand-voice,content,settings}.ts
│   │   └── utils/{debounce,validation,markdown}.ts
│   └── styles/globals.css
├── pages-output/                # default output (configurable)
├── package.json, tsconfig.json, tailwind.config.ts, next.config.ts
└── .env.local.example
```

---

## ✅ Phase Tracker (high-level)

| Phase | Status | Title | Screens / US |
|---|---|---|---|
| 0 | ✅ | Folder Restructure (Villa T → reference) | — |
| 1 | ✅ | Foundation & AI-friendly Docs | — |
| 2 | ✅ | Data Model & Type Layer | — |
| 3 | ✅ | State Management & Persistence | — |
| 4 | ✅ | AI Provider Abstraction & Prompts | US-013, US-015 (backend) |
| 5 | ✅ | Home & Project Lifecycle | S-00, S-01 · US-006/7/8/9 |
| 6 | ✅ | Step 1 — Input & UX Analysis | S-02 · US-001 |
| 7 | ✅ | Step 2 — Sitemap Canvas | S-03 · US-002/3/10 |
| 8 | ✅ | Step 3 — Brand Voice | S-04 · US-004 |
| 9 | ✅ | Step 4 — Generate Content + Zip | S-05 · US-005/11/12 |
| 10 | ✅ | Settings UI + Polish | S-06 · US-013/14/15 (UI) |

**Legend:** ⬜ chưa làm · 🚧 đang làm · ✅ xong · ⏸️ tạm hoãn

---

## Phase 0 — Folder Restructure ✅

**Goal:** Tách Villa T content cũ khỏi root để không lẫn với code app.

### Tasks
- [x] Tạo `_reference/villa-t/`
- [x] Move Villa T files: `CLAUDE.md` → `_reference/villa-t/villa-content-rules.md`, `README.md`, `plan.md`, `sitemap.md`, `_foundations/`, `_templates/`, `pages/`
- [x] Tạo `CLAUDE.md` mới (stub) cho PXcanvas — sẽ mở rộng Phase 1
- [x] Tạo `README.md` mới (stub) cho PXcanvas — sẽ mở rộng Phase 1
- [x] Tạo `_reference/README.md` giải thích vai trò reference data

### Done khi
- Root folder chỉ còn file thuộc app PXcanvas
- Villa T data nguyên vẹn trong `_reference/villa-t/`
- Stub `CLAUDE.md` warn AI không đọc nhầm Villa T rules

---

## Phase 1 — Foundation & AI-friendly Docs

**Goal:** Scaffolding chạy được, docs đủ để AI vibe-code các phase sau.

### Tasks
- [x] Init Next.js 15 (App Router) + TypeScript + Tailwind
- [x] Install deps: `zustand`, `reactflow`, `jszip`, `html-to-image`, `@anthropic-ai/sdk`, `sonner`
- [x] `npx shadcn init --defaults` + add: button, input, textarea, dialog, dropdown-menu, card, badge, checkbox, tabs, separator, sonner, label, select
- [x] Tạo folder skeleton theo target structure
- [x] Viết `CLAUDE.md` (root) — order đọc file, tech stack, folder map, conventions, rules
- [x] Viết `README.md` — setup, npm scripts, prerequisites
- [x] Viết `CHANGELOG.md` — Keep-a-Changelog format
- [x] Viết `docs/architecture.md` — system layers + data flow
- [x] Viết `docs/data-model.md` — tất cả TS types
- [x] Viết `docs/ai-prompts.md` — 5 prompts spec + placeholders
- [x] Viết `docs/api-routes.md` — API inventory
- [x] Viết `docs/state-management.md` — store map + patterns
- [x] Viết `docs/conventions.md` — naming, imports, error handling
- [x] Viết `docs/troubleshooting.md` — stub + initial entries
- [x] Tạo `.env.local.example`, thêm `typecheck` script, update `.gitignore`
- [x] git init + commit phase 1

### Done khi
- `npm run dev` chạy được, trang trắng có header "PXcanvas"
- git init + commit phase 1

---

## Phase 2 — Data Model & Type Layer

**Goal:** Đóng băng types/contracts trước khi viết UI.

### Tasks
- [x] `src/lib/types/project.ts` — `Project`, `ProjectZipMeta`
- [x] `src/lib/types/sitemap.ts` — `SitemapNode`
- [x] `src/lib/types/brand-voice.ts` — `BrandVoice`
- [x] `src/lib/types/content.ts` — `Section`, `PageContent`, `PageContentStatus`
- [x] `src/lib/types/settings.ts` — `Settings`, `AIProvider`, `DEFAULT_SETTINGS`
- [x] `src/lib/types/ux-analysis.ts` — `UxImprovement`, `FormInput`, `SiteType`
- [x] `docs/data-model.md` — viết ở Phase 1
- [x] localStorage schema documented trong `docs/state-management.md`
- [ ] (Post-MVP) Zod schemas cho import zip validation

### Done khi
- `tsc --noEmit` pass
- `docs/data-model.md` có đủ types, commit

---

## Phase 3 — State Management & Persistence

**Goal:** Zustand stores + localStorage layer chạy được.

### Tasks
- [x] `src/lib/store/projects.ts` — list, add, rename, delete, duplicate, get-by-id + persist
- [x] `src/lib/store/workflow.ts` — per-project state, dynamic localStorage, debounced 1s, tree helpers
- [x] `src/lib/store/settings.ts` — provider mode, API key, output folder, model, debug logging
- [x] `src/lib/store/undo-redo.ts` — stack max 20, push/undo/redo + deep clone
- [x] `src/lib/utils/debounce.ts`
- [x] Handler localStorage quota exceeded → toast (implemented in `src/app/page.tsx` "Storage is almost full" warning at >4.5MB)
- [x] `docs/state-management.md` — viết ở Phase 1

### Done khi
- Demo page tạo project, refresh giữ state
- Commit

---

## Phase 4 — AI Provider Abstraction & Prompt Files

**Goal:** Mọi AI call đi qua 1 interface, prompts đọc từ disk (US-015).

### Tasks
- [x] `src/lib/ai/provider.ts` — `callAI(promptKey, vars, options)` single entry point
- [x] `src/lib/ai/claude-agent.ts` — Mode A (spawn claude CLI subprocess, 30s timeout)
- [x] `src/lib/ai/anthropic-api.ts` — Mode B (@anthropic-ai/sdk)
- [x] `src/lib/ai/detect.ts` — execSync `claude --version`
- [x] `src/lib/ai/prompt-loader.ts` — read + replace + auto-regen from defaults
- [x] API `/api/ai/test-connection`
- [x] API `/api/prompts/ensure-defaults`
- [x] API `/api/health` (bonus)
- [x] API `/api/dev/regenerate-prompts` (dev-only bonus)
- [x] 5 prompt files seeded in `prompts/`
- [x] `docs/ai-prompts.md` — viết ở Phase 1
- [x] `docs/api-routes.md` — viết ở Phase 1

### Done khi
- `/api/ai/test-connection` trả OK cho cả 2 mode (nếu có)
- `prompts/` tự sinh khi missing
- Commit

---

## Phase 5 — Home & Project Lifecycle (S-00, S-01) ✅

**Covers:** US-006, US-007, US-008, US-009.

### Tasks
- [x] `app/page.tsx` — render project grid + empty state + localStorage quota warning
- [x] `components/home/project-card.tsx` — card + 3-dot menu (Rename inline / Duplicate / Delete)
- [x] `components/home/new-project-modal.tsx` — modal nhập tên + auto-suffix `(2)`
- [x] `components/home/empty-state.tsx`
- [x] `components/ui/delete-confirm-modal.tsx` — reusable (Phase 7 dùng lại)
- [x] Top bar: logo + "New Project" + Import (wired Phase 9) + Settings icon
- [x] Click card → router push `/project/[id]/step-{currentStep}`

### Done khi
- CRUD project hoạt động, persist localStorage
- Commit + CHANGELOG

---

## Phase 6 — Workflow Step 1: Input & UX Analysis (S-02) ✅

**Covers:** US-001.

### Tasks
- [x] `app/project/[id]/layout.tsx` — workflow shell: StepIndicator (1/4..4/4), breadcrumb, settings button
- [x] `app/project/[id]/step-1/page.tsx` — 3-stage flow (input → analyzing → results)
- [x] `components/step-1/input-form.tsx` — URL + site type + 3 textareas + tone chips + validation
- [x] `components/step-1/ux-improvements-list.tsx` — checkbox items, loading, error/retry, skip
- [x] API route `/api/ai/ux-analysis` — gọi prompt-loader key `01-ux-analysis`, return `UxImprovement[]`
- [x] Edge cases: URL fail vẫn chạy, AI 0 improvements → message, AI fail → retry/skip
- [x] Save state → workflow store, "Continue" → step-2

### Done khi
- End-to-end: input → AI → tick → Continue lưu state
- Commit

---

## Phase 7 — Workflow Step 2: Sitemap Canvas (S-03) ✅

**Covers:** US-002, US-003, US-010.

### Tasks
- [x] `app/project/[id]/step-2/page.tsx`
- [x] API route `/api/ai/sitemap` — input form + improvements ticked, output tree JSON
- [x] `components/step-2/sitemap-canvas.tsx` — React Flow + custom node type
- [x] `components/step-2/node-card.tsx` — name + description + "+" + "improved" badge
- [x] `components/step-2/side-panel.tsx` — edit name/description/delete + sibling reorder
- [x] `components/step-2/canvas-toolbar.tsx` — undo/redo, zoom, save indicator, node count, regenerate chip
- [x] Node interactions: add child (+), select, rename/description (side panel), delete (confirm if children), sibling reorder (↑↓), drag re-parent (block descendant)
- [x] Wire undo/redo store via `useSitemapMutations`, Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y
- [x] Auto-save debounced 1s + `savingStatus` field in workflow store
- [x] Loading overlay khi AI generate, retry button khi fail, "Regenerate" chip khi < 3 pages
- [x] Export modal (M-02): JSON serialize tree / PNG (html-to-image)

### Done khi
- Generate sitemap → edit đủ 9 thao tác → undo/redo → reload giữ state → export JSON/PNG
- Commit

---

## Phase 8 — Workflow Step 3: Brand Voice (S-04) ✅

**Covers:** US-004.

### Tasks
- [x] `app/project/[id]/step-3/page.tsx`
- [x] API route `/api/ai/brand-voice` — input URL/file/text → 5-field structured
- [x] `components/step-3/brand-voice-input.tsx` — URL + drag-drop upload (.md/.txt ≤10MB, PDF deferred) + textarea
- [x] `components/step-3/brand-voice-form.tsx` — editable 5 fields + regen + save + validation
- [x] `components/step-3/brand-voice-summary.tsx` — collapsed input summary post-save
- [x] File parsing strategy → `docs/decisions/0001-pdf-parsing-deferred.md`
- [x] Validation: dirty/unsaved → Continue blocked + hint; field-level toasts on Save

### Done khi
- Generate brand voice → edit → save persist → Continue chỉ enable sau save
- Commit

---

## Phase 9 — Workflow Step 4: Generate Content + Zip (S-05) ✅

**Covers:** US-005, US-011, US-012.

### Tasks
- [x] `app/project/[id]/step-4/page.tsx`
- [x] API `/api/ai/sections` — propose section list per page
- [x] API `/api/ai/content` — generate `.md` per page (node + sections + brand voice + format rules)
- [x] API `/api/files/write-content` — fs/promises write file, return path + existed flag
- [x] API `/api/files/check-folder` — verify path writable, mkdir if missing
- [x] API `/api/files/export-zip` — meta.json + sitemap.json + brand-voice.json + brand-voice.md + pages/*.md
- [x] API `/api/files/import-zip` — parse zip → validate meta → return project data
- [x] `components/step-4/page-list.tsx` — sidebar list + status badge + depth indent + per-row retry
- [x] `components/step-4/section-editor.tsx` — HTML5 drag reorder, add/remove, inline rename
- [x] `components/step-4/content-preview.tsx` — pre markdown, blacklist highlight, copy, regen
- [x] `components/step-4/batch-progress.tsx` — progress bar, cancel, failed list + retry failed
- [x] `components/step-4/overwrite-modal.tsx` — M-03: Overwrite/Skip/Rename input
- [x] Import button trên Home wired → /api/files/import-zip → create project + route to step-4

### Done khi
- Generate All → file `.md` ra folder + preview + copy
- Export/Import zip round-trip OK
- Edge cases per PRD US-005, commit

---

## Phase 10 — Settings UI + Polish ✅

**Covers:** US-013, US-014, US-015 (UI), global polish.

### Tasks
- [x] `app/settings/page.tsx` — 3 section cards (Provider / Output / Prompts)
- [x] `components/settings/ai-provider.tsx` — Mode A/B toggle, masked key + eye toggle, model select, debug logging, sdkDetected badge, Test connection với ephemeral badge
- [x] `components/settings/output-folder.tsx` — path input + onBlur check (`noCreate:true`) + "Ensure folder" button (mkdir). Skip browse picker (File System Access không cho server-side path)
- [x] `components/settings/prompt-files.tsx` — 5 rows với ✓/✗ + "Restore default" per file + "Restore all"
- [x] First-run wizard (`components/first-run/{wizard,first-run-gate}.tsx`) — Dialog modal trong root layout, gate qua client
- [x] Error boundaries — `app/error.tsx`, `app/global-error.tsx`, `app/project/[id]/error.tsx`
- [x] Toast system — Toaster đã mounted ở `layout.tsx`, đã dùng xuyên suốt step pages
- [x] Performance: NodeCard đã memo từ Phase 7, selectors là single-field (không cần refactor)
- [x] Accessibility — tất cả icon-only `<Button size="icon">` đã có `aria-label`
- [x] `docs/troubleshooting.md` — expanded với edge cases Phase 5-9
- [x] README cập nhật MVP 1.0.0 status + scripts table + workflow + folder structure

### API extensions
- [x] `ensure-defaults` route — thêm `{force, key}` payload
- [x] `check-folder` route — thêm `noCreate` flag
- [x] `health` route — keys không có `.md` suffix

### Done khi
- [x] Settings 100%
- [ ] Pilot project (Villa T redo) end-to-end < 2h theo PRD §⑧ — *cần user smoke-test thực tế*

---

## 🎁 Đề xuất bổ sung (ngoài PRD)

Đánh dấu `[MVP]` = nên đưa vào ngay · `[Post-MVP]` = sau MVP.

1. **[MVP] `docs/decisions/` (ADR-lite)** — mỗi quyết định lớn 1 file 5-10 dòng. AI hiểu *tại sao* không chỉ *là gì*.
2. **[MVP] Versioning `meta.json`** — `{ version: "0.x" }` cho zip export, dễ migrate schema sau.
3. **[MVP] `/api/health`** — check provider + folder + prompts. Settings page hiển thị status.
4. **[Post-MVP] Auto-backup zip** vào `~/.pxcanvas/backups/` mỗi N giờ.
5. **[MVP] Project-level "step state"** — `Project.currentStep` để mở đúng step đang dở.
6. **[Post-MVP] Keyboard shortcuts panel** — `?` mở modal list shortcuts.
7. **[MVP] AI call logging** — file `logs/ai-calls.jsonl` (debug-only flag). Hữu ích khi content sai → soi log qua Claude Code.
8. **[MVP] `/api/dev/regenerate-prompts`** — dev-only, xóa + regen prompts/ (test US-015 auto-regen).
9. **[Post-MVP] Smoke test script** — `npm run smoke` chạy 1 project mock end-to-end.
10. **[MVP] `CLAUDE.local.md`** (gitignored) — user note context riêng không commit.
11. **[MVP] First-run setup script** `npm run setup` — auto tạo prompts/, check Node, copy `.env.local.example`.
12. **[Post-MVP] Migration script template** — `src/lib/migrations/v0-to-v1.ts` empty, sẵn chỗ viết.

---

## ❓ Câu hỏi cần chốt trước khi bắt đầu Phase 1 ✅ (đã resolved trong implementation)

- [x] AI model default cho Mode A/B → **Sonnet 4.6** (`DEFAULT_SETTINGS.aiModel = "claude-sonnet-4-6"` trong `src/lib/types/settings.ts`)
- [x] Đề xuất [MVP] nào drop → không drop, tất cả 8 [MVP] items đã include; 4 [Post-MVP] giữ post-MVP
- [x] Bắt đầu Phase 1 luôn hay tách 1a/1b → làm 1 phase liền (docs + scaffold cùng commit)

---

## 📝 Changelog tracker (đồng bộ với `CHANGELOG.md`)

| Phase | Version | Date | Notes |
|---|---|---|---|
| 1 | 0.1.0 | 2026-05-20 | Foundation |
| 2 | 0.2.0 | 2026-05-20 | Data Model |
| 3 | 0.3.0 | 2026-05-20 | State |
| 4 | 0.4.0 | 2026-05-20 | AI Provider |
| 5 | 0.5.0 | 2026-05-20 | Home |
| 6 | 0.6.0 | 2026-05-20 | Step 1 |
| 7 | 0.7.0 | 2026-05-21 | Step 2 Canvas |
| 8 | 0.8.0 | 2026-05-21 | Step 3 Brand Voice |
| 9 | 0.9.0 | 2026-05-21 | Step 4 Generate |
| 10 | 1.0.0 | 2026-05-21 | MVP |
