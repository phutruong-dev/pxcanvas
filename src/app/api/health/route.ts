import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { detectClaudeCode } from "@/lib/ai/detect"
import { PROMPT_KEYS } from "@/lib/ai/prompt-loader"

export async function GET(): Promise<NextResponse> {
  const sdkDetected = detectClaudeCode()

  // Check each prompt file — keyed by PromptKey (no .md suffix)
  const prompts: Record<string, boolean> = {}
  for (const key of PROMPT_KEYS) {
    try {
      const content = await fs.readFile(path.join(process.cwd(), "prompts", `${key}.md`), "utf-8")
      prompts[key] = !!content.trim()
    } catch {
      prompts[key] = false
    }
  }

  return NextResponse.json({
    provider: { sdkDetected },
    prompts,
  })
}
