import { cn } from "@/lib/utils"

const STEPS = ["Input & Analysis", "Sitemap Canvas", "Brand Voice", "Generate Content"]

type Props = {
  current: 1 | 2 | 3 | 4
  maxReached?: 1 | 2 | 3 | 4
  onNavigate?: (step: 1 | 2 | 3 | 4) => void
}

export default function StepIndicator({ current, maxReached, onNavigate }: Props) {
  const reached = maxReached ?? current

  return (
    <ol className="flex items-center gap-1 text-xs">
      {STEPS.map((label, i) => {
        const step = (i + 1) as 1 | 2 | 3 | 4
        const done = step < current
        const active = step === current
        const accessible = step <= reached && step !== current
        const clickable = accessible && !!onNavigate

        const badge = (
          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold transition",
              done && "bg-primary text-primary-foreground",
              active && "border-2 border-primary text-primary",
              accessible && !done && "bg-primary/20 text-primary",
              !done && !active && !accessible && "border border-muted-foreground/40 text-muted-foreground",
            )}
          >
            {done || accessible ? "✓" : step}
          </span>
        )

        return (
          <li key={step} className="flex items-center gap-1">
            {clickable ? (
              <button
                type="button"
                onClick={() => onNavigate(step)}
                className="flex items-center gap-1 rounded hover:opacity-80 transition"
                aria-label={`Go to Step ${step}: ${label}`}
              >
                {badge}
                <span className={cn("hidden sm:inline text-primary/80 hover:underline")}>
                  {label}
                </span>
              </button>
            ) : (
              <>
                {badge}
                <span
                  className={cn(
                    "hidden sm:inline",
                    active ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </>
            )}
            {i < STEPS.length - 1 && (
              <span className="mx-1 text-muted-foreground/40">›</span>
            )}
          </li>
        )
      })}
    </ol>
  )
}
