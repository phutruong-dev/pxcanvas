import { NextRequest, NextResponse } from "next/server"
import { detectClaudeCode } from "@/lib/ai/detect"
import { testClaudeAgent } from "@/lib/ai/claude-agent"
import { testAnthropicApi } from "@/lib/ai/anthropic-api"
import type { AIProvider } from "@/lib/types/settings"

type RequestBody = {
  mode: AIProvider
  apiKey?: string
  model?: string
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as RequestBody
    const { mode, apiKey = "", model = "claude-sonnet-4-6" } = body

    if (mode === "sdk") {
      const found = detectClaudeCode()
      if (!found) {
        return NextResponse.json({
          ok: false,
          mode,
          message: "Claude Code not found. Run `claude login` in terminal or switch to API key mode.",
        })
      }
      try {
        await testClaudeAgent()
        return NextResponse.json({ ok: true, mode, message: "Claude Code SDK connected." })
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        return NextResponse.json({ ok: false, mode, message: `Claude Code error: ${msg}` })
      }
    }

    // mode === "api-key"
    if (!apiKey) {
      return NextResponse.json({ ok: false, mode, message: "API key is required." })
    }
    try {
      await testAnthropicApi(apiKey, model)
      return NextResponse.json({ ok: true, mode, message: "Anthropic API key valid." })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      return NextResponse.json({ ok: false, mode, message: `API error: ${msg}` })
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
