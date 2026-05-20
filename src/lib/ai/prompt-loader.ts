import fs from "fs/promises"
import path from "path"

const PROMPTS_DIR = path.join(process.cwd(), "prompts")

export type PromptKey =
  | "01-ux-analysis"
  | "02-sitemap-generate"
  | "03-brand-voice-extract"
  | "04-sections-propose"
  | "05-content-generate"

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

export async function ensurePromptFile(key: PromptKey): Promise<void> {
  await fs.mkdir(PROMPTS_DIR, { recursive: true })
  const filePath = path.join(PROMPTS_DIR, `${key}.md`)
  try {
    const existing = await fs.readFile(filePath, "utf-8")
    if (existing.trim()) return  // already exists and non-empty
  } catch {
    // doesn't exist — create it
  }
  await fs.writeFile(filePath, DEFAULTS[key], "utf-8")
}

export async function ensureAllPromptFiles(): Promise<{ created: string[]; existing: string[] }> {
  const keys: PromptKey[] = [
    "01-ux-analysis",
    "02-sitemap-generate",
    "03-brand-voice-extract",
    "04-sections-propose",
    "05-content-generate",
  ]
  const created: string[] = []
  const existing: string[] = []

  for (const key of keys) {
    const filePath = path.join(PROMPTS_DIR, `${key}.md`)
    try {
      const content = await fs.readFile(filePath, "utf-8")
      if (content.trim()) {
        existing.push(key)
        continue
      }
    } catch {
      // not found
    }
    await fs.writeFile(filePath, DEFAULTS[key], "utf-8")
    created.push(key)
  }

  return { created, existing }
}

// ─── Default prompt content ──────────────────────────────────────────────────

const DEFAULTS: Record<PromptKey, string> = {
  "01-ux-analysis": `# UX Analysis Prompt

You are a senior UX consultant. Analyze the provided website reference and/or project description, then identify UX improvement opportunities.

## Input

**Reference URL content (if available):**
{{nav_structure}}

**Project description:**
{{form_input}}

## Task

Return a JSON array of UX improvement suggestions. Each item must have exactly these fields:
- id: a unique string (use format "imp-1", "imp-2", ...)
- problem: the specific UX issue (1 sentence)
- reason: why this is a problem for the user (1 sentence)
- suggestion: a concrete improvement to apply to the sitemap (1 sentence)

Focus on: missing pages, unclear navigation, missing trust-builders, conversion gaps, page hierarchy issues.

## Output format

Return ONLY valid JSON, no markdown fences, no extra text:

[
  {
    "id": "imp-1",
    "problem": "...",
    "reason": "...",
    "suggestion": "..."
  }
]

If the input is already well-structured, return an empty array: []
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
`,

  "05-content-generate": `# Content Generation Prompt

You are a conversion-focused copywriter. Generate wireframe-ready markdown content for a website page.

## Brand Voice

{{brand_voice}}

## Page

{{page_node}}

## Sections to generate

{{sections}}

## Format Rules

{{format_rules}}

## Task

Generate complete markdown content for this page following the format rules above and the brand voice.

Critical rules:
- Follow the exact markdown format specified in the Format Rules
- Every word must respect the brand voice: use tone keywords, follow principles, avoid blacklist words
- Write specific, concrete copy — no placeholders, no lorem ipsum
- Each section gets a ## heading, each subsection/card gets ### or ####
- Include all CTAs with exact labels per CTA label reference
- Do NOT add SEO meta, alt text for images, or italic text

## Output

Return ONLY the markdown content. Start directly with the # page title line.
`,
}
