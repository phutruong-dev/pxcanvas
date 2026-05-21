import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

type RequestBody = {
  path: string
  noCreate?: boolean  // if true, only check; do not mkdir
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as RequestBody
    const folderPath = body.path?.trim()
    if (!folderPath) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 })
    }
    const resolved = path.resolve(folderPath)
    try {
      await fs.access(resolved, fs.constants.W_OK)
      return NextResponse.json({ writable: true, exists: true, resolved })
    } catch {
      if (body.noCreate) {
        return NextResponse.json({
          writable: false,
          exists: false,
          resolved,
          error: "Folder does not exist (use Ensure to create it)",
        })
      }
      try {
        await fs.mkdir(resolved, { recursive: true })
        return NextResponse.json({ writable: true, exists: true, resolved, created: true })
      } catch (mkdirErr) {
        const msg = mkdirErr instanceof Error ? mkdirErr.message : String(mkdirErr)
        return NextResponse.json({ writable: false, exists: false, error: msg, resolved })
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
