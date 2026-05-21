"use client"

import { AlertCircle, RefreshCw, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  total: number
  done: number
  failed: string[]   // page names that errored
  onCancel: () => void
  onRetryFailed: () => void
  cancelled: boolean
}

export default function BatchProgress({
  total,
  done,
  failed,
  onCancel,
  onRetryFailed,
  cancelled,
}: Props) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const active = done < total && !cancelled

  return (
    <div className="space-y-3 rounded-lg border bg-card px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium">
              {cancelled ? "Cancelled" : active ? "Generating…" : "Done"}
            </span>
            <span className="text-muted-foreground">
              {done}/{total} pages
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                failed.length > 0 ? "bg-amber-500" : "bg-primary",
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {active && (
          <Button variant="outline" size="sm" onClick={onCancel}>
            <Square className="mr-1 h-3 w-3 fill-current" />
            Cancel
          </Button>
        )}
      </div>

      {failed.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {failed.length} page{failed.length > 1 ? "s" : ""} failed
            </p>
            <Button variant="outline" size="sm" onClick={onRetryFailed}>
              <RefreshCw className="mr-1 h-3 w-3" />
              Retry failed
            </Button>
          </div>
          <ul className="text-xs text-muted-foreground space-y-0.5 max-h-24 overflow-y-auto">
            {failed.map((name) => (
              <li key={name}>• {name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
