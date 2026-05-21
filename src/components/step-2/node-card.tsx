"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { GripVertical, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useWorkflowStore } from "@/lib/store/workflow"
import { useCanvasContext } from "./canvas-context"
import type { SitemapNode } from "@/lib/types/sitemap"

function findInTree(root: SitemapNode, id: string): SitemapNode | null {
  if (root.id === id) return root
  for (const c of root.children) {
    const f = findInTree(c, id)
    if (f) return f
  }
  return null
}

function NodeCardImpl({ id }: NodeProps) {
  const node = useWorkflowStore((s) => (s.sitemap ? findInTree(s.sitemap, id) : null))
  const sections = useWorkflowStore((s) => s.pageContents[id]?.sections ?? [])
  const pageContents = useWorkflowStore((s) => s.pageContents)
  const setPageContent = useWorkflowStore((s) => s.setPageContent)
  const { selectedId, hoverTargetId, onAddChild } = useCanvasContext()

  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  if (!node) return null
  const isSelected = selectedId === id
  const isDropTarget = hoverTargetId === id
  const isRoot = node.parentId === null

  function onSectionDragStart(e: React.DragEvent, i: number) {
    e.stopPropagation()
    setDragIdx(i)
  }
  function onSectionDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    e.stopPropagation()
    setHoverIdx(i)
  }
  function onSectionDrop(e: React.DragEvent, i: number) {
    e.preventDefault()
    e.stopPropagation()
    if (dragIdx === null || dragIdx === i) {
      setDragIdx(null)
      setHoverIdx(null)
      return
    }
    const next = [...sections]
    const [moved] = next.splice(dragIdx, 1)
    next.splice(i, 0, moved)
    const existing = pageContents[id]
    if (existing) setPageContent(id, { ...existing, sections: next })
    setDragIdx(null)
    setHoverIdx(null)
  }
  function onSectionDragEnd(e: React.DragEvent) {
    e.stopPropagation()
    setDragIdx(null)
    setHoverIdx(null)
  }

  return (
    <div
      className={cn(
        "group relative w-[220px] cursor-grab rounded-lg border bg-card px-3 py-2 shadow-sm transition active:cursor-grabbing",
        isSelected && "border-primary ring-2 ring-primary/40",
        isDropTarget && "border-emerald-500 ring-2 ring-emerald-500/50",
        !isSelected && !isDropTarget && "hover:border-foreground/30",
      )}
    >
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={false}
          className="!h-1.5 !w-1.5 !border-0 !bg-muted-foreground/60"
        />
      )}

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium">{node.name || "Untitled"}</span>
          {node.improved && (
            <Badge
              variant="secondary"
              className="h-4 shrink-0 px-1.5 py-0 text-[10px] font-normal"
            >
              improved
            </Badge>
          )}
        </div>
        {node.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
            {node.description}
          </p>
        )}
      </div>

      {sections.length > 0 && (
        <div className="nodrag nopan mt-2 space-y-0.5 border-t pt-1.5">
          {sections.map((s, i) => (
            <div
              key={s.id}
              draggable
              onDragStart={(e) => onSectionDragStart(e, i)}
              onDragOver={(e) => onSectionDragOver(e, i)}
              onDrop={(e) => onSectionDrop(e, i)}
              onDragEnd={onSectionDragEnd}
              className={cn(
                "nodrag nopan flex cursor-grab items-center gap-1 rounded px-1 py-0.5 select-none",
                hoverIdx === i && dragIdx !== i
                  ? "bg-primary/10"
                  : "hover:bg-muted/50",
              )}
            >
              <GripVertical className="h-3 w-3 shrink-0 text-muted-foreground/30" />
              <span className="truncate text-[10px] text-muted-foreground">{s.name}</span>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        aria-label="Add child page"
        className="nodrag absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full border bg-background p-1 opacity-0 shadow-sm transition hover:bg-accent group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation()
          onAddChild(node.id)
        }}
      >
        <Plus className="h-3 w-3" />
      </button>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        className="!h-1.5 !w-1.5 !border-0 !bg-muted-foreground/60"
      />
    </div>
  )
}

const NodeCard = memo(NodeCardImpl)
export default NodeCard
