# PXcanvas — Screen Map

> Derived from PRD v1 (2026-05-20). Ordered theo user journey. Shared screens đánh dấu `[SHARED]`.

---

## Screen Index

| ID | Screen | US refs | Type |
|---|---|---|---|
| S-00 | Home / Project List | US-006, US-007, US-008, US-009, US-012 | Main |
| S-01 | New Project — Modal | US-007 | Modal |
| S-02 | Step 1 — Input & UX Analysis | US-001 | Workflow |
| S-03 | Step 2 — Sitemap Canvas | US-002, US-003, US-010 | Workflow |
| S-04 | Step 3 — Brand Voice | US-004 | Workflow |
| S-05 | Step 4 — Generate Content | US-005, US-011 | Workflow |
| S-06 | Settings | US-013, US-014, US-015 | `[SHARED]` |
| M-01 | Delete Confirm — Modal | US-003, US-008 | Modal |
| M-02 | Export Format — Modal | US-010 | Modal |
| M-03 | File Overwrite Confirm — Modal | US-005 | Modal |

---

## Navigation Flow

```
[S-00 Home]
  ├── (New Project) ──────────────────► [S-01 New Project Modal]
  │                                          └── (Create) ──► [S-02 Step 1]
  │
  ├── (Click project card) ──────────► [S-02/03/04/05 — last saved step]
  │
  ├── (Import button) ──────────────► file picker → [S-00 Home] (project added)
  │
  └── (Settings icon) ─────────────► [S-06 Settings]


[S-02 Step 1 — Input & UX Analysis]
  ├── (Submit form) ──► loading ──► render UX improvements list
  │     └── (Continue) ───────────────────────────────────────► [S-03 Step 2]
  │     └── (Skip analysis) ──────────────────────────────────► [S-03 Step 2]
  └── (Settings icon) ─────────────────────────────────────── ► [S-06 Settings]


[S-03 Step 2 — Sitemap Canvas]
  ├── (Back) ──────────────────────────────────────────────── ► [S-02 Step 1]
  ├── (Export) ───────────────────────────────────────────────► [M-02 Export Format Modal]
  │     └── (Confirm format) ──► download JSON / PNG
  ├── (Continue to Brand Voice) ─────────────────────────────► [S-04 Step 3]
  └── (Settings icon) ──────────────────────────────────────► [S-06 Settings]


[S-04 Step 3 — Brand Voice]
  ├── (Back) ──────────────────────────────────────────────── ► [S-03 Step 2]
  ├── (Save Brand Voice + Continue) ────────────────────────► [S-05 Step 4]
  └── (Settings icon) ──────────────────────────────────────► [S-06 Settings]


[S-05 Step 4 — Generate Content]
  ├── (Back) ──────────────────────────────────────────────── ► [S-04 Step 3]
  ├── (Generate All / Generate this page) ──► progress bar ──► content preview panels
  ├── (Export zip) ──► download [project-name].zip
  ├── (Back to Home) ─────────────────────────────────────── ► [S-00 Home]
  └── (Settings icon) ──────────────────────────────────────► [S-06 Settings]


[S-06 Settings] — overlay/page, accessible từ bất kỳ màn nào
  └── (Close / Back) ──────────────────────────────────────── ► màn trước đó
```

---

## S-00 — Home / Project List

**US refs:** US-006, US-007, US-008, US-009, US-012

### UI Elements

- App logo / name (PXcanvas) — top bar
- "New Project" button — top right
- "Import" button (nhận `.zip`) — top right (secondary)
- Settings icon — top right
- **Project grid / list:**
  - Project card: tên, ngày tạo, ngày sửa gần nhất
  - 3-dot menu mỗi card: Rename · Duplicate · Delete
  - Rename: inline edit trực tiếp trên card
  - Delete: trigger [M-01 Delete Confirm Modal]
- **Empty state** (khi chưa có project): illustration + text + CTA "Create your first project"

---

## S-01 — New Project Modal

**US refs:** US-007

### UI Elements

- Modal overlay (backdrop blur)
- Tiêu đề "New Project"
- Input field: Project name (placeholder "My project", validate không rỗng, auto-suffix `(2)` nếu trùng tên)
- Cancel button
- Create button (primary, disabled khi field rỗng)

---

## S-02 — Step 1: Input & UX Analysis

**US refs:** US-001

### UI Elements

**Section A — Input form** (trạng thái đầu):
- Step indicator (Step 1 / 4)
- Project name — breadcrumb / title
- **URL input** field (placeholder "Paste reference site URL")
  - URL validation inline
- **Form mô tả:**
  - Site type (dropdown: Villa/Hotel, SaaS, Landing page, E-commerce, Other)
  - Mục tiêu website (textarea)
  - Target user (textarea)
  - Tone/style (multi-select chips: Warm, Formal, Playful, Minimal, Bold...)
- Submit button "Analyze" (disabled khi cả 2 input rỗng)
- Error state: "Cần ít nhất 1 input (URL hoặc mô tả)"

**Section B — UX Improvements list** (sau khi AI trả về):
- Loading indicator trong lúc AI xử lý
- List items, mỗi item gồm:
  - Checkbox (default: ticked)
  - Vấn đề (label)
  - Lý do (body text)
  - Đề xuất cải tiến (highlighted text)
- Empty state khi AI trả 0 improvements: "Input đã đủ tốt — không có đề xuất"
- Error + Retry button khi AI fail
- "Skip analysis" button (bypass section B)
- "Continue" button (primary, ghi nhận state các checkbox)

---

## S-03 — Step 2: Sitemap Canvas

**US refs:** US-002, US-003, US-010

### UI Elements

**Top bar:**
- Step indicator (Step 2 / 4)
- Project name — breadcrumb
- Export button → [M-02 Export Format Modal]
- Back button (→ S-02)
- "Continue to Brand Voice" button (primary)

**Canvas area (React Flow):**
- Node cards: tên page + 1 dòng description
- "Improved" badge trên node sinh ra từ improvements đã tick
- Connection lines (parent → child)
- Zoom controls (+ / − / fit)
- Zoom range: 25%–200%
- Pan: drag empty area
- Loading overlay khi AI đang generate sitemap
- Error state: Retry button + giữ improvements state
- Empty state nếu sitemap < 3 pages: "Regenerate" button

**Node interactions:**
- Click "+" trên node → tạo child node mới
- Double-click node → rename inline
- Click node → side panel mở (S-03-panel)
- Delete node → trigger [M-01 Delete Confirm Modal] nếu có children
- Drag sibling → reorder
- Drag node sang parent khác → re-parent (block nếu drag vào descendant)

**Side panel (khi node được chọn):**
- Node name (editable)
- Description field (editable textarea)
- Delete node button

**Toolbar / Footer:**
- Undo (Ctrl+Z) / Redo (Ctrl+Shift+Z) buttons
- Auto-save indicator (saved / saving...)
- Node count

---

## S-04 — Step 3: Brand Voice

**US refs:** US-004

### UI Elements

**Top bar:**
- Step indicator (Step 3 / 4)
- Project name — breadcrumb
- Back button (→ S-03)
- "Save & Continue" button (primary, disabled khi chưa save)

**Input section (collapsible sau khi generate):**
- URL input (paste link website brand)
- File upload zone (drag-drop, `.md` / `.txt` / `.pdf`, max 10MB)
- Textarea mô tả brand (free text)
- "Generate Brand Voice" button
- Loading indicator, error + retry

**Brand Voice form (sau khi AI trả về, mọi field editable):**
- 3 Tone keywords (chip/tag edit, vd: Effortless · Curated · Warm)
- Voice principles (textarea, 3–5 dòng)
- Do examples (list, mỗi item editable, add/remove)
- Don't examples (list, mỗi item editable, add/remove)
- Blacklist words (tag list, add/remove)
- "Regenerate" button (nếu muốn thử lại)
- "Save Brand Voice" button (lưu vào project state)

**Error / edge states:**
- Field thiếu: để rỗng + hint "AI chưa extract được — tự điền hoặc Regenerate"
- Link không crawl được: inline error trên URL field
- File sai định dạng: toast "Chỉ hỗ trợ .md/.txt/.pdf"
- Chưa save mà bấm Continue: block + hint "Cần save brand voice trước"

---

## S-05 — Step 4: Generate Content

**US refs:** US-005, US-011

### UI Elements

**Top bar:**
- Step indicator (Step 4 / 4)
- Project name — breadcrumb
- Back button (→ S-04)
- "Export zip" button (download full project)
- "Back to Home" button

**Section list editor (per page):**
- Sidebar hoặc panel danh sách pages (từ sitemap)
- Click page → mở section list bên phải
- Section list: drag-to-reorder, add section, remove section, rename section
- "Generate this page" button per page

**Batch generate:**
- "Generate All" button (primary)
- Progress bar + counter "Generating 3 / 12 pages..."
- Cancel button (giữa batch)
- End-of-batch summary: success count + failed list + Retry failed button

**Content preview (per page):**
- Tab / panel per page name
- Rendered markdown preview (hoặc raw `.md` text)
- Copy button (copy raw content, không có UI chrome)
- Blacklist word highlights (đỏ) + "Regenerate section" shortcut
- "Regenerate page" button
- "Regenerate section" button (dropdown chọn section)
- Status badge: Generated / Not generated / Failed

**Output folder:**
- Folder path display + "Change folder" button
- Error state nếu folder không write được: inline warning + "Download zip instead"

---

## S-06 — Settings `[SHARED]`

**US refs:** US-013, US-014, US-015

### UI Elements

**AI Provider section:**
- Toggle/radio: Mode A (Claude Agent SDK) vs Mode B (API key)
- Mode A: status indicator (detected / not detected) + link hướng dẫn `claude login` nếu cần
- Mode B: API key field (masked input, show/hide toggle), provider selector (Anthropic / OpenAI)
- "Test connection" button → OK / Fail badge
- Warning khi không có provider nào hoạt động: "Install Claude Code hoặc set API key"

**Default output folder section:**
- File path input / file picker button
- Validation: path tồn tại + writable → green check; không tồn tại → warning inline
- "Browse" button (OS file picker)

**Prompt files section:**
- List 5 prompt files (`prompts/01-ux-analysis.md`, ...)
- Status: file tồn tại ✓ / bị xóa ✗
- "Restore default" button per file (hoặc "Restore all")
- Note: "Sửa file → mở Claude Code, edit trực tiếp. App tự pick up lần call kế tiếp."

**Close / Back** — trở về màn trước đó

---

## M-01 — Delete Confirm Modal

**Dùng cho:** xóa project (S-00) hoặc xóa node có children (S-03)

### UI Elements
- Tiêu đề "Xóa vĩnh viễn?" (project) hoặc "Xóa cả N sub-pages?" (node)
- Body text mô tả hành động không thể hoàn tác
- Cancel button
- Delete button (destructive/red)

---

## M-02 — Export Format Modal

**Dùng cho:** export sitemap (S-03)

### UI Elements
- Tiêu đề "Export Sitemap"
- 2 format options: JSON / PNG (radio hoặc 2 buttons)
- Export button
- Cancel button

---

## M-03 — File Overwrite Confirm Modal

**Dùng cho:** generate content khi file `.md` cùng tên đã tồn tại (S-05)

### UI Elements
- Tiêu đề "File đã tồn tại"
- Tên file bị conflict
- 3 options: Overwrite / Skip / Rename (thêm hậu tố)
- Confirm button
- Cancel button

---

## Notes

- **Step indicator (Step X / 4)** xuất hiện trên S-02, S-03, S-04, S-05 — là shared component navigation.
- **Settings** mở như overlay hoặc trang riêng; không nằm trong workflow step.
- **Canvas (S-03)** là màn phức tạp nhất — cần thêm empty state, loading overlay, side panel riêng.
- Không có Auth screen (local-only, single-user per PRD §①).
- Mobile layout không cần thiết kế (desktop-only 1280px+ per PRD §⑥).
