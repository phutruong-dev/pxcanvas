// Track A Vision pipeline — converts wireframe JPG → HTML using Claude multimodal.
// Only called from scripts/wireframe-generate.ts (CLI), never from user-facing API routes.

import fs from "fs/promises"
import path from "path"
import { loadPrompt } from "./prompt-loader"
import { callAnthropicApiWithImage, type ImageMediaType } from "./anthropic-api"
import { getSlotSchema, getRequiredSlots } from "@/lib/wireframes/slot-schema"
import { PXPACE_TOKEN_CHEATSHEET } from "@/lib/wireframes/token-cheatsheet"
import type { SectionType, WireframeSlot } from "@/lib/types/wireframe"

export type VisionResult = {
  html: string
  layout: string
  tags: string[]
  slotsUsed: string[]
}

type VisionOptions = {
  imagePath: string        // absolute path to source JPG
  sectionType: SectionType
  variation: number
  apiKey: string
  model?: string
  debugLogging?: boolean
  previousErrors?: string[]  // injected on retry
}

const DEFAULT_MODEL = "claude-sonnet-4-6"
const LOGS_DIR = path.join(process.cwd(), "logs")

export async function callVision(opts: VisionOptions): Promise<VisionResult> {
  const model = opts.model ?? DEFAULT_MODEL
  const slots = getSlotSchema(opts.sectionType)
  const requiredSlots = getRequiredSlots(opts.sectionType)

  const slotSchemaText = formatSlotSchema(slots)
  const requiredSlotsText = formatRequiredSlots(requiredSlots)
  const previousErrors = opts.previousErrors?.length
    ? `\n\n## CORRECTION REQUIRED (previous attempt failed)\n\nDo NOT repeat these mistakes:\n${opts.previousErrors.map((e) => `- ${e}`).join("\n")}\n`
    : ""

  const prompt = await loadPrompt("06-wireframe-from-image", {
    section_type: opts.sectionType,
    slot_schema: slotSchemaText,
    required_slots: requiredSlotsText,
    token_cheatsheet: PXPACE_TOKEN_CHEATSHEET,
    previous_errors: previousErrors,
  })

  const imageBuffer = await fs.readFile(opts.imagePath)
  const imageBase64 = imageBuffer.toString("base64")
  const mimeType = getMimeType(opts.imagePath)

  const raw = await callAnthropicApiWithImage(prompt, imageBase64, mimeType, model, opts.apiKey)

  if (opts.debugLogging) {
    await writeVisionLog(opts.sectionType, opts.variation, opts.imagePath, prompt, raw)
  }

  return parseVisionResponse(raw)
}

function formatSlotSchema(slots: WireframeSlot[]): string {
  if (slots.length === 0) return "(no slots defined for this type yet)"
  return slots.map((s) => {
    const parts = [`- \`${s.key}\` (${s.type}${s.required ? ", REQUIRED" : ", optional"})`]
    if (s.maxChars) parts[0] += `, ≤${s.maxChars} chars`
    if (s.repeatGroup) parts[0] += `, repeat group "${s.repeatGroup}"`
    parts.push(`  ${s.description}`)
    return parts.join("\n")
  }).join("\n")
}

function formatRequiredSlots(slots: WireframeSlot[]): string {
  if (slots.length === 0) return "(none — all slots are optional for this type)"
  return slots.map((s) => `- \`${s.key}\``).join("\n")
}

function getMimeType(filePath: string): ImageMediaType {
  const ext = path.extname(filePath).toLowerCase()
  const map: Record<string, ImageMediaType> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  }
  return map[ext] ?? "image/jpeg"
}

export function parseVisionResponse(raw: string): VisionResult {
  // Strip markdown fences if present
  let clean = raw.trim()
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```[a-z]*\n?/, "").replace(/```\s*$/, "").trim()
  }

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(clean) as Record<string, unknown>
  } catch {
    throw new Error(`Response is not valid JSON. Got:\n${raw.slice(0, 500)}`)
  }

  if (typeof parsed.html !== "string" || !parsed.html.trim()) {
    throw new Error(`Response missing "html" field`)
  }
  if (typeof parsed.layout !== "string" || !parsed.layout.trim()) {
    throw new Error(`Response missing "layout" field`)
  }
  if (!Array.isArray(parsed.tags)) {
    throw new Error(`Response missing "tags" array`)
  }
  if (!Array.isArray(parsed.slots_used)) {
    throw new Error(`Response missing "slots_used" array`)
  }

  return {
    html: parsed.html as string,
    layout: parsed.layout as string,
    tags: (parsed.tags as unknown[]).filter((t): t is string => typeof t === "string"),
    slotsUsed: (parsed.slots_used as unknown[]).filter((s): s is string => typeof s === "string"),
  }
}

async function writeVisionLog(
  type: SectionType,
  variation: number,
  imagePath: string,
  prompt: string,
  response: string,
): Promise<void> {
  try {
    await fs.mkdir(LOGS_DIR, { recursive: true })
    const logPath = path.join(LOGS_DIR, "ai-calls.jsonl")
    const entry = JSON.stringify({
      timestamp: new Date().toISOString(),
      key: "06-wireframe-from-image",
      type,
      variation,
      imagePath,
      promptLength: prompt.length,
      response,
    })
    await fs.appendFile(logPath, entry + "\n", "utf-8")
  } catch {
    // best-effort
  }
}
