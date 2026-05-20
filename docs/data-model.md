# Data Model — PXcanvas

> Nguồn duy nhất của types. Mọi code tham chiếu từ đây. Sẽ được implement trong `src/lib/types/`.

---

## `Project`
```ts
// src/lib/types/project.ts
type Project = {
  id: string           // nanoid, vd: "abc123"
  name: string         // tên project, vd: "Villa T Website"
  createdAt: string    // ISO 8601
  updatedAt: string    // ISO 8601 — cập nhật mỗi khi project có thay đổi
  currentStep: 1 | 2 | 3 | 4  // bước đang dở để re-open đúng chỗ
}
```

---

## `SitemapNode`
```ts
// src/lib/types/sitemap.ts
type SitemapNode = {
  id: string              // nanoid
  name: string            // tên page, vd: "About"
  description: string     // 1 dòng mô tả, vd: "Story behind the villa"
  children: SitemapNode[] // children (empty array nếu leaf)
  parentId: string | null // null nếu root
  improved: boolean       // true nếu node được sinh ra/đổi do AI improvement
}
```

**Lưu ý:** Tree được lưu dưới dạng nested object (không flatten). Mỗi lần mutation → deep clone toàn tree trước khi push vào undo stack.

---

## `BrandVoice`
```ts
// src/lib/types/brand-voice.ts
type BrandVoice = {
  toneKeywords: [string, string, string]   // đúng 3 từ
  principles: string                        // 3-5 dòng, plain text
  doExamples: string[]                     // 3-5 câu ví dụ đúng tone
  dontExamples: string[]                   // 3-5 câu ví dụ sai tone
  blacklist: string[]                      // từ bị cấm, lowercase
}
```

---

## `UxImprovement`
```ts
// src/lib/types/ux-analysis.ts
type UxImprovement = {
  id: string          // nanoid
  problem: string     // vấn đề UX
  reason: string      // lý do tại sao là vấn đề
  suggestion: string  // đề xuất cải tiến cụ thể
  checked: boolean    // default: true — user untick để bỏ qua
}
```

---

## `Section`
```ts
// src/lib/types/content.ts
type Section = {
  id: string    // nanoid
  name: string  // vd: "Hero", "Social Proof", "FAQ — Short"
}
```

---

## `PageContent`
```ts
// src/lib/types/content.ts
type PageContent = {
  pageId: string              // = SitemapNode.id
  sections: Section[]         // danh sách section đã chốt
  markdown: string            // generated .md content
  status: "idle" | "generating" | "done" | "error"
  generatedAt: string | null  // ISO 8601
  errorMessage: string | null
}
```

---

## `FormInput` (Step 1)
```ts
// src/lib/types/ux-analysis.ts
type FormInput = {
  siteType: "villa-hotel" | "saas" | "landing-page" | "ecommerce" | "other"
  goals: string       // mục tiêu website
  targetUser: string  // mô tả user
  tones: string[]     // tone chips đã chọn, vd: ["Warm", "Minimal"]
}
```

---

## `Settings`
```ts
// src/lib/types/settings.ts
type Settings = {
  provider: "sdk" | "api-key"
  apiKey: string        // plain text, lưu localStorage (local-only)
  outputFolder: string  // absolute path đến folder output
  aiModel: string       // default: "claude-sonnet-4-6"
  debugLogging: boolean // bật logs/ai-calls.jsonl
}
```

---

## `ProjectZipMeta` (meta.json trong zip export)
```ts
// src/lib/types/project.ts
type ProjectZipMeta = {
  version: string     // vd: "0.9.0" — schema version, dùng để migrate
  name: string        // tên project
  exportedAt: string  // ISO 8601
  pageCount: number
}
```

---

## localStorage Schema

| Key | Type | Ví dụ value |
|---|---|---|
| `pxcanvas:projects` | `Project[]` | `[{ id: "abc", name: "Villa T", ... }]` |
| `pxcanvas:workflow:abc` | `WorkflowState` | `{ projectId: "abc", sitemap: {...}, ... }` |
| `pxcanvas:settings` | `Settings` | `{ provider: "sdk", outputFolder: "C:/...", ... }` |

---

## Zip Export Structure

```
[project-name].zip
├── meta.json          # ProjectZipMeta
├── sitemap.json       # SitemapNode (root)
├── brand-voice.md     # BrandVoice formatted as markdown
└── pages/
    ├── 01-home.md
    ├── 02-about.md
    └── ...
```
