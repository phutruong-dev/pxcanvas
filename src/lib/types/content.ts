import type { SectionType } from "./wireframe"

export type Section = {
  id: string
  name: string         // e.g. "Hero", "Social Proof", "FAQ — Short"
  description: string  // 1-2 sentences: what this section communicates + why it's on this page

  // v1.0 — Wireframe-first fields. Optional for backward compat with MVP projects;
  // migration wizard fills these before Step 4b unlocks.
  type?: SectionType
  variationId?: string         // e.g. "feature-section-007"
  contentLockedAt?: string     // ISO 8601 — set when content sinh khớp variationId hiện tại; null = stale
}

export type PageContentStatus = "idle" | "generating" | "done" | "error"

export type PageContent = {
  pageId: string              // matches SitemapNode.id
  sections: Section[]
  markdown: string
  status: PageContentStatus
  generatedAt: string | null  // ISO 8601
  errorMessage: string | null
}
