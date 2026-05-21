# Wireframe Library

> Static HTML template asset. **Build once via Track A, reuse forever via Track B.**

This document covers what the library is, how it's organized, and how the
project app (Track B) consumes it. For the build pipeline itself, see
`docs/decisions/0002-wireframe-library-static.md` and Phase 12-14 in
`version-1.md`.

---

## 1. What the library is

A folder of HTML section templates organized by `SectionType`. Each template
is one variation of a section (e.g. variation 7 of "feature-section"). The
HTML uses only `pxpace.css` utility classes, contains zero hardcoded content,
and exposes a `data-slot="..."` attribute on every content-bearing node.

```
wireframe-library/
├── library.json                    # catalog index — what's in the library
├── _shared/
│   ├── pxpace.css                  # snapshot, locked to library version
│   └── wireframe-base.css          # debug outline, placeholder icons
└── <section-type>/
    └── <NNN>/
        ├── index.html              # the template
        └── meta.json               # variation metadata (slots, tags, layout)
```

`source.jpg` is **not** copied into the library — `meta.sourceImage` stores
a relative path back to `wireframe-design/<type>/featuresectionN.jpg`.

---

## 2. The slot contract

Slots are the **API** between the static template (Track A) and the dynamic
content (Track B). They never change without a library MAJOR version bump.

Each template has:
- **Required slots** — must be filled. Without them, the section breaks.
- **Optional slots** — content fills them when available; otherwise the slot
  stays visible with a placeholder (image-shaped grayscale block, or
  textual em-dash).
- **Repeat groups** — `feature-N-title`, `feature-N-body`, etc. The variation
  declares how many `N` it supports (4, 6, ...). Content must produce exactly
  that many items.

The full slot enum per section type lives in
`src/lib/wireframes/slot-schema.ts` and is the source of truth.

Common slots (reused across types):

| Key | Type | Meaning |
|---|---|---|
| `eyebrow` | text | ALL-CAPS tagline above headline |
| `headline` | text | Main H2 (5–12 words) |
| `description` | text | Supporting body paragraph |
| `cta-primary`, `cta-secondary` | button | Buttons |
| `image-1`, `image-2`, ... | image | Static-position images |
| `feature-N-icon`, `feature-N-title`, `feature-N-body` | mixed | Feature item repeat group |
| `faq-N-question`, `faq-N-answer` | text | FAQ item repeat group |

---

## 3. Build-once philosophy

The library is regenerated only when:
- A new section type is being added (Phase 15).
- The slot schema itself changes (rare, breaking, MAJOR bump).
- A template is unfrozen for a deliberate redesign (CLI `--force`).

It is **not** regenerated per project, per content change, or per render.
This is the central design constraint that makes everything else simple:
- No AI Vision cost during normal use.
- No nondeterminism in the user experience.
- Library can be cached aggressively, shipped to CDN, or vendored.

---

## 4. How the project app consumes the library (Track B)

```
Step 4a (Section & Variation Planning)
  loadLibrary()  →  catalog.sections[type].variations
                ↓
  AI prompt 04 receives library summary (id, layout, tags per variation)
                ↓
  AI suggests variationId per section
                ↓
  User confirms / overrides via variation-picker-modal

Step 4b (Content Generation)
  For each section: load variation.slots from library
                ↓
  AI prompt 05 receives slot_schema → emits content STRICTLY matching it

Step 4c (Compose)
  parseMarkdownToSlots(content, slots) → Record<key, value>
  slot-fill: read template HTML, replace [data-slot=key] textContent / attrs
  compose-page: wrap sections in <html><head><link pxpace.css></head><body>
```

No AI calls happen in 4c. Everything from compose-page onward is deterministic.

---

## 5. Versioning

The library's version is **independent** of the app version. It lives in
`library.json.version` and follows semver:

- **MAJOR**: slot schema changed (slot key renamed/removed). Project apps
  pinned to the old MAJOR cannot consume.
- **MINOR**: new section type added, or new variation under existing type.
  Backwards compatible.
- **PATCH**: template HTML refinement that preserves all existing slots.

Apps read `catalog.version` at startup and surface a warning if the major
version is incompatible with their `SectionType` enum.

---

## 6. Common operations (Track A — Phú only)

These are dev-only and live under `PXCANVAS_DEV=1` or CLI scripts.

```bash
# Generate one variation
npm run wireframe:gen -- --type feature-section --variation 1

# Generate all (resumable)
npm run wireframe:gen -- --type feature-section --all

# Validate library on disk
npm run wireframe:validate

# Freeze approved variations
npm run wireframe:freeze -- --type feature-section
```

These are scaffolded in Phase 12 onward; Phase 11 only sets up the types
and folder layout.

---

## 7. Troubleshooting

| Symptom | Likely cause |
|---|---|
| `loadLibrary()` returns empty catalog | `library.json` not present yet — Track A hasn't run |
| Validation fails on import | `library.json` schema mismatch → bump library MAJOR or fix shape |
| Slot debug shows missing labels | Template forgot `data-slot` on a content node — regenerate |
| Content has 6 features but variation slot stops at 4 | Variation declares max 4 in slot_schema; content gen must respect it (Phase 16b enforces) |
