"use client"

import { AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { UxImprovement } from "@/lib/types/ux-analysis"

type Props = {
  improvements: UxImprovement[]
  error: string | null
  onToggle: (id: string) => void
  onRetry: () => void
  onSkip: () => void
  onContinue: () => void
}

export default function UxImprovementsList({
  improvements,
  error,
  onToggle,
  onRetry,
  onSkip,
  onContinue,
}: Props) {
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Analysis failed</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
          <Button variant="ghost" onClick={onSkip}>
            Skip analysis
          </Button>
        </div>
      </div>
    )
  }

  if (improvements.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Input looks well-structured — no UX improvements suggested. You can continue directly.
          </p>
        </div>
        <Button onClick={onContinue}>Continue to Sitemap</Button>
      </div>
    )
  }

  const checkedCount = improvements.filter((i) => i.checked).length

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold">UX Improvements</h2>
        <p className="text-xs text-muted-foreground">
          {checkedCount} of {improvements.length} selected — these will be applied to the sitemap.
        </p>
      </div>

      <div className="divide-y rounded-lg border">
        {improvements.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex gap-3 p-4 transition-colors",
              !item.checked && "bg-muted/30 opacity-60"
            )}
          >
            <Checkbox
              id={item.id}
              checked={item.checked}
              onCheckedChange={() => onToggle(item.id)}
              className="mt-0.5 shrink-0"
            />
            <label htmlFor={item.id} className="flex-1 cursor-pointer space-y-1">
              <p className="text-sm font-medium">{item.problem}</p>
              <p className="text-xs text-muted-foreground">{item.reason}</p>
              <p className="text-xs font-medium text-foreground">
                → {item.suggestion}
              </p>
            </label>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex gap-3">
        <Button onClick={onContinue} disabled={checkedCount === 0}>
          Continue to Sitemap
        </Button>
        <Button variant="ghost" onClick={onSkip}>
          Skip analysis
        </Button>
      </div>
    </div>
  )
}
