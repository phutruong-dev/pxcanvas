import { create } from "zustand"
import type { SitemapNode } from "@/lib/types/sitemap"
import type { BrandVoice } from "@/lib/types/brand-voice"
import type { PageContent } from "@/lib/types/content"
import type { UxImprovement, FormInput } from "@/lib/types/ux-analysis"

export type SavingStatus = "idle" | "pending" | "saved"

type WorkflowState = {
  projectId: string | null
  formInput: FormInput | null
  uxImprovements: UxImprovement[]
  sitemap: SitemapNode | null       // root node
  brandVoice: BrandVoice | null
  pageContents: Record<string, PageContent>  // keyed by SitemapNode.id
  savingStatus: SavingStatus
}

type WorkflowStore = WorkflowState & {
  loadProject: (projectId: string) => void
  clearProject: () => void
  setFormInput: (input: FormInput) => void
  setUxImprovements: (items: UxImprovement[]) => void
  toggleImprovement: (id: string) => void
  setSitemap: (root: SitemapNode) => void
  updateNode: (id: string, patch: Partial<Pick<SitemapNode, "name" | "description">>) => void
  addChildNode: (parentId: string) => SitemapNode
  deleteNode: (id: string) => void
  reparentNode: (nodeId: string, newParentId: string) => boolean
  reorderSibling: (nodeId: string, direction: "up" | "down") => void
  setBrandVoice: (bv: BrandVoice) => void
  setPageContent: (pageId: string, content: PageContent) => void
}

const EMPTY_STATE: WorkflowState = {
  projectId: null,
  formInput: null,
  uxImprovements: [],
  sitemap: null,
  brandVoice: null,
  pageContents: {},
  savingStatus: "idle",
}

function storageKey(projectId: string) {
  return `pxcanvas:workflow:${projectId}`
}

// Tree helpers
function findNode(root: SitemapNode, id: string): SitemapNode | null {
  if (root.id === id) return root
  for (const child of root.children) {
    const found = findNode(child, id)
    if (found) return found
  }
  return null
}

function isDescendant(root: SitemapNode, ancestorId: string, nodeId: string): boolean {
  const ancestor = findNode(root, ancestorId)
  if (!ancestor) return false
  return !!findNode(ancestor, nodeId)
}

function updateNodeInTree(root: SitemapNode, id: string, patch: Partial<SitemapNode>): SitemapNode {
  if (root.id === id) return { ...root, ...patch }
  return { ...root, children: root.children.map((c) => updateNodeInTree(c, id, patch)) }
}

function removeNodeFromTree(root: SitemapNode, id: string): SitemapNode {
  return {
    ...root,
    children: root.children
      .filter((c) => c.id !== id)
      .map((c) => removeNodeFromTree(c, id)),
  }
}

function addChildToNode(root: SitemapNode, parentId: string, child: SitemapNode): SitemapNode {
  if (root.id === parentId) {
    return { ...root, children: [...root.children, child] }
  }
  return { ...root, children: root.children.map((c) => addChildToNode(c, parentId, child)) }
}

function findParent(root: SitemapNode, childId: string): SitemapNode | null {
  for (const child of root.children) {
    if (child.id === childId) return root
    const found = findParent(child, childId)
    if (found) return found
  }
  return null
}

export const useWorkflowStore = create<WorkflowStore>()((set, get) => {
  let saveTimer: ReturnType<typeof setTimeout> | null = null

  function save() {
    const projectId = get().projectId
    if (!projectId) return
    set({ savingStatus: "pending" })
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      try {
        const { savingStatus: _omit, ...persisted } = get()
        void _omit
        localStorage.setItem(storageKey(projectId), JSON.stringify(persisted))
        set({ savingStatus: "saved" })
      } catch {
        // quota exceeded — best effort; leave status as pending
      }
    }, 1000)
  }

  return {
    ...EMPTY_STATE,

    loadProject: (projectId) => {
      const raw = localStorage.getItem(storageKey(projectId))
      if (raw) {
        try {
          const saved = JSON.parse(raw) as Partial<WorkflowState>
          set({ ...EMPTY_STATE, ...saved, projectId, savingStatus: "saved" })
          return
        } catch {
          // corrupt data — start fresh
        }
      }
      set({ ...EMPTY_STATE, projectId })
    },

    clearProject: () => set(EMPTY_STATE),

    setFormInput: (formInput) => {
      set({ formInput })
      save()
    },

    setUxImprovements: (uxImprovements) => {
      set({ uxImprovements })
      save()
    },

    toggleImprovement: (id) => {
      const items = get().uxImprovements.map((i) =>
        i.id === id ? { ...i, checked: !i.checked } : i
      )
      set({ uxImprovements: items })
      save()
    },

    setSitemap: (sitemap) => {
      set({ sitemap })
      save()
    },

    updateNode: (id, patch) => {
      const { sitemap } = get()
      if (!sitemap) return
      const updated = updateNodeInTree(sitemap, id, patch)
      set({ sitemap: updated })
      save()
    },

    addChildNode: (parentId) => {
      const { sitemap } = get()
      const child: SitemapNode = {
        id: crypto.randomUUID(),
        name: "New page",
        description: "",
        children: [],
        parentId,
        improved: false,
      }
      if (!sitemap) return child
      const updated = addChildToNode(sitemap, parentId, child)
      set({ sitemap: updated })
      save()
      return child
    },

    deleteNode: (id) => {
      const { sitemap } = get()
      if (!sitemap || sitemap.id === id) return
      const updated = removeNodeFromTree(sitemap, id)
      set({ sitemap: updated })
      save()
    },

    // Returns false if would create a cycle (dragging into own descendant)
    reparentNode: (nodeId, newParentId) => {
      const { sitemap } = get()
      if (!sitemap) return false
      if (nodeId === newParentId) return false
      if (sitemap.id === nodeId) return false  // never reparent the root
      // Block if newParentId is a descendant of nodeId
      if (isDescendant(sitemap, nodeId, newParentId)) return false
      const node = findNode(sitemap, nodeId)
      if (!node) return false
      // No-op if already a direct child of newParentId
      const currentParent = findParent(sitemap, nodeId)
      if (currentParent && currentParent.id === newParentId) return false
      const withoutNode = removeNodeFromTree(sitemap, nodeId)
      const updatedNode = { ...node, parentId: newParentId }
      const updated = addChildToNode(withoutNode, newParentId, updatedNode)
      set({ sitemap: updated })
      save()
      return true
    },

    reorderSibling: (nodeId, direction) => {
      const { sitemap } = get()
      if (!sitemap) return
      const parent = findParent(sitemap, nodeId)
      if (!parent) return
      const idx = parent.children.findIndex((c) => c.id === nodeId)
      const newIdx = direction === "up" ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= parent.children.length) return
      const reordered = [...parent.children]
      const [moved] = reordered.splice(idx, 1)
      reordered.splice(newIdx, 0, moved)
      const updated = updateNodeInTree(sitemap, parent.id, { children: reordered })
      set({ sitemap: updated })
      save()
    },

    setBrandVoice: (brandVoice) => {
      set({ brandVoice })
      save()
    },

    setPageContent: (pageId, content) => {
      const pageContents = { ...get().pageContents, [pageId]: content }
      set({ pageContents })
      save()
    },
  }
})
