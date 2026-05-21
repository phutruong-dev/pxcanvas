"use client"

import { Check, Copy, RefreshCw } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { PageContent } from "@/lib/types/content"

type Props = {
  content: PageContent
  blacklist: string[]
  onRegen: () => void
  regenDisabled?: boolean
}

function highlightBlacklist(text: string, blacklist: string[]): React.ReactNode[] {
  if (!blacklist.length) return [text]
  const pattern = new RegExp(
    `\\b(${blacklist.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
    "gi",
  )
  const parts = text.split(pattern)
  const lowerSet = new Set(blacklist.map((w) => w.toLowerCase()))
  return parts.map((part, i) =>
    lowerSet.has(part.toLowerCase()) ? (
      <mark key={i} className="bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100 rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export default function ContentPreview({
  content,
  blacklist,
  onRegen,
  regenDisabled,
}: Props) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(content.markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("Copied to clipboard")
    } catch {
      toast.error("Could not copy to clipboard")
    }
  }

  if (!content.markdown && content.status !== "generating") {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No content yet — generate to see preview.
      </div>
    )
  }

  if (content.status === "generating") {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="animate-pulse">Generating content…</span>
      </div>
    )
  }

  if (content.status === "error") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-sm">
        <p className="text-destructive">{content.errorMessage ?? "Generation failed"}</p>
        <Button size="sm" onClick={onRegen} disabled={regenDisabled}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b bg-muted/30 px-4 py-2">
        <div className="text-xs text-muted-foreground">
          {content.generatedAt && (
            <span>Generated {new Date(content.generatedAt).toLocaleTimeString()}</span>
          )}
          {blacklist.length > 0 && (
            <span className="ml-3">
              Blacklist words highlighted in{" "}
              <mark className="bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100 rounded-sm px-0.5 text-[10px]">yellow</mark>
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onRegen}
            disabled={regenDisabled}
          >
            <RefreshCw className="mr-1 h-3.5 w-3.5" />
            Regenerate
          </Button>
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? (
              <Check className="mr-1 h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="mr-1 h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {highlightBlacklist(content.markdown, blacklist)}
        </pre>
      </div>
    </div>
  )
}
