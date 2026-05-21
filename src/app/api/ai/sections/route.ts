import { NextRequest, NextResponse } from "next/server"
import { callAI } from "@/lib/ai/provider"
import { extractJSON } from "@/lib/utils/extract-json"
import type { Section } from "@/lib/types/content"
import type { SitemapNode } from "@/lib/types/sitemap"
import type { Settings } from "@/lib/types/settings"

type RequestBody = {
  pageNode: SitemapNode
  sitemapJson: string
  settings: Pick<Settings, "provider" | "apiKey" | "aiModel" | "debugLogging">
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as RequestBody
    const { pageNode, sitemapJson, settings } = body

    const raw = await callAI(
      "04-sections-propose",
      {
        page_node: JSON.stringify(pageNode, null, 2),
        sitemap_json: sitemapJson,
      },
      {
        provider: settings.provider,
        apiKey: settings.apiKey,
        model: settings.aiModel,
        debugLogging: settings.debugLogging,
      },
    )

    const parsed = extractJSON(raw)
    if (!Array.isArray(parsed)) throw new Error("AI returned non-array sections")

    const sections: Section[] = parsed
      .filter((s): s is Record<string, unknown> => s !== null && typeof s === "object")
      .map((s) => ({
        id: typeof s.id === "string" && s.id ? s.id : crypto.randomUUID(),
        name: typeof s.name === "string" ? s.name : "Section",
        description: typeof s.description === "string" ? s.description : "",
      }))

    return NextResponse.json({ data: sections })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
