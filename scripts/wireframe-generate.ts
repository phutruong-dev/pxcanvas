#!/usr/bin/env node
// wireframe-generate.ts — Track A CLI: JPG → HTML wireframe
//
// Usage:
//   npx tsx scripts/wireframe-generate.ts --type feature-section --variation 1
//   npx tsx scripts/wireframe-generate.ts --type feature-section --all
//   npx tsx scripts/wireframe-generate.ts --type feature-section --all --skip-existing
//
// Reads ANTHROPIC_API_KEY from .env.local or environment.
//
// npm script: npm run wireframe:gen -- --type feature-section --variation 1

import fs from "fs/promises"
import path from "path"
import { SECTION_TYPES, type SectionType } from "../src/lib/types/wireframe"
import { callVision } from "../src/lib/ai/vision"
import { validateWireframeHtml } from "../src/lib/wireframes/html-validate"
import { getSlotSchema } from "../src/lib/wireframes/slot-schema"
import { formatVariationId } from "../src/lib/wireframes/meta-schema"

// ─── Env loading ─────────────────────────────────────────────────────────────

async function loadEnvLocal(): Promise<void> {
  try {
    const content = await fs.readFile(path.join(process.cwd(), ".env.local"), "utf-8")
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue
      const eqIdx = trimmed.indexOf("=")
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "")
      if (key && !process.env[key]) {
        process.env[key] = val
      }
    }
  } catch {
    // .env.local missing — rely on real env vars
  }
}

// ─── CLI args ─────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2)
  const get = (flag: string) => {
    const idx = args.indexOf(flag)
    return idx !== -1 ? args[idx + 1] : undefined
  }
  const has = (flag: string) => args.includes(flag)

  const type = get("--type") as SectionType | undefined
  const variationStr = get("--variation")
  const all = has("--all")
  const skipExisting = has("--skip-existing") || !has("--force")
  const model = get("--model")

  return { type, variation: variationStr ? parseInt(variationStr, 10) : undefined, all, skipExisting, model }
}

// ─── Paths ────────────────────────────────────────────────────────────────────

const WIREFRAME_DESIGN_DIR = path.join(process.cwd(), "wireframe-design")
const WIREFRAME_LIBRARY_DIR = path.join(process.cwd(), "wireframe-library")
const SHARED_DIR = path.join(WIREFRAME_LIBRARY_DIR, "_shared")

function sourceImagePath(type: SectionType, variation: number): string {
  return path.join(WIREFRAME_DESIGN_DIR, type, `featuresection${variation}.jpg`)
}

function outputDir(type: SectionType, variation: number): string {
  return path.join(WIREFRAME_LIBRARY_DIR, type, String(variation).padStart(3, "0"))
}

function htmlPath(type: SectionType, variation: number): string {
  return path.join(outputDir(type, variation), "index.html")
}

function metaPath(type: SectionType, variation: number): string {
  return path.join(outputDir(type, variation), "meta.json")
}

// ─── Source discovery ─────────────────────────────────────────────────────────

async function discoverVariations(type: SectionType): Promise<number[]> {
  const dir = path.join(WIREFRAME_DESIGN_DIR, type)
  let files: string[]
  try {
    files = await fs.readdir(dir)
  } catch {
    throw new Error(`Source directory not found: ${dir}`)
  }

  const pattern = /^featuresection(\d+)\.jpg$/i
  const nums: number[] = []
  for (const f of files) {
    const m = pattern.exec(f)
    if (m) nums.push(parseInt(m[1], 10))
  }
  return nums.sort((a, b) => a - b)
}

async function isGenerated(type: SectionType, variation: number): Promise<boolean> {
  try {
    await fs.access(htmlPath(type, variation))
    return true
  } catch {
    return false
  }
}

async function isFrozen(type: SectionType, variation: number): Promise<boolean> {
  try {
    const raw = await fs.readFile(metaPath(type, variation), "utf-8")
    const meta = JSON.parse(raw) as { frozen?: boolean }
    return meta.frozen === true
  } catch {
    return false
  }
}

// ─── Write output ─────────────────────────────────────────────────────────────

async function writeVariation(
  type: SectionType,
  variation: number,
  html: string,
  layout: string,
  tags: string[],
  slotsUsed: string[],
  model: string,
): Promise<void> {
  const dir = outputDir(type, variation)
  await fs.mkdir(dir, { recursive: true })

  const relativeSource = path.relative(process.cwd(), sourceImagePath(type, variation)).replace(/\\/g, "/")
  const relativeHtml = path.relative(process.cwd(), htmlPath(type, variation)).replace(/\\/g, "/")

  const htmlContent = wrapHtml(type, variation, html)
  await fs.writeFile(htmlPath(type, variation), htmlContent, "utf-8")

  const slotSchema = getSlotSchema(type)
  const usedSlots = slotSchema.filter((s) => slotsUsed.includes(s.key))

  const meta = {
    id: formatVariationId(type, variation),
    type,
    variation,
    sourceImage: relativeSource,
    htmlPath: relativeHtml,
    slots: usedSlots,
    layout,
    tags,
    approved: false,
    frozen: false,
    libraryVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    generatedBy: model,
  }

  await fs.writeFile(metaPath(type, variation), JSON.stringify(meta, null, 2), "utf-8")
}

function wrapHtml(type: SectionType, variation: number, bodyHtml: string): string {
  const sharedRelative = "../../_shared"
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${type} — variation ${variation}</title>
  <link rel="stylesheet" href="${sharedRelative}/pxpace.css">
  <link rel="stylesheet" href="${sharedRelative}/wireframe-base.css">
</head>
<body>
${bodyHtml}
</body>
</html>`
}

// ─── Generate one variation ───────────────────────────────────────────────────

const MAX_RETRIES = 2

async function generateOne(
  type: SectionType,
  variation: number,
  apiKey: string,
  model: string,
  skipExisting: boolean,
  debugLogging: boolean,
): Promise<{ status: "skipped" | "done" | "failed"; message?: string }> {
  const imgPath = sourceImagePath(type, variation)

  try { await fs.access(imgPath) }
  catch { return { status: "failed", message: `Source image not found: ${imgPath}` } }

  if (skipExisting && await isGenerated(type, variation)) {
    if (await isFrozen(type, variation)) {
      return { status: "skipped", message: "frozen" }
    }
    return { status: "skipped", message: "already generated" }
  }

  const previousErrors: string[] = []
  let lastError = ""

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      const result = await callVision({
        imagePath: imgPath,
        sectionType: type,
        variation,
        apiKey,
        model,
        debugLogging,
        previousErrors: previousErrors.length > 0 ? previousErrors : undefined,
      })

      const validation = await validateWireframeHtml(result.html, type)

      if (validation.warnings.length > 0) {
        console.log(`    ⚠ warnings: ${validation.warnings.join("; ")}`)
      }

      if (!validation.valid) {
        const errMsg = validation.errors.join("; ")
        previousErrors.push(...validation.errors)
        lastError = errMsg

        if (attempt <= MAX_RETRIES) {
          console.log(`    ✗ attempt ${attempt} invalid: ${errMsg}`)
          console.log(`    ↻ retrying (${attempt}/${MAX_RETRIES})...`)
          continue
        }

        return { status: "failed", message: `All ${MAX_RETRIES + 1} attempts failed. Last: ${errMsg}` }
      }

      await writeVariation(type, variation, result.html, result.layout, result.tags, result.slotsUsed, model)
      return { status: "done" }

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      previousErrors.push(msg)
      lastError = msg

      if (attempt <= MAX_RETRIES) {
        console.log(`    ✗ attempt ${attempt} error: ${msg.slice(0, 120)}`)
        console.log(`    ↻ retrying...`)
        continue
      }

      return { status: "failed", message: lastError }
    }
  }

  return { status: "failed", message: lastError }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await loadEnvLocal()

  const { type, variation, all, skipExisting, model: cliModel } = parseArgs()
  const apiKey = process.env.ANTHROPIC_API_KEY ?? ""
  const model = cliModel ?? process.env.WIREFRAME_MODEL ?? "claude-sonnet-4-6"
  const debugLogging = process.env.DEBUG_AI_LOGGING === "true"

  if (!apiKey) {
    console.error("Error: ANTHROPIC_API_KEY is not set. Add it to .env.local or set the env var.")
    process.exit(1)
  }

  if (!type) {
    console.error(`Error: --type is required. Options: ${SECTION_TYPES.join(", ")}`)
    process.exit(1)
  }

  if (!(SECTION_TYPES as readonly string[]).includes(type)) {
    console.error(`Error: Unknown section type "${type}". Options: ${SECTION_TYPES.join(", ")}`)
    process.exit(1)
  }

  if (!all && variation === undefined) {
    console.error("Error: Specify --variation N (single) or --all (batch)")
    process.exit(1)
  }

  const variations = all ? await discoverVariations(type) : [variation!]
  const total = variations.length
  let done = 0, skipped = 0, failed = 0

  await fs.mkdir(SHARED_DIR, { recursive: true })

  console.log(`\n━━━ wireframe-generate: ${type} ━━━`)
  console.log(`Model: ${model} | skip-existing: ${skipExisting} | debug-logging: ${debugLogging}`)
  console.log(`Found ${total} variation(s) to process\n`)

  for (const v of variations) {
    const label = `[${type} #${v}]`
    process.stdout.write(`  ${label} `)

    const result = await generateOne(type, v, apiKey, model, skipExisting, debugLogging)

    if (result.status === "done") {
      console.log(`✓ done`)
      done++
    } else if (result.status === "skipped") {
      console.log(`– skipped (${result.message})`)
      skipped++
    } else {
      console.log(`✗ FAILED: ${result.message}`)
      failed++
    }
  }

  console.log(`\n━━━ Summary ━━━`)
  console.log(`Done: ${done} | Skipped: ${skipped} | Failed: ${failed} | Total: ${total}`)

  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
