"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Plus } from "lucide-react"
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
  const sectionCount = useWorkflowStore((s) => s.pageContents[id]?.sections?.length ?? 0)
  const { selectedId, hoverTargetId, onAddChild } = useCanvasContext()

  if (!node) return null
  const isSelected = selectedId === id
  const isDropTarget = hoverTargetId === id
  const isRoot = node.parentId === null

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
        {sectionCount > 0 && (
          <p className="mt-1 text-[10px] text-muted-foreground/70">
            {sectionCount} section{sectionCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>

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
