"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import TopBar from "@/components/home/top-bar"
import ProjectCard from "@/components/home/project-card"
import EmptyState from "@/components/home/empty-state"
import NewProjectModal from "@/components/home/new-project-modal"
import { useProjectsStore } from "@/lib/store/projects"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [newOpen, setNewOpen] = useState(false)
  const projects = useProjectsStore((s) => s.projects)

  // Avoid Zustand/localStorage hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Warn if localStorage is almost full (>4.5MB of ~5MB quota)
  useEffect(() => {
    if (!mounted) return
    try {
      const used = JSON.stringify(localStorage).length
      if (used > 4_500_000) {
        toast.warning("Storage is almost full. Export projects as zip to free space.")
      }
    } catch {
      toast.error("Could not access local storage.")
    }
  }, [mounted])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const sorted = [...projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar onNew={() => setNewOpen(true)} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {sorted.length === 0 ? (
          <EmptyState onNew={() => setNewOpen(true)} />
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-xl font-semibold">Projects</h1>
              <span className="text-sm text-muted-foreground">
                {sorted.length} project{sorted.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {sorted.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </>
        )}
      </main>

      <NewProjectModal open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  )
}
