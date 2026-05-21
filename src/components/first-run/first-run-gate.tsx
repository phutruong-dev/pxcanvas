"use client"

import { useEffect, useState } from "react"
import { useSettingsStore } from "@/lib/store/settings"
import FirstRunWizard from "./wizard"

export default function FirstRunGate() {
  const dismissed = useSettingsStore((s) => s.dismissedFirstRun)
  const apiKey = useSettingsStore((s) => s.apiKey)
  const [open, setOpen] = useState(false)
  const [sdkDetected, setSdkDetected] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (checked || dismissed || apiKey) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/health")
        const json = await res.json()
        if (cancelled) return
        const detected = !!json.provider?.sdkDetected
        setSdkDetected(detected)
        if (!detected && !apiKey) setOpen(true)
      } catch {
        if (cancelled) return
        setOpen(true)
      } finally {
        if (!cancelled) setChecked(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [checked, dismissed, apiKey])

  if (!open) return null
  return (
    <FirstRunWizard
      open={open}
      sdkDetected={sdkDetected}
      onDismiss={() => setOpen(false)}
    />
  )
}
