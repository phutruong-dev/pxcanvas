import { NextRequest, NextResponse } from "next/server"
import JSZip from "jszip"
import type { SitemapNode } from "@/lib/types/sitemap"
import type { BrandVoice } from "@/lib/types/brand-voice"
import type { PageContent } from "@/lib/types/content"
import type { ProjectZipMeta } from "@/lib/types/project"

type ImportResult = {
  projectName: string
  sitemap: SitemapNode
  brandVoice: BrandVoice | null
  pageContents: Record<string, PageContent>
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData()
    const file = formData.get("file")
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const zip = await JSZip.loadAsync(buffer)

    // Find root folder — the first directory entry
    const entries = Object.keys(zip.files)
    const rootPrefix = entries.find((k) => zip.files[k].dir)
    const prefix = rootPrefix ?? ""

    async function readJson<T>(relPath: string): Promise<T | null> {
      const f = zip.file(`${prefix}${relPath}`)
      if (!f) return null
      try {
        const text = await f.async("text")
        return JSON.parse(text) as T
      } catch {
        return null
      }
    }

    const meta = await readJson<ProjectZipMeta>("meta.json")
    if (!meta?.name) {
      return NextResponse.json(
        { error: "Invalid zip: missing meta.json" },
        { status: 400 },
      )
    }

    const sitemap = await readJson<SitemapNode>("sitemap.json")
    if (!sitemap?.id) {
      return NextResponse.json(
        { error: "Invalid zip: missing or corrupt sitemap.json" },
        { status: 400 },
      )
    }

    const brandVoice = await readJson<BrandVoice>("brand-voice.json")

    // Re-read page markdowns and match to sitemap nodes
    function flattenNodes(root: SitemapNode): SitemapNode[] {
      return [root, ...root.children.flatMap(flattenNodes)]
    }
    const nodes = flattenNodes(sitemap)

    const pageContents: Record<string, PageContent> = {}
    for (const node of nodes) {
      const slug = node.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      const mdFile = zip.file(`${prefix}pages/${slug}.md`)
      const markdown = mdFile ? await mdFile.async("text") : ""
      pageContents[node.id] = {
        pageId: node.id,
        sections: [],
        markdown,
        status: markdown ? "done" : "idle",
        generatedAt: markdown ? (meta.exportedAt ?? null) : null,
        errorMessage: null,
      }
    }

    const result: ImportResult = {
      projectName: meta.name,
      sitemap,
      brandVoice,
      pageContents,
    }

    return NextResponse.json({ data: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
