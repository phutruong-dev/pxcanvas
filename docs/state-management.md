# State Management — PXcanvas

> Zustand + localStorage persist. Mọi store đều persist trừ undo-redo.

---

## Store Map

```
lib/store/
├── projects.ts      # danh sách project (home screen)
├── workflow.ts      # state của project đang mở (sitemap, brand voice, content)
├── settings.ts      # AI provider, output folder
└── undo-redo.ts     # undo stack cho sitemap canvas (không persist)
```

---

## `projects.ts`

**localStorage key:** `pxcanvas:projects`

```ts
type ProjectsStore = {
  projects: Project[]
  addProject: (name: string) => Project
  renameProject: (id: string, name: string) => void
  deleteProject: (id: string) => void
  duplicateProject: (id: string) => Project
  getProject: (id: string) => Project | undefined
  updateProjectStep: (id: string, step: 1 | 2 | 3 | 4) => void
}
```

---

## `workflow.ts`

**localStorage key:** `pxcanvas:workflow:{projectId}` (dynamic, per project)

```ts
type WorkflowStore = {
  projectId: string | null
  uxImprovements: UxImprovement[]
  sitemap: SitemapNode | null           // root node
  brandVoice: BrandVoice | null
  pageContents: Record<string, PageContent>  // keyed by node.id

  setUxImprovements: (items: UxImprovement[]) => void
  toggleImprovement: (id: string) => void
  setSitemap: (root: SitemapNode) => void
  updateNode: (id: string, patch: Partial<SitemapNode>) => void
  addChildNode: (parentId: string) => SitemapNode
  deleteNode: (id: string) => void
  reparentNode: (nodeId: string, newParentId: string) => void
  setBrandVoice: (bv: BrandVoice) => void
  setPageContent: (pageId: string, content: PageContent) => void
  loadProject: (projectId: string) => void  // hydrate từ localStorage
}
```

**Lưu ý:** `loadProject` phải được gọi khi user mở project. Workflow store clear về null trước khi load project mới.

---

## `settings.ts`

**localStorage key:** `pxcanvas:settings`

```ts
type SettingsStore = {
  provider: "sdk" | "api-key"
  apiKey: string           // plain text (local-only, acceptable per PRD)
  outputFolder: string     // absolute path
  aiModel: string          // default: "claude-sonnet-4-6"
  debugLogging: boolean    // bật/tắt logs/ai-calls.jsonl

  setProvider: (p: "sdk" | "api-key") => void
  setApiKey: (key: string) => void
  setOutputFolder: (path: string) => void
}
```

---

## `undo-redo.ts`

**Không persist** (mất khi reload — acceptable, undo history là session-only).

```ts
type UndoRedoStore = {
  past: SitemapNode[]    // array of past root nodes (deep clone)
  future: SitemapNode[]  // array of future root nodes

  push: (current: SitemapNode) => void   // push before mutation
  undo: () => SitemapNode | null
  redo: () => SitemapNode | null
  canUndo: boolean
  canRedo: boolean
  clear: () => void
}
```

**Max stack size:** 20. Khi vượt 20 → drop oldest từ `past`.

---

## Subscribe Pattern

```tsx
// Chỉ subscribe field cần (tránh re-render toàn component)
const projects = useProjectsStore((s) => s.projects)
const addProject = useProjectsStore((s) => s.addProject)

// Không làm thế này (subscribe toàn store → re-render mỗi mutation)
const store = useProjectsStore()  // ❌
```

---

## Auto-save Pattern (Debounce)

```ts
// lib/utils/debounce.ts
export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T

// Dùng trong workflow store:
const debouncedSave = debounce((state) => {
  localStorage.setItem(`pxcanvas:workflow:${state.projectId}`, JSON.stringify(state))
}, 1000)

// Gọi sau mỗi mutation trong workflow store
```

---

## localStorage Keys Summary

| Key | Store | Notes |
|---|---|---|
| `pxcanvas:projects` | projects | Array of Project |
| `pxcanvas:workflow:{id}` | workflow | Workflow state per project |
| `pxcanvas:settings` | settings | Global settings |
