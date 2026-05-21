# Wireframe Library — Understanding

> **PURPOSE:** Mapping from **content intent** → **wireframe variation**. This is what AI consults when picking a variation for a Sitemap section (Phase 16a). Every variation in the library has one entry here.
>
> **MAINTENANCE RULE:** Every time a new variation is added to `wireframe-library/`, an entry MUST be appended here. See `AI-GENERATION-RULES.md §5 Step 8`.
>
> **AUDIENCE:** AI session matching Sitemap section descriptions to variations + human reviewing the catalog.

---

## 📑 Quick Index (by content intent)

| Content intent | Item count | Has icons | Has CTAs | Has images | Variations |
|---|---|---|---|---|---|
| **Key Features / Why Us / Service Highlights** (icon cards) | 4-6 | ✓ | – | – | `feature-section-2` |
| **Tag cloud / Skill list / Tech stack / Categories** (label chips) | 5-15 | – | – | – | `feature-section-20` |

> When this table grows, group rows by content intent first (alphabetical), then by item count. Add new intent rows as needed.

### Section type coverage

| Section type | Total | Approved | Notes |
|---|---|---|---|
| feature-section | 2 / 111 | 1 | Pilots: 2, 20 |
| hero | 0 | 0 | (Phase 15) |
| header | 0 | 0 | (Phase 15) |
| footer | 0 | 0 | (Phase 15) |
| faq | 0 | 0 | (Phase 15) |
| testimonials | 0 | 0 | (Phase 15) |
| cta | 0 | 0 | (Phase 15) |
| blog | 0 | 0 | (Phase 15) |
| pricing | 0 | 0 | (Phase 15) |
| logo-cloud | 0 | 0 | (Phase 15) |
| stats | 0 | 0 | (Phase 15) |
| team | 0 | 0 | (Phase 15) |
| contact | 0 | 0 | (Phase 15) |
| gallery | 0 | 0 | (Phase 15) |

---

## How to read an entry

Each entry is a self-contained recipe answering: *"When would I pick this variation?"*

```
### <variation-id>
**Layout:** <one-sentence visual description>
**When to use:** <bullet list of content intents this variation fits>
**Content shape:** <slot requirements: required slots, repeat-group counts, character limits>
**Avoid for:** <bullet list of intents this variation does NOT fit, with reason>
**See also:** <related variation IDs to compare against>
```

---

## feature-section

### feature-section-2

**Layout:** Centered headline + description block, followed by a 3-column × 2-row grid of bordered cards. Each card stacks: square icon (top-left), bold title, multi-line body description.

**When to use:**
- **Key Features / Why Us** when there are 4-6 equally-weighted benefits
- **Service Highlights** for service businesses (interior design, consulting, agencies)
- **Product Capabilities** for SaaS / product pages listing core abilities
- **Amenities List** for hospitality (villa, hotel, resort) — e.g., pool, bedrooms, chef, view
- **Trust Pillars / Brand Values** when each pillar needs an icon + short explanation
- Content with balanced importance — no single item dominates

**Content shape:**
- Required: `headline` (5-12 words)
- Optional: `description` (1-2 sentences, ~20-40 words)
- Repeat group `feature` (6 items expected; 4-6 acceptable, 5 collapses asymmetrically — prefer feature-section-X with 5-col when 5 items):
  - `feature-N-icon` (visual marker, brand-agnostic shape)
  - `feature-N-title` (2-6 words, bold)
  - `feature-N-body` (1-2 sentences, ~15-25 words)
- No CTAs in this variation

**Avoid for:**
- Hero sections (no CTA, no above-the-fold prominence)
- 2-3 item lists (too sparse — use a 2-col or 3-col single-row variant)
- Content requiring images instead of icons (use feature-section-X with image cards)
- Mixed-importance content (one "hero" benefit + supporting points → use asymmetric split)
- Long descriptive copy (>30 words per item) — body will overflow

**See also:** (to be added — variations with 4-col grid, 2-col asymmetric, image cards)

---

### feature-section-20

**Layout:** Left-aligned header block (eyebrow + bold headline + multi-line description, ~50% width) followed by a flex-wrap row of pill-shaped badge chips below. No cards, no icons, no images.

**When to use:**
- **Tag cloud** for blog/portfolio categories
- **Skill list** for personal/agency portfolios (e.g., "What I do", "Capabilities")
- **Tech stack** for product/dev sites ("Built with React, Node, Postgres, …")
- **Service categories** when listing many small offerings without per-item detail
- **Filter chips** for archive/index pages
- **Industry/Audience tags** for B2B ("We serve: SaaS, e-commerce, healthcare, …")
- Content with 5-15 short labels that don't each warrant a full card

**Content shape:**
- Optional: `eyebrow` (1-3 words)
- Required: `headline` (5-12 words)
- Optional: `description` (1-3 sentences)
- Repeat group `feature` (5-15 items expected, just `feature-N-title` slot used — no icon, no body):
  - `feature-N-title` (1-3 words per chip — short labels only)

**Avoid for:**
- Each item needs explanation (use feature-section-2 with icon cards)
- Items have varying importance (chips imply equal weight)
- Very few items (<4) — visual feels sparse
- Items > 4 words — chips break visual rhythm
- Content needing icons (chips are text-only)

**See also:** (to be added — variations with badge + icon, badge with count number, centered badge layout)

---

## Append-only section

Future variations append below in numerical order within their section type. Keep the Quick Index table at the top in sync — that's the AI's first scan.
