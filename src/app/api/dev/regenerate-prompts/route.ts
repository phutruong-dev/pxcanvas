import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { ensureAllPromptFiles } from "@/lib/ai/prompt-loader"

// Dev-only — deletes and recreates all prompt files from defaults
export async function POST(): Promise<NextResponse> {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development" }, { status: 403 })
  }

  try {
    const promptsDir = path.join(process.cwd(), "prompts")
    const files = await fs.readdir(promptsDir).catch(() => [] as string[])
    const deleted: string[] = []

    for (const file of files) {
      if (file.endsWith(".md")) {
        await fs.unlink(path.join(promptsDir, file))
        deleted.push(file)
      }
    }

    const { created } = await ensureAllPromptFiles()
    return NextResponse.json({ deleted, created })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
