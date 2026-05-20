"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Pencil, Copy, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteConfirmModal from "@/components/ui/delete-confirm-modal"
import { useProjectsStore } from "@/lib/store/projects"
import type { Project } from "@/lib/types/project"

type Props = { project: Project }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function ProjectCard({ project }: Props) {
  const router = useRouter()
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(project.name)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const renameProject = useProjectsStore((s) => s.renameProject)
  const deleteProject = useProjectsStore((s) => s.deleteProject)
  const duplicateProject = useProjectsStore((s) => s.duplicateProject)

  useEffect(() => {
    if (renaming) {
      setRenameValue(project.name)
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 50)
    }
  }, [renaming, project.name])

  function commitRename() {
    const trimmed = renameValue.trim()
    if (trimmed && trimmed !== project.name) renameProject(project.id, trimmed)
    setRenaming(false)
  }

  function handleCardClick() {
    if (renaming) return
    router.push(`/project/${project.id}/step-${project.currentStep}`)
  }

  return (
    <>
      <Card
        className="group relative cursor-pointer transition-shadow hover:shadow-md"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            {renaming ? (
              <input
                ref={inputRef}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename()
                  if (e.key === "Escape") setRenaming(false)
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full rounded border border-input bg-background px-2 py-1 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring"
              />
            ) : (
              <p className="line-clamp-2 text-sm font-semibold leading-snug">{project.name}</p>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={(e) => e.stopPropagation()}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => setRenaming(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => duplicateProject(project.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p>Created {formatDate(project.createdAt)}</p>
            <p>Edited {formatDate(project.updatedAt)}</p>
          </div>
          <div className="mt-3">
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Step {project.currentStep} / 4
            </span>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmModal
        open={deleteOpen}
        title="Delete project?"
        description={`"${project.name}" will be permanently deleted. This cannot be undone.`}
        onConfirm={() => {
          deleteProject(project.id)
          setDeleteOpen(false)
        }}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  )
}
