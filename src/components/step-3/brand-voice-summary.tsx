"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BrandInputValues } from "./brand-voice-input"

type Props = {
  value: BrandInputValues
  onExpand: () => void
}

export default function BrandVoiceSummary({ value, onExpand }: Props) {
  const parts: string[] = []
  if (value.url.trim()) parts.push("URL")
  if (value.fileName) parts.push(`file (${value.fileName})`)
  if (value.freeText.trim()) parts.push("free text")
  const summary = parts.length === 0 ? "No input provided yet" : `Source: ${parts.join(" + ")}`

  return (
    <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-xs">
      <span className="truncate text-muted-foreground">{summary}</span>
      <Button variant="ghost" size="sm" onClick={onExpand}>
        Edit inputs
        <ChevronDown className="ml-1 h-3 w-3" />
      </Button>
    </div>
  )
}
