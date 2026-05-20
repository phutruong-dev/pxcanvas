# Template — Generate a Page

> Copy nguyên block dưới đây, điền vào `{{...}}`, paste cho AI.

---

## Prompt (copy from here)

```
You are generating CONTENT (text only — no visual design) for one page of the Villa T Dubrovnik website.

BEFORE WRITING, you MUST read these files in order and respect them:
1. _foundations/villa-facts.md     ← only state facts that exist in this file
2. _foundations/brand-voice.md     ← never use blacklisted words
3. _foundations/personas.md        ← apply hooks for the page's primary persona
4. _foundations/seo-keywords.md    ← use primary + 2 secondary keywords naturally
5. _foundations/ux-patterns.md     ← use standard CTAs / form labels / microcopy
6. _templates/page-output-schema.md ← format output exactly as this schema
7. sitemap.md (the section for the page below) ← respect the section order

PAGE TO GENERATE:
- Page slug:        {{PAGE_SLUG}}            (e.g. /the-villa/master-suite-sea)
- Output filename:  pages/{{NN}}-{{slug}}.md (e.g. pages/03a-master-sea.md)
- Primary persona:  {{PERSONA}}              (P1 Family / P2 Celebration / P3 Couple / P4 Corporate)
- Secondary persona (optional): {{PERSONA_2}}
- Primary keyword:  {{KEYWORD_PRIMARY}}
- Page-specific notes (optional):
  {{ANY_EXTRA_CONTEXT}}

OUTPUT RULES:
- English only (the website is English-primary).
- Format strictly per _templates/page-output-schema.md — no extra commentary.
- Every long body block wrapped in ```text ... ``` so I can paste into Figma.
- For any field you can't fill from facts, write {{NEEDS_INPUT: question}} — do not invent.
- Hero H1: provide TWO options (A, B) for me to pick.
- All CTA labels must match _foundations/ux-patterns.md §1 exactly.
- Self-check before sending:
  · No blacklisted words (luxury, 5-star, best, amazing, etc.)
  · At least one concrete specific (number, distance, brand) per major block
  · Primary keyword in H1, meta title, meta description, at least one H2
  · Pre-footer CTA included
  · Word count per block fits schema guidance

Now generate the page.
```

---

## Quick reference — slug & NN mapping

| NN | Slug | Page |
|---|---|---|
| 01 | `home` | `/` |
| 02 | `about` | `/about` |
| 03 | `the-villa` | `/the-villa` (hub) |
| 03a | `master-sea` | `/the-villa/master-suite-sea` |
| 03b | `master-old-town` | `/the-villa/master-suite-old-town` |
| 03c | `standard-rooms` | `/the-villa/standard-rooms` |
| 04 | `amenities` | `/amenities` |
| 05 | `services` | `/services` |
| 06 | `eat-drink` | `/eat-drink` |
| 06a | `private-chef` | `/eat-drink/private-chef` |
| 06b | `wine-cellar` | `/eat-drink/wine-cellar` |
| 07 | `location` | `/location` |
| 08 | `rates` | `/rates` |
| 09 | `faq` | `/faq` |
| 10 | `gallery` | `/gallery` |
| 11 | `reviews` | `/reviews` |
| 12 | `check-availability` | `/check-availability` |
| 13 | `contact` | `/contact` |
| 14 | `thank-you` | `/thank-you` |
| 15 | `house-rules` | `/house-rules` |
| 16 | `cancellation` | `/cancellation-policy` |
| 17 | `privacy` | `/privacy` |
| 18 | `terms` | `/terms` |

---

## Persona mapping per page (reference)

| Page | Primary | Secondary |
|---|---|---|
| Home | All four (balanced) | — |
| About | P3 Couple | P1 Family |
| The Villa (hub) | P1 Family | P2 Celebration |
| Master Sea | P3 Couple | — |
| Master Old Town | P3 Couple | P2 Celebration |
| Standard Rooms | P1 Family | P2 Celebration |
| Amenities | P2 Celebration | P3 Couple |
| Services | P4 Corporate | P1 Family |
| Eat & Drink | P3 Couple | P2 Celebration |
| Location | P1 Family | P3 Couple |
| Rates | P1 Family | P4 Corporate |
| FAQ | P1 Family | P4 Corporate |
| Gallery | All four (visual-led) | — |
| Reviews | P3 Couple | All |
| Check Availability | All four | — |
| Contact | All four | — |

---

## Primary keyword per page (reference)

| Page | Primary keyword |
|---|---|
| Home | private villa Dubrovnik |
| About | private villa Dubrovnik (brand-led) |
| The Villa | 6 bedroom villa Dubrovnik |
| Master Sea | Dubrovnik villa with sea view |
| Master Old Town | villa Dubrovnik Old Town view |
| Standard Rooms | Dubrovnik villa for families |
| Amenities | Dubrovnik villa with private pool |
| Services | full-service villa Dubrovnik |
| Eat & Drink | private chef villa Dubrovnik |
| Location | villa near Old Town Dubrovnik |
| Rates | Dubrovnik villa rates |
| FAQ | Dubrovnik villa booking |
| Gallery | Villa T Dubrovnik photos |
| Reviews | Villa T Dubrovnik reviews |
| Check Availability | book villa Dubrovnik |
| Contact | contact Villa T Dubrovnik |

---

## Example — filled prompt for `/the-villa/master-suite-sea`

```
You are generating CONTENT (text only — no visual design) for one page of the Villa T Dubrovnik website.

BEFORE WRITING, you MUST read these files in order and respect them:
1. _foundations/villa-facts.md
2. _foundations/brand-voice.md
3. _foundations/personas.md
4. _foundations/seo-keywords.md
5. _foundations/ux-patterns.md
6. _templates/page-output-schema.md
7. sitemap.md (section §4.3.a)

PAGE TO GENERATE:
- Page slug:        /the-villa/master-suite-sea
- Output filename:  pages/03a-master-sea.md
- Primary persona:  P3 Couple
- Secondary persona: —
- Primary keyword:  Dubrovnik villa with sea view
- Page-specific notes:
  This is the "anchor" room for couples & honeymoons.
  Hot-tub bath in ensuite is the standout feature — lead with it visually.
  Adjacent to a standard room (good for "couple + grandparents" pairing).

OUTPUT RULES:
[as above]

Now generate the page.
```
