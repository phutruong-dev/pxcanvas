"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, Loader2, RefreshCw, RotateCcw, X } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type PromptKey =
  | "01-ux-analysis"
  | "02-sitemap-generate"
  | "03-brand-voice-extract"
  | "04-sections-propose"
  | "05-content-generate"

const PROMPT_DESCRIPTIONS: Record<PromptKey, string> = {
  "01-ux-analysis": "Step 1 — UX improvement suggestions",
  "02-sitemap-generate": "Step 2 — Sitemap tree generation",
  "03-brand-voice-extract": "Step 3 — Brand voice extraction",
  "04-sections-propose": "Step 4 — Section list per page",
  "05-content-generate": "Step 4 — Page markdown content",
}

const ALL_KEYS = Object.keys(PROMPT_DESCRIPTIONS) as PromptKey[]

export default function PromptFilesSection() {
  const [status, setStatus] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [busyKey, setBusyKey] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/health")
      const json = await res.json()
      setStatus(json.prompts ?? {})
    } catch {
      toast.error("Could not check prompt files")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  async function restoreOne(key: PromptKey) {
    setBusyKey(key)
    try {
      const res = await fetch("/api/prompts/ensure-defaults", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: true, key }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error)
      toast.success(`Restored ${key}.md`)
      await refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Restore failed")
    } finally {
      setBusyKey(null)
    }
  }

  async function restoreAll() {
    setBusyKey("all")
    try {
      const res = await fetch("/api/prompts/ensure-defaults", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: true, key: "all" }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error)
      toast.success("All prompt files restored to defaults")
      await refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Restore failed")
    } finally {
      setBusyKey(null)
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Edit prompts in <code>prompts/</code> with any editor. The app reads them on each AI call.
        Use <strong>Restore default</strong> if you want to start over.
      </p>

      <div className="space-y-1.5">
        {ALL_KEYS.map((key) => {
          const exists = status[key]
          const busy = busyKey === key
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 rounded-md border bg-card px-3 py-2"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">{key}.md</span>
                  {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  ) : exists ? (
                    <Badge variant="default" className="gap-0.5 px-1.5 py-0 text-[10px] h-4">
                      <Check className="h-2.5 w-2.5" /> ok
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-0.5 px-1.5 py-0 text-[10px] h-4">
                      <X className="h-2.5 w-2.5" /> missing
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{PROMPT_DESCRIPTIONS[key]}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => restoreOne(key)}
                disabled={busy}
              >
                {busy ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <RotateCcw className="mr-1 h-3 w-3" />
                )}
                Restore default
              </Button>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t pt-3">
        <Button variant="ghost" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw className="mr-1 h-3 w-3" />
          Re-check
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={restoreAll}
          disabled={busyKey !== null}
        >
          Restore all defaults
        </Button>
      </div>
    </div>
  )
}
