"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type OverwriteDecision = "overwrite" | "skip" | "rename"

type Props = {
  open: boolean
  filePath: string
  onDecide: (decision: OverwriteDecision, newSlug?: string) => void
}

export default function OverwriteModal({ open, filePath, onDecide }: Props) {
  const [rename, setRename] = useState("")

  function handleRename() {
    const slug = rename.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-")
    if (!slug) return
    onDecide("rename", slug)
    setRename("")
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>File already exists</DialogTitle>
          <DialogDescription className="break-all">
            <code className="text-xs">{filePath}</code> already exists. Choose what to do:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="rename-slug">Rename to</Label>
            <div className="flex gap-2">
              <Input
                id="rename-slug"
                placeholder="new-slug"
                value={rename}
                onChange={(e) => setRename(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
              />
              <Button size="sm" onClick={handleRename} disabled={!rename.trim()}>
                Save as
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onDecide("skip")}>
            Skip
          </Button>
          <Button variant="destructive" onClick={() => onDecide("overwrite")}>
            Overwrite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
