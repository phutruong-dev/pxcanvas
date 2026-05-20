import { NextRequest, NextResponse } from "next/server"
import { callAI } from "@/lib/ai/provider"
import { extractJSON } from "@/lib/utils/extract-json"
import type { UxImprovement, FormInput } from "@/lib/types/ux-analysis"
import type { Settings } from "@/lib/types/settings"

type RequestBody = {
  url?: string
  formInput: FormInput
  settings: Pick<Settings, "provider" | "apiKey" | "aiModel" | "debugLogging">
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as RequestBody
    const { url, formInput, settings } = body

    const navStructure = url
      ? `Reference URL: ${url}\n(Read this URL and extract its navigation structure and content overview.)`
      : "No reference URL provided."

    const raw = await callAI(
      "01-ux-analysis",
      {
        nav_structure: navStructure,
        form_input: JSON.stringify(formInput, null, 2),
        url: url ?? "",
      },
      { provider: settings.provider, apiKey: settings.apiKey, model: settings.aiModel, debugLogging: settings.debugLogging }
    )

    const parsed = extractJSON(raw)
    const improvements = parsed as UxImprovement[]

    // Ensure checked defaults to true for each item
    const result: UxImprovement[] = improvements.map((item) => ({
      ...item,
      checked: item.checked ?? true,
    }))

    return NextResponse.json({ data: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
