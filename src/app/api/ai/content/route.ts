import { NextRequest, NextResponse } from "next/server"
import { callAI } from "@/lib/ai/provider"
import type { Section } from "@/lib/types/content"
import type { SitemapNode } from "@/lib/types/sitemap"
import type { BrandVoice } from "@/lib/types/brand-voice"
import type { Settings } from "@/lib/types/settings"

type RequestBody = {
  pageNode: SitemapNode
  sections: Section[]
  brandVoice: BrandVoice
  settings: Pick<Settings, "provider" | "apiKey" | "aiModel" | "debugLogging">
}

function formatBrandVoice(bv: BrandVoice): string {
  return [
    `Tone: ${bv.toneKeywords.join(", ")}`,
    `Principles:\n${bv.principles}`,
    `Do examples:\n${bv.doExamples.map((e) => `- ${e}`).join("\n")}`,
    `Don't examples:\n${bv.dontExamples.map((e) => `- ${e}`).join("\n")}`,
    `Blacklist words: ${bv.blacklist.join(", ")}`,
  ].join("\n\n")
}

const FORMAT_RULES = `
- Start with # page title
- Each section must follow this exact structure in order:
  1. ## Section Name          — matches name from the sections list exactly
  2. **EYEBROW LABEL**        — 2–5 ALL CAPS words (context/category label, e.g. WHY US, HOW IT WORKS)
  3. ### Main Headline        — 5–12 words, benefit-focused, attention-grabbing
  4. Short description.       — 1–2 sentences of supporting copy (20–40 words)
  5. [section body]           — #### for cards/feature items, bullets for lists, CTAs
- Use #### (not ###) for cards and feature items within a section
- CTAs: write as **[CTA label]** on their own line
- Write in plain markdown — no HTML, no tables, no image syntax
- Do NOT include SEO meta, alt text, italics, or lorem ipsum
- Keep all blacklist words out of the copy
`.trim()

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as RequestBody
    const { pageNode, sections, brandVoice, settings } = body

    const raw = await callAI(
      "05-content-generate",
      {
        brand_voice: formatBrandVoice(brandVoice),
        page_node: JSON.stringify(pageNode, null, 2),
        sections: sections
          .map((s) => `- ${s.name}: ${s.description?.trim() || "(no description)"}`)
          .join("\n"),
        format_rules: FORMAT_RULES,
      },
      {
        provider: settings.provider,
        apiKey: settings.apiKey,
        model: settings.aiModel,
        debugLogging: settings.debugLogging,
      },
    )

    return NextResponse.json({ data: raw.trim() })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
