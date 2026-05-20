import { NextResponse } from "next/server"
import { ensureAllPromptFiles } from "@/lib/ai/prompt-loader"

export async function POST(): Promise<NextResponse> {
  try {
    const result = await ensureAllPromptFiles()
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
