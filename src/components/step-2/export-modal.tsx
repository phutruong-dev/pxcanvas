"use client"

import { useState } from "react"
import { toPng } from "html-to-image"
import { Download, FileJson, ImageIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useWorkflowStore } from "@/lib/store/workflow"
import { useProjectsStore } from "@/lib/store/projects"

type Props = {
  open: boolean
  onClose: () => void
  canvasRef: React.RefObject<HTMLDivElement | null>
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "sitemap"
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ExportModal({ open, onClose, canvasRef }: Props) {
  const sitemap = useWorkflowStore((s) => s.sitemap)
  const projectId = useWorkflowStore((s) => s.projectId)
  const project = useProjectsStore((s) => (projectId ? s.getProject(projectId) : null))
  const [busy, setBusy] = useState<"json" | "png" | null>(null)

  const baseName = project ? slugify(project.name) : "sitemap"

  async function exportJSON() {
    if (!sitemap) return
    setBusy("json")
    try {
      const blob = new Blob([JSON.stringify(sitemap, null, 2)], { type: "application/json" })
      download(blob, `${baseName}-sitemap.json`)
      toast.success("Sitemap JSON downloaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to export JSON")
    } finally {
      setBusy(null)
    }
  }

  async function exportPNG() {
    if (!canvasRef.current) {
      toast.error("Canvas not ready")
      return
    }
    setBusy("png")
    try {
      const viewport = canvasRef.current.querySelector<HTMLElement>(".react-flow__viewport")
      const target = viewport ?? canvasRef.current
      const dataUrl = await toPng(target, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        cacheBust: true,
      })
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      download(blob, `${baseName}-sitemap.png`)
      toast.success("Sitemap PNG downloaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to export PNG")
    } finally {
      setBusy(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export sitemap</DialogTitle>
          <DialogDescription>
            Download the current tree as JSON or a flat PNG snapshot of the canvas.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={exportJSON}
            disabled={busy !== null}
            className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-sm transition hover:border-primary disabled:opacity-50"
          >
            <FileJson className="h-6 w-6 text-muted-foreground" />
            <span className="font-medium">JSON</span>
            <span className="text-[11px] text-muted-foreground">tree.json</span>
            {busy === "json" && <span className="text-[10px]">Working…</span>}
          </button>

          <button
            onClick={exportPNG}
            disabled={busy !== null}
            className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-sm transition hover:border-primary disabled:opacity-50"
          >
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
            <span className="font-medium">PNG</span>
            <span className="text-[11px] text-muted-foreground">canvas snapshot</span>
            {busy === "png" && <span className="text-[10px]">Working…</span>}
          </button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <Download className="mr-1.5 h-3.5 w-3.5 opacity-0" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
