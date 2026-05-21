"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Loader2, Plus, RefreshCw, Trash2, X } from "lucide-react"
import SectionEditor from "@/components/shared/section-editor"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import DeleteConfirmModal from "@/components/ui/delete-confirm-modal"
import { useWorkflowStore } from "@/lib/store/workflow"
import { useSettingsStore } from "@/lib/store/settings"
import { useSitemapMutations } from "@/lib/hooks/use-sitemap-mutations"
import type { SitemapNode } from "@/lib/types/sitemap"
import type { Section } from "@/lib/types/content"

function findNode(root: SitemapNode, id: string): SitemapNode | null {
  if (root.id === id) return root
  for (const c of root.children) {
    const f = findNode(c, id)
    if (f) return f
  }
  return null
}

function findParent(root: SitemapNode, id: string): SitemapNode | null {
  for (const c of root.children) {
    if (c.id === id) return root
    const f = findParent(c, id)
    if (f) return f
  }
  return null
}

type Props = {
  selectedId: string | null
  onClose: () => void
}

export default function SidePanel({ selectedId, onClose }: Props) {
  const sitemap = useWorkflowStore((s) => s.sitemap)

  const node = sitemap && selectedId ? findNode(sitemap, selectedId) : null
  const parent = sitemap && selectedId ? findParent(sitemap, selectedId) : null

  if (!node) {
    return (
      <aside className="w-80 shrink-0 border-l bg-background p-6 text-sm text-muted-foreground">
        Click a page on the canvas to edit it.
      </aside>
    )
  }

  return (
    <NodeEditor
      key={node.id}
      node={node}
      parent={parent}
      onClose={onClose}
    />
  )
}

function NodeEditor({
  node,
  parent,
  onClose,
}: {
  node: SitemapNode
  parent: SitemapNode | null
  onClose: () => void
}) {
  const { update, remove, reorder, addChild } = useSitemapMutations()
  const sitemap = useWorkflowStore((s) => s.sitemap)
  const pageContents = useWorkflowStore((s) => s.pageContents)
  const setPageContent = useWorkflowStore((s) => s.setPageContent)
  const provider = useSettingsStore((s) => s.provider)
  const apiKey = useSettingsStore((s) => s.apiKey)
  const aiModel = useSettingsStore((s) => s.aiModel)
  const debugLogging = useSettingsStore((s) => s.debugLogging)

  const [name, setName] = useState(node.name)
  const [description, setDescription] = useState(node.description)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [generatingSections, setGeneratingSections] = useState(false)

  const isRoot = node.parentId === null
  const childCount = node.children.length
  const siblingIdx = parent ? parent.children.findIndex((c) => c.id === node.id) : -1
  const canUp = parent !== null && siblingIdx > 0
  const canDown = parent !== null && siblingIdx < (parent?.children.length ?? 0) - 1
  const sections: Section[] = pageContents[node.id]?.sections ?? []

  function commitName() {
    if (name !== node.name) update(node.id, { name })
  }
  function commitDescription() {
    if (description !== node.description) update(node.id, { description })
  }
  function handleDelete() {
    if (childCount > 0) {
      setConfirmOpen(true)
    } else {
      remove(node.id)
      onClose()
    }
  }
  function confirmDelete() {
    setConfirmOpen(false)
    remove(node.id)
    onClose()
  }

  function handleAddChild() {
    addChild(node.id)
    toast.success(`Added child page under "${node.name}"`)
  }

  async function generateSections() {
    if (!sitemap) return
    setGeneratingSections(true)
    try {
      const res = await fetch("/api/ai/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageNode: node,
          sitemapJson: JSON.stringify(sitemap, null, 2),
          settings: { provider, apiKey, aiModel, debugLogging },
        }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error ?? "Section generation failed")
      const newSections = json.data as Section[]
      const existing = pageContents[node.id]
      setPageContent(node.id, {
        pageId: node.id,
        sections: newSections,
        markdown: existing?.markdown ?? "",
        status: existing?.status ?? "idle",
        generatedAt: existing?.generatedAt ?? null,
        errorMessage: null,
      })
      toast.success(`Generated ${newSections.length} sections for "${node.name}"`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Section generation failed")
    } finally {
      setGeneratingSections(false)
    }
  }

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Page details</h2>
          {node.improved && (
            <Badge variant="secondary" className="h-5 px-1.5 py-0 text-[10px]">
              improved
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="space-y-1.5">
          <Label htmlFor="node-name">Name</Label>
          <Input
            id="node-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur()
            }}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="node-desc">Description</Label>
          <Textarea
            id="node-desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={commitDescription}
          />
        </div>

        {!isRoot && (
          <div className="space-y-1.5">
            <Label>Order among siblings</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!canUp}
                onClick={() => reorder(node.id, "up")}
                className="flex-1"
              >
                <ArrowUp className="mr-1 h-3.5 w-3.5" />
                Up
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!canDown}
                onClick={() => reorder(node.id, "down")}
                className="flex-1"
              >
                <ArrowDown className="mr-1 h-3.5 w-3.5" />
                Down
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          <p>
            Children: <span className="font-medium text-foreground">{childCount}</span>
          </p>
          {parent && (
            <p className="mt-0.5">
              Parent: <span className="font-medium text-foreground">{parent.name}</span>
            </p>
          )}
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={handleAddChild}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add child page
        </Button>

        <div className="space-y-2 border-t pt-4">
          <div className="flex items-center justify-between">
            <Label>Sections</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={generateSections}
              disabled={generatingSections}
            >
              {generatingSections ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : sections.length > 0 ? (
                <RefreshCw className="mr-1 h-3 w-3" />
              ) : (
                <Plus className="mr-1 h-3 w-3" />
              )}
              {sections.length > 0 ? "Re-generate" : "Generate"}
            </Button>
          </div>

          {sections.length === 0 ? (
            <p className="rounded-md border border-dashed bg-muted/20 px-3 py-3 text-center text-xs text-muted-foreground">
              No sections yet. Click Generate to propose a section layout for this page.
            </p>
          ) : (
            <SectionEditor
              sections={sections}
              disabled={generatingSections}
              onSave={(updated) => {
                const existing = pageContents[node.id]
                setPageContent(node.id, {
                  pageId: node.id,
                  sections: updated,
                  markdown: existing?.markdown ?? "",
                  status: existing?.status ?? "idle",
                  generatedAt: existing?.generatedAt ?? null,
                  errorMessage: null,
                })
                toast.success("Sections saved")
              }}
            />
          )}
        </div>
      </div>

      {!isRoot && (
        <div className="border-t p-4">
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={handleDelete}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete page
          </Button>
        </div>
      )}

      <DeleteConfirmModal
        open={confirmOpen}
        title="Delete this page?"
        description={`"${node.name}" has ${childCount} child page${childCount === 1 ? "" : "s"} that will also be deleted.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </aside>
  )
}
