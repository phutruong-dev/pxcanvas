"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useWorkflowStore } from "@/lib/store/workflow"
import { useProjectsStore } from "@/lib/store/projects"

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const id = params.id as string
  const loadProject = useWorkflowStore((s) => s.loadProject)
  const project = useProjectsStore((s) => s.getProject(id))

  useEffect(() => {
    if (id) loadProject(id)
  }, [id, loadProject])

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Project not found.</p>
      </div>
    )
  }

  return <>{children}</>
}
