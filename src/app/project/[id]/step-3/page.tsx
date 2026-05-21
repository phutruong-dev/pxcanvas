"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import GenerateOverlay from "@/components/shared/generate-overlay"
import BrandVoiceInput, {
  emptyInputValues,
  hasAnyInput,
  type BrandInputValues,
} from "@/components/step-3/brand-voice-input"
import BrandVoiceForm, {
  type BrandVoiceFormHandle,
} from "@/components/step-3/brand-voice-form"
import BrandVoiceSummary from "@/components/step-3/brand-voice-summary"
import { useWorkflowStore } from "@/lib/store/workflow"
import { useSettingsStore } from "@/lib/store/settings"
import type { BrandVoice } from "@/lib/types/brand-voice"

export default function Step3Page() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const projectId = useWorkflowStore((s) => s.projectId)
  const brandVoice = useWorkflowStore((s) => s.brandVoice)
  const setBrandVoice = useWorkflowStore((s) => s.setBrandVoice)

  const provider = useSettingsStore((s) => s.provider)
  const apiKey = useSettingsStore((s) => s.apiKey)
  const aiModel = useSettingsStore((s) => s.aiModel)
  const debugLogging = useSettingsStore((s) => s.debugLogging)

  const [inputValues, setInputValues] = useState<BrandInputValues>(emptyInputValues)
  const [inputExpanded, setInputExpanded] = useState(true)
  const [generateState, setGenerateState] = useState<"idle" | "loading" | "error">("idle")
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [draftVoice, setDraftVoice] = useState<BrandVoice | null>(null)
  const [dirty, setDirty] = useState(false)
  const [confirmRegenOpen, setConfirmRegenOpen] = useState(false)
  const formRef = useRef<BrandVoiceFormHandle>(null)

  // Hydrate draft from store when page first mounts with persisted brandVoice
  useEffect(() => {
    if (projectId === id && brandVoice && !draftVoice) {
      setDraftVoice(brandVoice)
      setInputExpanded(false)
      setDirty(false)
    }
  }, [projectId, id, brandVoice, draftVoice])

  const generate = useCallback(async () => {
    if (!hasAnyInput(inputValues)) {
      toast.error("Provide a URL, file, or description first.")
      return
    }
    setGenerateState("loading")
    setGenerateError(null)
    try {
      const res = await fetch("/api/ai/brand-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: inputValues.url,
          fileName: inputValues.fileName,
          fileText: inputValues.fileText,
          freeText: inputValues.freeText,
          settings: { provider, apiKey, aiModel, debugLogging },
        }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error ?? "Unexpected error")
      const voice = json.data as BrandVoice
      setDraftVoice(voice)
      setDirty(true)  // freshly generated counts as unsaved
      setInputExpanded(false)
      setGenerateState("idle")
      formRef.current?.reset(voice)
      toast.success("Brand voice generated — review and save.")
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : String(err))
      setGenerateState("error")
    }
  }, [inputValues, provider, apiKey, aiModel, debugLogging])

  function handleRegenerate() {
    if (dirty) {
      setConfirmRegenOpen(true)
    } else {
      setInputExpanded(true)
    }
  }

  function confirmRegenerate() {
    setConfirmRegenOpen(false)
    setInputExpanded(true)
  }

  function handleSave(bv: BrandVoice) {
    setBrandVoice(bv)
    setDraftVoice(bv)
    setDirty(false)
    toast.success("Brand voice saved")
  }

  function handleContinue() {
    if (!brandVoice || dirty) {
      toast.error("Save your brand voice to continue.")
      return
    }
    router.push(`/project/${id}/step-4`)
  }

  function handleBack() {
    router.push(`/project/${id}/step-2`)
  }

  if (projectId !== id) {
    return <div className="p-6 text-sm text-muted-foreground">Loading…</div>
  }

  const continueDisabled = !brandVoice || dirty

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Brand Voice</h1>
          <p className="text-sm text-muted-foreground">
            Extract tone & rules from your inputs. Edit, then save to continue.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            Back
          </Button>
          <Button
            size="sm"
            onClick={handleContinue}
            disabled={continueDisabled}
            title={continueDisabled ? "Save your brand voice to continue" : undefined}
          >
            Continue
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="relative space-y-6">
        {inputExpanded ? (
          <section className="rounded-lg border bg-card p-5">
            <BrandVoiceInput
              value={inputValues}
              onChange={setInputValues}
              onGenerate={generate}
              generating={generateState === "loading"}
              generateLabel={draftVoice ? "Regenerate brand voice" : "Generate brand voice"}
            />
          </section>
        ) : (
          <BrandVoiceSummary
            value={inputValues}
            onExpand={() => setInputExpanded(true)}
          />
        )}

        {draftVoice && (
          <section className="rounded-lg border bg-card p-5">
            <BrandVoiceForm
              ref={formRef}
              initial={draftVoice}
              saved={brandVoice}
              onSave={handleSave}
              onRegenerate={handleRegenerate}
              dirtyChange={setDirty}
            />
          </section>
        )}

        {!draftVoice && generateState === "idle" && (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Provide at least one input and click Generate to extract the brand voice.
          </div>
        )}

        {generateState !== "idle" && (
          <GenerateOverlay
            state={generateState}
            loadingTitle="Extracting brand voice…"
            loadingHint="AI is reading your inputs. Usually takes 10–20 seconds."
            errorTitle="Brand voice extraction failed"
            error={generateError ?? undefined}
            onRetry={generate}
            onSkip={() => setGenerateState("idle")}
          />
        )}
      </div>

      <Dialog open={confirmRegenOpen} onOpenChange={(o) => !o && setConfirmRegenOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Discard unsaved edits?</DialogTitle>
            <DialogDescription>
              You have unsaved changes in the form. Regenerating will let you edit input and rebuild the brand voice — your current edits are kept until you save or generate again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmRegenOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRegenerate}>Edit inputs</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
