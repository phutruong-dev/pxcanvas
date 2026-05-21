"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, ExternalLink, Loader2, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSettingsStore } from "@/lib/store/settings"
import { toast } from "sonner"

type Props = {
  open: boolean
  sdkDetected: boolean
  onDismiss: () => void
}

type Mode = "sdk" | "api-key"

export default function FirstRunWizard({ open, sdkDetected, onDismiss }: Props) {
  const [mode, setMode] = useState<Mode>(sdkDetected ? "sdk" : "api-key")
  const [keyDraft, setKeyDraft] = useState("")
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  const setProvider = useSettingsStore((s) => s.setProvider)
  const setApiKey = useSettingsStore((s) => s.setApiKey)
  const setDismissedFirstRun = useSettingsStore((s) => s.setDismissedFirstRun)

  async function testAndSave() {
    setTesting(true)
    setResult(null)
    try {
      const res = await fetch("/api/ai/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, apiKey: keyDraft }),
      })
      const json = await res.json()
      setResult({ ok: !!json.ok, message: json.message ?? "" })
      if (json.ok) {
        setProvider(mode)
        if (mode === "api-key") setApiKey(keyDraft)
        toast.success("Provider configured")
        setDismissedFirstRun(true)
        onDismiss()
      }
    } catch (err) {
      setResult({ ok: false, message: err instanceof Error ? err.message : String(err) })
    } finally {
      setTesting(false)
    }
  }

  function skip() {
    setDismissedFirstRun(true)
    onDismiss()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && skip()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to PXcanvas</DialogTitle>
          <DialogDescription>
            PXcanvas needs an AI provider to generate sitemaps and content. Choose one:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <ModeOption
            active={mode === "sdk"}
            onClick={() => setMode("sdk")}
            title="Use my Claude Code CLI"
            sub={
              sdkDetected ? (
                <Badge variant="default" className="gap-0.5 text-[10px]">
                  <Check className="h-2.5 w-2.5" /> Detected
                </Badge>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-destructive">
                  <X className="h-3 w-3" /> Not detected
                </span>
              )
            }
          />
          <ModeOption
            active={mode === "api-key"}
            onClick={() => setMode("api-key")}
            title="Use Anthropic API key"
            sub={<span className="text-xs text-muted-foreground">Direct API calls</span>}
          />

          {mode === "sdk" && !sdkDetected && (
            <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs">
              <p className="mb-1">Install Claude Code first:</p>
              <a
                href="https://docs.claude.com/en/docs/claude-code/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                claude.com/claude-code <ExternalLink className="h-3 w-3" />
              </a>
              <p className="mt-1 text-muted-foreground">
                Then run <code className="rounded bg-muted px-1">claude login</code> in your terminal.
              </p>
            </div>
          )}

          {mode === "api-key" && (
            <div className="space-y-1.5">
              <Label htmlFor="wizard-key">API key</Label>
              <Input
                id="wizard-key"
                type="password"
                placeholder="sk-ant-..."
                value={keyDraft}
                onChange={(e) => setKeyDraft(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          )}

          {result && !result.ok && (
            <p className="text-xs text-destructive">{result.message}</p>
          )}
        </div>

        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <Button variant="ghost" size="sm" onClick={skip}>
            Skip for now
          </Button>
          <div className="flex gap-2">
            <Link href="/settings" onClick={skip}>
              <Button variant="outline" size="sm">
                Open Settings
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={testAndSave}
              disabled={testing || (mode === "api-key" && !keyDraft.trim())}
            >
              {testing && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Test & save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ModeOption({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean
  onClick: () => void
  title: string
  sub: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-md border px-3 py-2.5 text-left transition ${
        active ? "border-primary bg-primary/5" : "hover:border-foreground/30"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{title}</span>
        <span>{sub}</span>
      </div>
    </button>
  )
}
