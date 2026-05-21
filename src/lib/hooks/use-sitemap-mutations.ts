"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { useWorkflowStore } from "@/lib/store/workflow"
import { useUndoRedoStore } from "@/lib/store/undo-redo"
import type { SitemapNode } from "@/lib/types/sitemap"

function snapshot() {
  const sm = useWorkflowStore.getState().sitemap
  if (sm) useUndoRedoStore.getState().push(sm)
}

export function doUndo(): boolean {
  const sm = useWorkflowStore.getState().sitemap
  if (!sm) return false
  const prev = useUndoRedoStore.getState().undo(sm)
  if (!prev) return false
  useWorkflowStore.getState().setSitemap(prev)
  return true
}

export function doRedo(): boolean {
  const sm = useWorkflowStore.getState().sitemap
  if (!sm) return false
  const next = useUndoRedoStore.getState().redo(sm)
  if (!next) return false
  useWorkflowStore.getState().setSitemap(next)
  return true
}

export function useSitemapMutations() {
  const canUndo = useUndoRedoStore((s) => s.canUndo)
  const canRedo = useUndoRedoStore((s) => s.canRedo)

  const addChild = (parentId: string): SitemapNode => {
    snapshot()
    return useWorkflowStore.getState().addChildNode(parentId)
  }

  const update = (
    id: string,
    patch: Partial<Pick<SitemapNode, "name" | "description">>,
  ): void => {
    snapshot()
    useWorkflowStore.getState().updateNode(id, patch)
  }

  const remove = (id: string): void => {
    snapshot()
    useWorkflowStore.getState().deleteNode(id)
  }

  const reparent = (nodeId: string, newParentId: string): boolean => {
    snapshot()
    const ok = useWorkflowStore.getState().reparentNode(nodeId, newParentId)
    if (!ok) toast.error("Cannot move node into its own descendant.")
    return ok
  }

  const reorder = (nodeId: string, direction: "up" | "down"): void => {
    snapshot()
    useWorkflowStore.getState().reorderSibling(nodeId, direction)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return
      }
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        doUndo()
      } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault()
        doRedo()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return {
    canUndo,
    canRedo,
    addChild,
    update,
    remove,
    reparent,
    reorder,
    undo: doUndo,
    redo: doRedo,
  }
}
