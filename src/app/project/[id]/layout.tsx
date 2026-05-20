"use client"

import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
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
  const id = params.id as string
  const loadProject = useWorkflowStore((s) => s.loadProject)
  const project = useProjectsStore((s) => s.getProject(id))
  const updateProjectStep = useProjectsStore((s) => s.updateProjectStep)

  useEffect(() => {
    if (id) loadProject(id)
  }, [id, loadProject])

  useEffect(() => {
    if (id) updateProjectStep(id, stepFromPath(pathname))
  }, [id, pathname, updateProjectStep])

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Project not found.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <WorkflowHeader projectName={project.name} step={stepFromPath(pathname)} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
