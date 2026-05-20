"use client"

import Link from "next/link"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import StepIndicator from "./step-indicator"

type Props = {
  projectName: string
  step: 1 | 2 | 3 | 4
}

export default function WorkflowHeader({ projectName, step }: Props) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="shrink-0 text-sm font-semibold hover:underline">
            PXcanvas
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="truncate text-sm text-muted-foreground">{projectName}</span>
        </div>

        <div className="flex items-center gap-4">
          <StepIndicator current={step} />
          <Link href="/settings">
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
