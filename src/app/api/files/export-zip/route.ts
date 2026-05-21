import { NextRequest, NextResponse } from "next/server"
import JSZip from "jszip"
import type { SitemapNode } from "@/lib/types/sitemap"
import type { BrandVoice } from "@/lib/types/brand-voice"
import type { PageContent } from "@/lib/types/content"
import type { ProjectZipMeta } from "@/lib/types/project"

type RequestBody = {
  projectName: string
  sitemap: SitemapNode
  brandVoice: BrandVoice
  pageContents: Record<string, PageContent>
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "untitled"
}

function formatBrandVoiceMd(bv: BrandVoice): string {
  return [
    `# Brand Voice`,
    ``,
    `## Tone keywords`,
    bv.toneKeywords.join(", "),
    ``,
    `## Writing principles`,
    bv.principles,
    ``,
    `## Do examples`,
    bv.doExamples.map((e) => `- ${e}`).join("\n"),
    ``,
    `## Don't examples`,
    bv.dontExamples.map((e) => `- ${e}`).join("\n"),
    ``,
    `## Blacklist words`,
    bv.blacklist.join(", "),
  ].join("\n")
}

function flattenNodes(root: SitemapNode): SitemapNode[] {
  return [root, ...root.children.flatMap(flattenNodes)]
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as RequestBody
    const { projectName, sitemap, brandVoice, pageContents } = body

    const projectSlug = slugify(projectName)
    const zip = new JSZip()
    const folder = zip.folder(projectSlug)!

    const pages = flattenNodes(sitemap)

    const meta: ProjectZipMeta = {
      version: "0.9.0",
      name: projectName,
      exportedAt: new Date().toISOString(),
      pageCount: pages.length,
    }
    folder.file("meta.json", JSON.stringify(meta, null, 2))
    folder.file("sitemap.json", JSON.stringify(sitemap, null, 2))
    folder.file("brand-voice.json", JSON.stringify(brandVoice, null, 2))
    folder.file("brand-voice.md", formatBrandVoiceMd(brandVoice))

    const pagesFolder = folder.folder("pages")!
    for (const node of pages) {
      const pc = pageContents[node.id]
      if (!pc || !pc.markdown) continue
      pagesFolder.file(`${slugify(node.name)}.md`, pc.markdown)
    }

    const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" })

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${projectSlug}.pxcanvas.zip"`,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
