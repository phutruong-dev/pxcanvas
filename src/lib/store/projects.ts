import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Project } from "@/lib/types/project"

type ProjectsStore = {
  projects: Project[]
  addProject: (name: string) => Project
  renameProject: (id: string, name: string) => void
  deleteProject: (id: string) => void
  duplicateProject: (id: string) => Project | null
  getProject: (id: string) => Project | undefined
  updateProjectStep: (id: string, step: 1 | 2 | 3 | 4) => void
  touch: (id: string) => void  // update updatedAt
}

function uniqueName(base: string, existing: string[]): string {
  if (!existing.includes(base)) return base
  let n = 2
  while (existing.includes(`${base} (${n})`)) n++
  return `${base} (${n})`
}

function newProject(name: string): Project {
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStep: 1,
    maxReachedStep: 1,
  }
}

export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set, get) => ({
      projects: [],

      addProject: (name) => {
        const existing = get().projects.map((p) => p.name)
        const safeName = uniqueName(name.trim() || "Untitled project", existing)
        const project = newProject(safeName)
        set((s) => ({ projects: [...s.projects, project] }))
        return project
      },

      renameProject: (id, name) => {
        if (!name.trim()) return
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, name: name.trim(), updatedAt: new Date().toISOString() } : p
          ),
        }))
      },

      deleteProject: (id) => {
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }))
        // Clean up workflow state
        localStorage.removeItem(`pxcanvas:workflow:${id}`)
      },

      duplicateProject: (id) => {
        const source = get().projects.find((p) => p.id === id)
        if (!source) return null
        const existing = get().projects.map((p) => p.name)
        const copy = newProject(uniqueName(`${source.name} (copy)`, existing))
        // Clone workflow state if it exists
        const workflowKey = `pxcanvas:workflow:${id}`
        const raw = localStorage.getItem(workflowKey)
        if (raw) localStorage.setItem(`pxcanvas:workflow:${copy.id}`, raw)
        set((s) => ({ projects: [...s.projects, copy] }))
        return copy
      },

      getProject: (id) => get().projects.find((p) => p.id === id),

      updateProjectStep: (id, step) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  currentStep: step,
                  maxReachedStep: (Math.max(p.maxReachedStep ?? 1, step) as 1 | 2 | 3 | 4),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }))
      },

      touch: (id) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, updatedAt: new Date().toISOString() } : p
          ),
        }))
      },
    }),
    { name: "pxcanvas:projects" }
  )
)
