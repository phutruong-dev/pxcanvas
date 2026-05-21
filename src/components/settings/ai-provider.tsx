"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, Eye, EyeOff, Loader2, RefreshCw, X } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useSettingsStore } from "@/lib/store/settings"
import type { AIProvider } from "@/lib/types/settings"

const MODELS = [
  { value: "claude-sonnet-4-6", label: "Sonnet 4.6 (recommended)" },
  { value: "claude-opus-4-7", label: "Opus 4.7" },
  { value: "claude-haiku-4-5-20251001", label: "Haiku 4.5" },
]

type TestResult = { ok: boolean; message: string }

export default function AIProviderSection() {
  const provider = useSettingsStore((s) => s.provider)
  const apiKey = useSettingsStore((s) => s.apiKey)
  const aiModel = useSettingsStore((s) => s.aiModel)
  const debugLogging = useSettingsStore((s) => s.debugLogging)
  const setProvider = useSettingsStore((s) => s.setProvider)
  const setApiKey = useSettingsStore((s) => s.setApiKey)
  const setAiModel = useSettingsStore((s) => s.setAiModel)
  const setDebugLogging = useSettingsStore((s) => s.setDebugLogging)

  const [sdkDetected, setSdkDetected] = useState<boolean | null>(null)
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [detecting, setDetecting] = useState(false)

  const detectSdk = useCallback(async () => {
    setDetecting(true)
    try {
      const res = await fetch("/api/health")
      const json = await res.json()
      setSdkDetected(!!json.provider?.sdkDetected)
    } catch {
      setSdkDetected(false)
    } finally {
      setDetecting(false)
    }
  }, [])

  useEffect(() => {
    void detectSdk()
  }, [detectSdk])

  // Auto-clear test result on relevant input mutation
  useEffect(() => {
    setTestResult(null)
  }, [provider, apiKey, aiModel])

  async function handleTest() {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch("/api/ai/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: provider, apiKey, model: aiModel }),
      })
      const json = await res.json()
      const result: TestResult = { ok: !!json.ok, message: json.message ?? "" }
      setTestResult(result)
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setTestResult({ ok: false, message: msg })
      toast.error(msg)
    } finally {
      setTesting(false)
    }
  }

  function handleProvider(next: AIProvider) {
    setProvider(next)
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Provider mode</Label>
        <div className="grid grid-cols-2 gap-2">
          <ProviderButton
            active={provider === "sdk"}
            onClick={() => handleProvider("sdk")}
            title="Mode A — Claude Code SDK"
            sub="Uses your installed Claude Code CLI"
          />
          <ProviderButton
            active={provider === "api-key"}
            onClick={() => handleProvider("api-key")}
            title="Mode B — Anthropic API key"
            sub="Direct API calls with your own key"
          />
        </div>
      </div>

      {provider === "sdk" && (
        <div className="rounded-md border bg-muted/30 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm">
              {detecting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              ) : sdkDetected ? (
                <Badge variant="default" className="gap-1">
                  <Check className="h-3 w-3" /> Detected
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <X className="h-3 w-3" /> Not detected
                </Badge>
              )}
              <span className="text-muted-foreground">Claude Code CLI</span>
            </div>
            <Button variant="ghost" size="sm" onClick={detectSdk} disabled={detecting}>
              <RefreshCw className="mr-1 h-3 w-3" />
              Re-check
            </Button>
          </div>
          {sdkDetected === false && (
            <p className="mt-2 text-xs text-muted-foreground">
              Install Claude Code, then run <code className="rounded bg-muted px-1">claude login</code> in your terminal.
            </p>
          )}
        </div>
      )}

      {provider === "api-key" && (
        <div className="space-y-1.5">
          <Label htmlFor="api-key">Anthropic API key</Label>
          <div className="relative">
            <Input
              id="api-key"
              type={showKey ? "text" : "password"}
              autoComplete="off"
              spellCheck={false}
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-9"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => setShowKey((v) => !v)}
              aria-label={showKey ? "Hide key" : "Show key"}
            >
              {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Stored locally in your browser. Never sent anywhere except Anthropic.
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="ai-model">Model</Label>
        <Select value={aiModel} onValueChange={(v) => v && setAiModel(v)}>
          <SelectTrigger id="ai-model">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
        <div>
          <Label htmlFor="debug-logging" className="text-sm">Debug logging</Label>
          <p className="text-xs text-muted-foreground">
            Append every AI call to <code>logs/ai-calls.jsonl</code>
          </p>
        </div>
        <Checkbox
          id="debug-logging"
          checked={debugLogging}
          onCheckedChange={(c) => setDebugLogging(c === true)}
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button onClick={handleTest} disabled={testing}>
          {testing && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
          Test connection
        </Button>
        {testResult && (
          <Badge variant={testResult.ok ? "default" : "destructive"} className="gap-1">
            {testResult.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            {testResult.ok ? "OK" : "Failed"}
          </Badge>
        )}
      </div>
      {testResult && !testResult.ok && (
        <p className="text-xs text-destructive">{testResult.message}</p>
      )}
    </div>
  )
}

function ProviderButton({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean
  onClick: () => void
  title: string
  sub: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-2.5 text-left transition",
        active ? "border-primary bg-primary/5" : "hover:border-foreground/30",
      )}
    >
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </button>
  )
}
