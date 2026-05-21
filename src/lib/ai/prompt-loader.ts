import fs from "fs/promises"
import path from "path"

const PROMPTS_DIR = path.join(process.cwd(), "prompts")

export type PromptKey =
  | "01-ux-analysis"
  | "02-sitemap-generate"
  | "03-brand-voice-extract"
  | "04-sections-propose"
  | "05-content-generate"
  | "06-wireframe-from-image"

/**
 * Read a prompt file, replace {{placeholders}}, return the final prompt string.
 * Auto-regens the file from defaults if missing or empty.
 */
export async function loadPrompt(
  key: PromptKey,
  vars: Record<string, string>
): Promise<string> {
  const filePath = path.join(PROMPTS_DIR, `${key}.md`)

  let raw: string
  try {
    raw = await fs.readFile(filePath, "utf-8")
    if (!raw.trim()) throw new Error("empty")
  } catch {
    // File missing or empty → write default and retry
    await ensurePromptFile(key)
    raw = await fs.readFile(filePath, "utf-8")
  }

  // Replace all {{placeholder}} occurrences
  let prompt = raw
  for (const [k, v] of Object.entries(vars)) {
    prompt = prompt.replaceAll(`{{${k}}}`, v)
  }

  return prompt
}

export const PROMPT_KEYS: PromptKey[] = [
  "01-ux-analysis",
  "02-sitemap-generate",
  "03-brand-voice-extract",
  "04-sections-propose",
  "05-content-generate",
  "06-wireframe-from-image",
]

export async function ensurePromptFile(key: PromptKey, force = false): Promise<void> {
  await fs.mkdir(PROMPTS_DIR, { recursive: true })
  const filePath = path.join(PROMPTS_DIR, `${key}.md`)
  if (!force) {
    try {
      const existing = await fs.readFile(filePath, "utf-8")
      if (existing.trim()) return  // already exists and non-empty
    } catch {
      // doesn't exist — create it
    }
  }
  await fs.writeFile(filePath, DEFAULTS[key], "utf-8")
}

export async function ensureAllPromptFiles(force = false): Promise<{ created: string[]; existing: string[]; restored: string[] }> {
  const created: string[] = []
  const existing: string[] = []
  const restored: string[] = []

  for (const key of PROMPT_KEYS) {
    const filePath = path.join(PROMPTS_DIR, `${key}.md`)
    let hasContent = false
    try {
      const content = await fs.readFile(filePath, "utf-8")
      hasContent = !!content.trim()
    } catch {
      // not found
    }
    if (hasContent && !force) {
      existing.push(key)
      continue
    }
    await fs.writeFile(filePath, DEFAULTS[key], "utf-8")
    if (hasContent) restored.push(key)
    else created.push(key)
  }

  return { created, existing, restored }
}

// ─── Default prompt content ──────────────────────────────────────────────────

const DEFAULTS: Record<PromptKey, string> = {
  "01-ux-analysis": `# UX Analysis Prompt — Conversion-Centered Design (CCD)

You are a senior **Conversion-Centered Design (CCD)** consultant trained in Oli Gardner's framework. Your job is to audit a reference website's **sitemap and content layout** and propose changes that will increase conversion when applied to the user's project sitemap. You are NOT proposing app/feature changes (no auth, search, dark mode, animations).

## Inputs

**Reference site (pre-fetched server-side; may include title, headings, nav links, body text preview):**
{{nav_structure}}

**User's project description:**
{{form_input}}

## Methodology — apply the 7 CCD Principles

For every suggestion, name which principle it serves:

1. **Attention** — Each conversion page should have an attention ratio close to 1:1 (one primary CTA, minimal competing links). Flag pages cluttered with navigation/secondary actions.
2. **Context** — Pages must match the visitor intent and traffic source. Generic landing pages dilute paid/organic intent.
3. **Clarity** — Above-the-fold value proposition obvious within 5 seconds. Reduce cognitive load; one idea per section.
4. **Congruence** — Every section on a page supports the single conversion goal. Cut off-topic content.
5. **Credibility** — Trust pages and trust signals are present and discoverable (testimonials, case studies, logos, ratings, guarantees, security badges).
6. **Closing** — Conversion paths end in clear CTAs. Friction-reducing trust appears near decision points (price, signup, checkout).
7. **Continuance** — Post-conversion UX is intentional (thank-you, onboarding, upsell, nurture sequences).

## Output rules

Return a JSON array of **sitemap + content-layout improvements** (max 8). Each item must target ONE of these change types:

- **Add page** — A missing conversion-critical page (e.g. Pricing, Case Studies, Comparison, FAQ — Short, Pre-footer CTA strip, Thank-you, Onboarding tour, Industry-specific landing)
- **Restructure** — Flatten deep nesting, group related pages under a parent, or surface a high-intent page buried in submenus
- **Re-purpose** — Reframe an overloaded page into focused variants (e.g. "Home" trying to serve everyone → split into segmented landing pages)
- **Add section** — A conversion-focused section to insert into an existing page (Hero rewrite, social proof strip, comparison table, mini-FAQ, secondary Pre-footer CTA)
- **De-emphasize / remove** — Content competing with the primary conversion goal (excessive top-nav links, secondary CTAs above the primary one)

**Do NOT propose:**
- Feature work (auth flow, search, dark mode, multilingual toggle, performance, accessibility-only fixes)
- Visual polish without conversion intent ("better colors", "use a slider")
- Content rewrites at the word level (that's Step 4's job)

## Required JSON schema

Return ONLY valid JSON, no markdown fences, no extra text. Each improvement:

[
  {
    "id": "imp-1",
    "problem": "Specific gap in the current sitemap or content layout (1 sentence).",
    "reason": "<CCD principle name>: why this hurts conversion (1 sentence).",
    "suggestion": "Concrete sitemap change to apply — name the new page / restructure action / section to add (1 sentence)."
  }
]

Examples of good suggestions (style reference, not content):
- "Add a 'Case Studies' page under About, listing 3 customer wins with metrics and 1 quote each."
- "Move 'Pricing' from footer to top-nav and add a 'Compare plans' comparison table on the page."
- "Split 'Solutions' into segment-specific landing pages (e.g. 'For Designers', 'For Founders') matching paid-traffic intent."
- "Add a Pre-footer CTA strip with 1 button repeating the page's primary action."
- "Remove the duplicate newsletter signup from the Hero section — it competes with the primary trial CTA."

If the reference site is already strong per CCD, return an empty array: [].
`,

  "02-sitemap-generate": `# Sitemap Generation Prompt

You are a UX architect. Generate a sitemap for a website based on the project description and selected UX improvements.

## Input

**Project description:**
{{form_input}}

**Reference navigation (if available):**
{{nav_structure}}

**UX improvements to apply:**
{{improvements}}

## Task

Generate a complete sitemap as a nested JSON tree. Each node must have:
- id: unique string (use slugified page name, e.g. "home", "about", "contact")
- name: page display name (e.g. "Home", "About Us")
- description: 1 sentence describing the page's purpose
- children: array of child nodes (empty array for leaf pages)
- parentId: parent node's id, or null for the root
- improved: true if this node was added/modified because of one of the UX improvements above, false otherwise

Root node is always "Home" with parentId: null.

## Output format

Return ONLY valid JSON, no markdown fences, no extra text. Single root node:

{
  "id": "home",
  "name": "Home",
  "description": "Main landing page",
  "children": [...],
  "parentId": null,
  "improved": false
}
`,

  "03-brand-voice-extract": `# Brand Voice Extraction Prompt

You are a brand strategist. Extract the brand voice from the provided input (website content, documents, or description).

## Input

{{brand_input}}

## Task

Analyze the input and extract the brand voice. Return a JSON object with exactly these fields:

- toneKeywords: exactly 3 single-word adjectives that capture the brand's tone (e.g. ["Effortless", "Curated", "Warm"])
- principles: 3–5 writing principles as a single string, separated by newlines (e.g. "Use specific details over labels.\nWrite short, active sentences.\nSpeak directly: 'you' and 'we', not 'guests' and 'the team'.")
- doExamples: array of 3–5 example sentences that match the brand voice
- dontExamples: array of 3–5 example sentences that violate the brand voice
- blacklist: array of words/phrases to avoid, lowercase (e.g. ["luxury", "amazing", "5-star"])

## Output format

Return ONLY valid JSON, no markdown fences, no extra text:

{
  "toneKeywords": ["Word1", "Word2", "Word3"],
  "principles": "Principle one.\\nPrinciple two.\\nPrinciple three.",
  "doExamples": ["Example sentence one.", "Example sentence two.", "Example sentence three."],
  "dontExamples": ["Bad example one.", "Bad example two.", "Bad example three."],
  "blacklist": ["word1", "word2", "word3"]
}
`,

  "04-sections-propose": `# Section List Proposal Prompt

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

- \`id\` — kebab-case slug, unique within the page (e.g. "hero", "key-features", "faq-short")
- \`name\` — short display title, Title Case (e.g. "Hero", "FAQ — Short", "Pre-footer CTA")
- \`description\` — exactly 1-2 sentences explaining (a) what content goes here, (b) why this section exists on this page. This will guide the content generator later — be concrete, no fluff.

If the page is non-content (e.g. dashboard route, system page), return a minimal list with just Hero and Pre-footer CTA.
`,

  "06-wireframe-from-image": `# Wireframe HTML Generation Prompt\n\nSee prompts/06-wireframe-from-image.md — this file should not be auto-generated.\nDelete this file and restore from the repo.\n`,

  "05-content-generate": `# Content Generation Prompt

You are a conversion-focused copywriter. Generate wireframe-ready markdown content for a website page.

## Brand Voice

{{brand_voice}}

## Page

{{page_node}}

## Sections to generate

Each line below is one section the page must contain, formatted as \`- <name>: <description>\`. The description tells you what content goes in that section and why it exists. Honor every section in the order given.

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
`,
}
