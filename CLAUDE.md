# CLAUDE.md — PXcanvas

> File AI luôn đọc đầu tiên. **Đây là dự án CODE APP** — Next.js local web app cho UI/UX designer.
> KHÔNG nhầm với Villa T content trong `_reference/villa-t/` (đó là pilot data, không phải code).

---

## 1. Order đọc file (BẮT BUỘC)

Trước khi làm bất kỳ task nào:

1. `CLAUDE.md` *(file này)*
2. **`version-1.md`** — plan v1.0 hiện tại (Wireframe Library). Có `⚡ Quick Start` ở đầu file cho AI session.
3. `MVP-plan.md` — kế hoạch MVP đã xong (10 phases ✅, archived reference)
4. `PRD.md` — yêu cầu chi tiết, user stories US-001 → US-015
5. `screen.md` — UI screens + navigation flow
6. (Khi cần detail) `docs/architecture.md`, `docs/data-model.md`, `docs/conventions.md`

### Khi task = build Wireframe Library (Track A — generate HTML từ JPG)

Đọc thêm 2 file BẮT BUỘC trước khi viết HTML:

1. **`wireframe-library/AI-GENERATION-RULES.md`** — bible: component catalog (`wf-*`), 8-step decision flow, DO/DON'T, HTML wrapper template
2. **`wireframe-library/UNDERSTANDING.md`** — catalog content intent → variation, update entry sau mỗi variation mới (Step 8)

---

## 2. Trạng thái hiện tại

- **MVP (v1.0.0)** ✅ xong — `MVP-plan.md`
- **v1.0 — Wireframe Library** 🚧 đang làm — xem `version-1.md` Phase Tracker
- Phase hiện tại: **13 — Build Feature Section library** (Claude Code session generate HTML từ 111 JPG)

---

## 3. Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Canvas | React Flow |
| State | Zustand + localStorage persist |
| AI (Mode A) | Claude Agent SDK (gọi từ Next.js API route) |
| AI (Mode B) | `@anthropic-ai/sdk` (Anthropic API key) |
| Default model | `claude-sonnet-4-6` |
| File ops | Node `fs/promises` + JSZip + html-to-image |
| Toast | sonner |

---

## 4. Folder Map

```
.
├── CLAUDE.md, README.md, CHANGELOG.md
├── version-1.md             # v1.0 plan (current)
├── MVP-plan.md, PRD.md, screen.md
├── pxpace.css               # design tokens (CSS variables, utility classes)
├── docs/
│   ├── architecture.md, data-model.md, ai-prompts.md, api-routes.md
│   ├── state-management.md, conventions.md, troubleshooting.md
│   ├── wireframe-library.md # library overview (build-once philosophy)
│   └── decisions/           # ADR-lite
├── prompts/                 # 5 file .md — AI prompts, edit qua Claude Code
├── logs/                    # ai-calls.jsonl (debug, gitignored)
├── pages-output/            # default output folder (gitignored)
├── wireframe-design/        # SOURCE — read-only JPG input (v1.0)
│   └── feature-section/     # 111 JPG: feature-section-1.jpg .. feature-section-111.jpg
├── wireframe-library/       # BUILT ARTIFACT — commit, static asset (v1.0)
│   ├── AI-GENERATION-RULES.md  # bible cho Track A generation
│   ├── UNDERSTANDING.md     # content intent → variation catalog
│   ├── _shared/
│   │   ├── pxpace.css, wireframe-components.css, wireframe-base.css
│   └── feature-section/
│       └── feature-section-N/   # folder = JPG stem
│           ├── index.html
│           └── meta.json
├── scripts/                 # CLI utilities
│   ├── wireframe-validate.ts    # bulk integrity check
│   └── wireframe-generate.ts    # DEPRECATED (was for API key approach)
├── src/
│   ├── app/                 # layout.tsx, page.tsx, settings/, project/, api/
│   ├── components/          # ui/, home/, workflow/, step-1..4/, settings/
│   └── lib/
│       ├── ai/              # provider abstraction + prompt loader
│       ├── store/           # Zustand stores
│       ├── wireframes/      # slot-schema, meta-schema, library-loader, html-validate (v1.0)
│       ├── files/, types/, utils/
└── _reference/
    └── villa-t/             # KHÔNG CHỈNH — chỉ đọc khi cần reference
```

---

## 5. Code Conventions (quick ref)

Chi tiết: `docs/conventions.md`. Tóm tắt:

- Component files: `kebab-case.tsx`, default export.
- Import order: React → external → shadcn → local → lib → types.
- Store: `use{Name}Store` pattern, chỉ subscribe field cần (không subscribe cả store).
- API route: `POST`, có try/catch, return `{ data }` | `{ error }`.
- Toast: dùng `sonner`, không dùng alert/confirm trừ modal confirm xóa.
- No `any`. No inline styles. No comments trừ khi WHY không obvious.
- **UI components: dùng shadcn/ui với màu mặc định (default color palette).** Không override CSS variable màu trừ khi user yêu cầu rõ ràng. Không custom theme.

---

## 6. AI Provider

Mọi AI call đi qua `src/lib/ai/provider.ts` (abstraction layer):

```ts
// Không gọi SDK trực tiếp từ component hay page
// Chỉ gọi từ API route (server-side)
const result = await callAI("02-sitemap-generate", {
  form_input: JSON.stringify(formInput),
  improvements: JSON.stringify(checked),
})
```

Prompt files trong `prompts/` — sửa qua Claude Code, app pick up khi gọi.

---

## 7. Rules bắt buộc

### App code
- **KHÔNG sửa** `_reference/villa-t/` trừ khi user yêu cầu rõ ràng.
- **KHÔNG đọc** `_reference/villa-t/villa-content-rules.md` cho task code — chỉ đọc khi cần reference format cho prompt `05-content-generate.md`.
- **KHÔNG hard-code** API key, model name, hay output path trong code (đọc từ settings store).
- **CẬP NHẬT** `MVP-plan.md` / `version-1.md` checkbox khi xong task. Bump `CHANGELOG.md` khi xong phase.
- **KHÔNG tạo** file mới trong `docs/` nếu thông tin đã có trong file hiện tại — update existing file.

### Wireframe Library (Track A — generate HTML)
- **KHÔNG invent** CSS class. Chỉ dùng `wf-*` từ `wireframe-components.css` hoặc utility từ `pxpace.css`.
- **KHÔNG inline `style=`** cho color/spacing/typography. Chỉ cho slot-specific sizing nếu thực sự cần.
- **KHÔNG zero-pad** folder name. Stem name của HTML folder = stem của source JPG (xem memory `feedback_wireframe_naming`).
- **KHÔNG dùng** `scripts/wireframe-generate.ts` (deprecated). Generate trực tiếp bằng Read + Write tool.
- **BẮT BUỘC update** `wireframe-library/UNDERSTANDING.md` sau mỗi variation mới (Step 8 trong decision flow).
- **BẮT BUỘC chạy** `npm run wireframe:validate` sau khi xong 1 batch.

---

## 8. Khi bắt đầu session mới

1. Đọc file theo order §1 (bao gồm `version-1.md` Quick Start cho v1.0 phase hiện tại).
2. Check Phase Tracker:
   - MVP: `MVP-plan.md` (đã ✅ xong toàn bộ)
   - v1.0: `version-1.md` — phase nào đang 🚧?
3. Nếu task = wireframe generation → đọc thêm `wireframe-library/AI-GENERATION-RULES.md` + `UNDERSTANDING.md`.
4. Hỏi user muốn làm task nào nếu không rõ.
5. Sau khi xong → tick checkbox trong plan tương ứng + commit (theo memory `feedback_commit_after_changes`).
