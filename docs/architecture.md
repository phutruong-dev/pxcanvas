# Architecture — PXcanvas

## System Layers

```
┌─────────────────────────────────────────┐
│              Browser (UI)               │
│  React components + Zustand stores      │
│  Auto-save → localStorage (debounce 1s) │
└───────────────┬─────────────────────────┘
                │ fetch
┌───────────────▼─────────────────────────┐
│         Next.js API Routes              │
│         (src/app/api/)                  │
└───────┬───────────────────┬─────────────┘
        │                   │
┌───────▼───────┐   ┌───────▼──────────────┐
│  AI Provider  │   │  File System (Node)   │
│  (lib/ai/)    │   │  (lib/files/)         │
│               │   │                       │
│  Mode A:      │   │  fs/promises:         │
│  Claude Agent │   │  - write .md files    │
│  SDK          │   │  - export/import zip  │
│               │   │  - read prompt files  │
│  Mode B:      │   │  - check folders      │
│  Anthropic    │   └───────────────────────┘
│  API key      │
└───────────────┘
```

## Data Flow per Workflow Step

### Step 1 — UX Analysis
```
User input (URL + form)
  → POST /api/ai/ux-analysis
    → prompt-loader reads prompts/01-ux-analysis.md
    → replace {{url}}, {{form_input}} placeholders
    → call AI provider
    → return UxImprovement[]
  → render checkbox list
  → save checked items → workflow store → localStorage
```

### Step 2 — Sitemap Canvas
```
improvements[] + form data
  → POST /api/ai/sitemap
    → prompt-loader reads prompts/02-sitemap-generate.md
    → replace {{improvements}}, {{form_input}} placeholders
    → call AI provider
    → return SitemapNode tree (JSON)
  → render on React Flow canvas
  → user edits (add/delete/rename/reorder/re-parent)
    → each edit → undo stack push → debounce → localStorage
  → Export: JSON (serialize) or PNG (html-to-image)
```

### Step 3 — Brand Voice
```
User input (URL / file / text)
  → POST /api/ai/brand-voice
    → prompt-loader reads prompts/03-brand-voice-extract.md
    → replace {{brand_input}} placeholder
    → call AI provider
    → return BrandVoice { toneKeywords, principles, doExamples, dontExamples, blacklist }
  → render editable form
  → user edits → Save → workflow store → localStorage
```

### Step 4 — Generate Content
```
For each page node in sitemap:
  → POST /api/ai/sections   → propose Section[]
  → user edits section list
  → POST /api/ai/content
    → prompt-loader reads prompts/05-content-generate.md
    → replace {{page_node}}, {{sections}}, {{brand_voice}} placeholders
    → call AI provider
    → return markdown string
  → render preview + highlight blacklist words
  → POST /api/files/write-content → fs.writeFile to output folder
  → (end) POST /api/files/export-zip → JSZip → download
```

## State Persistence Strategy

| Data | Where stored | When saved |
|---|---|---|
| Projects list | `localStorage: pxcanvas:projects` | On every mutation |
| Project workflow state | `localStorage: pxcanvas:project:{id}` | Debounced 1s after each action |
| Settings | `localStorage: pxcanvas:settings` | Immediately on change |
| Generated .md files | Disk (user-chosen folder) | On generate action |
| Sitemap export | Disk (download) | On explicit export |
| Project zip | Disk (download) | On explicit export |

## Key Libraries

| Library | Role |
|---|---|
| `reactflow` | Sitemap canvas — nodes, edges, drag, zoom, pan |
| `zustand` | Client state + localStorage persist |
| `@anthropic-ai/sdk` | Mode B AI calls (Anthropic API key) |
| Claude Agent SDK | Mode A AI calls (Claude Code auth) |
| `jszip` | Export/import project .zip |
| `html-to-image` | Export canvas as PNG |
| `sonner` | Toast notifications |
| `shadcn/ui` | UI component library |
