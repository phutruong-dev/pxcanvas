"use client"

import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react"
import { Plus, RotateCcw, Save, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { BrandVoice } from "@/lib/types/brand-voice"

const MAX_EXAMPLES = 5
const MIN_EXAMPLES = 1
const MAX_EXAMPLE_LEN = 200
const MAX_TONE_LEN = 30

type Props = {
  initial: BrandVoice
  saved: BrandVoice | null  // last persisted value, for dirty detection
  onSave: (bv: BrandVoice) => void
  onRegenerate: () => void
  dirtyChange?: (dirty: boolean) => void
}

export type BrandVoiceFormHandle = {
  reset: (bv: BrandVoice) => void
}

function deepEqual(a: BrandVoice | null, b: BrandVoice | null): boolean {
  if (a === b) return true
  if (!a || !b) return false
  return JSON.stringify(a) === JSON.stringify(b)
}

const BrandVoiceForm = forwardRef<BrandVoiceFormHandle, Props>(function BrandVoiceForm(
  { initial, saved, onSave, onRegenerate, dirtyChange },
  ref,
) {
  const [tones, setTones] = useState<[string, string, string]>(initial.toneKeywords)
  const [principles, setPrinciples] = useState(initial.principles)
  const [doExamples, setDoExamples] = useState<string[]>(
    initial.doExamples.length > 0 ? initial.doExamples : [""],
  )
  const [dontExamples, setDontExamples] = useState<string[]>(
    initial.dontExamples.length > 0 ? initial.dontExamples : [""],
  )
  const [blacklist, setBlacklist] = useState<string[]>(initial.blacklist)
  const [blacklistDraft, setBlacklistDraft] = useState("")

  const tone1Ref = useRef<HTMLInputElement>(null)
  const tone2Ref = useRef<HTMLInputElement>(null)
  const tone3Ref = useRef<HTMLInputElement>(null)
  const principlesRef = useRef<HTMLTextAreaElement>(null)
  const doRef = useRef<HTMLInputElement>(null)
  const dontRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    reset(bv: BrandVoice) {
      setTones(bv.toneKeywords)
      setPrinciples(bv.principles)
      setDoExamples(bv.doExamples.length > 0 ? bv.doExamples : [""])
      setDontExamples(bv.dontExamples.length > 0 ? bv.dontExamples : [""])
      setBlacklist(bv.blacklist)
      setBlacklistDraft("")
    },
  }))

  const current: BrandVoice = {
    toneKeywords: tones,
    principles,
    doExamples: doExamples.map((s) => s.trim()).filter(Boolean),
    dontExamples: dontExamples.map((s) => s.trim()).filter(Boolean),
    blacklist,
  }
  const dirty = !deepEqual(current, saved)

  useEffect(() => {
    dirtyChange?.(dirty)
  }, [dirty, dirtyChange])

  function setTone(i: 0 | 1 | 2, val: string) {
    const next = [...tones] as [string, string, string]
    next[i] = val.slice(0, MAX_TONE_LEN)
    setTones(next)
  }

  function addExample(list: "do" | "dont") {
    const arr = list === "do" ? doExamples : dontExamples
    if (arr.length >= MAX_EXAMPLES) return
    const setter = list === "do" ? setDoExamples : setDontExamples
    setter([...arr, ""])
  }
  function updateExample(list: "do" | "dont", i: number, val: string) {
    const arr = list === "do" ? doExamples : dontExamples
    const setter = list === "do" ? setDoExamples : setDontExamples
    const next = [...arr]
    next[i] = val.slice(0, MAX_EXAMPLE_LEN)
    setter(next)
  }
  function removeExample(list: "do" | "dont", i: number) {
    const arr = list === "do" ? doExamples : dontExamples
    if (arr.length <= MIN_EXAMPLES) return
    const setter = list === "do" ? setDoExamples : setDontExamples
    setter(arr.filter((_, idx) => idx !== i))
  }

  function commitBlacklistDraft() {
    const tokens = blacklistDraft
      .split(/[,\n]/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
    if (tokens.length === 0) return
    const merged = Array.from(new Set([...blacklist, ...tokens]))
    setBlacklist(merged)
    setBlacklistDraft("")
  }
  function removeBlacklist(word: string) {
    setBlacklist(blacklist.filter((w) => w !== word))
  }

  function focusAndScroll(el: HTMLElement | null) {
    el?.scrollIntoView({ behavior: "smooth", block: "center" })
    el?.focus()
  }

  function handleSave() {
    const t1 = tones[0].trim()
    const t2 = tones[1].trim()
    const t3 = tones[2].trim()
    if (!t1) {
      toast.error("Tone 1 cannot be empty.")
      focusAndScroll(tone1Ref.current)
      return
    }
    if (!t2) {
      toast.error("Tone 2 cannot be empty.")
      focusAndScroll(tone2Ref.current)
      return
    }
    if (!t3) {
      toast.error("Tone 3 cannot be empty.")
      focusAndScroll(tone3Ref.current)
      return
    }
    if (!principles.trim()) {
      toast.error("Principles cannot be empty.")
      focusAndScroll(principlesRef.current)
      return
    }
    const cleanDo = doExamples.map((s) => s.trim()).filter(Boolean)
    if (cleanDo.length < MIN_EXAMPLES) {
      toast.error("Add at least one Do example.")
      focusAndScroll(doRef.current)
      return
    }
    const cleanDont = dontExamples.map((s) => s.trim()).filter(Boolean)
    if (cleanDont.length < MIN_EXAMPLES) {
      toast.error("Add at least one Don't example.")
      focusAndScroll(dontRef.current)
      return
    }

    onSave({
      toneKeywords: [t1, t2, t3],
      principles: principles.trim(),
      doExamples: Array.from(new Set(cleanDo)),
      dontExamples: Array.from(new Set(cleanDont)),
      blacklist,
    })
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <Label>Tone keywords</Label>
        <div className="grid grid-cols-3 gap-2">
          <Input
            ref={tone1Ref}
            placeholder="e.g. friendly"
            value={tones[0]}
            onChange={(e) => setTone(0, e.target.value)}
          />
          <Input
            ref={tone2Ref}
            placeholder="e.g. confident"
            value={tones[1]}
            onChange={(e) => setTone(1, e.target.value)}
          />
          <Input
            ref={tone3Ref}
            placeholder="e.g. concise"
            value={tones[2]}
            onChange={(e) => setTone(2, e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-2">
        <Label htmlFor="bv-principles">Writing principles</Label>
        <Textarea
          id="bv-principles"
          ref={principlesRef}
          rows={5}
          placeholder="One principle per line. e.g. 'Use specific details over labels.'"
          value={principles}
          onChange={(e) => setPrinciples(e.target.value)}
        />
      </section>

      <ExampleList
        title="Do examples"
        items={doExamples}
        firstRef={doRef}
        onAdd={() => addExample("do")}
        onChange={(i, v) => updateExample("do", i, v)}
        onRemove={(i) => removeExample("do", i)}
      />

      <ExampleList
        title="Don't examples"
        items={dontExamples}
        firstRef={dontRef}
        onAdd={() => addExample("dont")}
        onChange={(i, v) => updateExample("dont", i, v)}
        onRemove={(i) => removeExample("dont", i)}
      />

      <section className="space-y-2">
        <Label htmlFor="bv-blacklist">Blacklist (forbidden words)</Label>
        <div className="rounded-md border bg-card p-2">
          {blacklist.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {blacklist.map((word) => (
                <Badge
                  key={word}
                  variant="secondary"
                  className="gap-1 pl-2 pr-1 text-xs"
                >
                  {word}
                  <button
                    type="button"
                    onClick={() => removeBlacklist(word)}
                    className="rounded p-0.5 hover:bg-background"
                    aria-label={`Remove ${word}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <Input
            id="bv-blacklist"
            placeholder="Type a word and press Enter or comma to add"
            value={blacklistDraft}
            onChange={(e) => setBlacklistDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault()
                commitBlacklistDraft()
              } else if (e.key === "Backspace" && blacklistDraft === "" && blacklist.length > 0) {
                setBlacklist(blacklist.slice(0, -1))
              }
            }}
            onBlur={commitBlacklistDraft}
            className="border-0 px-2 shadow-none focus-visible:ring-0"
          />
        </div>
      </section>

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="outline" size="sm" onClick={onRegenerate}>
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Regenerate
        </Button>
        <div className="flex items-center gap-3">
          {dirty ? (
            <span className="text-xs text-amber-600">Unsaved changes</span>
          ) : (
            <span className="text-xs text-muted-foreground">Saved</span>
          )}
          <Button size="sm" onClick={handleSave} disabled={!dirty}>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            Save brand voice
          </Button>
        </div>
      </div>
    </div>
  )
})

function ExampleList({
  title,
  items,
  firstRef,
  onAdd,
  onChange,
  onRemove,
}: {
  title: string
  items: string[]
  firstRef: React.RefObject<HTMLInputElement | null>
  onAdd: () => void
  onChange: (i: number, v: string) => void
  onRemove: (i: number) => void
}) {
  return (
    <section className="space-y-2">
      <Label>{title}</Label>
      <div className="space-y-2">
        {items.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              ref={i === 0 ? firstRef : undefined}
              value={val}
              onChange={(e) => onChange(i, e.target.value)}
              placeholder={`${title} ${i + 1}`}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(i)}
              disabled={items.length <= MIN_EXAMPLES}
              aria-label="Remove example"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          disabled={items.length >= MAX_EXAMPLES}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add example
        </Button>
      </div>
    </section>
  )
}

export default BrandVoiceForm
