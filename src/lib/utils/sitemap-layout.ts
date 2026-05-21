import type { Edge, Node } from "reactflow"
import type { SitemapNode } from "@/lib/types/sitemap"

export const NODE_WIDTH = 220
export const NODE_BASE_HEIGHT = 96
const SECTION_OVERHEAD = 16 // mt-2 + border-t + pt-1.5
const SECTION_ROW_H = 20    // each section row
const H_GAP = 32
const V_GAP = 72

// Kept for backward-compat — equals NODE_BASE_HEIGHT
export const NODE_HEIGHT = NODE_BASE_HEIGHT

export function nodeHeight(sectionCount: number): number {
  return sectionCount > 0
    ? NODE_BASE_HEIGHT + SECTION_OVERHEAD + sectionCount * SECTION_ROW_H
    : NODE_BASE_HEIGHT
}

function computeSubtreeWidth(node: SitemapNode, widths: Map<string, number>): number {
  if (node.children.length === 0) {
    widths.set(node.id, NODE_WIDTH)
    return NODE_WIDTH
  }
  let total = 0
  node.children.forEach((child, i) => {
    total += computeSubtreeWidth(child, widths)
    if (i < node.children.length - 1) total += H_GAP
  })
  const width = Math.max(NODE_WIDTH, total)
  widths.set(node.id, width)
  return width
}

function collectMaxHeights(
  node: SitemapNode,
  depth: number,
  sectionCounts: Record<string, number>,
  maxHeights: Map<number, number>,
): void {
  const h = nodeHeight(sectionCounts[node.id] ?? 0)
  maxHeights.set(depth, Math.max(maxHeights.get(depth) ?? 0, h))
  for (const child of node.children) {
    collectMaxHeights(child, depth + 1, sectionCounts, maxHeights)
  }
}

function buildYOffsets(
  root: SitemapNode,
  sectionCounts: Record<string, number>,
): Map<number, number> {
  const maxHeights = new Map<number, number>()
  collectMaxHeights(root, 0, sectionCounts, maxHeights)
  const yOffsets = new Map<number, number>()
  let y = 0
  const maxDepth = maxHeights.size > 0 ? Math.max(...maxHeights.keys()) : 0
  for (let d = 0; d <= maxDepth; d++) {
    yOffsets.set(d, y)
    y += (maxHeights.get(d) ?? NODE_BASE_HEIGHT) + V_GAP
  }
  return yOffsets
}

function place(
  node: SitemapNode,
  depth: number,
  leftX: number,
  widths: Map<string, number>,
  yOffsets: Map<number, number>,
  nodes: Node[],
  edges: Edge[],
): void {
  const subtreeW = widths.get(node.id) ?? NODE_WIDTH
  const x = leftX + subtreeW / 2 - NODE_WIDTH / 2
  const y = yOffsets.get(depth) ?? depth * (NODE_BASE_HEIGHT + V_GAP)
  nodes.push({
    id: node.id,
    type: "nodeCard",
    position: { x, y },
    data: { nodeId: node.id },
    draggable: node.parentId !== null,
  })
  let cursor = leftX
  for (const child of node.children) {
    const childW = widths.get(child.id) ?? NODE_WIDTH
    place(child, depth + 1, cursor, widths, yOffsets, nodes, edges)
    cursor += childW + H_GAP
    edges.push({
      id: `${node.id}->${child.id}`,
      source: node.id,
      target: child.id,
      type: "smoothstep",
      animated: false,
    })
  }
}

export function treeToFlow(
  root: SitemapNode,
  sectionCounts: Record<string, number> = {},
): { nodes: Node[]; edges: Edge[] } {
  const widths = new Map<string, number>()
  computeSubtreeWidth(root, widths)
  const yOffsets = buildYOffsets(root, sectionCounts)
  const nodes: Node[] = []
  const edges: Edge[] = []
  place(root, 0, 0, widths, yOffsets, nodes, edges)
  return { nodes, edges }
}

export function countNodes(root: SitemapNode | null): number {
  if (!root) return 0
  return 1 + root.children.reduce((sum, c) => sum + countNodes(c), 0)
}

export function flattenTree(root: SitemapNode | null): SitemapNode[] {
  if (!root) return []
  return [root, ...root.children.flatMap(flattenTree)]
}
