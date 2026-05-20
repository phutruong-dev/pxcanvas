import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { detectClaudeCode } from "@/lib/ai/detect"

const PROMPT_KEYS = [
  "01-ux-analysis",
  "02-sitemap-generate",
  "03-brand-voice-extract",
  "04-sections-propose",
  "05-content-generate",
]

export async function GET(): Promise<NextResponse> {
  const sdkDetected = detectClaudeCode()

  // Check each prompt file
  const prompts: Record<string, boolean> = {}
  for (const key of PROMPT_KEYS) {
    try {
      const content = await fs.readFile(path.join(process.cwd(), "prompts", `${key}.md`), "utf-8")
      prompts[`${key}.md`] = !!content.trim()
    } catch {
      prompts[`${key}.md`] = false
    }
  }

  return NextResponse.json({
    provider: { sdkDetected },
    prompts,
  })
}
