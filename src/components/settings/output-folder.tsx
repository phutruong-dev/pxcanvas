"use client"

import { useState } from "react"
import { AlertTriangle, Check, FolderPlus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSettingsStore } from "@/lib/store/settings"

type CheckResult = {
  writable: boolean
  exists: boolean
  resolved: string
  created?: boolean
  error?: string
}

export default function OutputFolderSection() {
  const outputFolder = useSettingsStore((s) => s.outputFolder)
  const setOutputFolder = useSettingsStore((s) => s.setOutputFolder)
  const [draft, setDraft] = useState(outputFolder)
  const [status, setStatus] = useState<CheckResult | null>(null)
  const [busy, setBusy] = useState<"check" | "ensure" | null>(null)

  async function callCheck(noCreate: boolean): Promise<CheckResult | null> {
    if (!draft.trim()) return null
    try {
      const res = await fetch("/api/files/check-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: draft, noCreate }),
      })
      const json = (await res.json()) as CheckResult
      return json
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Folder check failed")
      return null
    }
  }

  async function handleBlur() {
    if (!draft.trim()) {
      setStatus(null)
      return
    }
    setBusy("check")
    const result = await callCheck(true)
    setBusy(null)
    if (result) {
      setStatus(result)
      // Commit to store on blur for non-empty value
      if (draft !== outputFolder) setOutputFolder(draft)
    }
  }

  async function handleEnsure() {
    setBusy("ensure")
    const result = await callCheck(false)
    setBusy(null)
    if (result) {
      setStatus(result)
      if (result.writable) {
        if (result.created) toast.success(`Folder created: ${result.resolved}`)
        else toast.success("Folder is writable")
        if (draft !== outputFolder) setOutputFolder(draft)
      } else {
        toast.error(result.error ?? "Folder not writable")
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="output-folder">Output folder (absolute path)</Label>
        <div className="flex gap-2">
          <Input
            id="output-folder"
            placeholder="e.g. D:\\projects\\pxcanvas-output  (Windows)  or  /Users/me/pxcanvas (macOS)"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value)
              setStatus(null)
            }}
            onBlur={handleBlur}
            className="font-mono text-xs"
          />
          <Button
            variant="outline"
            onClick={handleEnsure}
            disabled={busy !== null || !draft.trim()}
          >
            {busy === "ensure" ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <FolderPlus className="mr-1.5 h-3.5 w-3.5" />
            )}
            Ensure folder
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Generated <code>.md</code> files are written here. Use the file explorer to copy a folder
          path (right-click → &quot;Copy as path&quot; on Windows, or hold Option + right-click → &quot;Copy
          as Pathname&quot; on macOS).
        </p>
      </div>

      {status && (
        <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            {status.writable ? (
              <Badge variant="default" className="gap-1">
                <Check className="h-3 w-3" /> Writable
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" /> Not writable
              </Badge>
            )}
            <span className="break-all text-muted-foreground">{status.resolved}</span>
          </div>
          {!status.writable && status.error && (
            <p className="mt-1 text-destructive">{status.error}</p>
          )}
        </div>
      )}
    </div>
  )
}
