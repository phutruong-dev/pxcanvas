"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Loader2, RefreshCw, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import SectionEditor from "@/components/shared/section-editor"
import { cn } from "@/lib/utils"
import { sectionExistsInMd } from "@/lib/utils/markdown-sections"
import type { SitemapNode } from "@/lib/types/sitemap"
import type { Section, PageContent } from "@/lib/types/content"

type Props = {
  page: SitemapNode
  sections: Section[]
  pageContent: PageContent | null
  sectionGeneratingIds: Set<string>
  selectedSectionId: string | null
  onSelectSection: (id: string | null) => void
  onGenerateSection: (section: Section) => void
  onGeneratePage: () => void
  onSaveSections: (sections: Section[]) => void
  batchRunning: boolean
  hasBrandVoice: boolean
}

export default function SectionsPanel({
  page,
  sections,
  pageContent,
  sectionGeneratingIds,
  selectedSectionId,
  onSelectSection,
  onGenerateSection,
  onGeneratePage,
  onSaveSections,
  batchRunning,
  hasBrandVoice,
}: Props) {
  const [editorOpen, setEditorOpen] = useState(false)

  const markdown = pageContent?.markdown ?? ""
  const pageGenerating = pageContent?.status === "generating"
  const disabled = batchRunning || pageGenerating

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-3 py-2.5">
        <p className="truncate text-sm font-semibold">{page.name}</p>
        <Button
          size="sm"
          variant="outline"
          className="h-7 shrink-0 text-xs"
          disabled={disabled || !hasBrandVoice}
          onClick={onGeneratePage}
        >
          <Zap className="mr-1 h-3 w-3" />
          {pageContent?.status === "done" ? "Regen page" : "Generate page"}
        </Button>
      </div>

      {/* Section list */}
      <div className="flex-1 overflow-y-auto">
        {sections.length === 0 ? (
          <p className="px-3 py-4 text-center text-xs text-muted-foreground">
            No sections yet. Generate sections in Step 2 or add them below.
          </p>
        ) : (
          <ul className="divide-y">
            {sections.map((s) => {
              const isGenerating = sectionGeneratingIds.has(s.id)
              const hasMd = sectionExistsInMd(markdown, s.name)
              const isSelected = selectedSectionId === s.id

              return (
                <li
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectSection(isSelected ? null : s.id)}
                  onKeyDown={(e) => e.key === "Enter" && onSelectSection(isSelected ? null : s.id)}
                  className={cn(
                    "group flex cursor-pointer items-start gap-2 px-3 py-2.5 transition hover:bg-muted/50",
                    isSelected && "bg-muted",
                  )}
                >
                  {/* Status dot */}
                  <span
                    className={cn(
                      "mt-1 h-2 w-2 shrink-0 rounded-full",
                      isGenerating
                        ? "animate-pulse bg-blue-400"
                        : hasMd
                          ? "bg-emerald-500"
                          : "bg-muted-foreground/30",
                    )}
                  />

                  {/* Name + description */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-tight">{s.name}</p>
                    {s.description && (
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                        {s.description}
                      </p>
                    )}
                  </div>

                  {/* Regen button */}
                  {isGenerating ? (
                    <Loader2 className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
                      disabled={disabled || !hasBrandVoice}
                      aria-label={hasMd ? "Regenerate section" : "Generate section"}
                      onClick={(e) => {
                        e.stopPropagation()
                        onGenerateSection(s)
                      }}
                    >
                      {hasMd ? (
                        <RefreshCw className="h-3 w-3" />
                      ) : (
                        <Zap className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Edit sections toggle */}
      <div className="border-t">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition"
          onClick={() => setEditorOpen((o) => !o)}
        >
          Edit sections
          {editorOpen ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
        {editorOpen && (
          <div className="border-t px-3 py-3">
            <SectionEditor
              sections={sections}
              onSave={(updated) => {
                onSaveSections(updated)
                setEditorOpen(false)
              }}
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </aside>
  )
}
