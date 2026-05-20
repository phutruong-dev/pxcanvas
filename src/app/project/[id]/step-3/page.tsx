import StepIndicator from "@/components/workflow/step-indicator"

export default function Step3Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <StepIndicator current={3} />
      <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Step 3 — Brand Voice (Phase 8)
      </div>
    </div>
  )
}
