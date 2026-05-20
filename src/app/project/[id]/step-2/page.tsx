import StepIndicator from "@/components/workflow/step-indicator"

export default function Step2Page() {
  return (
    <div className="px-6 py-8">
      <StepIndicator current={2} />
      <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Step 2 — Sitemap Canvas (Phase 7)
      </div>
    </div>
  )
}
