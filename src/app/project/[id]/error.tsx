"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useParams } from "next/navigation"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params = useParams()
  const id = params?.id as string | undefined

  useEffect(() => {
    console.error("Project route error:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md space-y-4 text-center">
        <div className="flex justify-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Project step crashed</h2>
          <p className="mt-1 break-words text-sm text-muted-foreground">
            {error.message || "Something went wrong while loading this step."}
          </p>
        </div>
        <div className="flex justify-center gap-2">
          <Button onClick={reset} size="sm">
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Try again
          </Button>
          {id && (
            <Link href={`/project/${id}/step-1`}>
              <Button variant="outline" size="sm">
                Restart project
              </Button>
            </Link>
          )}
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
