import { cn } from "@/lib/utils"

const STEPS = ["Input & Analysis", "Sitemap Canvas", "Brand Voice", "Generate Content"]

type Props = { current: 1 | 2 | 3 | 4 }

export default function StepIndicator({ current }: Props) {
  return (
    <ol className="flex items-center gap-1 text-xs">
      {STEPS.map((label, i) => {
        const step = (i + 1) as 1 | 2 | 3 | 4
        const done = step < current
        const active = step === current
        return (
          <li key={step} className="flex items-center gap-1">
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                done && "bg-primary text-primary-foreground",
                active && "border-2 border-primary text-primary",
                !done && !active && "border border-muted-foreground/40 text-muted-foreground"
              )}
            >
              {done ? "✓" : step}
            </span>
            <span
              className={cn(
                "hidden sm:inline",
                active ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="mx-1 text-muted-foreground/40">›</span>
            )}
          </li>
        )
      })}
    </ol>
  )
}
