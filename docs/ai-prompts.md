# AI Prompts — PXcanvas

> 5 prompt files sống trong `prompts/`. Edit trực tiếp qua Claude Code — app pick up lần call kế tiếp.
> Mỗi file: **System prompt** (rule cố định) + **Variable placeholders** (thay bằng data lúc runtime).

---

## Placeholders Reference

| Placeholder | Có trong file | Giá trị runtime |
|---|---|---|
| `{{url}}` | 01 | URL user paste |
| `{{form_input}}` | 01, 02 | JSON stringify của form mô tả (site type, goals, target user, tone) |
| `{{improvements}}` | 02 | JSON array các `UxImprovement` đã tick |
| `{{nav_structure}}` | 01, 02 | Nav tree extract từ AI WebFetch (nếu có) |
| `{{brand_input}}` | 03 | String gồm URL / file content / text mô tả brand (concatenated) |
| `{{sitemap_json}}` | 04, 05 | JSON serialize `SitemapNode[]` toàn bộ sitemap |
| `{{page_node}}` | 04, 05 | JSON của node đang gen (`{ name, description }`) |
| `{{sections}}` | 05 | JSON array `Section[]` đã edit |
| `{{brand_voice}}` | 05 | JSON serialize `BrandVoice` object |
| `{{format_rules}}` | 05 | Nội dung file `_reference/villa-t/villa-content-rules.md` (format conversion-focus) |

---

## Expected AI Output Format (per file)

### `01-ux-analysis.md` → `UxImprovement[]`
```json
[
  {
    "id": "imp-1",
    "problem": "Không có social proof trên homepage",
    "reason": "User cần validation trước khi book",
    "suggestion": "Thêm section Reviews Preview với 2-3 quote ngắn"
  }
]
```

### `02-sitemap-generate.md` → `SitemapNode` tree
```json
{
  "id": "home",
  "name": "Home",
  "description": "Landing page chính, hero + overview",
  "improved": false,
  "children": [
    {
      "id": "about",
      "name": "About",
      "description": "Story behind the villa",
      "improved": true,
      "children": []
    }
  ]
}
```

### `03-brand-voice-extract.md` → `BrandVoice`
```json
{
  "toneKeywords": ["Effortless", "Curated", "Warm"],
  "principles": "Write short, active sentences. Use specific details over labels...",
  "doExamples": ["Heated infinity pool overlooking the Adriatic", "Six bedrooms, each facing the sea"],
  "dontExamples": ["Luxury experience", "Amazing views", "5-star treatment"],
  "blacklist": ["luxury", "luxurious", "5-star", "amazing", "breathtaking", "stunning"]
}
```

### `04-sections-propose.md` → `Section[]` per page
```json
[
  { "id": "hero", "name": "Hero" },
  { "id": "social-proof", "name": "Social Proof" },
  { "id": "features", "name": "Key Features" },
  { "id": "faq", "name": "FAQ — Short" },
  { "id": "pre-footer-cta", "name": "Pre-footer CTA" }
]
```

### `05-content-generate.md` → Markdown string
```markdown
# Villa T — Home

---

## Hero

### Your Adriatic escape, ready when you are.

...
```
Full format theo schema trong `_reference/villa-t/villa-content-rules.md`.

---

## Cách `prompt-loader.ts` hoạt động

```
1. Nhận promptKey (vd: "02-sitemap-generate") + vars object
2. Đọc file `prompts/02-sitemap-generate.md` từ disk (fs.readFile — không cache)
3. Replace từng {{placeholder}} bằng vars[placeholder]
4. Nếu placeholder thiếu trong vars → skip, log warning
5. Nếu file không tồn tại → gọi /api/prompts/ensure-defaults để regen
6. Return full prompt string → gửi cho AI provider
```

---

## Cách edit prompt

1. Mở Claude Code
2. Sửa trực tiếp file `prompts/[tên-file].md`
3. AI call tiếp theo trong app tự pick up version mới (không cần restart server)

## Restore default prompt

- Trong Settings → Prompt Files → nút "Restore default" per file
- Hoặc delete file → app tự regen từ default lần call kế tiếp
