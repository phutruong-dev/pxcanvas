// Library catalog loader — server-side only.
// Reads `wireframe-library/library.json` and caches in-memory.
//
// Track B (project app compose) calls `loadLibrary()` per request.
// Library file is static (committed to repo), but we re-read mtime to allow hot-reload in dev.

import fs from "fs/promises"
import path from "path"
import { validateLibraryCatalog } from "./meta-schema"
import type { LibraryCatalog, SectionType, WireframeVariation } from "@/lib/types/wireframe"

const LIBRARY_DIR_NAME = "wireframe-library"
const LIBRARY_JSON_FILENAME = "library.json"

const EMPTY_CATALOG: LibraryCatalog = {
  version: "0.0.0",
  generatedAt: new Date(0).toISOString(),
  sections: {},
}

type CacheEntry = {
  mtimeMs: number
  catalog: LibraryCatalog
}

let cache: CacheEntry | null = null

function libraryRoot(): string {
  return path.join(process.cwd(), LIBRARY_DIR_NAME)
}

function libraryJsonPath(): string {
  return path.join(libraryRoot(), LIBRARY_JSON_FILENAME)
}

/**
 * Load and cache the library catalog.
 * Returns an empty catalog (no error) when library.json does not exist yet —
 * lets Phase 11/12 boot before Track A has produced anything.
 */
export async function loadLibrary(): Promise<LibraryCatalog> {
  const jsonPath = libraryJsonPath()
  let stat
  try {
    stat = await fs.stat(jsonPath)
  } catch {
    return EMPTY_CATALOG
  }

  if (cache && cache.mtimeMs === stat.mtimeMs) {
    return cache.catalog
  }

  const raw = await fs.readFile(jsonPath, "utf-8")
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    throw new Error(`Invalid JSON in ${jsonPath}: ${(err as Error).message}`)
  }

  const result = validateLibraryCatalog(parsed)
  if (!result.ok) {
    throw new Error(`Library catalog validation failed:\n - ${result.errors.join("\n - ")}`)
  }

  cache = { mtimeMs: stat.mtimeMs, catalog: result.data }
  return result.data
}

/** Clear cache (test/dev use). */
export function clearLibraryCache(): void {
  cache = null
}

/** All variations of a given section type, filtered to approved+frozen by default. */
export async function getVariations(
  type: SectionType,
  opts: { approvedOnly?: boolean } = {},
): Promise<WireframeVariation[]> {
  const { approvedOnly = true } = opts
  const catalog = await loadLibrary()
  const entry = catalog.sections[type]
  if (!entry) return []
  return approvedOnly ? entry.variations.filter((v) => v.approved) : entry.variations
}

/** Find a single variation by its id (e.g. "feature-section-007"). */
export async function getVariation(id: string): Promise<WireframeVariation | null> {
  const catalog = await loadLibrary()
  for (const entry of Object.values(catalog.sections)) {
    if (!entry) continue
    const hit = entry.variations.find((v) => v.id === id)
    if (hit) return hit
  }
  return null
}

/** Compact summary for AI prompt 04 (sections-propose). */
export type LibraryCatalogSummary = Array<{
  type: SectionType
  variations: Array<{ id: string; layout: string; tags: string[] }>
}>

export async function getLibrarySummaryForPrompt(): Promise<LibraryCatalogSummary> {
  const catalog = await loadLibrary()
  const out: LibraryCatalogSummary = []
  for (const [type, entry] of Object.entries(catalog.sections)) {
    if (!entry) continue
    const approved = entry.variations.filter((v) => v.approved)
    if (approved.length === 0) continue
    out.push({
      type: type as SectionType,
      variations: approved.map((v) => ({
        id: v.id,
        layout: v.layout,
        tags: v.tags,
      })),
    })
  }
  return out
}
