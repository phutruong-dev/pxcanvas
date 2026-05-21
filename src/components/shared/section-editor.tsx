"use client"

import { useState } from "react"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { Section } from "@/lib/types/content"

type Props = {
  sections: Section[]
  onSave: (sections: Section[]) => void
  disabled?: boolean
}

export default function SectionEditor({ sections: initial, onSave, disabled }: Props) {
  const [items, setItems] = useState<Section[]>(initial.length > 0 ? initial : [])
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const dirty = JSON.stringify(items) !== JSON.stringify(initial)

  function updateField(i: number, patch: Partial<Section>) {
    const next = [...items]
    next[i] = { ...next[i], ...patch }
    setItems(next)
  }

  function remove(i: number) {
    setItems(items.filter((_, idx) => idx !== i))
  }

  function add() {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        name: `Section ${items.length + 1}`,
        description: "",
      },
    ])
  }

  function onDragStart(i: number) {
    setDragIdx(i)
  }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    setHoverIdx(i)
  }
  function onDrop(e: React.DragEvent, i: number) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) {
      setDragIdx(null)
      setHoverIdx(null)
      return
    }
    const next = [...items]
    const [moved] = next.splice(dragIdx, 1)
    next.splice(i, 0, moved)
    setItems(next)
    setDragIdx(null)
    setHoverIdx(null)
  }
  function onDragEnd() {
    setDragIdx(null)
    setHoverIdx(null)
  }

  return (
    <div className="space-y-2">
      <div className="space-y-1.5">
        {items.map((section, i) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDrop={(e) => onDrop(e, i)}
            onDragEnd={onDragEnd}
            className={cn(
              "rounded-md border bg-card px-2 py-1.5 transition",
              hoverIdx === i && dragIdx !== i && "border-primary ring-1 ring-primary/40",
            )}
          >
            <div className="flex items-center gap-1.5">
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/50" />
              <Input
                value={section.name}
                onChange={(e) => updateField(i, { name: e.target.value })}
                disabled={disabled}
                placeholder="Section name"
                className="h-7 border-0 px-1 py-0 text-sm font-medium shadow-none focus-visible:ring-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                disabled={disabled || items.length <= 1}
                onClick={() => remove(i)}
                aria-label="Remove section"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Textarea
              value={section.description}
              onChange={(e) => updateField(i, { description: e.target.value })}
              disabled={disabled}
              placeholder="What does this section communicate and why is it here?"
              rows={2}
              className="ml-5 min-h-0 resize-none border-0 px-1 py-0.5 text-xs leading-snug text-muted-foreground shadow-none focus-visible:ring-0"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={add} disabled={disabled}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add section
        </Button>
        <Button size="sm" onClick={() => onSave(items)} disabled={disabled || !dirty}>
          Save sections
        </Button>
      </div>
    </div>
  )
}
