# PXcanvas — Version 1.0 Plan: Wireframe Library

> Kế hoạch nâng cấp từ MVP (v1.0.0 — content `.md`) lên **v1.0 — Wireframe HTML pages**.
> Đọc kèm: `MVP-plan.md` (lịch sử MVP), `PRD.md`, `CLAUDE.md`.

---

## 🎯 Mục tiêu

Đầu ra cuối cùng của user: thay vì chỉ có `.md` content, mỗi project xuất được **trang web wireframe HTML** ghép từ các template section dùng chung.

### Nguyên tắc nền tảng (mới — từ feedback user)

> **Wireframe Library = static template asset. Build once, reuse forever.**
> Layout và style **không bao giờ thay đổi** sau khi đã build. Mỗi project chỉ tiêu thụ template + bơm content vào — không sinh hay sửa template.

→ Kéo theo:
- Library **không phải feature trong app** của user. Là **build artifact ở repo level** (hoặc package độc lập).
- Quá trình "JPG → HTML template" là **dev pipeline chạy 1 lần** (có thể CLI/script hoặc hidden dev route), không phải UI user-facing.
- Library version độc lập với app version. App v1.0.0 có thể bump lên 1.0.1 mà library template giữ nguyên.
- Mỗi template chỉ regen khi **chính chủ (Phú) muốn cải tiến layout** — không phải khi user dự án mới chạy.

### 2 track song song

| Track | Ai chạy | Khi nào | Output |
|---|---|---|---|
| **A. Library Builder** (Phase 11-15) | Phú (dev), 1 lần per section type | Khi có batch JPG mới | Folder `wireframe-library/` commit vào repo |
| **B. Project App Compose** (Phase 16) | User, mỗi project | Sau khi xong Step 4 content | `pages/*.html` wireframe per project |

→ Track B là **giá trị chính của v1.0**. Track A là chuẩn bị nguyên liệu.

---

## 🧱 Triết lý kỹ thuật

1. **Library = static folder**, có thể commit repo, publish npm, hoặc serve CDN. KHÔNG có database/dynamic generation cho library trong app user.
2. **Tách `wireframe-design/` (source JPG, read-only) ↔ `wireframe-library/` (built HTML, immutable một khi approved)**.
3. **Mỗi variation 1 folder** — `index.html` + `meta.json`. Cấu trúc phẳng, dễ index, dễ ship.
4. **Self-contained preview**: mỗi `index.html` link `pxpace.css` qua relative path → mở `file://` được, không cần server. Test/QA dễ.
5. **Slot-first contract**: HTML có `data-slot="..."` trên mỗi node nội dung. Đây là **API ổn định** giữa template (cố định) và content (động per-project). Đổi slot key = breaking change library version.
6. **AI Vision chỉ ở Library Builder (Track A)**. Track B (Project App) **không gọi AI Vision** — chỉ chọn template + map content (có thể AI text-only hoặc rule-based).
7. **Prompt-driven cho Track A**, không hard-code layout analysis.
8. **Token cheatsheet ≠ full CSS** — gửi AI 1 bản tóm tắt ~1-2KB.
9. **Library frozen sau approve** — file approved không bị overwrite trừ khi explicit unfreeze. Bảo vệ template khỏi accidental regen.

---

## 📦 Library location & distribution (open decision)

3 option, chốt trước Phase 11:

| Option | Pro | Con |
|---|---|---|
| **A. Commit vào repo `wireframe-library/`** | đơn giản, version theo git, hoạt động offline | repo to dần khi 800+ section |
| **B. NPM package `@pxcanvas/wireframe-library`** | versioned độc lập, share được nhiều project | thêm publish step, cần npm scope |
| **C. CDN/static host + lazy fetch trong app** | repo gọn, update không cần redeploy app | online-only, phức tạp caching |

**Đề xuất:** Option **A** cho v1.0 (đơn giản, immediate). Migrate sang B khi library > 500 variation hoặc cần share cross-project.

---

## 📐 Kiến trúc folder

```
web-content-app/
├── pxpace.css                          # design token (đã có)
│
├── wireframe-design/                   # SOURCE — read-only JPG input
│   ├── feature-section/*.jpg           # 111 ảnh (đã có)
│   ├── hero/*.jpg                      # tương lai
│   └── ...
│
├── wireframe-library/                  # BUILT ARTIFACT — commit, immutable
│   ├── library.json                    # toàn bộ catalog (index lookup nhanh)
│   ├── _shared/
│   │   ├── pxpace.css                  # copy snapshot (lock theo library version)
│   │   └── wireframe-base.css          # placeholder icon, debug outline
│   ├── feature-section/
│   │   ├── 001/
│   │   │   ├── index.html
│   │   │   ├── meta.json               # { id, slots, layout, tags, approved, frozen }
│   │   │   └── preview.png             # auto-generated thumbnail (html-to-image)
│   │   ├── 002/ ...
│   │   └── _index.json
│   └── hero/ ... (tương lai)
│
├── scripts/                            # NEW — Library Builder CLI (Track A)
│   ├── wireframe-generate.ts           # CLI: gen 1 hoặc batch
│   ├── wireframe-validate.ts           # CLI: validate library integrity
│   ├── wireframe-thumbnail.ts          # CLI: render preview.png
│   └── wireframe-freeze.ts             # CLI: lock approved, unfreeze cẩn trọng
│
├── prompts/
│   └── 06-wireframe-from-image.md      # NEW — chỉ dùng ở Track A (CLI)
│
├── src/
│   ├── app/
│   │   ├── wireframes/                 # NEW — DEV ROUTE (gated, không cho user thường)
│   │   │   └── page.tsx                # gallery + QA UI cho Phú khi build library
│   │   ├── api/
│   │   │   ├── wireframes/             # NEW — dev-only routes, gated bằng env flag
│   │   │   │   ├── generate/route.ts
│   │   │   │   ├── batch/route.ts
│   │   │   │   ├── approve/route.ts
│   │   │   │   └── freeze/route.ts
│   │   │   └── compose/route.ts        # NEW (Track B) — user-facing
│   │   └── project/[id]/step-4/
│   │       └── wireframe-tab.tsx       # NEW (Track B) — preview HTML page
│   ├── components/
│   │   ├── wireframes-dev/             # Track A UI (dev gated)
│   │   └── compose/                    # Track B UI
│   │       ├── page-preview.tsx        # iframe preview
│   │       ├── section-picker.tsx      # user override variation chọn
│   │       └── slot-fill-progress.tsx
│   └── lib/
│       ├── wireframes/
│       │   ├── library-loader.ts       # load library.json (in-memory cache)
│       │   ├── slot-schema.ts          # known slot keys per section type
│       │   ├── meta-schema.ts          # Zod
│       │   ├── token-cheatsheet.ts     # cho Track A prompt
│       │   ├── html-validate.ts        # Track A
│       │   ├── pick-variation.ts       # Track B — chọn template cho 1 section
│       │   ├── slot-fill.ts            # Track B — fill content vào HTML
│       │   └── compose-page.ts         # Track B — ghép section thành page
│       └── types/wireframe.ts
└── version-1.md
```

### Phân vùng quyền

| Folder | Đối tượng | Edit khi |
|---|---|---|
| `wireframe-design/` | Phú | Có batch JPG mới |
| `wireframe-library/` | **Generated only**, không sửa tay | Chạy CLI Track A → auto-write |
| `scripts/` | Phú | Phát triển Library Builder |
| `src/app/wireframes/`, `src/components/wireframes-dev/` | Phú (dev mode) | Build library tool |
| `src/components/compose/`, `src/lib/wireframes/pick-*`, `slot-*`, `compose-*` | Code chính của app v1.0 | Theo phase |

---

## 🧩 Data model

```ts
// src/lib/types/wireframe.ts

export type SectionType =
  | "feature-section" | "hero" | "header" | "footer"
  | "faq" | "testimonials" | "cta" | "blog" | "pricing"
  | "logo-cloud" | "team" | "contact" | "stats" | "gallery";

export interface WireframeVariation {
  id: string;                    // "feature-section-001"
  type: SectionType;
  variation: number;
  sourceImage: string;           // relative path
  htmlPath: string;
  previewImage: string;          // thumbnail
  slots: WireframeSlot[];
  layout: string;                // "split-image-2col"
  tags: string[];
  approved: boolean;
  frozen: boolean;               // true = library lock, không regen
  libraryVersion: string;        // "1.0.0"
  generatedAt: string;
  generatedBy: string;
}

export interface WireframeSlot {
  key: string;                   // "headline", "feature-1-icon"
  type: "text" | "image" | "icon" | "button" | "list";
  required: boolean;
  description: string;
  maxChars?: number;
  repeatGroup?: string;          // "feature" — slot thuộc group lặp
}

// Library catalog cho Track B lookup
export interface LibraryCatalog {
  version: string;
  generatedAt: string;
  sections: Record<SectionType, {
    total: number;
    approved: number;
    variations: WireframeVariation[];
  }>;
}
```

### Slot key convention (chung)

| Key | Type | Ý nghĩa |
|---|---|---|
| `eyebrow` | text | Tagline trên headline |
| `headline` | text | H2 chính |
| `description` | text | Mô tả dưới headline |
| `cta-primary`, `cta-secondary` | button | Nút |
| `image-1`, `image-2`, ... | image | Ảnh |
| `feature-N-icon`, `feature-N-title`, `feature-N-body` | icon/text | Item lặp (`repeatGroup: "feature"`) |
| `link-N-label`, `link-N-href` | text | Link footer/nav |
| `stat-N-value`, `stat-N-label` | text | Số liệu |

→ Lock vào `slot-schema.ts`. Đổi = breaking change library version.

---

## 🤖 Track A: Library Builder (build-once pipeline)

> Chỉ Phú chạy, không có trong UX user thường.

### Workflow CLI

```bash
# 1. Generate 1 variation để test prompt
npm run wireframe:gen -- --type feature-section --variation 1

# 2. Batch generate cả type (resumable, skip-existing)
npm run wireframe:gen -- --type feature-section --all

# 3. Mở dev UI để QA + approve (dev mode only)
PXCANVAS_DEV=1 npm run dev
# truy cập http://localhost:3000/wireframes

# 4. Sau khi approve hết, freeze
npm run wireframe:freeze -- --type feature-section

# 5. Validate library trước commit
npm run wireframe:validate

# 6. Commit wireframe-library/ vào git
git add wireframe-library/ && git commit -m "lib: feature-section v1.0 (111 variations)"
```

### AI Vision input/output

**Input:**
- JPG (base64 hoặc file path)
- Prompt 06 (role, constraint, slot schema, token cheatsheet)

**Output JSON:**
```json
{
  "html": "<section class=\"...\">...</section>",
  "layout": "split-image-2col",
  "tags": ["image-heavy", "minimal"],
  "slots_used": ["headline", "eyebrow", "image-1"]
}
```

**Validation pipeline:**
1. HTML phải có `<section>` root
2. Mọi class CSS ∈ pxpace.css (preload set class names build-time)
3. Mọi `data-slot` ∈ slot schema của type
4. Required slot present
5. Retry tối đa 2 lần với error feedback

### Token cheatsheet (~1-2KB string trong `token-cheatsheet.ts`)

```
COLORS: bg-/text-/border- × {primary, secondary, tertiary, base, surface, surface-2,
  light, dark, success, error} × {none, -5/10/20/30/40/50/60/70/80/90, -l-1/2/3/4, -d-1/2/3/4}
TEXT: text-title, text-body
SPACING: padding-/margin-/gap- × {4xs..4xl}
  directional: -left/-right/-top/-bottom/-horizontal/-vertical
TYPOGRAPHY: text-xs..text-4xl, font-100..900, italic, bold, uppercase, line-height-xs..xl
RADIUS: radius-xs/s/m/l/xl/full
LAYOUT: columns-2..8, columns-min-{5..70}, flex-row, flex-column,
  items-(left|center|right|top|middle|bottom), content-*, space-between, gap-*
  col-span-N, col-start-N, row-span-N
RESPONSIVE: columns-N--on-(xl|l|m|s), col-span-N--on-X
WIDTH/HEIGHT: width-10..90, max-width-10..140, max-site-width, full-width, full-height
ASPECT: aspect-1, aspect-16-9, aspect-4-3, etc.
WIREFRAME PLACEHOLDER CONVENTION (cho v1.x — grayscale, không brand color):
  - Image: <div class="bg-base-10 radius-m aspect-16-9" data-slot="image-N"></div>
  - Icon: <div class="bg-base-10 radius-full" style="width:4rem;height:4rem" data-slot="feature-N-icon"></div>
  - Button: <button class="bg-secondary text-tertiary padding-vertical-2xs padding-horizontal-s radius-s" data-slot="cta-primary">...</button>
  - Heading: <h2 class="text-2xl font-700 text-title" data-slot="headline">...</h2>
  - Body text: <p class="text-m text-body line-height-l" data-slot="description">...</p>
```

---

## 🚀 Track B: Project App Compose (user-facing — core v1.0)

> User chạy mỗi project, tiêu thụ library. **Approach A — Wireframe-first strict** (đã chốt).

### Nguyên tắc đã chốt
- **Pick variation TRƯỚC content**. User chọn layout, content sinh sau theo constraint của variation.
- **Section type enum hardcode** trong `src/lib/types/wireframe.ts` (type-safe, autocomplete).
- **Force regenerate content** khi đổi variation. Content cũ mất, AI gọi lại với slot_schema mới.

### Flow

```
[ Sitemap (Step 2) + Brand voice (Step 3) ]
                ↓
[ Load library.json — đã built sẵn ở Track A ]
                ↓
┌─ STEP 4a — Section & Variation Planning ──────────┐
│  AI proposes sections per page với:               │
│    { name, type, description, suggestedVariationId }│
│  User reviews/overrides:                          │
│    - Edit name/description                        │
│    - Change type (dropdown enum)                  │
│    - Pick variation (modal thumbnail grid)        │
│    - Reorder, add, remove                         │
│  Gate: mọi section phải có variationId → 4b      │
└────────────────────────────────────────────────────┘
                ↓
┌─ STEP 4b — Content Generation (slot-constrained) ─┐
│  Per section: AI call với slot_schema constraint  │
│  AI sinh content STRICT khớp slot (N items, char) │
│  Output: markdown structured + parse-able slots   │
│  Edit/regen per-section                           │
│  Nếu đổi variation → confirm dialog → force regen │
└────────────────────────────────────────────────────┘
                ↓
┌─ STEP 4c — Compose & Export ──────────────────────┐
│  Slot-fill (pure function, no AI)                 │
│  Compose page HTML (wrap + concat sections)       │
│  Preview iframe                                   │
│  Export zip: pages/*.html + pages/*.md            │
└────────────────────────────────────────────────────┘
                ↓
       pages-output/<project>/<page>.html
```

### `pick-variation` strategy (cho AI suggest ở 4a + manual override)

1. **Rule-based scoring** (default, v1.0): match tags + slot fit. Deterministic, không tốn token. Dùng để filter variation grid trong picker modal + auto-pick fallback.
2. **AI suggest trong prompt 04**: AI nhận `library_catalog_summary` (per type: layout tag, slot list rút gọn) → suggest variation ID cho mỗi section. User có thể giữ hoặc override.

### `slot-fill` strategy

**Rule-based replace** (pure function, không AI):
- Parse HTML
- Với mỗi `[data-slot=key]`: lookup content theo key
- Text slot: replace innerText (preserve formatting parent class)
- Image slot: giữ placeholder grayscale (v1.x), v2 sẽ swap brand image
- Repeat group (`feature-N-*`): clone template node theo N từ slot_schema, fill từng cái
- Optional slot missing content: ẩn node (hoặc giữ placeholder text như "—")

### Content → slot mapping

Content sinh ở 4b **đã biết slot_schema** → format markdown rigid:
- `**EYEBROW**` → slot `eyebrow`
- `### Headline` → slot `headline`
- Paragraph dưới headline → slot `description`
- `#### Feature title` + body → slot `feature-N-title` + `feature-N-body`
- `**[CTA label]**` → slot `cta-primary` (đầu tiên) / `cta-secondary` (thứ hai)

```ts
parseMarkdownToSlots(md: string, slotSchema: WireframeSlot[]): Record<string, string>
```

Reuse: `extractSectionFromMd()` từ `src/lib/utils/markdown-sections.ts`.

### Migration: MVP project → v1.0

Project cũ (Section thiếu `type`/`variationId`):
1. Mở Step 4 lần đầu trong v1.0 → detect missing fields
2. Hiện wizard "Upgrade project: assign section types & variations"
3. Wizard gọi prompt 04 với current sections → output mapping
4. User accept → Section enrich với `type` + `variationId`
5. Content cũ giữ lại nhưng `contentLockedAt = null` (stale flag)
6. User phải re-generate content qua 4b để khớp slot mới

---

## 📋 Phase Tracker v1.x

| Phase | Track | Status | Title |
|---|---|---|---|
| 11 | A+B | ✅ | Foundation: types, slot schema, cheatsheet, library folder |
| 12 | A | ⬜ | Vision pipeline (CLI single + prompt + validate) |
| 13 | A | ⬜ | Dev QA UI + batch runner (hidden behind `PXCANVAS_DEV=1`) |
| 14 | A | ⬜ | Build Feature Section library (111 variation, approve, freeze) |
| 15 | A | ⬜ | (Lặp lại P14 cho các section type khác — không khẩn cấp) |
| 16a | B | ⬜ | Section & Variation Planning (4a) |
| 16b | B | ⬜ | Content Generation slot-constrained (4b) |
| 16c | B | ⬜ | Compose & Preview (4c) |
| 17 | B | ⬜ | Step 4 UI tích hợp + export + migration wizard |
| 18 | B | ⬜ | Release v1.0 |

**Track A (Phase 11-15)** ship riêng, không gate release v1.0. Có thể merge từng section type.
**Track B (Phase 16-18)** là pre-requisite của release v1.0. Có thể chạy với chỉ Feature Section library (đủ demo).

---

## Phase 11 — Foundation ✅

**Goal:** types + library skeleton + cheatsheet đủ cho Phase 12 chạy.

### Tasks
- [x] Tạo `wireframe-library/_shared/{pxpace.css, wireframe-base.css}`
- [x] `wireframe-base.css` — `[data-slot]` debug outline (active khi `<body class="slot-debug">`)
- [x] `src/lib/types/wireframe.ts` — `SectionType` enum, `WireframeSlot/Variation/Meta`, `LibraryCatalog`
- [x] Extend `Section` type (`src/lib/types/content.ts`) — thêm `type?`, `variationId?`, `contentLockedAt?`
- [x] `src/lib/wireframes/slot-schema.ts` — slot list cho `feature-section`, `hero`, `cta`, `faq` (type khác stub)
- [x] `src/lib/wireframes/token-cheatsheet.ts` — pxpace.css class reference cho prompt 06
- [x] `src/lib/wireframes/meta-schema.ts` — manual validators (không Zod), `formatVariationId`, `parseVariationId`
- [x] `src/lib/wireframes/library-loader.ts` — load + cache `library.json`, empty fallback
- [x] `docs/wireframe-library.md` — slot contract, folder layout, troubleshooting
- [x] `docs/decisions/0002-wireframe-library-static.md` — ADR build-once + commit-to-repo
- [x] Library location chốt Option A (commit repo)

### Done khi
- [x] `tsc --noEmit` pass
- [x] `loadLibrary()` chạy được với library.json missing → empty catalog
- [x] Smoke test loader + meta-schema PASS

---

## Phase 12 — Vision Pipeline (CLI single)

**Goal:** CLI sinh 1 variation HTML từ JPG, validate pass.

### Tasks
- [ ] `prompts/06-wireframe-from-image.md`
- [ ] Mở rộng `src/lib/ai/anthropic-api.ts` hỗ trợ image content
- [ ] `src/lib/ai/vision.ts` — wrapper helper
- [ ] `src/lib/wireframes/html-validate.ts` — class check, slot check
- [ ] `scripts/wireframe-generate.ts` — CLI args `--type --variation [--all] [--skip-existing]`
  - Write `wireframe-library/<type>/<NNN>/index.html` + `meta.json`
  - Generate thumbnail bằng html-to-image (headless)
- [ ] Log AI call vào `logs/ai-calls.jsonl`
- [ ] `package.json` scripts: `wireframe:gen`, `wireframe:validate`
- [ ] Test tay 5 JPG đa dạng

### Done khi
- 5/5 HTML mở browser nhìn giống JPG, pass validate
- Commit (chỉ code, chưa commit library)

---

## Phase 13 — Dev QA UI + Batch Runner

**Goal:** UI để Phú duyệt + chạy batch resumable.

### Tasks
- [ ] Env gate: `PXCANVAS_DEV=1` mới expose `/wireframes` + `/api/wireframes/*`
- [ ] `app/wireframes/page.tsx` — gallery card grid theo type
  - Filter status (pending/generated/approved/frozen)
  - Action per card: regenerate, approve/reject, edit notes
- [ ] `app/wireframes/[type]/[variation]/page.tsx` — detail 2-cột (JPG ↔ HTML iframe), slot debug toggle
- [ ] API `/api/wireframes/generate` (gọi từ UI, wrap CLI logic)
- [ ] API `/api/wireframes/batch` — SSE progress, concurrency 1, retry, skip-existing, resumable
- [ ] API `/api/wireframes/approve` — flip `meta.approved`
- [ ] `components/wireframes-dev/batch-runner.tsx`
- [ ] `scripts/wireframe-freeze.ts` + API `/api/wireframes/freeze` — set `frozen:true`, prevent regen

### Done khi
- Chạy batch 10 ảnh đầu tiên trong UI, pause/resume OK
- Approve + freeze hoạt động

---

## Phase 14 — Build Feature Section Library

**Goal:** library Feature Section hoàn thiện, frozen, commit.

### Tasks
- [ ] Chạy batch 111 ảnh, monitor failure
- [ ] Tinh chỉnh prompt 06 dựa trên failure pattern, regenerate failed
- [ ] Manual QA per variation (Phú click qua từng card)
- [ ] Approve ≥ 80% (≥ 89 variation)
- [ ] Reject + note variation không đạt (giữ lại để retry sau)
- [ ] Generate `library.json` catalog
- [ ] Generate thumbnail `preview.png` toàn bộ
- [ ] Freeze approved
- [ ] Commit `wireframe-library/feature-section/` + `library.json`
- [ ] CHANGELOG v1.1.0-alpha

### Done khi
- `wireframe-library/feature-section/` có ≥ 89 variation approved + frozen
- Commit clean, repo size acceptable

---

## Phase 15 — Section Type Expansion (lặp lại theo nhu cầu)

> Không khẩn cấp cho release v1.0. Phase 16-18 chỉ cần Feature Section là demo được.

Lặp Phase 12-14 cho mỗi type mới. Mỗi type 1 commit độc lập, bump library version.

Priority: Hero → Header → Footer → CTA → FAQ → Testimonials → Logo Cloud → Pricing → Blog → Stats → Team → Contact.

---

## Phase 16 — Step 4 Wireframe-first Pipeline (Track B core)

Split thành 3 sub-phase theo Approach A đã chốt.

### Phase 16a — Section & Variation Planning

**Goal:** UI 4a cho user pick variation TRƯỚC khi sinh content.

### Tasks
- [ ] Extend `Section` type: thêm `type: SectionType`, `variationId: string`, `contentLockedAt?: string`
- [ ] Rewrite `prompts/04-sections-propose.md` — output `{ name, type, description, suggestedVariationId }`, nhận `{{available_types}}` + `{{library_catalog_summary}}`
- [ ] Update `src/app/api/ai/sections/route.ts` — pass library summary, parse new output
- [ ] `src/lib/wireframes/pick-variation.ts` — rule-based scoring (tags + slot fit) cho auto-pick fallback
- [ ] `src/components/step-4/section-editor.tsx` — thêm type badge + variation thumbnail
- [ ] `src/components/step-4/variation-picker-modal.tsx` NEW — grid filter theo type, click chọn variation
- [ ] `src/components/step-4/type-dropdown.tsx` NEW — change SectionType
- [ ] Workflow store: gate 4b — disable nếu có section thiếu `variationId`
- [ ] Migration wizard: detect MVP project, gọi prompt 04 enrich type/variation

### Done khi
- Mở 1 page → AI propose sections kèm type + variation → user pick variation modal hoạt động
- Reload giữ state, không break MVP project (migration wizard chạy)

### Phase 16b — Content Generation (slot-constrained)

**Goal:** Content sinh ra STRICT khớp slot schema của variation đã chọn.

### Tasks
- [ ] Rewrite `prompts/05-content-generate.md` — inject `{{slot_schema}}` placeholder
- [ ] Update `src/app/api/ai/content/route.ts` — load slot_schema từ variation, format vào prompt
- [ ] `src/lib/wireframes/parse-md-to-slots.ts` — markdown → `Record<slot_key, string>`, reuse `extractSectionFromMd`
- [ ] `src/lib/wireframes/slot-fill.ts` — pure HTML replace, hỗ trợ repeat group
- [ ] Validation: AI output phải có đủ required slot, đúng N items, char limit (warn không reject)
- [ ] UI: confirm dialog khi user đổi variation sau khi có content → "Sẽ regen, content mất"
- [ ] Force regen flow: clear content + gọi API content lại
- [ ] Set `contentLockedAt = ISO` khi sinh xong

### Done khi
- 1 section feature-section variation 7 → content có đúng 4 features (nếu variation có 4 slot)
- Đổi variation → confirm → content cũ xóa, content mới sinh, slot khớp

### Phase 16c — Compose & Preview

**Goal:** Ghép page HTML wireframe đầy đủ.

### Tasks
- [ ] `src/lib/wireframes/compose-page.ts` — concat section HTML + wrap `<html><head><link pxpace.css></head><body>`
- [ ] API `POST /api/compose/page` — input `{ projectId, pageId }`, output HTML string
- [ ] API `POST /api/files/write-page-html` — write `.html` cùng folder `.md`
- [ ] Unit test pure functions (slot-fill, parse-md, compose-page)
- [ ] Fallback: section type chưa có library → bỏ qua section + log warning trong page HTML

### Done khi
- 1 page Villa T → ra `.html` mở browser được, content đã fill, layout đúng

---

## Phase 17 — Step 4 UI tích hợp + export

**Goal:** User experience xuất wireframe HTML mượt.

### Tasks
- [ ] Step 4: tab "Wireframe HTML" cạnh tab Markdown
- [ ] `components/step-4/wireframe-preview.tsx` — iframe sandbox srcdoc HTML đã compose
- [ ] Refresh preview khi: content edit, variation đổi
- [ ] Export zip: include `pages/*.html` + `pages/*.md`
- [ ] Import zip: support cả 2 format (backward compat MVP) — meta.json version check
- [ ] Project store: bump zip meta version "1.0"
- [ ] CHANGELOG v1.0.0-rc.1

### Done khi
- Pilot Villa T redo: 3 page → 3 HTML, preview trong app + file output ra folder

---

## Phase 18 — Polish & Release v1.0

### Tasks
- [ ] `docs/wireframe-library.md` đầy đủ: workflow build, slot reference, troubleshooting
- [ ] `docs/decisions/0003-compose-pipeline.md` — ADR Track B
- [ ] README v1.0: thêm screenshot Step 4 wireframe preview
- [ ] Performance:
  - `library-loader` cache (đọc 1 lần per session)
  - Iframe lazy load nếu nhiều page
- [ ] Smoke test `npm run smoke:compose` — 1 project mock → ra HTML, validate slot fill
- [ ] Bump v1.0.0 final

---

## 🚧 Decisions đã chốt + Open questions

### Đã chốt
- ✅ **Approach:** A — Wireframe-first strict (pick variation trước, content sinh sau strict khớp slot)
- ✅ **Section type:** hardcode enum trong `src/lib/types/wireframe.ts`
- ✅ **Re-skin behavior:** force regenerate content khi đổi variation
- ✅ **Library location:** Option A — commit `wireframe-library/` vào git repo
- ✅ **`source.jpg`:** không copy, dùng relative path tới `wireframe-design/`
- ✅ **Library version:** semver độc lập app, ghi trong `library.json`. Breaking khi đổi slot schema
- ✅ **Wireframe styling:** grayscale (`bg-base-10` placeholder) cho v1.x, brand-color skin để v2
- ✅ **Frozen unlock:** chỉ CLI với flag `--force`, log warning

### Còn open (chốt khi vào phase tương ứng)
- [ ] **Pick-variation algorithm** chi tiết — weight tags vs slot fit vs layout family. **Chốt khi vào Phase 16a.**
- [ ] **Content slot mapping khi markdown thừa** — content có 6 features nhưng variation chỉ 4 → drop 2 cuối hay merge? **Chốt khi vào Phase 16b.**
- [ ] **Multi-variant content** — 1 section có content cho variation A, đổi sang variation B (cùng schema) — cache content cũ hay force regen? **Đã chốt:** force regen luôn (đơn giản, không cache).

---

## 📝 Changelog tracker

| Phase | Version | Mục đích |
|---|---|---|
| 11 | (no bump) | foundation, no user-visible |
| 12 | (no bump) | CLI internal |
| 13 | (no bump) | dev UI internal |
| 14 | library 1.0.0 (feature-section) | first library release, commit lib |
| 15 | library MINOR bump per type | mở rộng |
| 16 | 1.0.0-beta.1 | compose backend |
| 17 | 1.0.0-rc.1 | Step 4 UI tích hợp |
| 18 | 1.0.0 | release |

> **Note:** library version tách riêng app version. App đọc `library.json` field `version` để check compat.
