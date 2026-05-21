import { NextRequest, NextResponse } from "next/server"
import { callAI } from "@/lib/ai/provider"
import { extractJSON } from "@/lib/utils/extract-json"
import type { SitemapNode } from "@/lib/types/sitemap"
import type { UxImprovement, FormInput } from "@/lib/types/ux-analysis"
import type { Settings } from "@/lib/types/settings"

type RequestBody = {
  url?: string
  formInput: FormInput
  improvements: UxImprovement[]
  settings: Pick<Settings, "provider" | "apiKey" | "aiModel" | "debugLogging">
}

function normalize(node: unknown, parentId: string | null): SitemapNode {
  if (!node || typeof node !== "object") {
    throw new Error("Sitemap node must be an object")
  }
  const n = node as Record<string, unknown>
  if (typeof n.id !== "string" || !n.id) throw new Error("Sitemap node missing id")
  if (typeof n.name !== "string") throw new Error("Sitemap node missing name")
  const rawChildren = Array.isArray(n.children) ? n.children : []
  const normalized: SitemapNode = {
    id: n.id,
    name: n.name,
    description: typeof n.description === "string" ? n.description : "",
    parentId,
    improved: n.improved === true,
    children: [],
  }
  normalized.children = rawChildren.map((c) => normalize(c, normalized.id))
  return normalized
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as RequestBody
    const { url, formInput, improvements, settings } = body

    const navStructure = url
      ? `Reference URL: ${url}\n(Use the URL's nav/content as inspiration; do not block on fetch failure.)`
      : "No reference URL provided."

    const checked = (improvements ?? []).filter((i) => i.checked)

    const raw = await callAI(
      "02-sitemap-generate",
      {
        form_input: JSON.stringify(formInput, null, 2),
        nav_structure: navStructure,
        improvements: JSON.stringify(checked, null, 2),
      },
      {
        provider: settings.provider,
        apiKey: settings.apiKey,
        model: settings.aiModel,
        debugLogging: settings.debugLogging,
      },
    )

    const parsed = extractJSON(raw)
    const root = normalize(parsed, null)

    return NextResponse.json({ data: root })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
