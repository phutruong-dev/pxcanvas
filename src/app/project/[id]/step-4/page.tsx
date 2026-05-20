import StepIndicator from "@/components/workflow/step-indicator"

export default function Step4Page() {
  return (
    <div className="px-6 py-8">
      <StepIndicator current={4} />
      <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Step 4 — Generate Content (Phase 9)
      </div>
    </div>
  )
}
