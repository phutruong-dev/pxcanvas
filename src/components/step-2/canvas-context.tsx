"use client"

import { createContext, useContext } from "react"

type CanvasCtx = {
  selectedId: string | null
  hoverTargetId: string | null
  onAddChild: (parentId: string) => void
}

const CanvasContext = createContext<CanvasCtx>({
  selectedId: null,
  hoverTargetId: null,
  onAddChild: () => {},
})

export function useCanvasContext() {
  return useContext(CanvasContext)
}

export default CanvasContext
