"use client"

import { useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Download, FolderOutput, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageList from "@/components/step-4/page-list"
import SectionEditor from "@/components/step-4/section-editor"
import ContentPreview from "@/components/step-4/content-preview"
import BatchProgress from "@/components/step-4/batch-progress"
import OverwriteModal, { type OverwriteDecision } from "@/components/step-4/overwrite-modal"
import { useWorkflowStore } from "@/lib/store/workflow"
import { useSettingsStore } from "@/lib/store/settings"
import { useProjectsStore } from "@/lib/store/projects"
import { flattenTree } from "@/lib/utils/sitemap-layout"
import type { Section } from "@/lib/types/content"
import type { SitemapNode } from "@/lib/types/sitemap"

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "page"
}

export default function Step4Page() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const projectId = useWorkflowStore((s) => s.projectId)
  const sitemap = useWorkflowStore((s) => s.sitemap)
  const brandVoice = useWorkflowStore((s) => s.brandVoice)
  const pageContents = useWorkflowStore((s) => s.pageContents)
  const setPageContent = useWorkflowStore((s) => s.setPageContent)

  const project = useProjectsStore((s) => s.getProject(id))

  const provider = useSettingsStore((s) => s.provider)
  const apiKey = useSettingsStore((s) => s.apiKey)
  const aiModel = useSettingsStore((s) => s.aiModel)
  const debugLogging = useSettingsStore((s) => s.debugLogging)
  const outputFolder = useSettingsStore((s) => s.outputFolder)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [batchRunning, setBatchRunning] = useState(false)
  const [batchDone, setBatchDone] = useState(0)
  const [batchFailed, setBatchFailed] = useState<string[]>([])
  const [batchCancelled, setBatchCancelled] = useState(false)

  // Overwrite modal state
  const [overwriteFile, setOverwriteFile] = useState<string | null>(null)
  const overwriteResolve = useRef<((d: OverwriteDecision, slug?: string) => void) | null>(null)

  const cancelRef = useRef(false)
  const settings = { provider, apiKey, aiModel, debugLogging }

  const pages = flattenTree(sitemap)

  const statuses = Object.fromEntries(
    pages.map((p) => [p.id, pageContents[p.id]?.status ?? "idle"]),
  )

  const selectedPage = selectedId ? pages.find((p) => p.id === selectedId) ?? null : null
  const selectedContent = selectedId ? pageContents[selectedId] ?? null : null

  async function generateOnePage(node: SitemapNode, abortSignal?: boolean): Promise<boolean> {
    if (abortSignal) return false
    const existing = pageContents[node.id]
    setPageContent(node.id, {
      pageId: node.id,
      sections: existing?.sections ?? [],
      markdown: existing?.markdown ?? "",
      status: "generating",
      generatedAt: existing?.generatedAt ?? null,
      errorMessage: null,
    })

    try {
      // Step 1: propose sections if not already set
      let sections = existing?.sections?.length ? existing.sections : []
      if (!sections.length) {
        const secRes = await fetch("/api/ai/sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageNode: node,
            sitemapJson: JSON.stringify(sitemap, null, 2),
            settings,
          }),
        })
        const secJson = await secRes.json()
        if (!secRes.ok || secJson.error) throw new Error(secJson.error ?? "Sections failed")
        sections = secJson.data as Section[]
      }

      // Step 2: generate content
      const ctRes = await fetch("/api/ai/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageNode: node,
          sections,
          brandVoice,
          settings,
        }),
      })
      const ctJson = await ctRes.json()
      if (!ctRes.ok || ctJson.error) throw new Error(ctJson.error ?? "Content failed")

      setPageContent(node.id, {
        pageId: node.id,
        sections,
        markdown: ctJson.data as string,
        status: "done",
        generatedAt: new Date().toISOString(),
        errorMessage: null,
      })
      return true
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setPageContent(node.id, {
        pageId: node.id,
        sections: existing?.sections ?? [],
        markdown: existing?.markdown ?? "",
        status: "error",
        generatedAt: null,
        errorMessage: msg,
      })
      return false
    } finally {
    }
  }

  async function generateAll(targetPages: SitemapNode[] = pages) {
    if (!brandVoice) {
      toast.error("Brand voice is missing — complete Step 3 first.")
      return
    }
    cancelRef.current = false
    setBatchCancelled(false)
    setBatchRunning(true)
    setBatchDone(0)
    setBatchFailed([])

    let done = 0
    const failed: string[] = []
    for (const node of targetPages) {
      if (cancelRef.current) break
      const ok = await generateOnePage(node, cancelRef.current)
      if (ok) done++
      else failed.push(node.name)
      setBatchDone(done)
      setBatchFailed([...failed])
    }

    setBatchRunning(false)
    if (cancelRef.current) {
      setBatchCancelled(true)
      toast.info("Generation cancelled.")
    } else if (failed.length > 0) {
      toast.warning(`Done — ${failed.length} page(s) failed.`)
    } else {
      toast.success("All pages generated.")
    }
  }

  function handleCancel() {
    cancelRef.current = true
  }

  async function handleRetryFailed() {
    const failedPages = pages.filter((p) => pageContents[p.id]?.status === "error")
    await generateAll(failedPages)
  }

  function handleSaveSections(sections: Section[]) {
    if (!selectedId) return
    const existing = pageContents[selectedId]
    setPageContent(selectedId, {
      ...(existing ?? {
        pageId: selectedId,
        markdown: "",
        status: "idle",
        generatedAt: null,
        errorMessage: null,
      }),
      sections,
    })
    toast.success("Sections saved")
  }

  // Write to folder with overwrite modal
  async function askOverwrite(filePath: string): Promise<{ decision: OverwriteDecision; slug?: string }> {
    return new Promise((resolve) => {
      setOverwriteFile(filePath)
      overwriteResolve.current = (decision, slug) => {
        setOverwriteFile(null)
        overwriteResolve.current = null
        resolve({ decision, slug })
      }
    })
  }

  async function writeToFolder() {
    if (!outputFolder?.trim()) {
      toast.error("Set an output folder in Settings first.")
      return
    }
    const donePPages = pages.filter((p) => pageContents[p.id]?.status === "done")
    if (donePPages.length === 0) {
      toast.error("No generated pages to write — generate content first.")
      return
    }

    // Check folder first
    const checkRes = await fetch("/api/files/check-folder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: outputFolder }),
    })
    const checkJson = await checkRes.json()
    if (!checkJson.writable) {
      toast.error(`Cannot write to folder: ${checkJson.error}`)
      return
    }

    let written = 0
    let skipped = 0
    for (const node of donePPages) {
      const content = pageContents[node.id]
      if (!content?.markdown) continue
      let slug = slugify(node.name)

      const writeRes = await fetch("/api/files/write-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outputFolder, slug, markdown: content.markdown }),
      })
      const writeJson = await writeRes.json()

      if (writeJson.existed) {
        const { decision, slug: newSlug } = await askOverwrite(writeJson.path ?? `${outputFolder}/${slug}.md`)
        if (decision === "skip") { skipped++; continue }
        if (decision === "rename" && newSlug) slug = newSlug
        // Re-write with decision
        const rewriteRes = await fetch("/api/files/write-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ outputFolder, slug, markdown: content.markdown }),
        })
        const rewriteJson = await rewriteRes.json()
        if (rewriteJson.error) { toast.error(`Failed to write ${slug}: ${rewriteJson.error}`); continue }
      } else if (writeJson.error) {
        toast.error(`Failed to write ${node.name}: ${writeJson.error}`)
        continue
      }
      written++
    }

    toast.success(`Written ${written} file(s)${skipped ? ` (${skipped} skipped)` : ""} to ${outputFolder}`)
  }

  async function exportZip() {
    if (!project) return
    const donePages = pages.filter((p) => pageContents[p.id]?.status === "done")
    if (donePages.length === 0) {
      toast.error("Generate content first.")
      return
    }

    try {
      const res = await fetch("/api/files/export-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: project.name,
          sitemap,
          brandVoice,
          pageContents,
        }),
      })
      if (!res.ok) {
        const j = await res.json()
        toast.error(j.error ?? "Export failed")
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${slugify(project.name)}.pxcanvas.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("ZIP downloaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed")
    }
  }

  if (projectId !== id) {
    return <div className="p-6 text-sm text-muted-foreground">Loading…</div>
  }

  if (!sitemap) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="space-y-3 text-center">
          <p className="text-sm font-medium">Sitemap not found</p>
          <Button variant="outline" size="sm" onClick={() => router.push(`/project/${id}/step-2`)}>
            Back to Step 2
          </Button>
        </div>
      </div>
    )
  }

  const batchTotal = batchRunning ? pages.length : 0

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex shrink-0 items-center justify-between border-b bg-background px-6 py-3">
        <div>
          <h1 className="text-base font-semibold">Generate Content</h1>
          <p className="text-xs text-muted-foreground">
            Select a page to edit sections and preview content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/project/${id}/step-3`)}>
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Back
          </Button>
          <Button variant="outline" size="sm" onClick={writeToFolder}>
            <FolderOutput className="mr-1.5 h-3.5 w-3.5" />
            Write to folder
          </Button>
          <Button variant="outline" size="sm" onClick={exportZip}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export ZIP
          </Button>
          <Button
            size="sm"
            onClick={() => generateAll()}
            disabled={batchRunning || !brandVoice}
          >
            <Zap className="mr-1.5 h-3.5 w-3.5" />
            Generate All
          </Button>
        </div>
      </div>

      {(batchRunning || batchDone > 0 || batchFailed.length > 0) && (
        <div className="shrink-0 px-6 py-3">
          <BatchProgress
            total={batchTotal || pages.length}
            done={batchDone}
            failed={batchFailed}
            onCancel={handleCancel}
            onRetryFailed={handleRetryFailed}
            cancelled={batchCancelled}
          />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <PageList
          pages={pages}
          statuses={statuses}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRegen={(pageId) => {
            const node = pages.find((p) => p.id === pageId)
            if (node) void generateOnePage(node)
          }}
        />

        <main className="flex flex-1 flex-col overflow-hidden">
          {selectedPage && selectedContent !== undefined ? (
            <>
              <div className="shrink-0 border-b bg-muted/20 px-4 py-3">
                <h2 className="mb-2 text-sm font-semibold">{selectedPage.name} — Sections</h2>
                <SectionEditor
                  key={selectedPage.id}
                  sections={selectedContent?.sections ?? []}
                  onSave={handleSaveSections}
                  disabled={selectedContent?.status === "generating"}
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <ContentPreview
                  content={
                    selectedContent ?? {
                      pageId: selectedPage.id,
                      sections: [],
                      markdown: "",
                      status: "idle",
                      generatedAt: null,
                      errorMessage: null,
                    }
                  }
                  blacklist={brandVoice?.blacklist ?? []}
                  onRegen={() => generateOnePage(selectedPage)}
                  regenDisabled={batchRunning}
                />
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Select a page from the sidebar to view and edit its content.
            </div>
          )}
        </main>
      </div>

      <OverwriteModal
        open={overwriteFile !== null}
        filePath={overwriteFile ?? ""}
        onDecide={(decision, newSlug) => overwriteResolve.current?.(decision, newSlug)}
      />
    </div>
  )
}
