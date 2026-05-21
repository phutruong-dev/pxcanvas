# Wireframe Library — AI Generation Rules

> **PURPOSE:** This file is the **bible** for any AI session that generates wireframe HTML from JPG. Read it fully before generating. It defines the component system, conventions, and decision flow that keep all 800+ variations consistent.
>
> **AUDIENCE:** Claude Code (or any AI with vision + write tools).
>
> **DO NOT DEVIATE.** If unsure, mirror an existing approved variation. If a JPG shows something not covered here, ask user — do not invent.

---

## 1. The Library is a System

The wireframe library is **not** a folder of disconnected HTML files. It is a **design system** with:
- A single set of reusable component classes (`wf-*` in `_shared/wireframe-components.css`).
- A single set of slot keys (`data-slot=`) defined in `src/lib/wireframes/slot-schema.ts`.
- A single set of pxpace design tokens (CSS variables in `_shared/pxpace.css`).

**Every variation = pure composition of these primitives.** No new CSS classes, no inline styles for color/typography/spacing, no rogue tags.

When you generate a variation, you're choosing **which** components + **how** to arrange them. You're not designing — the design is already in the components.

---

## 2. File output per variation

**Naming convention (CRITICAL):** HTML folder name MUST equal source JPG filename stem.

```
wireframe-design/feature-section/feature-section-20.jpg          ← source
wireframe-library/feature-section/feature-section-20/index.html  ← output
                                  └─────────┬─────────┘
                                            └─ same stem
```

Every variation lives at `wireframe-library/<type>/<type>-<N>/`:

```
feature-section-<N>/
├── index.html      # Full HTML page (DOCTYPE → body, links to shared CSS)
└── meta.json       # Structured metadata
```

- `<N>` is the exact number from the JPG filename — **no zero-padding** (e.g., `feature-section-1`, `feature-section-20`, `feature-section-111`)
- Future section types follow the same pattern: `hero-5/`, `footer-12/`, etc.
- The variation ID in `meta.json` = folder name (e.g., `"id": "feature-section-20"`)

### 2.1. index.html template (exact wrapper)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{type} — variation {N}</title>
  <link rel="stylesheet" href="../../_shared/pxpace.css">
  <link rel="stylesheet" href="../../_shared/wireframe-components.css">
  <link rel="stylesheet" href="../../_shared/wireframe-base.css">
</head>
<body>

<section class="wf-section">
  <div class="wf-container">
    {section content built from wf-* components}
  </div>
</section>

</body>
</html>
```

The order of `<link>` matters: pxpace tokens → components → base overrides.

### 2.2. meta.json template

```json
{
  "id": "feature-section-020",
  "type": "feature-section",
  "variation": 20,
  "sourceImage": "wireframe-design/feature-section/featuresection20.jpg",
  "htmlPath": "wireframe-library/feature-section/020/index.html",
  "layout": "<2-4 word kebab-case layout tag>",
  "tags": ["<from the canonical tag list>"],
  "slots": [
    { "key": "<slot-key>", "type": "text|image|icon|button|list", "required": <bool>, "description": "<hint>" }
  ],
  "approved": false,
  "frozen": false,
  "libraryVersion": "1.0.0",
  "generatedAt": "<ISO 8601>",
  "generatedBy": "claude-opus-4-7"
}
```

---

## 3. Component catalog (canonical reference)

Compose these. **Do not invent new classes.** Modifiers use `--` suffix.

### 3.1. Layout primitives

| Class | Purpose |
|---|---|
| `.wf-section` | Section root; default vertical+horizontal padding |
| `.wf-section--tight` / `--loose` / `--flush` | Padding variants |
| `.wf-section--full` | No horizontal padding (full-bleed) |
| `.wf-section--surface` / `--surface-2` / `--dark` | Background variants |
| `.wf-container` | Centered, max 140rem |
| `.wf-container--narrow` (80rem) / `--wide` (160rem) | Width variants |
| `.wf-stack` | Vertical flex with gap-s |
| `.wf-stack--tight` / `--loose` | Gap variants |
| `.wf-cluster` | Horizontal flex-wrap with gap-s |
| `.wf-split` | 2-column grid 1:1 with gap-xl |
| `.wf-split--40-60` / `--60-40` / `--30-70` / `--70-30` | Asymmetric splits |
| `.wf-header-block` | Header wrapper (eyebrow+heading+description), max-width 60rem |
| `.wf-header-block--centered` / `--full` | Variants |

### 3.2. Typography (with slot mapping)

| Class | data-slot to use | Visual |
|---|---|---|
| `.wf-eyebrow` | `eyebrow` | Small bold label above headline |
| `.wf-eyebrow--uppercase` | `eyebrow` | Same but ALL CAPS letter-spaced |
| `.wf-display` | `headline` | Extra-large display heading |
| `.wf-h1` | `headline` | H1 |
| `.wf-h2` | `headline` (or `feature-N-title` if very large card title) | Main section heading |
| `.wf-h3` | `feature-N-title` (large cards) | Subheading |
| `.wf-h4` | `feature-N-title` (standard cards) | Card title |
| `.wf-h5` | `feature-N-title` (small cards) | Small card title |
| `.wf-description` | `description` (or `feature-N-body`) | Body paragraph |
| `.wf-description--lead` | `description` | Larger lead paragraph |
| `.wf-description--small` | `feature-N-body` (compact) | Smaller body |
| `.wf-caption` | (various) | Small caption text |

### 3.3. Buttons

| Class | data-slot |
|---|---|
| `.wf-btn.wf-btn--primary` | `cta-primary` |
| `.wf-btn.wf-btn--secondary` | `cta-secondary` |
| `.wf-btn.wf-btn--ghost` | text-link CTA |
| `.wf-btn--lg` / `--sm` | Size modifiers |
| `.wf-btn--pill` | Fully rounded |

### 3.4. Image placeholders

| Class | When to use |
|---|---|
| `.wf-image.wf-image--16-9` | Default hero/feature image |
| `.wf-image--4-3` | Standard landscape |
| `.wf-image--3-2` | Photo |
| `.wf-image--square` | Square image card |
| `.wf-image--portrait` (3:4) | Vertical image |
| `.wf-image--tall` (2:3) | Tall portrait |
| `.wf-image--flat` | No border-radius |
| `.wf-image--rounded` | Larger radius |

Always use `data-slot="image-1"`, `image-2`, etc.

### 3.5. Icons

| Class | When to use |
|---|---|
| `.wf-icon` | Default 2.4rem square |
| `.wf-icon--sm` (1.8rem) / `--lg` (4rem) / `--xl` (5.6rem) | Sizes |
| `.wf-icon--circle` | Round container |
| `.wf-icon--square` | Rounded square |
| `.wf-avatar` | Person photo (4rem circle) |
| `.wf-avatar--sm` / `--lg` | Avatar sizes |

`data-slot="feature-N-icon"` for repeating feature icons.

### 3.6. Cards

| Class | When to use |
|---|---|
| `.wf-card` | White surface card |
| `.wf-card--surface` | Gray surface card |
| `.wf-card--bordered` | Transparent + border |
| `.wf-card--elevated` | With shadow |
| `.wf-card--flat` | Structure only (no bg/padding) |
| `.wf-card--dark` | Dark inverted card |
| `.wf-card--compact` / `--loose` | Padding variants |

### 3.7. Feature items + grids

| Class | When to use |
|---|---|
| `.wf-feature-grid` | Grid wrapper |
| `.wf-feature-grid--2col` … `--6col` | Column count |
| `.wf-feature-item` | Single feature (icon + title + body) |
| `.wf-feature-item--centered` | Centered align text |
| `.wf-feature-item--row` | Horizontal icon + content |

Grids auto-collapse on smaller screens (no need to specify responsive variants).

### 3.8. Other repeat-group components

| Class | Item slots | When to use |
|---|---|---|
| `.wf-badge` + `.wf-badge-list` | `feature-N-title` | Tag/chip cloud |
| `.wf-stat` + `.wf-stat__value` / `__label` | `stat-N-value` / `stat-N-label` | Stats |
| `.wf-testimonial` + `__quote` / `__author` | `testimonial-N-*` | Customer quotes |
| `.wf-faq-list` + `.wf-faq-item` + `__question` / `__answer` | `faq-N-question` / `faq-N-answer` | FAQ |
| `.wf-logo-cloud` + `.wf-logo-item` | `logo-N` | Logo strip |
| `.wf-checklist` + `.wf-checklist-item` | `feature-N-title` | Bullet-checkmark list |

### 3.9. Form

| Class | When to use |
|---|---|
| `.wf-input` / `.wf-textarea` | Form fields |
| `.wf-form-field` + `__label` | Field wrapper |

---

## 4. Slot key naming (single source of truth)

Defined in `src/lib/wireframes/slot-schema.ts`. Quick reference:

| Slot key | Type | Repeat? | Purpose |
|---|---|---|---|
| `eyebrow` | text | no | Tagline above headline |
| `headline` | text | no | Main H2 (required) |
| `description` | text | no | Body paragraph |
| `cta-primary` | button | no | First/primary CTA |
| `cta-secondary` | button | no | Second CTA |
| `image-1`, `image-2`, … | image | indexed | Standalone images |
| `feature-N-icon` / `-title` / `-body` | mixed | repeat group "feature" | Feature item (N=1..12) |
| `faq-N-question` / `-answer` | text | repeat group "faq" | FAQ item (N=1..8) |
| `stat-N-value` / `-label` | text | (future) | Stat item |
| `testimonial-N-quote` / `-author-name` / `-author-role` | text | (future) | Testimonial |
| `logo-N` | image | (future) | Logo item |

**Rules:**
- Only use keys from this list (per section type). Adding new keys = code change in `slot-schema.ts`.
- Required slots must appear; required-ness varies by type — check `getRequiredSlots(type)` (e.g. `headline` is required for feature-section).
- Repeat groups: count items in the JPG, emit N consecutive (e.g., 3 cards → `feature-1`, `feature-2`, `feature-3`).

---

## 5. Decision flow when reading a JPG

Follow this sequence every time:

### Step 1 — Identify section type
Confirm the type matches the folder you're writing to (`feature-section` for `wireframe-library/feature-section/<NNN>/`).

### Step 2 — Identify layout family
Pick one (or combine 2 with `+`):
- `split-image-2col` — image + text side-by-side
- `centered-text` — heading block centered, no image
- `left-text-grid` — header on left, grid on right
- `full-bleed-image` — image fills width with overlay text
- `card-grid` — grid of cards (specify 2/3/4 col)
- `icon-grid` — feature items with icons in grid
- `badge-cloud` — tag/chip flex-wrap
- `stacked` — vertical stack with each row a block
- `asymmetric` — irregular split

### Step 3 — Inventory blocks
List what's in the image:
- Eyebrow / tagline? → `wf-eyebrow`
- Heading? → `wf-h1`/`wf-h2`/`wf-h3` based on size
- Description paragraph? → `wf-description`
- Buttons? Count + variants (primary filled vs secondary outline)
- Image(s)? Count + aspect ratios
- Repeating items? Count → emit N feature/badge/faq slots
- Icon style? Square vs circle, large vs small

### Step 4 — Pick composition
Map to wf-* components:
- Section background: `.wf-section--surface`/`--dark`/none
- Container width: default vs `--narrow`
- Header alignment: default (left) vs `--centered`
- Item layout: `.wf-feature-grid--Ncol` vs `.wf-badge-list` vs `.wf-cluster`
- Cards: `.wf-card`/`--surface`/`--bordered`/`--elevated`

### Step 5 — Emit HTML
- Wrapper as in §2.1
- Add `data-slot=` to every content-bearing element using §4 keys
- Indent for readability (2 spaces)
- Keep placeholder text from the JPG (Lorem ipsum, "Tagline", "Section headings", etc.) — do NOT invent real content

### Step 6 — Write meta.json
- Fill `layout` with the §Step 2 tag
- Fill `tags` from this canonical list only:
  ```
  minimal · image-heavy · dark-bg · icon-grid · text-focus
  2-col · 3-col · 4-col · 5-col · 6-col
  card-layout · badge-chips · cta-focused · full-bleed
  left-aligned · centered · asymmetric · stacked
  surface-bg · bordered · elevated
  ```
- `slots[]` lists every `data-slot` you emitted with type/required/description

### Step 7 — Validate (mental check)
- [ ] All CSS classes start with `wf-` OR are from pxpace.css utility set
- [ ] Every content node has `data-slot=`
- [ ] All slot keys exist in `src/lib/wireframes/slot-schema.ts` for this type
- [ ] Required slots present
- [ ] No inline `style=` except for slot-specific sizing (icon dimensions) — and even then, prefer wf-icon size modifiers

### Step 8 — Update `UNDERSTANDING.md` (MANDATORY)

`wireframe-library/UNDERSTANDING.md` is the catalog AI consults when picking a variation for a Sitemap section (Phase 16a). Every new variation MUST be appended here.

Two updates per variation:

**a) Quick Index table** (top of file)
- Add the new variation ID to the row matching its primary content intent.
- If no row matches → create a new intent row (group alphabetically).
- Update "Section type coverage" totals.

**b) Detail entry** (under the matching `## <section-type>` block)
- Append a new `### <variation-id>` block in numerical order
- Use the exact 5-field template:
  ```
  **Layout:** <one sentence visual description>
  **When to use:** <bullet list of content intents>
  **Content shape:** <required + optional + repeat-group slots with counts/limits>
  **Avoid for:** <bullet list of anti-patterns with reason>
  **See also:** <related variation IDs>
  ```

If unsure about "When to use" — look at similar approved variations and mirror their use-case framing. Be specific: "Key Features / Why Us / Service Highlights" beats "list of features".

---

## 6. DO / DON'T

### ✅ DO
- Compose `wf-*` components for everything.
- Mirror the closest approved variation when in doubt.
- Use pxpace utility classes for fine-tuning gaps/margins/padding (e.g. `gap-l`, `margin-top-m`).
- Use semantic HTML: `<section>`, `<h2>`, `<h3>`, `<h4>`, `<p>`, `<button>`, `<ul>`, `<li>`.
- Set `data-slot=` on EVERY content node.
- Keep JPG placeholder text verbatim (Lorem ipsum, etc.).

### ❌ DON'T
- Don't invent new CSS classes. Need a pattern not covered? Pause and tell the user.
- Don't use inline `style=` for colors, spacing, typography. Only for slot-specific sizing if absolutely required.
- Don't hardcode hex colors, px values, or font names. Use design tokens.
- Don't add `<style>` blocks. All styling lives in `_shared/*.css`.
- Don't use `<div>` for everything. Use semantic tags.
- Don't translate placeholder text. Keep it as it appears in the JPG.
- Don't add JavaScript. These are static templates.

---

## 7. When to extend (rare)

If 5+ variations need a pattern that's not in `wireframe-components.css`:

1. **Stop generating**. Don't make a one-off inline solution.
2. Tell the user: "Variation N needs pattern X. Should I add `.wf-X` to components?"
3. User decides: extend components OR rework variation.

Adding a new `wf-*` class = library MINOR version bump (in `library.json.version`).

Adding a new `data-slot` key = library MAJOR version bump (breaking).

---

## 8. Reference: pilot variations

These have been reviewed and serve as canonical examples. When in doubt, open one and mirror its structure:

| Variation | Layout | Why it's a good reference |
|---|---|---|
| `feature-section/feature-section-20/` | `stacked-header-badge-cloud` | Header block + flex-wrap badge list |

(More to be added as Phase 13 progresses.)

---

## 9. Validation

After writing a batch, run:

```bash
npm run wireframe:validate
```

Checks:
- Every variation has `index.html` + `meta.json`
- `meta.json` shape valid
- HTML contains `<section>`
- All CSS classes ∈ pxpace.css ∪ wireframe-components.css ∪ wireframe-base.css
- All `data-slot=` keys ∈ slot-schema for the type
- Required slots present

Errors block commit. Warnings logged but allowed.

---

## 10. Workflow summary (for AI session)

```
User: "Generate feature-section variations 21-30"
  ↓
For each N in [21..30]:
  ↓
  Read wireframe-design/feature-section/feature-section-<N>.jpg
  ↓
  Follow §5 Decision Flow (Steps 1-8)
  ↓
  Write wireframe-library/feature-section/feature-section-<N>/index.html
  Write wireframe-library/feature-section/feature-section-<N>/meta.json
  Append entry to wireframe-library/UNDERSTANDING.md (Quick Index + Detail)
  ↓
After batch:
  ↓
  Run `npm run wireframe:validate`
  ↓
  Report: done / failed variations
  ↓
User reviews each in browser (file://)
```

That's the entire workflow. Keep it tight.
