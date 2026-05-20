import { FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = { onNew: () => void }

export default function EmptyState({ onNew }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FolderOpen className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-medium">No projects yet</p>
        <p className="text-sm text-muted-foreground">
          Create your first project to start building wireframe-ready content.
        </p>
      </div>
      <Button onClick={onNew}>Create your first project</Button>
    </div>
  )
}
