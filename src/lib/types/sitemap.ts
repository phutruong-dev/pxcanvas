export type SitemapNode = {
  id: string
  name: string
  description: string
  children: SitemapNode[]
  parentId: string | null  // null for root node
  improved: boolean        // true if created/modified by an AI improvement suggestion
}
