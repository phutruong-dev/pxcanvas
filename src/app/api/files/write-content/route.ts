import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

type RequestBody = {
  outputFolder: string
  slug: string
  markdown: string
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as RequestBody
    const { outputFolder, slug, markdown } = body

    if (!outputFolder?.trim()) {
      return NextResponse.json({ error: "outputFolder is required" }, { status: 400 })
    }
    if (!slug?.trim() || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
    }

    const dir = path.resolve(outputFolder)
    await fs.mkdir(dir, { recursive: true })

    const filePath = path.join(dir, `${slug}.md`)

    let existed = false
    try {
      await fs.access(filePath)
      existed = true
    } catch {
      // file doesn't exist — fine
    }

    await fs.writeFile(filePath, markdown, "utf-8")

    return NextResponse.json({ path: filePath, existed })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
