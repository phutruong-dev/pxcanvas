// Wireframe Library types — v1.0
//
// Library = static template asset. Built once via Track A (Library Builder CLI),
// consumed at runtime by Track B (project app compose).
//
// SectionType enum is the source of truth for which sections the library knows about.
// Adding a new type = code change (hardcoded for type-safety + autocomplete).

export const SECTION_TYPES = [
  "hero",
  "feature-section",
  "header",
  "footer",
  "faq",
  "testimonials",
  "cta",
  "blog",
  "pricing",
  "logo-cloud",
  "stats",
  "team",
  "contact",
  "gallery",
] as const

export type SectionType = (typeof SECTION_TYPES)[number]

export type SlotValueType = "text" | "image" | "icon" | "button" | "list"

export type WireframeSlot = {
  key: string                  // "headline", "feature-1-title", "cta-primary"
  type: SlotValueType
  required: boolean
  description: string          // hint cho content mapping + AI prompt
  maxChars?: number            // soft limit cho text slot
  repeatGroup?: string         // "feature" — slot thuộc group lặp lại
  repeatIndex?: number         // 1-based, đi cùng repeatGroup
}

export type WireframeVariation = {
  id: string                   // "feature-section-001"
  type: SectionType
  variation: number            // 1..N
  sourceImage: string          // relative path → "wireframe-design/feature-section/featuresection1.jpg"
  htmlPath: string             // relative path → "wireframe-library/feature-section/001/index.html"
  previewImage?: string        // optional thumbnail path
  slots: WireframeSlot[]
  layout: string               // short tag: "split-image-2col", "centered-text-3card-grid"
  tags: string[]               // ["minimal", "image-heavy", "dark"]
  approved: boolean
  frozen: boolean              // true = locked, không regen
  libraryVersion: string       // semver of library at generation time
  generatedAt: string          // ISO 8601
  generatedBy: string          // model ID
  notes?: string
}

// Per-section meta.json schema (file mỗi variation lưu)
export type WireframeMeta = Omit<WireframeVariation, "type" | "variation"> & {
  type: SectionType
  variation: number
}

// Library catalog — root index file
export type LibraryCatalog = {
  version: string              // library semver — bump khi đổi slot schema = breaking
  generatedAt: string          // ISO 8601 of last build
  sections: Partial<Record<SectionType, LibrarySectionIndex>>
}

export type LibrarySectionIndex = {
  total: number                // tổng variation generated
  approved: number             // số variation approved
  frozen: number               // số variation frozen
  variations: WireframeVariation[]
}

// Per-variation status từ catalog scan (so sánh source JPG vs library output)
export type VariationStatus = "pending" | "generated" | "approved" | "frozen"

export type CatalogScanResult = {
  type: SectionType
  total: number                // tổng JPG nguồn
  generated: number
  approved: number
  frozen: number
  items: CatalogScanItem[]
}

export type CatalogScanItem = {
  sourceImage: string
  variation: number
  status: VariationStatus
  variationId: string
}

// Batch runner state (Phase 13)
export type BatchRunStatus = "idle" | "running" | "paused" | "done" | "failed"

export type BatchRunState = {
  type: SectionType
  total: number
  completed: number
  failed: { variation: number; error: string }[]
  current?: number
  status: BatchRunStatus
  startedAt?: string
}
