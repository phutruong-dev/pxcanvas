import { NextRequest, NextResponse } from "next/server"
import { callAI } from "@/lib/ai/provider"
import { extractJSON } from "@/lib/utils/extract-json"
import { fetchUrlContent, formatFetchedPageForPrompt } from "@/lib/utils/url-fetcher"
import type { BrandVoice } from "@/lib/types/brand-voice"
import type { Settings } from "@/lib/types/settings"

type RequestBody = {
  url?: string
  fileName?: string
  fileText?: string
  freeText?: string
  /** @deprecated kept for backward compat — if set, used as-is */
  brandInput?: string
  settings: Pick<Settings, "provider" | "apiKey" | "aiModel" | "debugLogging">
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
}

function normalize(parsed: unknown): BrandVoice {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("AI returned non-object brand voice")
  }
  const p = parsed as Record<string, unknown>

  const tones = asStringArray(p.toneKeywords)
  const tone1 = tones[0] ?? ""
  const tone2 = tones[1] ?? ""
  const tone3 = tones[2] ?? ""

  const principles = typeof p.principles === "string" ? p.principles : ""
  const doExamples = asStringArray(p.doExamples)
  const dontExamples = asStringArray(p.dontExamples)
  const blacklist = asStringArray(p.blacklist).map((w) => w.toLowerCase())

  return {
    toneKeywords: [tone1, tone2, tone3],
    principles,
    doExamples,
    dontExamples,
    blacklist: Array.from(new Set(blacklist)),
  }
}

async function buildBrandInput(body: RequestBody): Promise<string> {
  // Back-compat: accept pre-built brandInput
  if (body.brandInput && body.brandInput.trim()) return body.brandInput.trim()

  const parts: string[] = []

  if (body.url && body.url.trim()) {
    try {
      const page = await fetchUrlContent(body.url.trim())
      parts.push(`Pre-fetched website content:\n${formatFetchedPageForPrompt(page)}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      parts.push(`Reference URL provided (${body.url}) but fetch failed: ${msg}.`)
    }
  }

  if (body.fileText && body.fileText.trim()) {
    const label = body.fileName ? `Document (${body.fileName})` : "Document"
    parts.push(`${label}:\n${body.fileText.trim()}`)
  }

  if (body.freeText && body.freeText.trim()) {
    parts.push(`Brand description:\n${body.freeText.trim()}`)
  }

  return parts.join("\n\n---\n\n")
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as RequestBody
    const { settings } = body

    const brandInput = await buildBrandInput(body)
    if (!brandInput) {
      return NextResponse.json(
        { error: "Brand input is required (URL, file content, or free text)." },
        { status: 400 },
      )
    }

    const raw = await callAI(
      "03-brand-voice-extract",
      { brand_input: brandInput },
      {
        provider: settings.provider,
        apiKey: settings.apiKey,
        model: settings.aiModel,
        debugLogging: settings.debugLogging,
      },
    )

    const parsed = extractJSON(raw)
    const voice = normalize(parsed)

    return NextResponse.json({ data: voice })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
