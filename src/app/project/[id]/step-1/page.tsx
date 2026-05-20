import StepIndicator from "@/components/workflow/step-indicator"

export default function Step1Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <StepIndicator current={1} />
      <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Step 1 — Input & UX Analysis (Phase 6)
      </div>
    </div>
  )
}
