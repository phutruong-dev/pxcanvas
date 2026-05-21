"use client"

import Link from "next/link"
import { useEffect } from "react"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Route error:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md space-y-4 text-center">
        <div className="flex justify-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="mt-1 break-words text-sm text-muted-foreground">
            {error.message || "An unexpected error occurred."}
          </p>
          {error.digest && (
            <p className="mt-1 text-xs text-muted-foreground">Digest: {error.digest}</p>
          )}
        </div>
        <div className="flex justify-center gap-2">
          <Button onClick={reset} size="sm">
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="mr-1.5 h-3.5 w-3.5" />
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
