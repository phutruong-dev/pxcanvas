"use client"

import { useEffect, useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useWorkflowStore } from "@/lib/store/workflow"
import { useProjectsStore } from "@/lib/store/projects"
import WorkflowHeader from "@/components/workflow/workflow-header"

function stepFromPath(pathname: string): 1 | 2 | 3 | 4 {
  if (pathname.includes("step-2")) return 2
  if (pathname.includes("step-3")) return 3
  if (pathname.includes("step-4")) return 4
  return 1
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const id = params.id as string

  const loadProject = useWorkflowStore((s) => s.loadProject)
  const savingStatus = useWorkflowStore((s) => s.savingStatus)
  const project = useProjectsStore((s) => s.getProject(id))
  const updateProjectStep = useProjectsStore((s) => s.updateProjectStep)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (id) loadProject(id)
  }, [id, loadProject])

  useEffect(() => {
    if (id) updateProjectStep(id, stepFromPath(pathname))
  }, [id, pathname, updateProjectStep])

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Project not found.</p>
      </div>
    )
  }

  const step = stepFromPath(pathname)
  const maxReached = (project.maxReachedStep ?? step) as 1 | 2 | 3 | 4

  return (
    <div className="flex min-h-screen flex-col">
      <WorkflowHeader
        projectName={project.name}
        step={step}
        maxReached={maxReached}
        savingStatus={savingStatus}
        onNavigate={(s) => router.push(`/project/${id}/step-${s}`)}
      />
      <main className="flex-1">{children}</main>
    </div>
  )
}
