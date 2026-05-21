# Section List Proposal Prompt

You are a senior **Conversion-Centered Design (CCD)** copy strategist. Propose the section structure for one website page so that, when content is generated later, the page converts.

## Inputs

**Page (the one we are designing):**
{{page_node}}

**Full sitemap context (other pages that exist):**
{{sitemap_json}}

## Mandatory rules (apply by page-type detection)

Detect the page type from its name + description + position in the sitemap. Then output sections respecting MUST/SHOULD rules below:

| Page type | MUST include | SHOULD include |
|---|---|---|
| **Home / Landing** | Hero, Pre-footer CTA | Social Proof, Key Features / Why Us, How It Works, Testimonials, FAQ — Short |
| **About / Story** | Hero, Pre-footer CTA | Founding Story, Team / Values, Stats / Milestones |
| **Pricing / Product / Service** | Hero, Pricing or Features detail, Pre-footer CTA | Comparison table, Testimonials, FAQ |
| **Contact / Booking** | Hero, Form | FAQ — Short, Trust signals (response time, hours, location) |
| **FAQ** | Hero, FAQ list (grouped) | Pre-footer CTA |
| **Case Study / Customer Story** | Hero, Problem, Solution, Result with metrics | Quote / Testimonial, Pre-footer CTA |
| **Blog index / Resources** | Hero, List of items | Categories filter, Newsletter signup |
| **Any other** | Hero, Pre-footer CTA | (use judgement based on page intent) |

Beyond the mandatory list, add any extra sections that strengthen conversion for this page's specific intent. Cap total sections at 8 to keep pages focused.

## CCD anchoring (don't name principles in output, just respect spirit)

- **Attention** — one primary CTA per page; secondary CTAs allowed only in Pre-footer
- **Clarity** — Hero communicates value in 1 line; one idea per section
- **Credibility** — trust signals near decision points (testimonials before pricing CTA, badges in Hero, etc.)
- **Closing** — every conversion page ends with a Pre-footer CTA repeating the primary action
- **Continuance** — if page is a conversion endpoint (thank-you, post-signup), describe what happens next

## Output format

Return ONLY valid JSON array, no markdown fences, no extra text. Each section:

[
  {
    "id": "hero",
    "name": "Hero",
    "description": "Above-the-fold value prop with 1 headline, 1 sub-headline, and the primary CTA."
  },
  {
    "id": "social-proof",
    "name": "Social Proof",
    "description": "Logos of 5-8 well-known customers to establish trust before users read further."
  },
  {
    "id": "pre-footer-cta",
    "name": "Pre-footer CTA",
    "description": "Repeats the page's primary CTA in a focused strip just above the footer."
  }
]

### Field rules

- `id` — kebab-case slug, unique within the page (e.g. "hero", "key-features", "faq-short")
- `name` — short display title, Title Case (e.g. "Hero", "FAQ — Short", "Pre-footer CTA")
- `description` — exactly 1-2 sentences explaining (a) what content goes here, (b) why this section exists on this page. This will guide the content generator later — be concrete, no fluff.

If the page is non-content (e.g. dashboard route, system page), return a minimal list with just Hero and Pre-footer CTA.
