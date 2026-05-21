"use client"

import { useRef, useState } from "react"
import { File as FileIcon, Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED_EXT = [".md", ".txt"]

export type BrandInputValues = {
  url: string
  fileName: string | null
  fileText: string
  freeText: string
}

export function emptyInputValues(): BrandInputValues {
  return { url: "", fileName: null, fileText: "", freeText: "" }
}

export function hasAnyInput(v: BrandInputValues): boolean {
  return Boolean(v.url.trim() || v.fileText.trim() || v.freeText.trim())
}

type Props = {
  value: BrandInputValues
  onChange: (next: BrandInputValues) => void
  onGenerate: () => void
  generating: boolean
  generateLabel?: string
}

export default function BrandVoiceInput({
  value,
  onChange,
  onGenerate,
  generating,
  generateLabel = "Generate Brand Voice",
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [dragOver, setDragOver] = useState(false)

  function patch(p: Partial<BrandInputValues>) {
    onChange({ ...value, ...p })
  }

  async function ingestFile(file: File) {
    const lower = file.name.toLowerCase()
    const ok = ALLOWED_EXT.some((ext) => lower.endsWith(ext))
    if (!ok) {
      toast.error("Only .md or .txt files are supported (PDF deferred — paste text instead).")
      return
    }
    if (file.size > MAX_BYTES) {
      toast.error("File exceeds 10 MB limit.")
      return
    }
    try {
      const text = await file.text()
      patch({ fileName: file.name, fileText: text })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to read file")
    }
  }

  function clearFile() {
    patch({ fileName: null, fileText: "" })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const canGenerate = hasAnyInput(value) && !generating

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="bv-url">Reference URL</Label>
        <Input
          id="bv-url"
          placeholder="https://example.com"
          value={value.url}
          onChange={(e) => patch({ url: e.target.value })}
          disabled={generating}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Upload document (.md or .txt, max 10 MB)</Label>
        <div
          className={cn(
            "rounded-md border border-dashed px-4 py-6 text-center text-sm transition",
            dragOver && "border-primary bg-primary/5",
            !dragOver && "border-muted-foreground/30",
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            const f = e.dataTransfer.files?.[0]
            if (f) void ingestFile(f)
          }}
        >
          {value.fileName ? (
            <div className="flex items-center justify-between gap-2 text-left">
              <div className="flex min-w-0 items-center gap-2">
                <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{value.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {value.fileText.length.toLocaleString()} chars loaded
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
                disabled={generating}
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={generating}
              className="flex w-full flex-col items-center gap-2 text-muted-foreground"
            >
              <Upload className="h-5 w-5" />
              <span className="text-xs">
                Drag & drop or <span className="text-primary underline">click to upload</span>
              </span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.txt,text/plain,text/markdown"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void ingestFile(f)
            }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bv-text">Brand description (free text)</Label>
        <Textarea
          id="bv-text"
          rows={5}
          placeholder="Describe the brand: who they are, what they sell, the audience, the vibe…"
          value={value.freeText}
          onChange={(e) => patch({ freeText: e.target.value })}
          disabled={generating}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={onGenerate} disabled={!canGenerate}>
          {generating && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
          {generateLabel}
        </Button>
      </div>
    </div>
  )
}
