# API Routes — PXcanvas

> Inventory đầy đủ mọi API route. Update khi thêm/sửa route.

---

## AI Routes (`/api/ai/`)

### `POST /api/ai/ux-analysis`
- **Phase:** 6
- **Input:** `{ url?: string, formInput: FormInput }`
- **Output:** `{ data: UxImprovement[] }` | `{ error: string }`
- **Prompt file:** `prompts/01-ux-analysis.md`
- **Placeholders:** `{{url}}`, `{{form_input}}`, `{{nav_structure}}`

### `POST /api/ai/sitemap`
- **Phase:** 7
- **Input:** `{ formInput: FormInput, improvements: UxImprovement[], navStructure?: string }`
- **Output:** `{ data: SitemapNode }` (root node) | `{ error: string }`
- **Prompt file:** `prompts/02-sitemap-generate.md`
- **Placeholders:** `{{form_input}}`, `{{improvements}}`, `{{nav_structure}}`

### `POST /api/ai/brand-voice`
- **Phase:** 8
- **Input:** `{ brandInput: string }` (concatenated URL content + file text + textarea)
- **Output:** `{ data: BrandVoice }` | `{ error: string }`
- **Prompt file:** `prompts/03-brand-voice-extract.md`
- **Placeholders:** `{{brand_input}}`

### `POST /api/ai/sections`
- **Phase:** 9
- **Input:** `{ pageNode: SitemapNode, sitemapJson: string }`
- **Output:** `{ data: Section[] }` | `{ error: string }`
- **Prompt file:** `prompts/04-sections-propose.md`
- **Placeholders:** `{{page_node}}`, `{{sitemap_json}}`

### `POST /api/ai/content`
- **Phase:** 9
- **Input:** `{ pageNode: SitemapNode, sections: Section[], brandVoice: BrandVoice }`
- **Output:** `{ data: string }` (markdown) | `{ error: string }`
- **Prompt file:** `prompts/05-content-generate.md`
- **Placeholders:** `{{page_node}}`, `{{sections}}`, `{{brand_voice}}`, `{{format_rules}}`

### `POST /api/ai/test-connection`
- **Phase:** 4
- **Input:** `{ mode: "sdk" | "api-key", apiKey?: string }`
- **Output:** `{ ok: boolean, mode: string, message: string }`

---

## File Routes (`/api/files/`)

### `POST /api/files/write-content`
- **Phase:** 9
- **Input:** `{ folderPath: string, filename: string, content: string }`
- **Output:** `{ path: string }` | `{ error: string }`
- **Note:** Security check — path must be within user-chosen root folder (no traversal).

### `POST /api/files/check-folder`
- **Phase:** 9 (also Settings, Phase 10)
- **Input:** `{ folderPath: string }`
- **Output:** `{ exists: boolean, writable: boolean }` | `{ error: string }`

### `POST /api/files/export-zip`
- **Phase:** 9
- **Input:** `{ project: Project, sitemap: SitemapNode, brandVoice: BrandVoice, pages: PageContent[] }`
- **Output:** Binary (zip download) | `{ error: string }`
- **Zip structure:** `sitemap.json`, `brand-voice.md`, `pages/*.md`, `meta.json`

### `POST /api/files/import-zip`
- **Phase:** 9
- **Input:** FormData with zip file
- **Output:** `{ data: Project }` (new project created) | `{ error: string }`
- **Validation:** Must contain `meta.json` + `sitemap.json`. Rejects malformed zip.

---

## Prompt Routes (`/api/prompts/`)

### `POST /api/prompts/ensure-defaults`
- **Phase:** 4
- **Input:** `{}` (no body)
- **Output:** `{ created: string[], existing: string[] }` (lists of files created vs already existed)
- **Note:** Creates 5 default prompt files if missing. Safe to call repeatedly (idempotent).

---

## Health Route (`/api/health`) — Bonus

- **Phase:** 10
- **Input:** None (GET)
- **Output:**
```json
{
  "provider": { "mode": "sdk", "ok": true },
  "outputFolder": { "path": "/Users/...", "exists": true, "writable": true },
  "prompts": {
    "01-ux-analysis.md": true,
    "02-sitemap-generate.md": false
  }
}
```

---

## Dev Routes (`/api/dev/`)

### `POST /api/dev/regenerate-prompts`
- **Phase:** 4 (dev-only)
- **Input:** `{}`
- **Output:** `{ deleted: string[], created: string[] }`
- **Note:** Deletes all prompt files and recreates from defaults. Only enabled in `NODE_ENV=development`.
