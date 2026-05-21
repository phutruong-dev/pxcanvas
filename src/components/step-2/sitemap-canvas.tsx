"use client"

import { useCallback, useEffect, useMemo, useState, type RefObject } from "react"
import ReactFlow, {
  Background,
  useEdgesState,
  useNodesState,
  type NodeMouseHandler,
  type NodeDragHandler,
} from "reactflow"
import "reactflow/dist/style.css"

import { useWorkflowStore } from "@/lib/store/workflow"
import { useSitemapMutations } from "@/lib/hooks/use-sitemap-mutations"
import {
  NODE_WIDTH,
  flattenTree,
  nodeHeight,
  treeToFlow,
} from "@/lib/utils/sitemap-layout"
import NodeCard from "./node-card"
import CanvasContext from "./canvas-context"
import type { SitemapNode } from "@/lib/types/sitemap"

const nodeTypes = { nodeCard: NodeCard }

type Props = {
  selectedId: string | null
  onSelect: (id: string | null) => void
  canvasRef?: RefObject<HTMLDivElement | null>
  layoutKey?: number
}

export default function SitemapCanvas({ selectedId, onSelect, canvasRef, layoutKey }: Props) {
  const sitemap = useWorkflowStore((s) => s.sitemap)
  const pageContents = useWorkflowStore((s) => s.pageContents)
  const mutations = useSitemapMutations()
  const { reparent, addChild } = mutations

  const [hoverTargetId, setHoverTargetId] = useState<string | null>(null)
  const [excludeIds, setExcludeIds] = useState<Set<string>>(new Set())

  const sectionCounts = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(pageContents).map(([k, v]) => [k, v.sections?.length ?? 0]),
      ),
    [pageContents],
  )

  const layout = useMemo(
    () => (sitemap ? treeToFlow(sitemap, sectionCounts) : { nodes: [], edges: [] }),
    [sitemap, sectionCounts],
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(layout.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layout.edges)

  // Re-sync layout whenever the tree, section counts, or auto-layout is triggered
  useEffect(() => {
    setNodes(layout.nodes)
    setEdges(layout.edges)
  }, [layout, layoutKey, setNodes, setEdges])

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, n) => onSelect(n.id),
    [onSelect],
  )
  const onPaneClick = useCallback(() => onSelect(null), [onSelect])

  const onNodeDragStart: NodeDragHandler = useCallback(
    (_, n) => {
      if (!sitemap) return
      const flat = flattenTree(sitemap)
      const startNode = flat.find((x) => x.id === n.id)
      const set = new Set<string>()
      function walk(node: SitemapNode) {
        set.add(node.id)
        node.children.forEach(walk)
      }
      if (startNode) walk(startNode)
      setExcludeIds(set)
    },
    [sitemap],
  )

  const onNodeDrag: NodeDragHandler = useCallback(
    (_, n) => {
      const cx = n.position.x + NODE_WIDTH / 2
      const cy = n.position.y + nodeHeight(sectionCounts[n.id] ?? 0) / 2
      let hit: string | null = null
      for (const other of layout.nodes) {
        if (other.id === n.id) continue
        if (excludeIds.has(other.id)) continue
        const { x, y } = other.position
        const otherH = nodeHeight(sectionCounts[other.id] ?? 0)
        if (cx >= x && cx <= x + NODE_WIDTH && cy >= y && cy <= y + otherH) {
          hit = other.id
          break
        }
      }
      setHoverTargetId(hit)
    },
    [layout.nodes, excludeIds, sectionCounts],
  )

  const onNodeDragStop: NodeDragHandler = useCallback(
    (_, n) => {
      const target = hoverTargetId
      setHoverTargetId(null)
      setExcludeIds(new Set())
      if (target && target !== n.id) {
        reparent(n.id, target)
      } else {
        // Snap back: re-apply layout positions
        setNodes(layout.nodes)
      }
    },
    [hoverTargetId, reparent, layout.nodes, setNodes],
  )

  const ctxValue = useMemo(
    () => ({ selectedId, hoverTargetId, onAddChild: addChild }),
    [selectedId, hoverTargetId, addChild],
  )

  return (
    <CanvasContext.Provider value={ctxValue}>
      <div ref={canvasRef} className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          nodesConnectable={false}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={1} />
        </ReactFlow>
      </div>
    </CanvasContext.Provider>
  )
}
