# Code Conventions — PXcanvas

## File & Folder Naming

| Type | Convention | Example |
|---|---|---|
| React component | `kebab-case.tsx` | `project-card.tsx` |
| Zustand store | `kebab-case.ts` | `projects.ts` |
| Lib / util | `kebab-case.ts` | `prompt-loader.ts` |
| Type file | `kebab-case.ts` | `brand-voice.ts` |
| Next.js API route | `route.ts` (always) | `src/app/api/ai/sitemap/route.ts` |
| Next.js page | `page.tsx` (always) | `src/app/project/[id]/step-1/page.tsx` |
| Next.js layout | `layout.tsx` (always) | `src/app/project/[id]/layout.tsx` |

## Component Structure

```tsx
// 1. Imports — external first, then internal
import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/types/project"

// 2. Types (local to file)
type Props = { project: Project }

// 3. Component — default export always
export default function ProjectCard({ project }: Props) {
  // hooks first
  const [open, setOpen] = useState(false)

  // handlers
  function handleDelete() { ... }

  // render
  return (...)
}
```

## Imports Order
1. React and Next.js built-ins
2. External packages (zustand, reactflow, ...)
3. shadcn/ui components (`@/components/ui/...`)
4. Local components (`@/components/...`)
5. Lib / utils (`@/lib/...`)
6. Types (`@/lib/types/...`)

## TypeScript Rules

- Always explicit return type on API route handlers.
- Use `type` (not `interface`) for data shapes; `interface` for extension patterns.
- No `any`. Use `unknown` + type guard or proper type.
- Zod for external data only (AI response, zip import). Internal data trusts types.

## Zustand Store Pattern

```ts
// lib/store/projects.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Project } from "@/lib/types/project"

type ProjectsStore = {
  projects: Project[]
  addProject: (name: string) => void
  // ...
}

export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set, get) => ({
      projects: [],
      addProject: (name) => set((s) => ({ projects: [...s.projects, newProject(name)] })),
    }),
    { name: "pxcanvas:projects" }
  )
)
```

## API Route Pattern

```ts
// src/app/api/ai/sitemap/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json()
    // validate input
    // call AI or file ops
    return NextResponse.json({ data: result })
  } catch (err) {
    return NextResponse.json({ error: "..." }, { status: 500 })
  }
}
```

## Error Handling

- API routes: always catch + return `{ error: string }` with appropriate status.
- UI: show `sonner` toast for user-facing errors. Log raw error to console.
- Never `throw` from a Zustand action — handle inline.
- Loading state: local `useState` (not in store) unless shared across components.

## Toast Pattern

```ts
import { toast } from "sonner"

// Success
toast.success("Brand voice saved")

// Error
toast.error("AI call failed — try again")

// Warning (storage)
toast.warning("Storage almost full — export project to free space")
```

## Comments

- No comments by default. Add only when WHY is non-obvious.
- No JSDoc on simple functions. Only on complex AI prompt builders.
- No "TODO" in committed code — put them in MVP-plan.md instead.

## shadcn/ui & Colors

- **Luôn dùng shadcn/ui components** cho mọi UI element: Button, Input, Dialog, Card, Badge, Checkbox, Select, Tabs, Separator, Sonner, Label, Textarea, DropdownMenu.
- **Màu mặc định (default palette)** — không override CSS variables trong `globals.css` trừ khi user yêu cầu rõ ràng.
- **Không custom theme** — không tạo file `theme.ts`, không đổi `--primary`, `--background`, v.v.
- Nếu cần màu semantic: dùng class `text-destructive`, `text-muted-foreground`, `bg-muted`, `border`, v.v. theo hệ shadcn.
- Icon: dùng `lucide-react` (đã cài kèm shadcn).

## Tailwind

- Desktop-only layout (1280px+). Không optimize mobile.
- No inline styles. Tailwind classes only.
- Use `cn()` from `@/lib/utils` for conditional classes.
- Class order: layout → sizing → spacing → typography → color → border → effects.
