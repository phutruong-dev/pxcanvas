// Runtime validation for wireframe meta.json (per-variation) and library.json (catalog).
// No Zod dep — manual type guards keep this lib lean.

import { SECTION_TYPES, type SectionType, type WireframeMeta, type WireframeSlot, type LibraryCatalog } from "@/lib/types/wireframe"

const SLOT_VALUE_TYPES = ["text", "image", "icon", "button", "list"] as const

function isString(v: unknown): v is string {
  return typeof v === "string"
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every(isString)
}

function isSectionType(v: unknown): v is SectionType {
  return isString(v) && (SECTION_TYPES as readonly string[]).includes(v)
}

function isSlot(v: unknown): v is WireframeSlot {
  if (!v || typeof v !== "object") return false
  const o = v as Record<string, unknown>
  if (!isString(o.key)) return false
  if (!isString(o.type) || !(SLOT_VALUE_TYPES as readonly string[]).includes(o.type)) return false
  if (typeof o.required !== "boolean") return false
  if (!isString(o.description)) return false
  if (o.maxChars !== undefined && typeof o.maxChars !== "number") return false
  if (o.repeatGroup !== undefined && !isString(o.repeatGroup)) return false
  if (o.repeatIndex !== undefined && typeof o.repeatIndex !== "number") return false
  return true
}

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: string[] }

export function validateWireframeMeta(input: unknown): ValidationResult<WireframeMeta> {
  const errors: string[] = []
  if (!input || typeof input !== "object") {
    return { ok: false, errors: ["meta.json must be an object"] }
  }
  const o = input as Record<string, unknown>

  if (!isString(o.id)) errors.push("id must be string")
  if (!isSectionType(o.type)) errors.push(`type must be one of: ${SECTION_TYPES.join(", ")}`)
  if (typeof o.variation !== "number" || o.variation < 1) errors.push("variation must be positive number")
  if (!isString(o.sourceImage)) errors.push("sourceImage must be string")
  if (!isString(o.htmlPath)) errors.push("htmlPath must be string")
  if (o.previewImage !== undefined && !isString(o.previewImage)) errors.push("previewImage must be string if present")
  if (!Array.isArray(o.slots) || !o.slots.every(isSlot)) errors.push("slots must be WireframeSlot[]")
  if (!isString(o.layout)) errors.push("layout must be string")
  if (!isStringArray(o.tags)) errors.push("tags must be string[]")
  if (typeof o.approved !== "boolean") errors.push("approved must be boolean")
  if (typeof o.frozen !== "boolean") errors.push("frozen must be boolean")
  if (!isString(o.libraryVersion)) errors.push("libraryVersion must be string (semver)")
  if (!isString(o.generatedAt)) errors.push("generatedAt must be ISO string")
  if (!isString(o.generatedBy)) errors.push("generatedBy must be string (model id)")
  if (o.notes !== undefined && !isString(o.notes)) errors.push("notes must be string if present")

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, data: o as unknown as WireframeMeta }
}

export function validateLibraryCatalog(input: unknown): ValidationResult<LibraryCatalog> {
  const errors: string[] = []
  if (!input || typeof input !== "object") {
    return { ok: false, errors: ["library.json must be an object"] }
  }
  const o = input as Record<string, unknown>
  if (!isString(o.version)) errors.push("version must be string (semver)")
  if (!isString(o.generatedAt)) errors.push("generatedAt must be ISO string")
  if (!o.sections || typeof o.sections !== "object") {
    errors.push("sections must be object")
    return { ok: false, errors }
  }

  const sections = o.sections as Record<string, unknown>
  for (const [key, val] of Object.entries(sections)) {
    if (!isSectionType(key)) {
      errors.push(`unknown section type: ${key}`)
      continue
    }
    if (!val || typeof val !== "object") {
      errors.push(`sections.${key} must be object`)
      continue
    }
    const s = val as Record<string, unknown>
    if (typeof s.total !== "number") errors.push(`sections.${key}.total must be number`)
    if (typeof s.approved !== "number") errors.push(`sections.${key}.approved must be number`)
    if (typeof s.frozen !== "number") errors.push(`sections.${key}.frozen must be number`)
    if (!Array.isArray(s.variations)) errors.push(`sections.${key}.variations must be array`)
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, data: o as unknown as LibraryCatalog }
}

// Helper: format variation id from type + number.
// Convention: folder name = source JPG stem (e.g. "feature-section-20"), no zero-padding.
export function formatVariationId(type: SectionType, variation: number): string {
  return `${type}-${variation}`
}

export function parseVariationId(id: string): { type: SectionType; variation: number } | null {
  // "feature-section-007" → split at last hyphen
  const lastDash = id.lastIndexOf("-")
  if (lastDash === -1) return null
  const typeStr = id.slice(0, lastDash)
  const numStr = id.slice(lastDash + 1)
  if (!isSectionType(typeStr)) return null
  const variation = parseInt(numStr, 10)
  if (!Number.isFinite(variation) || variation < 1) return null
  return { type: typeStr, variation }
}
