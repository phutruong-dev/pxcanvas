"use client"

import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  state: "loading" | "error"
  loadingTitle?: string
  loadingHint?: string
  errorTitle?: string
  error?: string
  onRetry: () => void
  onSkip?: () => void
}

export default function GenerateOverlay({
  state,
  loadingTitle = "Generating…",
  loadingHint = "AI is working on this. Usually takes 10–20 seconds.",
  errorTitle = "Generation failed",
  error,
  onRetry,
  onSkip,
}: Props) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex max-w-sm flex-col items-center gap-4 rounded-lg border bg-background px-6 py-8 shadow-lg">
        {state === "loading" && (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">{loadingTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">{loadingHint}</p>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div className="text-center">
              <p className="text-sm font-medium">{errorTitle}</p>
              {error && (
                <p className="mt-1 break-words text-xs text-muted-foreground">{error}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="default" size="sm" onClick={onRetry}>
                Retry
              </Button>
              {onSkip && (
                <Button variant="outline" size="sm" onClick={onSkip}>
                  Skip
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
