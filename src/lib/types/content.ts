export type Section = {
  id: string
  name: string  // e.g. "Hero", "Social Proof", "FAQ — Short"
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
