"use client"

import { RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SitemapNode } from "@/lib/types/sitemap"
import type { PageContentStatus } from "@/lib/types/content"

type Props = {
  pages: SitemapNode[]
  statuses: Record<string, PageContentStatus>
  selectedId: string | null
  onSelect: (id: string) => void
  onRegen: (id: string) => void
}

const statusConfig: Record<PageContentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  idle: { label: "idle", variant: "outline" },
  generating: { label: "generating…", variant: "secondary" },
  done: { label: "done", variant: "default" },
  error: { label: "error", variant: "destructive" },
}

export default function PageList({
  pages,
  statuses,
  selectedId,
  onSelect,
  onRegen,
}: Props) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r bg-background">
      <div className="border-b px-3 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pages ({pages.length})
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {pages.map((page) => {
          const status = statuses[page.id] ?? "idle"
          const cfg = statusConfig[status]
          const isSelected = page.id === selectedId
          const depth = getDepth(pages, page)
          return (
            <div
              key={page.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(page.id)}
              onKeyDown={(e) => e.key === "Enter" && onSelect(page.id)}
              className={cn(
                "group flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition hover:bg-muted/50",
                isSelected && "bg-muted",
              )}
              style={{ paddingLeft: `${12 + depth * 16}px` }}
            >
              <span className="min-w-0 flex-1 truncate">{page.name}</span>
              <Badge variant={cfg.variant} className="shrink-0 text-[10px] px-1.5 py-0 h-4">
                {cfg.label}
              </Badge>
              {status === "error" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100"
                  aria-label="Retry"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRegen(page.id)
                  }}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

function getDepth(pages: SitemapNode[], node: SitemapNode): number {
  if (!node.parentId) return 0
  const parent = pages.find((p) => p.id === node.parentId)
  return parent ? 1 + getDepth(pages, parent) : 0
}
