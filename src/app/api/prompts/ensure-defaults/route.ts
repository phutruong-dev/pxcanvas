import { NextRequest, NextResponse } from "next/server"
import {
  ensureAllPromptFiles,
  ensurePromptFile,
  PROMPT_KEYS,
  type PromptKey,
} from "@/lib/ai/prompt-loader"

type RequestBody = {
  force?: boolean
  key?: PromptKey | "all"
}

function isPromptKey(k: string): k is PromptKey {
  return (PROMPT_KEYS as string[]).includes(k)
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let body: RequestBody = {}
    try {
      body = (await req.json()) as RequestBody
    } catch {
      // empty body is fine — defaults to ensure (non-force, all)
    }
    const { force = false, key } = body

    if (force && !key) {
      return NextResponse.json(
        { error: "force=true requires a `key` (specific PromptKey or 'all')" },
        { status: 400 },
      )
    }

    if (key && key !== "all" && !isPromptKey(key)) {
      return NextResponse.json({ error: `Unknown key: ${key}` }, { status: 400 })
    }

    if (key && key !== "all") {
      await ensurePromptFile(key, force)
      return NextResponse.json({ ok: true, key, force })
    }

    const result = await ensureAllPromptFiles(force)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
