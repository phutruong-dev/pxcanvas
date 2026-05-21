"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import TopBar from "@/components/home/top-bar"
import ProjectCard from "@/components/home/project-card"
import EmptyState from "@/components/home/empty-state"
import NewProjectModal from "@/components/home/new-project-modal"
import { useProjectsStore } from "@/lib/store/projects"
import { useWorkflowStore } from "@/lib/store/workflow"
import type { SitemapNode } from "@/lib/types/sitemap"
import type { BrandVoice } from "@/lib/types/brand-voice"
import type { PageContent } from "@/lib/types/content"

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [newOpen, setNewOpen] = useState(false)
  const projects = useProjectsStore((s) => s.projects)
  const addProject = useProjectsStore((s) => s.addProject)
  const setSitemap = useWorkflowStore((s) => s.setSitemap)
  const setBrandVoice = useWorkflowStore((s) => s.setBrandVoice)
  const setPageContent = useWorkflowStore((s) => s.setPageContent)
  const loadProject = useWorkflowStore((s) => s.loadProject)
  const importRef = useRef<HTMLInputElement | null>(null)

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

  async function handleImport(file: File) {
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch("/api/files/import-zip", { method: "POST", body: formData })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error ?? "Import failed")
      const { projectName, sitemap, brandVoice, pageContents } = json.data as {
        projectName: string
        sitemap: SitemapNode
        brandVoice: BrandVoice | null
        pageContents: Record<string, PageContent>
      }
      const project = addProject(projectName)
      loadProject(project.id)
      setSitemap(sitemap)
      if (brandVoice) setBrandVoice(brandVoice)
      Object.entries(pageContents).forEach(([pageId, content]) =>
        setPageContent(pageId, content),
      )
      toast.success(`Imported "${projectName}"`)
      router.push(`/project/${project.id}/step-4`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed")
    }
  }

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
      <TopBar
        onNew={() => setNewOpen(true)}
        onImport={() => importRef.current?.click()}
      />
      <input
        ref={importRef}
        type="file"
        accept=".zip"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) void handleImport(f)
          e.target.value = ""
        }}
      />

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
