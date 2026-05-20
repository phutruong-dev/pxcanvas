import { create } from "zustand"
import { debounce } from "@/lib/utils/debounce"
import type { SitemapNode } from "@/lib/types/sitemap"
import type { BrandVoice } from "@/lib/types/brand-voice"
import type { PageContent } from "@/lib/types/content"
import type { UxImprovement, FormInput } from "@/lib/types/ux-analysis"

type WorkflowState = {
  projectId: string | null
  formInput: FormInput | null
  uxImprovements: UxImprovement[]
  sitemap: SitemapNode | null       // root node
  brandVoice: BrandVoice | null
  pageContents: Record<string, PageContent>  // keyed by SitemapNode.id
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
}

function storageKey(projectId: string) {
  return `pxcanvas:workflow:${projectId}`
}

// Save debounced to localStorage — not Zustand persist (key is dynamic per project)
const debouncedSave = debounce((projectId: string, state: WorkflowState) => {
  try {
    localStorage.setItem(storageKey(projectId), JSON.stringify(state))
  } catch {
    // quota exceeded handled via toast in components
  }
}, 1000)

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

export const useWorkflowStore = create<WorkflowStore>()((set, get) => {
  function save(patch: Partial<WorkflowState> = {}) {
    const next = { ...get(), ...patch }
    if (next.projectId) debouncedSave(next.projectId, next)
  }

  return {
    ...EMPTY_STATE,

    loadProject: (projectId) => {
      const raw = localStorage.getItem(storageKey(projectId))
      if (raw) {
        try {
          const saved = JSON.parse(raw) as WorkflowState
          set({ ...saved, projectId })
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
      save({ formInput })
    },

    setUxImprovements: (uxImprovements) => {
      set({ uxImprovements })
      save({ uxImprovements })
    },

    toggleImprovement: (id) => {
      const items = get().uxImprovements.map((i) =>
        i.id === id ? { ...i, checked: !i.checked } : i
      )
      set({ uxImprovements: items })
      save({ uxImprovements: items })
    },

    setSitemap: (sitemap) => {
      set({ sitemap })
      save({ sitemap })
    },

    updateNode: (id, patch) => {
      const { sitemap } = get()
      if (!sitemap) return
      const updated = updateNodeInTree(sitemap, id, patch)
      set({ sitemap: updated })
      save({ sitemap: updated })
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
      save({ sitemap: updated })
      return child
    },

    deleteNode: (id) => {
      const { sitemap } = get()
      if (!sitemap || sitemap.id === id) return
      const updated = removeNodeFromTree(sitemap, id)
      set({ sitemap: updated })
      save({ sitemap: updated })
    },

    // Returns false if would create a cycle (dragging into own descendant)
    reparentNode: (nodeId, newParentId) => {
      const { sitemap } = get()
      if (!sitemap) return false
      if (nodeId === newParentId) return false
      // Block if newParentId is a descendant of nodeId
      if (isDescendant(sitemap, nodeId, newParentId)) return false
      const node = findNode(sitemap, nodeId)
      if (!node) return false
      const withoutNode = removeNodeFromTree(sitemap, nodeId)
      const updatedNode = { ...node, parentId: newParentId }
      const updated = addChildToNode(withoutNode, newParentId, updatedNode)
      set({ sitemap: updated })
      save({ sitemap: updated })
      return true
    },

    setBrandVoice: (brandVoice) => {
      set({ brandVoice })
      save({ brandVoice })
    },

    setPageContent: (pageId, content) => {
      const pageContents = { ...get().pageContents, [pageId]: content }
      set({ pageContents })
      save({ pageContents })
    },
  }
})
