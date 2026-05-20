# CLAUDE.md — PXcanvas

> File AI luôn đọc đầu tiên. **Đây là dự án CODE APP** — Next.js local web app cho UI/UX designer.
> KHÔNG nhầm với Villa T content trong `_reference/villa-t/` (đó là pilot data, không phải code).

---

## 1. Order đọc file (BẮT BUỘC)

Trước khi làm bất kỳ task nào:

1. `CLAUDE.md` *(file này)*
2. `MVP-plan.md` — kế hoạch 10 phases, check phase hiện tại đang làm
3. `PRD.md` — yêu cầu chi tiết, user stories US-001 → US-015
4. `screen.md` — UI screens + navigation flow
5. (Khi cần detail) `docs/architecture.md`, `docs/data-model.md`, `docs/conventions.md`

---

## 2. Trạng thái hiện tại

Xem `MVP-plan.md` Phase Tracker để biết phase nào đang làm. File này không track trạng thái.

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
├── MVP-plan.md, PRD.md, screen.md
├── docs/
│   ├── architecture.md      # layers + data flow
│   ├── data-model.md        # tất cả types/interfaces
│   ├── ai-prompts.md        # prompt files spec
│   ├── api-routes.md        # API inventory
│   ├── state-management.md  # Zustand stores
│   ├── conventions.md       # code style
│   ├── troubleshooting.md   # lỗi + fix
│   └── decisions/           # ADR-lite
├── prompts/                 # 5 file .md — AI prompts, edit qua Claude Code
├── logs/                    # ai-calls.jsonl (debug, gitignored)
├── pages-output/            # default output folder (gitignored)
├── src/
│   ├── app/
│   │   ├── layout.tsx, page.tsx (S-00 Home)
│   │   ├── settings/page.tsx   (S-06)
│   │   ├── project/[id]/       (S-02 → S-05)
│   │   └── api/                (AI + file + prompt routes)
│   ├── components/
│   │   ├── ui/                 (shadcn primitives)
│   │   ├── home/, workflow/
│   │   └── step-1/, step-2/, step-3/, step-4/, settings/
│   └── lib/
│       ├── ai/                 (provider abstraction + prompt loader)
│       ├── store/              (Zustand stores)
│       ├── files/              (zip, png export)
│       ├── types/              (tất cả TS types)
│       └── utils/              (debounce, validation, cn)
└── _reference/
    └── villa-t/               # KHÔNG CHỈNH — chỉ đọc khi cần reference
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

- **KHÔNG sửa** `_reference/villa-t/` trừ khi user yêu cầu rõ ràng.
- **KHÔNG đọc** `_reference/villa-t/villa-content-rules.md` cho task code — chỉ đọc khi cần reference format cho prompt `05-content-generate.md`.
- **KHÔNG hard-code** API key, model name, hay output path trong code (đọc từ settings store).
- **CẬP NHẬT** `MVP-plan.md` checkbox khi xong task. Bump `CHANGELOG.md` khi xong phase.
- **KHÔNG tạo** file mới trong `docs/` nếu thông tin đã có trong file hiện tại — update existing file.

---

## 8. Khi bắt đầu session mới

1. Đọc file theo order §1.
2. Check `MVP-plan.md` Phase Tracker — phase nào đang ⬜ / 🚧?
3. Hỏi user muốn làm task nào nếu không rõ.
4. Sau khi xong → tick checkbox trong `MVP-plan.md` + commit.
