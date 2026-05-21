import type { Edge, Node } from "reactflow"
import type { SitemapNode } from "@/lib/types/sitemap"

export const NODE_WIDTH = 220
export const NODE_HEIGHT = 96
const H_GAP = 32
const V_GAP = 72

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

function place(
  node: SitemapNode,
  depth: number,
  leftX: number,
  widths: Map<string, number>,
  nodes: Node[],
  edges: Edge[],
): void {
  const subtreeW = widths.get(node.id) ?? NODE_WIDTH
  const x = leftX + subtreeW / 2 - NODE_WIDTH / 2
  const y = depth * (NODE_HEIGHT + V_GAP)
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
    place(child, depth + 1, cursor, widths, nodes, edges)
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

export function treeToFlow(root: SitemapNode): { nodes: Node[]; edges: Edge[] } {
  const widths = new Map<string, number>()
  computeSubtreeWidth(root, widths)
  const nodes: Node[] = []
  const edges: Edge[] = []
  place(root, 0, 0, widths, nodes, edges)
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
