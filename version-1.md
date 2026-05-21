# PXcanvas — Version 1.0 Plan: Wireframe Library

> Kế hoạch nâng cấp từ MVP (v1.0.0 — content `.md`) lên **v1.0 — Wireframe HTML pages**.
> Đọc kèm: `MVP-plan.md` (lịch sử MVP), `PRD.md`, `CLAUDE.md`.

---

## ⚡ Quick start cho AI session tiếp theo

**Phase hiện tại: 13 — Build Feature Section library (Claude Code session).**

### BƯỚC ĐẦU TIÊN — BẮT BUỘC

**Đọc `wireframe-library/AI-GENERATION-RULES.md`** — đây là bible cho việc generate HTML. Chứa:
- Component catalog (`wf-*` classes)
- Slot schema reference
- Decision flow 7 bước khi đọc 1 JPG
- DO/DON'T list
- HTML wrapper template

### Workflow

1. User yêu cầu generate batch variation N..M (ví dụ "generate 21-30").
2. Với mỗi variation N trong batch (theo `AI-GENERATION-RULES.md §5 Decision Flow`):
   - `Read` ảnh `wireframe-design/feature-section/featuresection<N>.jpg`
   - Analyze: identify section type → layout family → blocks → compose wf-* components
   - `Write` `wireframe-library/feature-section/<NNN>/index.html` (NNN = zero-pad 3 digits)
   - `Write` `wireframe-library/feature-section/<NNN>/meta.json`
3. Sau batch: `npm run wireframe:validate` → confirm pass
4. User mở browser xem từng `index.html` so với JPG

### Files quan trọng (đọc trước generate)

| File | Vai trò |
|---|---|
| `wireframe-library/AI-GENERATION-RULES.md` | **Bible** — component catalog + decision flow + DO/DON'T |
| `wireframe-library/_shared/wireframe-components.css` | Component class definitions (`wf-section`, `wf-h2`, `wf-btn`, etc.) |
| `wireframe-library/_shared/pxpace.css` | Design tokens (CSS variables) |
| `wireframe-library/_shared/wireframe-base.css` | Slot debug overlay |
| `src/lib/wireframes/slot-schema.ts` | Slot key enum per section type |
| `wireframe-library/feature-section/020/` | Reference pilot — mirror this structure |

### KHÔNG
- ❌ Không invent CSS class — chỉ dùng `wf-*` từ `wireframe-components.css` hoặc utility từ `pxpace.css`
- ❌ Không inline `style=` cho color/spacing/typography (chỉ cho slot-specific sizing nếu thực sự cần)
- ❌ Không dùng `scripts/wireframe-generate.ts` (deprecated — cần API key)
- ❌ Không cần `.env.local` / `ANTHROPIC_API_KEY`
- ❌ Không translate placeholder text (Lorem ipsum, "Tagline", v.v. giữ nguyên từ JPG)

### Khi cần pattern không có
Nếu 5+ variation cần pattern mới (không có trong `wireframe-components.css`):
1. **Dừng generate**
2. Báo user: "Variation N cần pattern X. Thêm `.wf-X` vào components?"
3. User quyết định extend hay rework

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
6. **Track A = Claude Code session, không CLI/API**. Phú dùng Claude Code (Mode A) yêu cầu AI đọc JPG → write HTML trực tiếp. KHÔNG cần `ANTHROPIC_API_KEY`, KHÔNG cần CLI generate script, KHÔNG cần multimodal API call code. Claude Code đã có vision sẵn.
7. **Track B (Project App) không gọi AI Vision** — chỉ chọn template + map content (rule-based hoặc AI text-only).
8. **Library frozen sau approve** — file approved không bị overwrite trừ khi explicit unfreeze.

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
├── scripts/                            # Track A utilities (validate only)
│   └── wireframe-validate.ts           # bulk library integrity check
│   # NOTE: wireframe-generate.ts existed but is DEPRECATED (used API key approach).
│   # Generation now happens via Claude Code session — see "Track A Workflow" section.
│
├── prompts/
│   # NOTE: 06-wireframe-from-image.md existed but is DEPRECATED (was for CLI Vision).
│   # Claude Code reads JPG directly with its built-in vision capability.
│
├── src/
│   ├── app/
│   │   ├── wireframes/                 # OPTIONAL — preview gallery (Track A QA)
│   │   │   └── page.tsx                # static list of generated variations + iframe preview
│   │   ├── api/
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

## 🤖 Track A: Library Builder (Claude Code session)

> Phú yêu cầu Claude Code trong Cursor/CLI đọc JPG + write HTML. Không CLI script, không API key, không Vision pipeline code.

### Workflow chuẩn (per batch ~10-20 variations)

**1. Phú mở Claude Code session, nói:**
> "Generate wireframe HTML cho feature-section variations N..M"

**2. Claude Code làm tự động trong session:**
- Lặp với mỗi N trong batch:
  - `Read` tool đọc `wireframe-design/feature-section/featuresection<N>.jpg` (Read tool có multimodal support → AI nhìn được ảnh)
  - Analyze layout: identify wrapper, columns, items, image/icon/button placeholders
  - Map sang `data-slot` từ slot-schema (xem `src/lib/wireframes/slot-schema.ts`)
  - `Write` tool tạo `wireframe-library/feature-section/<NNN>/index.html` (full HTML page wrapped)
  - `Write` tool tạo `wireframe-library/feature-section/<NNN>/meta.json`

**3. Phú review batch:**
- Mở từng `index.html` trong browser (file://)
- So sánh với JPG nguồn
- Note variation nào layout sai → yêu cầu Claude Code regenerate

**4. Sau khi pass cả 111:**
```bash
npm run wireframe:validate   # bulk check meta + HTML
git add wireframe-library/feature-section/
git commit -m "lib: feature-section v1.0 (111 variations)"
```

### Quy tắc HTML Claude Code phải tuân (CHECKLIST khi generate)

**File `index.html` wrapper:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>feature-section — variation NN</title>
  <link rel="stylesheet" href="../../_shared/pxpace.css">
  <link rel="stylesheet" href="../../_shared/wireframe-base.css">
</head>
<body>
{section fragment}
</body>
</html>
```

**Section fragment rules:**
- Root: `<section class="padding-vertical-2xl padding-horizontal-l">` (điều chỉnh padding theo ảnh)
- Mọi node nội dung có `data-slot="<key>"`
- Slot key ∈ `src/lib/wireframes/slot-schema.ts` cho type tương ứng
- Required slots phải xuất hiện (xem `getRequiredSlots(type)`)
- Class CSS chỉ dùng từ `pxpace.css` (không invent class mới)
- Wireframe styling: grayscale placeholder (`bg-base-10`, `bg-surface`), KHÔNG dùng brand color (`bg-primary`, etc.)

**Placeholder conventions:**
```html
<!-- Image -->
<div class="bg-base-10 radius-m full-width" style="aspect-ratio:16/9" data-slot="image-1"></div>

<!-- Icon (circle gray) -->
<div class="bg-base-10 radius-full" style="width:4rem;height:4rem" data-slot="feature-1-icon"></div>

<!-- Primary button (filled dark) -->
<button class="bg-secondary text-tertiary padding-vertical-2xs padding-horizontal-s radius-s font-500" data-slot="cta-primary">Contact now</button>

<!-- Secondary button (outlined) -->
<button class="border border-border text-title padding-vertical-2xs padding-horizontal-s radius-s font-500" data-slot="cta-secondary">See more</button>

<!-- Eyebrow -->
<span class="text-s font-600 text-title" data-slot="eyebrow">Tagline</span>

<!-- Headline H2 -->
<h2 class="text-3xl font-700 text-title line-height-s" data-slot="headline">Section headings</h2>

<!-- Body description -->
<p class="text-m text-body line-height-l" data-slot="description">Lorem ipsum dolor sit amet...</p>

<!-- Feature card title -->
<h4 class="text-l font-600 text-title" data-slot="feature-1-title">Feature name</h4>

<!-- Feature card body -->
<p class="text-m text-body line-height-l" data-slot="feature-1-body">Short description</p>

<!-- Badge/chip (variation 20 style) -->
<span class="bg-base-10 radius-full padding-vertical-2xs padding-horizontal-s text-m text-title" data-slot="feature-N-title">Label</span>
```

**File `meta.json` shape:**
```json
{
  "id": "feature-section-NNN",
  "type": "feature-section",
  "variation": <N>,
  "sourceImage": "wireframe-design/feature-section/featuresection<N>.jpg",
  "htmlPath": "wireframe-library/feature-section/<NNN>/index.html",
  "layout": "<2-4 word layout tag>",
  "tags": ["minimal" | "image-heavy" | "dark-bg" | "icon-grid" | "text-focus" | "2-col" | "3-col" | "4-col" | "card-layout" | "badge-chips" | "cta-focused" | "full-bleed" | "left-aligned" | "centered"],
  "slots": [
    { "key": "<slot-key>", "type": "text|image|icon|button|list", "required": <bool>, "description": "<short hint>" [, "repeatGroup": "feature", "repeatIndex": <N>] }
  ],
  "approved": false,
  "frozen": false,
  "libraryVersion": "1.0.0",
  "generatedAt": "<ISO 8601>",
  "generatedBy": "claude-opus-4-7"
}
```

### Token cheatsheet (cho Claude Code khi cần lookup class names)

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
ASPECT: aspect-1, aspect-16-9, aspect-4-3, aspect-3-2 etc.
```

Hoặc xem trực tiếp `pxpace.css` để check class name. KHÔNG invent class.

### Validation pipeline (validate.ts)

`npm run wireframe:validate` chạy `scripts/wireframe-validate.ts`:
1. Mỗi variation phải có `index.html` + `meta.json`
2. `meta.json` pass `validateWireframeMeta()` (xem `src/lib/wireframes/meta-schema.ts`)
3. HTML phải chứa `<section>` element
4. Mọi class CSS ∈ pxpace.css
5. Mọi `data-slot` ∈ slot schema của type
6. Required slot present

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
| 11 | A+B | ✅ | Foundation: types, slot schema, library folder, validator |
| 12 | A | ⏸️ | ~~Vision pipeline CLI~~ — DEPRECATED (API key approach scrapped) |
| 13 | A | 🚧 | **Build Feature Section library — Claude Code session batches** |
| 14 | A | ⬜ | Optional preview gallery (`/wireframes` static viewer) |
| 15 | A | ⬜ | Section Type Expansion (Hero/Header/Footer/...) — không khẩn cấp |
| 16a | B | ⬜ | Section & Variation Planning (4a) |
| 16b | B | ⬜ | Content Generation slot-constrained (4b) |
| 16c | B | ⬜ | Compose & Preview (4c) |
| 17 | B | ⬜ | Step 4 UI tích hợp + export + migration wizard |
| 18 | B | ⬜ | Release v1.0 |

**Track A (Phase 11, 13-15)** ship riêng, không gate release v1.0.
**Track B (Phase 16-18)** là pre-requisite của release v1.0. Có thể chạy với chỉ Feature Section library (đủ demo).
**Phase 12** giữ làm reference cho hậu thế — code đã commit nhưng deprecated (không xóa để có audit trail).

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

## Phase 12 — ⏸️ DEPRECATED (API-key Vision pipeline approach)

> Approach này dựa trên giả định sai: user dùng Anthropic API key Mode B. Thực tế user dùng Claude CLI Mode A — không cần API key.
> Code đã commit (`commit fa....`) nhưng KHÔNG dùng cho generation. Xem Phase 13 cho approach đúng.

### Files giữ lại (dùng tham khảo, không xóa)
- `prompts/06-wireframe-from-image.md` — prompt cho Vision API, không cần nữa nhưng có thể tham khảo
- `src/lib/ai/anthropic-api.ts` — `callAnthropicApiWithImage()` không dùng, nhưng vô hại
- `src/lib/ai/vision.ts` — dead code, không gọi từ đâu
- `scripts/wireframe-generate.ts` — DEPRECATED, không chạy. Nếu chạy sẽ báo missing `ANTHROPIC_API_KEY`

### Files vẫn DÙNG (Phase 11 + 13 cần)
- `src/lib/wireframes/html-validate.ts` — validator, dùng ở `wireframe:validate`
- `scripts/wireframe-validate.ts` — bulk integrity check
- `package.json` script `wireframe:validate`

### Cleanup tùy chọn (không bắt buộc)
- Có thể xóa vision.ts, wireframe-generate.ts, callAnthropicApiWithImage, 06 prompt nếu muốn repo gọn.
- Không xóa: html-validate, wireframe-validate.

---

## Phase 13 — Build Feature Section Library (Claude Code session)

**Goal:** Tạo HTML + meta.json cho 111 feature-section variation, validate pass, commit.

### Approach
Phú mở Claude Code session, yêu cầu generate từng batch ~10-20 variation. Claude Code:
1. Đọc JPG bằng `Read` tool (vision có sẵn)
2. Analyze layout
3. Write `wireframe-library/feature-section/<NNN>/index.html` + `meta.json` theo HTML conventions ở §Track A Workflow

Đã xong: variation 020 (commit dạng pilot, đã validate pass).

### Tasks (Phú execute với Claude Code)
- [x] Variation 020 pilot — validate pass, layout đúng
- [ ] Variation 001-019 (batch 1: ~10 variations/session)
- [ ] Variation 021-040 (batch 2)
- [ ] Variation 041-060 (batch 3)
- [ ] Variation 061-080 (batch 4)
- [ ] Variation 081-100 (batch 5)
- [ ] Variation 101-111 (batch 6)
- [ ] Per batch: Phú open browser + so sánh với JPG nguồn → request re-generate variation lỗi
- [ ] Sau khi 111 xong: `npm run wireframe:validate` pass cả 111
- [ ] Generate `wireframe-library/library.json` catalog (script hoặc tay)
- [ ] Set `approved: true` cho variation đã review OK (script bulk hoặc edit meta)
- [ ] Set `frozen: true` cho approved (script bulk)
- [ ] Commit `wireframe-library/feature-section/` + `library.json`

### Per-batch quality criteria
- Layout HTML render in browser **giống** JPG nguồn (so sánh side-by-side)
- Validate pass: `<section>`, pxpace.css classes only, slot keys ∈ schema, required slots present
- Slot debug toggle work (`<body class="slot-debug">`)
- Mọi variation có meta.json đúng format

### Done khi
- 111/111 variation generated + validated
- ≥ 89/111 (80%) approved + frozen
- `library.json` catalog có sẵn
- Commit `wireframe-library/feature-section/` (~5-10MB HTML + meta)

---

## Phase 14 — Optional Preview Gallery (`/wireframes` static viewer)

**Goal:** UI nhẹ trong app để Phú browse library + iframe preview, NOT required cho release.

### Tasks
- [ ] `app/wireframes/page.tsx` — list type tabs + grid card variation
- [ ] Card: thumbnail (JPG nguồn) + iframe preview HTML + meta info
- [ ] Filter: tags, layout, approved status
- [ ] Slot debug toggle (toggle `<body class="slot-debug">` trên iframe)
- [ ] Click card → mở variation in fullscreen iframe
- [ ] Read-only — không có generate/approve UI (làm tay qua Claude Code session)

### Done khi
- `/wireframes` mở được, browse 111 variation
- Iframe preview render đúng
- Filter/search hoạt động

---

## Phase 15 — Section Type Expansion (theo nhu cầu)

> Không khẩn cấp cho release v1.0. Phase 16-18 chỉ cần Feature Section là demo được.

Lặp Phase 13 cho mỗi type mới:
1. Phú thêm JPG vào `wireframe-design/<type>/`
2. Define slot schema cho type trong `src/lib/wireframes/slot-schema.ts`
3. Yêu cầu Claude Code generate batch
4. Validate + approve + commit

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
| 12 | (deprecated) | code committed nhưng không dùng |
| 13 | library 1.0.0 (feature-section) | first library release, commit lib |
| 14 | (no bump) | optional preview gallery |
| 15 | library MINOR bump per type | mở rộng |
| 16 | 1.0.0-beta.1 | compose backend |
| 17 | 1.0.0-rc.1 | Step 4 UI tích hợp |
| 18 | 1.0.0 | release |

> **Note:** library version tách riêng app version. App đọc `library.json` field `version` để check compat.
