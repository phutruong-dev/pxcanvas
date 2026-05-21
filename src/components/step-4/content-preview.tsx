"use client"

import { Check, Copy, RefreshCw, X, Zap } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button } from "@/components/ui/button"
import { extractSectionFromMd } from "@/lib/utils/markdown-sections"
import type { PageContent, Section } from "@/lib/types/content"

type Props = {
  content: PageContent
  blacklist: string[]
  onRegen: () => void
  regenDisabled?: boolean
  selectedSection: Section | null
  onClearSection: () => void
}

function markBlacklist(text: string, blacklist: string[]): React.ReactNode {
  if (!blacklist.length) return text
  const pattern = new RegExp(
    `\\b(${blacklist.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
    "gi",
  )
  const parts = text.split(pattern)
  const lowerSet = new Set(blacklist.map((w) => w.toLowerCase()))
  return (
    <>
      {parts.map((part, i) =>
        lowerSet.has(part.toLowerCase()) ? (
          <mark
            key={i}
            className="rounded-sm bg-yellow-200 px-0.5 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

const mdComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-2 text-2xl font-bold leading-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-8 border-b pb-1.5 text-lg font-semibold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-5 text-base font-semibold">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1.5 mt-4 text-sm font-semibold">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="mb-3 leading-relaxed text-foreground/90">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 text-foreground/90">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 text-foreground/90">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto rounded-md bg-muted p-3 font-mono text-sm">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-5 border-border" />,
  a: ({ href, children }) => (
    <a href={href} className="text-primary underline">
      {children}
    </a>
  ),
}

export default function ContentPreview({
  content,
  blacklist,
  onRegen,
  regenDisabled,
  selectedSection,
  onClearSection,
}: Props) {
  const [copied, setCopied] = useState(false)

  const displayMarkdown = selectedSection
    ? extractSectionFromMd(content.markdown, selectedSection.name)
    : content.markdown

  async function copy() {
    try {
      await navigator.clipboard.writeText(displayMarkdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("Copied to clipboard")
    } catch {
      toast.error("Could not copy to clipboard")
    }
  }

  if (content.status === "generating") {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="animate-pulse">Generating content…</span>
      </div>
    )
  }

  if (content.status === "error") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-sm">
        <p className="text-destructive">{content.errorMessage ?? "Generation failed"}</p>
        <Button size="sm" onClick={onRegen} disabled={regenDisabled}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Retry
        </Button>
      </div>
    )
  }

  if (!content.markdown) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-sm">
        <p className="text-muted-foreground">No content yet.</p>
        <Button size="sm" onClick={onRegen} disabled={regenDisabled}>
          <Zap className="mr-1.5 h-3.5 w-3.5" />
          Generate this page
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {selectedSection ? (
            <>
              <span className="font-medium text-foreground">{selectedSection.name}</span>
              <button
                type="button"
                onClick={onClearSection}
                className="flex items-center gap-0.5 hover:text-foreground transition"
                aria-label="Show full page"
              >
                <X className="h-3 w-3" />
                Full page
              </button>
            </>
          ) : (
            <>
              <span>Full page</span>
              {content.generatedAt && (
                <span>· {new Date(content.generatedAt).toLocaleTimeString()}</span>
              )}
              {blacklist.length > 0 && (
                <span>
                  · Blacklist{" "}
                  <mark className="rounded-sm bg-yellow-200 px-0.5 text-[10px] text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100">
                    highlighted
                  </mark>
                </span>
              )}
            </>
          )}
        </div>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" onClick={onRegen} disabled={regenDisabled}>
            <RefreshCw className="mr-1 h-3.5 w-3.5" />
            {selectedSection ? "Regen page" : "Regenerate"}
          </Button>
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? (
              <Check className="mr-1 h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="mr-1 h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {displayMarkdown ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={mdComponents}
          >
            {displayMarkdown}
          </ReactMarkdown>
        ) : (
          <p className="text-sm text-muted-foreground">
            This section has not been generated yet. Click{" "}
            <RefreshCw className="inline h-3.5 w-3.5" /> to generate it.
          </p>
        )}
      </div>
    </div>
  )
}
