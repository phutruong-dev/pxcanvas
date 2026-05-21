"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import InputForm from "@/components/step-1/input-form"
import UxImprovementsList from "@/components/step-1/ux-improvements-list"
import { useWorkflowStore } from "@/lib/store/workflow"
import { useSettingsStore } from "@/lib/store/settings"
import type { FormInput, UxImprovement } from "@/lib/types/ux-analysis"

type Stage = "input" | "analyzing" | "results"

export default function Step1Page() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [stage, setStage] = useState<Stage>("input")
  const [error, setError] = useState<string | null>(null)
  const [lastUrl, setLastUrl] = useState("")
  const [lastFormInput, setLastFormInput] = useState<FormInput | null>(null)

  const improvements = useWorkflowStore((s) => s.uxImprovements)
  const setUxImprovements = useWorkflowStore((s) => s.setUxImprovements)
  const toggleImprovement = useWorkflowStore((s) => s.toggleImprovement)
  const setFormInput = useWorkflowStore((s) => s.setFormInput)

  const provider = useSettingsStore((s) => s.provider)
  const apiKey = useSettingsStore((s) => s.apiKey)
  const aiModel = useSettingsStore((s) => s.aiModel)
  const debugLogging = useSettingsStore((s) => s.debugLogging)

  async function handleAnalyze(url: string, formInput: FormInput) {
    setLastUrl(url)
    setLastFormInput(formInput)
    setFormInput(formInput)
    setStage("analyzing")
    setError(null)

    try {
      const res = await fetch("/api/ai/ux-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          formInput,
          settings: { provider, apiKey, aiModel, debugLogging },
        }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error ?? "Unexpected error")
      setUxImprovements(json.data as UxImprovement[])
      setStage("results")
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setStage("results")
    }
  }

  function handleRetry() {
    if (lastFormInput) handleAnalyze(lastUrl, lastFormInput)
  }

  function handleSkip() {
    setUxImprovements([])
    router.push(`/project/${id}/step-2`)
  }

  function handleContinue() {
    router.push(`/project/${id}/step-2`)
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8 space-y-1">
        <h1 className="text-lg font-semibold">Input & UX Analysis</h1>
        <p className="text-sm text-muted-foreground">
          Provide a reference URL and/or describe your project. AI will suggest UX improvements to apply to your sitemap.
        </p>
      </div>

      {stage === "input" && (
        <InputForm
          initialValues={
            lastFormInput
              ? { url: lastUrl, formInput: lastFormInput }
              : undefined
          }
          loading={false}
          onSubmit={handleAnalyze}
          onSkip={handleSkip}
        />
      )}

      {stage === "analyzing" && (
        <div className="flex flex-col items-center gap-4 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Analyzing input{lastUrl ? " and reading URL" : ""}…
          </p>
          <p className="text-xs text-muted-foreground">This usually takes 5–15 seconds.</p>
        </div>
      )}

      {stage === "results" && (
        <div className="space-y-6">
          {/* Show form again collapsed for context */}
          <div className="rounded-lg border bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Analyzed:{" "}
              {lastUrl && <span className="font-medium text-foreground">{lastUrl} · </span>}
              <span>{lastFormInput?.siteType?.replace("-", " ")}</span>
            </p>
            <button
              className="mt-1 text-xs text-primary hover:underline"
              onClick={() => setStage("input")}
            >
              Edit input
            </button>
          </div>

          <UxImprovementsList
            improvements={improvements}
            error={error}
            onToggle={toggleImprovement}
            onRetry={handleRetry}
            onSkip={handleSkip}
            onContinue={handleContinue}
          />
        </div>
      )}
    </div>
  )
}
