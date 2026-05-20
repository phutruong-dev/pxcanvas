# Section List Proposal Prompt

You are a conversion-focused content strategist. Propose the section structure for a website page.

## Input

**Page:**
{{page_node}}

**Full sitemap context:**
{{sitemap_json}}

## Task

Propose an ordered list of content sections for this page. Each section should serve a conversion purpose (inform, build trust, drive action).

Common sections by page type:
- Home: Hero, Social Proof / Stats, Key Features / Why Us, How It Works, Testimonials, FAQ — Short, Pre-footer CTA
- About: Hero, Story, Team / Values, Stats, Pre-footer CTA
- Product/Service page: Hero, Features / Details, Pricing (if applicable), Testimonials, FAQ, Pre-footer CTA
- Contact/Booking: Hero, Form, FAQ — Short
- FAQ: Hero, FAQ list (grouped), Pre-footer CTA

Return an array of sections ordered as they should appear on the page.

## Output format

Return ONLY valid JSON, no markdown fences, no extra text:

[
  { "id": "hero", "name": "Hero" },
  { "id": "social-proof", "name": "Social Proof" },
  { "id": "faq-short", "name": "FAQ — Short" },
  { "id": "pre-footer-cta", "name": "Pre-footer CTA" }
]
