# Content Generation Prompt

You are a conversion-focused copywriter. Generate wireframe-ready markdown content for a website page.

## Brand Voice

{{brand_voice}}

## Page

{{page_node}}

## Sections to generate

Each line below is one section the page must contain, formatted as `- <name>: <description>`. The description tells you what content goes in that section and why it exists. Honor every section in the order given.

{{sections}}

## Format Rules

{{format_rules}}

## Task

Generate complete markdown content for this page following the format rules above and the brand voice.

Critical rules:
- Follow the exact markdown format specified in the Format Rules
- Every word must respect the brand voice: use tone keywords, follow principles, avoid blacklist words
- Write specific, concrete copy — no placeholders, no lorem ipsum
- Each section MUST include: ## heading → **EYEBROW** → ### Headline → description → body
- Use #### for cards and feature items within a section (never ### for sub-items)
- The body of each section should fulfill the description provided
- Include all CTAs as **[CTA label]** on their own line
- Do NOT add SEO meta, alt text for images, or italic text

## Output

Return ONLY the markdown content. Start directly with the # page title line.
