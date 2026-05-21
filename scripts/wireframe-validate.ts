#!/usr/bin/env node
// wireframe-validate.ts — validate library integrity before committing.
//
// Usage: npm run wireframe:validate
//
// Checks:
//   - Each generated variation has index.html + meta.json
//   - meta.json passes schema validation
//   - HTML has <section> root and data-slot attributes
//   - Slot keys are in schema

import fs from "fs/promises"
import path from "path"
import { SECTION_TYPES, type SectionType } from "../src/lib/types/wireframe"
import { validateWireframeMeta } from "../src/lib/wireframes/meta-schema"
import { validateWireframeHtml } from "../src/lib/wireframes/html-validate"

const LIBRARY_DIR = path.join(process.cwd(), "wireframe-library")

async function main() {
  let totalErrors = 0
  let totalWarnings = 0
  let totalChecked = 0

  for (const type of SECTION_TYPES) {
    const typeDir = path.join(LIBRARY_DIR, type)
    let entries: string[]
    try {
      entries = await fs.readdir(typeDir)
    } catch {
      continue // type not built yet
    }

    // Folder name = source JPG stem (e.g. "feature-section-20")
    const folderPattern = new RegExp(`^${type}-(\\d+)$`)
    const variationDirs = entries
      .filter((e) => folderPattern.test(e))
      .sort((a, b) => {
        const na = parseInt(a.match(folderPattern)![1], 10)
        const nb = parseInt(b.match(folderPattern)![1], 10)
        return na - nb
      })
    if (variationDirs.length === 0) continue

    console.log(`\n── ${type} (${variationDirs.length} variations)`)

    for (const dir of variationDirs) {
      const fullDir = path.join(typeDir, dir)
      const htmlFile = path.join(fullDir, "index.html")
      const metaFile = path.join(fullDir, "meta.json")
      const variation = parseInt(dir.match(folderPattern)![1], 10)
      const errors: string[] = []
      const warnings: string[] = []

      // Check files exist
      let html = ""
      let metaRaw = ""
      try {
        html = await fs.readFile(htmlFile, "utf-8")
      } catch {
        errors.push("Missing index.html")
      }
      try {
        metaRaw = await fs.readFile(metaFile, "utf-8")
      } catch {
        errors.push("Missing meta.json")
      }

      // Validate meta.json
      if (metaRaw) {
        try {
          const parsed = JSON.parse(metaRaw) as unknown
          const result = validateWireframeMeta(parsed)
          if (!result.ok) errors.push(...result.errors.map((e) => `meta: ${e}`))
        } catch {
          errors.push("meta.json is invalid JSON")
        }
      }

      // Validate HTML
      if (html) {
        const htmlResult = await validateWireframeHtml(html, type as SectionType)
        errors.push(...htmlResult.errors.map((e) => `html: ${e}`))
        warnings.push(...htmlResult.warnings.map((w) => `html: ${w}`))
      }

      totalChecked++
      totalErrors += errors.length
      totalWarnings += warnings.length

      if (errors.length > 0) {
        console.log(`  ✗ ${dir}: ${errors.join("; ")}`)
      } else if (warnings.length > 0) {
        console.log(`  ⚠ ${dir}: ${warnings.join("; ")}`)
      } else {
        console.log(`  ✓ ${dir}`)
      }
    }
  }

  console.log(`\n━━━ Validation Summary ━━━`)
  console.log(`Checked: ${totalChecked} | Errors: ${totalErrors} | Warnings: ${totalWarnings}`)

  if (totalErrors > 0) {
    console.log("\nFix errors before committing library.")
    process.exit(1)
  } else {
    console.log("\nAll checks passed.")
  }
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
