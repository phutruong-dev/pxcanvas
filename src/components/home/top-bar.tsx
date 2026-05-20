import Link from "next/link"
import { Settings, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  onNew: () => void
  onImport?: () => void
}

export default function TopBar({ onNew, onImport }: Props) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <span className="text-base font-semibold tracking-tight">PXcanvas</span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onImport}
            disabled={!onImport}
            className="gap-1.5"
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button size="sm" onClick={onNew}>
            New Project
          </Button>
          <Link href="/settings">
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
