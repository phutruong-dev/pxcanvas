# Changelog — PXcanvas

> Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
> Version schema: `0.x.0` per phase → `1.0.0` tại MVP.

---

## [Unreleased]

### Added — v1.0 Wireframe Library UNDERSTANDING catalog
- `wireframe-library/UNDERSTANDING.md` — content intent → variation lookup for Phase 16a Sitemap→Wireframe matching. Quick Index table at top (content intent + item count + has-icons/CTAs/images → variation IDs) + detailed entry per variation (Layout / When to use / Content shape / Avoid for / See also)
- Entries for `feature-section-2` (3-col bordered card grid for Key Features / Why Us / Amenities) and `feature-section-20` (badge cloud for tag list / skill list / categories)

### Changed
- `wireframe-library/AI-GENERATION-RULES.md` — Decision Flow extended to 8 steps; Step 8 mandates appending to UNDERSTANDING.md (Quick Index row + Detail block) for every new variation
- `version-1.md` Quick Start — UNDERSTANDING.md listed as critical reference file; workflow paths updated to include the Edit step

### Added — v1.0 Wireframe Library variation 2
- `wireframe-library/feature-section/feature-section-2/` — centered header + 3-col bordered card grid with 6 feature items (icon + title + body)

### Changed — v1.0 Wireframe naming convention
- Renamed 111 source JPGs: `featuresection<N>.jpg` → `feature-section-<N>.jpg` (one-time, via `git mv` preserving history)
- Renamed pilot variation folder: `wireframe-library/feature-section/020/` → `feature-section-20/`
- HTML folder name now **exactly matches** source JPG filename stem — eliminates QA cross-reference friction
- `src/lib/wireframes/meta-schema.ts` — `formatVariationId()` no longer zero-pads (returns `feature-section-2`, not `feature-section-002`)
- `scripts/wireframe-validate.ts` — folder regex now `^<type>-\d+$` (matches new convention)
- `wireframe-library/AI-GENERATION-RULES.md` — naming convention section made explicit
- `version-1.md` Quick Start — paths updated to new convention

### Added — v1.0 Wireframe Component System
- `wireframe-library/_shared/wireframe-components.css` — design system with `wf-*` classes: section/container, typography (eyebrow, h1-h5, description), buttons (primary/secondary/ghost/sizes), image/icon placeholders, cards, feature-grid, badge-list, stat, testimonial, faq, logo-cloud, checklist, form, layout helpers (stack/cluster/split/header-block)
- `wireframe-library/AI-GENERATION-RULES.md` — canonical rule sheet for AI sessions to follow when generating variations: component catalog, slot conventions, 7-step decision flow, DO/DON'T, extension policy
- `wireframe-library/feature-section/020/` — pilot variation refactored to use `wf-*` components (reference for future variations)

### Changed
- `src/lib/wireframes/html-validate.ts` — validator now loads class names from all 3 shared CSS files (pxpace + components + base), supporting BEM-style classes like `wf-foo--mod` and `wf-foo__bar`
- `version-1.md` Quick Start — points AI sessions to `AI-GENERATION-RULES.md` as primary reference
- Variation `index.html` wrapper now links `wireframe-components.css` between `pxpace.css` and `wireframe-base.css`

### Added — v1.0 Phase 12 Vision Pipeline
- `prompts/06-wireframe-from-image.md` — AI Vision prompt: slot schema + token cheatsheet + JSON output format
- `src/lib/ai/vision.ts` — multimodal wrapper: JPG→base64, prompt build, JSON parse, retry context, debug log
- `src/lib/wireframes/html-validate.ts` — pxpace.css class validator (parse CSS) + data-slot validator
- `scripts/wireframe-generate.ts` — CLI for Track A: `--type` `--variation` `--all` `--skip-existing`; retry ×2 with error feedback; writes index.html + meta.json
- `scripts/wireframe-validate.ts` — bulk library integrity checker

### Changed — v1.0 Phase 12 Vision Pipeline
- `src/lib/ai/anthropic-api.ts` — add `callAnthropicApiWithImage()` for multimodal (image+text) calls
- `src/lib/ai/prompt-loader.ts` — add `"06-wireframe-from-image"` to `PromptKey` union + `PROMPT_KEYS` array
- `package.json` — add scripts `wireframe:gen` and `wireframe:validate`

### Added — v1.0 Phase 11 Foundation
- `version-1.md` — plan for v1.0 wireframe library (Approach A: wireframe-first strict)
- `src/lib/types/wireframe.ts` — `SectionType` enum (14 types), `WireframeSlot`/`WireframeVariation`/`WireframeMeta`/`LibraryCatalog` types
- `src/lib/wireframes/slot-schema.ts` — slot definitions per section type (`feature-section`, `hero`, `cta`, `faq` fully defined; others stubbed)
- `src/lib/wireframes/token-cheatsheet.ts` — compact pxpace.css class reference for AI Vision prompts
- `src/lib/wireframes/meta-schema.ts` — runtime validators (no Zod), `formatVariationId`/`parseVariationId` helpers
- `src/lib/wireframes/library-loader.ts` — cached loader for `library.json`, empty-fallback when library not yet built
- `wireframe-library/_shared/pxpace.css` — snapshot of design tokens, locked to library version
- `wireframe-library/_shared/wireframe-base.css` — slot debug overlay + placeholder icons
- `docs/wireframe-library.md` — slot contract, folder layout, troubleshooting
- `docs/decisions/0002-wireframe-library-static.md` — ADR: build-once + commit-to-repo

### Changed
- `src/lib/types/content.ts` — `Section` extended with optional `type`, `variationId`, `contentLockedAt` (required after migration wizard in Phase 17)

---

## [1.8.0] — Free step navigation + save indicator · 2026-05-21

### Added
- `maxReachedStep` field on `Project` type — tracks highest step ever visited, never decreases when navigating back
- Save status indicator in workflow header: "Saving…" (amber) and "All changes saved" (muted) — visible on all steps

### Changed
- `src/lib/store/projects.ts` — `updateProjectStep` now uses `Math.max` to update `maxReachedStep`; `newProject` initializes `maxReachedStep: 1`
- `src/components/workflow/step-indicator.tsx` — accepts `maxReached` + `onNavigate` props; steps ≤ `maxReached` render as clickable buttons with checkmark; future steps remain dimmed/non-interactive
- `src/components/workflow/workflow-header.tsx` — forwards `maxReached`, `onNavigate`, `savingStatus` props to StepIndicator and save indicator
- `src/app/project/[id]/layout.tsx` — reads `maxReachedStep` from projects store and `savingStatus` from workflow store; passes both through to header; adds `useRouter` for step navigation

---

## [1.7.0] — Structured section content: eyebrow + headline + description · 2026-05-21

### Changed
- `src/app/api/ai/content/route.ts` — `FORMAT_RULES` updated: each section now requires a 4-part structure: `## Section Name` → `**EYEBROW LABEL**` (2–5 ALL CAPS words) → `### Main Headline` (5–12 words) → short description (1–2 sentences) → body content with `####` for cards
- `prompts/05-content-generate.md` — task instructions updated to enforce eyebrow → headline → description structure per section
- `src/lib/ai/prompt-loader.ts` — DEFAULTS["05-content-generate"] synced

---

## [1.6.0] — Step 4 redesign: 3-col layout + MD preview + per-section generate · 2026-05-21

### Added
- `src/components/step-4/sections-panel.tsx` — new center column: section list with status dots (idle/generating/done), click to select section for preview, hover to show per-section Generate/Regen button, "Edit sections" collapsible toggle, "Generate page" button
- `src/lib/utils/markdown-sections.ts` — `extractSectionFromMd`, `patchSectionInMd`, `sectionExistsInMd` utilities for section-level markdown operations
- Per-section generate: `generateSection(node, section)` calls `/api/ai/content` with one section, extracts the `## heading` block from response and patches it into the full page markdown; other sections are untouched

### Changed
- `src/app/project/[id]/step-4/page.tsx` — 3-column layout (PageList | SectionsPanel | ContentPreview); new state `selectedSectionId`, `sectionGeneratingIds`; removed old stacked SectionEditor+ContentPreview layout; clicking a page also resets selected section
- `src/components/step-4/content-preview.tsx` — replaced `<pre>` raw markdown with `react-markdown` + `remark-gfm` (proper headings, lists, bold, blockquote, etc.); accepts `selectedSection` prop to filter view to a single section; toolbar shows "Full page" / section name toggle with ✕ to clear
- Installed `react-markdown`, `remark-gfm`

---

## [1.5.0] — Generate this page button in Step 4 · 2026-05-21

### Changed
- `src/components/step-4/content-preview.tsx` — empty state now shows a "Generate this page" button instead of plain text
- `src/app/project/[id]/step-4/page.tsx` — removed duplicate button from page header; single button lives in ContentPreview empty state only

--- — Generate this page button in Step 4 · 2026-05-21

### Changed
- `src/app/project/[id]/step-4/page.tsx` — added "Generate this page" / "Regenerate" button in the selected-page header; always visible when a page is selected, disabled during batch run or when brand voice is missing
- `src/components/step-4/content-preview.tsx` — empty state (no content yet) now shows a "Generate this page" button instead of plain text

---

## [1.4.0] — UX polish: wider side panel + Auto-layout button · 2026-05-21

### Added
- `src/components/step-2/canvas-toolbar.tsx` — "Auto-layout" button (LayoutGrid icon) re-applies computed node positions and fits the viewport; useful after generating sections or adding pages

### Changed
- `src/components/step-2/side-panel.tsx` — Page Detail panel widened from `w-80` (320px) to `w-[37.5rem]` (600px)
- `src/components/step-2/sitemap-canvas.tsx` — accepts `layoutKey` prop; re-applies layout when key changes
- `src/app/project/[id]/step-2/page.tsx` — manages `layoutKey` state; passes `onAutoLayout` to toolbar and `layoutKey` to canvas

---

## [1.3.0] — Dynamic canvas layout — no more node overlap · 2026-05-21

### Changed
- `src/lib/utils/sitemap-layout.ts` — `treeToFlow` now accepts `sectionCounts: Record<string, number>` (default `{}`); added `nodeHeight(sectionCount)` export; Y positions are computed per-depth using cumulative max heights instead of a fixed `NODE_HEIGHT` constant — rows automatically space out to fit the tallest card at each depth level
- `src/components/step-2/sitemap-canvas.tsx` — subscribes to `pageContents` and derives `sectionCounts` via `useMemo`; passes counts to `treeToFlow` so layout re-computes when sections are generated; `onNodeDrag` hit-detection uses `nodeHeight()` per node instead of the old fixed constant

---

## [1.2.0] — Sections visible + drag-droppable on Canvas nodes · 2026-05-21

### Changed
- `src/components/step-2/node-card.tsx` — sections now render inline on each canvas node card as a compact list with grip handles; drag-drop to reorder sections directly on the canvas (uses `nodrag nopan` + `stopPropagation` to avoid conflict with React Flow node drag); reorder saves to store immediately with no Save button needed; replaces previous "N sections" count-only display

---

## [1.1.0] — Sections editing + Canvas indicators + Bug fixes · 2026-05-21

### Added
- `src/components/shared/section-editor.tsx` — shared SectionEditor component extracted from step-4; supports drag-reorder, add/remove, inline name+description editing, dirty-save pattern
- `src/components/step-2/side-panel.tsx` — sections are now fully editable inline (rename / add / remove / re-order + Save) in the Step 2 side-panel; replaces the previous read-only list + "Edit in Step 4" hint
- `src/components/step-2/node-card.tsx` — canvas node cards now display section count ("N sections") when a page has sections, giving at-a-glance sitemap coverage audit
- `src/lib/utils/url-fetcher.ts` — server-side HTML fetcher with SSRF guard and 5 MB cap; used by UX Analysis to resolve URLs server-side without hitting 30 s browser timeout
- `src/app/api/ai/brand-voice/route.ts` — brand voice extraction API supporting URL, uploaded file text, and free text inputs

### Changed
- `src/components/step-4/section-editor.tsx` — now re-exports from `src/components/shared/section-editor` (no logic change)
- `src/lib/types/content.ts` — `Section` type gains mandatory `description: string` field
- `prompts/04-sections-propose.md` — rewritten with CCD-anchored section rules: MUST/SHOULD mandatory sections per page type (Home, About, Pricing, Contact, FAQ); each section returns `{id, name, description}`
- `prompts/05-content-generate.md` — `{{sections}}` placeholder now receives `name: description` format for richer content generation context
- `src/app/api/ai/sections/route.ts` — normalizes `description` field (fallback `""`) so missing field does not crash
- `src/app/api/ai/content/route.ts` — passes `- name: description` per section to generation prompt
- `src/app/api/ai/ux-analysis/route.ts` — fetches URL server-side via `url-fetcher.ts`; UX Analysis now works on any public URL without timeout
- `prompts/01-ux-analysis.md` — updated to focus improvements on sitemap/architecture level aligned with Conversion-Centered Design (CCD) principles
- `src/lib/ai/claude-agent.ts` — default timeout raised to 120 s; configurable via `CLAUDE_AGENT_TIMEOUT_MS` env var
- `src/app/project/[id]/layout.tsx` — added `hydrated` guard to fix SSR hydration mismatch when Zustand persist not yet rehydrated
- `src/app/project/[id]/step-1/page.tsx` — split combined settings selector into 4 individual primitive selectors to fix Maximum update depth infinite render loop
- `src/app/globals.css` — switched font to Inter (better CJK + Latin support)
- `src/app/layout.tsx` — loads Inter from `next/font/google`
- `start.bat` — launch script for opening the app with one double-click; uses goto labels to avoid parenthesis syntax error in IF blocks

---

## [1.0.0] — Phase 10: Settings UI + Polish · MVP — 2026-05-21

### Added
- Settings page (`/settings`) — 3 Card sections: AI Provider, Output Folder, Prompt Files
- `src/components/settings/ai-provider.tsx` — Mode A/B toggle, sdkDetected badge with re-check, masked API key (`type="password"` + eye toggle), model select (Sonnet/Opus/Haiku), debug logging toggle, Test connection with ephemeral status badge (auto-clears on input change)
- `src/components/settings/output-folder.tsx` — path input with onBlur check (`noCreate:true`, read-only), "Ensure folder" button (mkdir), writable/exists badges
- `src/components/settings/prompt-files.tsx` — 5-row status grid (ok/missing) + "Restore default" per file + "Restore all defaults"
- `src/components/first-run/wizard.tsx` + `first-run-gate.tsx` — Dialog modal mounted in root layout; shows only when neither SDK detected nor API key set and not previously dismissed
- Error boundaries: `src/app/error.tsx` (route-level), `src/app/global-error.tsx` (root fallback), `src/app/project/[id]/error.tsx` (project step)

### Changed
- `src/lib/types/settings.ts` — added `dismissedFirstRun: boolean` field
- `src/lib/store/settings.ts` — added `setDismissedFirstRun` action
- `src/lib/ai/prompt-loader.ts` — exported `PROMPT_KEYS`; `ensurePromptFile(key, force?)` and `ensureAllPromptFiles(force?)` now support force-overwrite
- `src/app/api/prompts/ensure-defaults/route.ts` — extended payload `{force?, key?}`; `force:true` requires explicit `key` (PromptKey or "all")
- `src/app/api/files/check-folder/route.ts` — added `noCreate` flag for read-only existence check
- `src/app/api/health/route.ts` — prompt status keys no longer include `.md` suffix
- `src/app/layout.tsx` — mounted `<FirstRunGate />`
- `docs/troubleshooting.md` — expanded with Phase 5-9 edge cases (file upload, batch generation, write-to-folder, import-zip)
- `README.md` — updated MVP status, expanded scripts table, workflow steps, folder structure

---

## [0.9.0] — Phase 9: Generate Content + Zip — 2026-05-21

### Added
- Step 4 page (`/project/[id]/step-4`) — full batch content generation with per-page section editing + content preview
- API `/api/ai/sections` — calls `04-sections-propose`, returns ordered `Section[]` per page
- API `/api/ai/content` — calls `05-content-generate` with brand voice + sections + format rules, returns raw markdown
- API `/api/files/check-folder` — verifies path is writable; creates directory if missing
- API `/api/files/write-content` — writes `{slug}.md` to output folder; returns `{path, existed}` for overwrite detection
- API `/api/files/export-zip` — assembles JSZip with `meta.json + sitemap.json + brand-voice.json + brand-voice.md + pages/*.md`; returns binary zip
- API `/api/files/import-zip` — parses uploaded `.zip`, validates `meta.json`, reconstructs sitemap/brandVoice/pageContents
- `src/components/step-4/page-list.tsx` — sidebar with depth-indented pages, status badges, per-row error retry
- `src/components/step-4/section-editor.tsx` — HTML5 drag-to-reorder sections, add/remove, inline rename
- `src/components/step-4/content-preview.tsx` — `<pre>` markdown display with blacklist word highlight (yellow), copy to clipboard, regenerate CTA
- `src/components/step-4/batch-progress.tsx` — progress bar, Cancel button (AbortController ref), failed-pages retry list
- `src/components/step-4/overwrite-modal.tsx` — M-03: Overwrite / Skip / Rename (slug input)
- Home page "Import" button wired to `/api/files/import-zip` → creates project → routes to step-4

### Changed
- `src/app/page.tsx` — added import ZIP flow (file input + fetch + addProject + setSitemap/setBrandVoice/setPageContent)

---

## [0.8.0] — Phase 8: Brand Voice — 2026-05-21

### Added
- Step 3 page (`/project/[id]/step-3`) — Brand Voice extraction + editor
- API `/api/ai/brand-voice` — calls `03-brand-voice-extract` prompt, returns normalized `BrandVoice`
- `src/components/step-3/brand-voice-input.tsx` — URL + drag-drop file upload (.md/.txt, ≤10MB, client-side `FileReader.readAsText`) + free text + Generate
- `src/components/step-3/brand-voice-form.tsx` — 5-field editor: 3 fixed tone keywords, principles textarea, do/don't example rows (1–5, add/remove), blacklist chip input. Local dirty tracking + per-field save validation with focus+scroll
- `src/components/step-3/brand-voice-summary.tsx` — collapsed input summary after save
- `src/components/shared/generate-overlay.tsx` — parameterized overlay (loading/error titles, retry/skip) — promoted from `step-2/` for reuse
- `docs/decisions/0001-pdf-parsing-deferred.md` — ADR explaining MVP drops PDF support (pdf-parse Next.js footgun, pdfjs-dist bundle bloat)

### Changed
- `src/app/project/[id]/step-2/page.tsx` — imports `GenerateOverlay` from `shared/`, passes step-specific labels

### Removed
- `src/components/step-2/generate-overlay.tsx` — replaced by shared version

---

## [0.7.0] — Phase 7: Sitemap Canvas — 2026-05-21

### Added
- Step 2 page (`/project/[id]/step-2`) — React Flow sitemap canvas + side panel + toolbar
- API `/api/ai/sitemap` — calls `02-sitemap-generate` prompt, returns normalized `SitemapNode` tree
- `src/lib/utils/sitemap-layout.ts` — pure `treeToFlow(root)` (Reingold-Tilford-lite top-down) + `countNodes` + `flattenTree`
- `src/lib/hooks/use-sitemap-mutations.ts` — undo-aware wrapper hook (snapshot → push → mutate) + Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y keyboard handlers
- `src/components/step-2/` — `sitemap-canvas`, `node-card`, `side-panel`, `canvas-toolbar`, `generate-overlay`, `export-modal`, `canvas-context`
- Node interactions: add child (+), select, rename, edit description, delete (confirm modal if has children), sibling reorder (↑↓), drag re-parent (block descendant via `reparentNode` cycle check)
- Auto-generate sitemap on entering Step 2 with empty state
- Regenerate chip in toolbar when `<3` total nodes
- Export modal (M-02): JSON download + PNG via `html-to-image`
- Save indicator: `savingStatus: "idle" | "pending" | "saved"` surfaced in workflow store; toolbar shows live status

### Changed
- `src/lib/store/workflow.ts` — added `reorderSibling(nodeId, direction)`, added `savingStatus` field, inlined debounce inside the store so `pending → saved` transitions are observable, strip `savingStatus` from localStorage serialization

---

## [0.6.0] — Phase 6: Step 1 — Input & UX Analysis — 2026-05-20

### Added
- Workflow shell `src/app/project/[id]/layout.tsx` — StepIndicator + sticky header + per-route step tracking
- Step 1 page (`/project/[id]/step-1`) — 3-stage flow (input → analyzing → results)
- `src/components/step-1/input-form.tsx` — URL + site type + 3 textareas + tone chips + validation
- `src/components/step-1/ux-improvements-list.tsx` — checkbox items, loading, error/retry, skip
- API `/api/ai/ux-analysis` — calls `01-ux-analysis` prompt, returns `UxImprovement[]`
- Edge case handling: URL fail still runs; AI returns 0 improvements → message; AI fail → retry/skip
- "Continue" persists state to workflow store and routes to `/step-2`

---

## [0.5.0] — Phase 5: Home & Project Lifecycle — 2026-05-20

### Added
- Home page (`src/app/page.tsx`) — project grid + empty state + localStorage quota warning
- `src/components/home/project-card.tsx` — card with 3-dot menu (Rename inline / Duplicate / Delete)
- `src/components/home/new-project-modal.tsx` — modal with auto-suffix `(2)` for duplicate names
- `src/components/home/empty-state.tsx` — first-time user CTA
- `src/components/home/top-bar.tsx` — logo + "New Project" + Import (wire deferred to Phase 9) + Settings icon
- `src/components/ui/delete-confirm-modal.tsx` — reusable confirmation dialog
- Click card → router push `/project/[id]/step-{currentStep}`

---

## [0.4.0] — Phase 4: AI Provider Abstraction & Prompts — 2026-05-20

### Added
- `src/lib/ai/provider.ts` — single `callAI(promptKey, vars, options)` entry point
- `src/lib/ai/claude-agent.ts` — Mode A: spawn `claude` CLI subprocess with 30s timeout
- `src/lib/ai/anthropic-api.ts` — Mode B: `@anthropic-ai/sdk` direct calls
- `src/lib/ai/detect.ts` — `execSync claude --version` runtime detection
- `src/lib/ai/prompt-loader.ts` — read prompts from disk, replace `{{vars}}`, auto-regen if missing
- API `/api/ai/test-connection` — per-mode connection test
- API `/api/prompts/ensure-defaults` — restore missing prompt files
- API `/api/health` (bonus) — provider + prompt status
- API `/api/dev/regenerate-prompts` (dev-only bonus) — force regen for testing
- 5 prompt files seeded under `prompts/`

---

## [0.3.0] — Phase 3: State Management & Persistence — 2026-05-20

### Added
- `src/lib/store/projects.ts` — list, add, rename, delete, duplicate, get-by-id + zustand persist
- `src/lib/store/workflow.ts` — per-project state, dynamic localStorage key, 1s debounce, tree helpers
- `src/lib/store/settings.ts` — provider mode, API key, output folder, model, debug logging
- `src/lib/store/undo-redo.ts` — stack max 20, push/undo/redo with deep clone
- `src/lib/utils/debounce.ts` — generic debounce util

---

## [0.2.0] — Phase 2: Data Model & Type Layer — 2026-05-20

### Added
- `src/lib/types/project.ts` — `Project`, `ProjectZipMeta`
- `src/lib/types/sitemap.ts` — `SitemapNode`
- `src/lib/types/brand-voice.ts` — `BrandVoice`
- `src/lib/types/content.ts` — `Section`, `PageContent`, `PageContentStatus`
- `src/lib/types/settings.ts` — `Settings`, `AIProvider`, `DEFAULT_SETTINGS`
- `src/lib/types/ux-analysis.ts` — `UxImprovement`, `FormInput`, `SiteType`

---

## [0.1.0] — Phase 1: Foundation — 2026-05-20

### Added
- Next.js 15 (App Router) + TypeScript + Tailwind CSS scaffold
- shadcn/ui setup với components: button, input, textarea, dialog, dropdown-menu, card, badge, checkbox, tabs, separator, sonner, label, select
- Dependencies: zustand, reactflow, jszip, html-to-image, @anthropic-ai/sdk, sonner
- Folder skeleton: docs/, prompts/, logs/, pages-output/, src/app/api/, src/components/, src/lib/
- `CLAUDE.md` — AI entry point, rules, tech stack, folder map
- `README.md` — user-facing setup guide
- `CHANGELOG.md` — this file
- `docs/architecture.md` — system layers + data flow diagrams
- `docs/data-model.md` — tất cả TypeScript types (Project, SitemapNode, BrandVoice, UxImprovement, Section, PageContent, Settings, ProjectZipMeta)
- `docs/ai-prompts.md` — 5 prompt files spec, placeholders, expected output format
- `docs/api-routes.md` — inventory tất cả API routes
- `docs/state-management.md` — Zustand store map + patterns
- `docs/conventions.md` — coding conventions, import order, error handling
- `docs/troubleshooting.md` — common errors + fixes
- `.env.local.example` — template cho API key
- `_reference/` — Villa T content moved as pilot/reference data
- `AGENTS.md` — auto-generated by create-next-app

### Notes
- Phase 0 (folder restructure) hoàn thành trước Phase 1: Villa T content moved to `_reference/villa-t/`
- `npm run dev` → trang trắng (chưa có UI) — Phase 5 sẽ build Home screen

---

## [0.0.0] — Phase 0: Folder Restructure — 2026-05-20

### Changed
- Tách Villa T content project ra khỏi root
- `CLAUDE.md` (Villa T rules) → `_reference/villa-t/villa-content-rules.md`
- `_foundations/`, `_templates/`, `pages/`, `sitemap.md`, `plan.md`, `README.md` → `_reference/villa-t/`
- Tạo stub `CLAUDE.md` và `README.md` mới cho PXcanvas app
