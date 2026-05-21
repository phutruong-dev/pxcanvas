"use client"

import { AlertTriangle, Download, Redo2, Undo2, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { useReactFlow } from "reactflow"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useWorkflowStore } from "@/lib/store/workflow"
import { useSitemapMutations } from "@/lib/hooks/use-sitemap-mutations"
import { countNodes } from "@/lib/utils/sitemap-layout"

type Props = {
  onRegenerate: () => void
  onExport: () => void
}

export default function CanvasToolbar({ onRegenerate, onExport }: Props) {
  const sitemap = useWorkflowStore((s) => s.sitemap)
  const savingStatus = useWorkflowStore((s) => s.savingStatus)
  const { canUndo, canRedo, undo, redo } = useSitemapMutations()
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  const nodeCount = countNodes(sitemap)
  const tooFew = nodeCount > 0 && nodeCount < 3

  const saveLabel =
    savingStatus === "pending" ? "Saving…" : savingStatus === "saved" ? "Saved" : ""

  return (
    <div className="flex items-center justify-between gap-3 border-b bg-background/80 px-4 py-2 backdrop-blur">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Undo"
          disabled={!canUndo}
          onClick={undo}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Redo"
          disabled={!canRedo}
          onClick={redo}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <div className="mx-2 h-5 w-px bg-border" />
        <Button variant="ghost" size="icon" aria-label="Zoom out" onClick={() => zoomOut()}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Zoom in" onClick={() => zoomIn()}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Fit view" onClick={() => fitView({ padding: 0.2 })}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {tooFew && (
          <button
            type="button"
            onClick={onRegenerate}
            className="inline-flex items-center gap-1 rounded-full border border-amber-500/50 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-900 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-200"
          >
            <AlertTriangle className="h-3 w-3" />
            Only {nodeCount} page{nodeCount === 1 ? "" : "s"} — Regenerate
          </button>
        )}
        <span>
          {nodeCount} page{nodeCount === 1 ? "" : "s"}
        </span>
        <span className={cn("min-w-[3.5rem]", savingStatus === "pending" && "text-amber-600")}>
          {saveLabel}
        </span>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Export
        </Button>
      </div>
    </div>
  )
}
