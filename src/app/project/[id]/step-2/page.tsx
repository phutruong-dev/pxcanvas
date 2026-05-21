"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ReactFlowProvider } from "reactflow"
import { toast } from "sonner"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import SitemapCanvas from "@/components/step-2/sitemap-canvas"
import SidePanel from "@/components/step-2/side-panel"
import CanvasToolbar from "@/components/step-2/canvas-toolbar"
import GenerateOverlay from "@/components/shared/generate-overlay"
import ExportModal from "@/components/step-2/export-modal"
import { useWorkflowStore } from "@/lib/store/workflow"
import { useSettingsStore } from "@/lib/store/settings"
import { useUndoRedoStore } from "@/lib/store/undo-redo"
import type { SitemapNode } from "@/lib/types/sitemap"

export default function Step2Page() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const projectId = useWorkflowStore((s) => s.projectId)
  const sitemap = useWorkflowStore((s) => s.sitemap)
  const setSitemap = useWorkflowStore((s) => s.setSitemap)
  const formInput = useWorkflowStore((s) => s.formInput)
  const uxImprovements = useWorkflowStore((s) => s.uxImprovements)
  const clearUndoRedo = useUndoRedoStore((s) => s.clear)

  const provider = useSettingsStore((s) => s.provider)
  const apiKey = useSettingsStore((s) => s.apiKey)
  const aiModel = useSettingsStore((s) => s.aiModel)
  const debugLogging = useSettingsStore((s) => s.debugLogging)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [generateState, setGenerateState] = useState<"idle" | "loading" | "error">("idle")
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [layoutKey, setLayoutKey] = useState(0)
  const canvasRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    clearUndoRedo()
  }, [id, clearUndoRedo])

  const generate = useCallback(async () => {
    if (!formInput) {
      setGenerateState("error")
      setGenerateError("Form input is missing. Go back to Step 1.")
      return
    }
    setGenerateState("loading")
    setGenerateError(null)
    try {
      const res = await fetch("/api/ai/sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formInput,
          improvements: uxImprovements,
          settings: { provider, apiKey, aiModel, debugLogging },
        }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error ?? "Unexpected error")
      const tree = json.data as SitemapNode
      setSitemap(tree)
      clearUndoRedo()
      setGenerateState("idle")
      toast.success("Sitemap generated")
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : String(err))
      setGenerateState("error")
    }
  }, [
    formInput,
    uxImprovements,
    provider,
    apiKey,
    aiModel,
    debugLogging,
    setSitemap,
    clearUndoRedo,
  ])

  useEffect(() => {
    if (projectId === id && !sitemap && generateState === "idle" && formInput) {
      void generate()
    }
  }, [projectId, id, sitemap, generateState, formInput, generate])

  function handleContinue() {
    router.push(`/project/${id}/step-3`)
  }
  function handleBack() {
    router.push(`/project/${id}/step-1`)
  }

  if (projectId !== id) {
    return <div className="p-6 text-sm text-muted-foreground">Loading…</div>
  }

  const noInput = !sitemap && !formInput && generateState === "idle"

  return (
    <ReactFlowProvider>
      <div className="flex h-[calc(100vh-3.5rem)] flex-col">
        <div className="flex items-center justify-between border-b bg-background px-6 py-3">
          <div>
            <h1 className="text-base font-semibold">Sitemap Canvas</h1>
            <p className="text-xs text-muted-foreground">
              Click a node to select. &quot;+&quot; adds a child. Drag a node onto another to re-parent.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              Back
            </Button>
            <Button size="sm" onClick={handleContinue} disabled={!sitemap}>
              Continue
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <CanvasToolbar onRegenerate={generate} onExport={() => setExportOpen(true)} onAutoLayout={() => setLayoutKey((k) => k + 1)} />

        <div className="relative flex flex-1 overflow-hidden">
          <div className="relative flex-1">
            <SitemapCanvas
              selectedId={selectedId}
              onSelect={setSelectedId}
              canvasRef={canvasRef}
              layoutKey={layoutKey}
            />

            {noInput && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/95">
                <div className="max-w-sm space-y-3 text-center">
                  <p className="text-sm font-medium">No input found</p>
                  <p className="text-xs text-muted-foreground">
                    Go back to Step 1 to provide a URL or describe your project.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleBack}>
                    Back to Step 1
                  </Button>
                </div>
              </div>
            )}

            {generateState !== "idle" && (
              <GenerateOverlay
                state={generateState}
                loadingTitle="Generating sitemap…"
                loadingHint="AI is structuring your pages. Usually takes 10–20 seconds."
                errorTitle="Sitemap generation failed"
                error={generateError ?? undefined}
                onRetry={generate}
                onSkip={() => setGenerateState("idle")}
              />
            )}
          </div>

          <SidePanel selectedId={selectedId} onClose={() => setSelectedId(null)} />
        </div>

        <ExportModal
          open={exportOpen}
          onClose={() => setExportOpen(false)}
          canvasRef={canvasRef}
        />
      </div>
    </ReactFlowProvider>
  )
}
