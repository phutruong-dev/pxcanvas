import { create } from "zustand"
import type { SitemapNode } from "@/lib/types/sitemap"

const MAX_STACK = 20

type UndoRedoStore = {
  past: SitemapNode[]
  future: SitemapNode[]
  canUndo: boolean
  canRedo: boolean
  push: (snapshot: SitemapNode) => void
  undo: (current: SitemapNode) => SitemapNode | null
  redo: (current: SitemapNode) => SitemapNode | null
  clear: () => void
}

function clone(node: SitemapNode): SitemapNode {
  return JSON.parse(JSON.stringify(node))
}

export const useUndoRedoStore = create<UndoRedoStore>()((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  // Call BEFORE applying a mutation, passing current sitemap root
  push: (snapshot) => {
    set((s) => {
      const next = [...s.past, clone(snapshot)]
      const trimmed = next.length > MAX_STACK ? next.slice(next.length - MAX_STACK) : next
      return { past: trimmed, future: [], canUndo: true, canRedo: false }
    })
  },

  // Returns the state to restore, or null if stack is empty
  undo: (current) => {
    const { past } = get()
    if (past.length === 0) return null
    const prev = past[past.length - 1]
    set((s) => ({
      past: s.past.slice(0, -1),
      future: [clone(current), ...s.future],
      canUndo: s.past.length > 1,
      canRedo: true,
    }))
    return clone(prev)
  },

  redo: (current) => {
    const { future } = get()
    if (future.length === 0) return null
    const next = future[0]
    set((s) => ({
      past: [...s.past, clone(current)],
      future: s.future.slice(1),
      canUndo: true,
      canRedo: s.future.length > 1,
    }))
    return clone(next)
  },

  clear: () => set({ past: [], future: [], canUndo: false, canRedo: false }),
}))
