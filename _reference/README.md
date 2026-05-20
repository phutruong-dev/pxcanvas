# _reference/

> Reference data, không phải code app. KHÔNG sửa trừ khi user yêu cầu rõ.

## Nội dung

### `villa-t/`

Project content cho website Villa T Dubrovnik. Đã được gen hoàn thiện trước khi build PXcanvas. Dùng làm:

- **Pilot data Phase 9** — PRD §⑧ Success Metrics yêu cầu redo Villa T qua app < 2h. Folder này là output kỳ vọng để so sánh.
- **Reference format** — pages/*.md là canonical example của content wireframe-ready format.
- **Reference brand voice** — `_foundations/brand-voice.md` là output kỳ vọng của Step 3 (Brand Voice) khi user input villa info.

### Files trong `villa-t/`

| File | Vai trò gốc |
|---|---|
| `villa-content-rules.md` | Rules cho gen content villa (= CLAUDE.md cũ trước khi rename). KHÔNG load khi code app. |
| `README.md` | Mô tả content project Villa T |
| `plan.md` | Roadmap gen content (đã xong) |
| `sitemap.md` | Blueprint 15 pages villa |
| `_foundations/` | brand-voice, villa-facts, personas, seo-keywords, ux-patterns |
| `_templates/` | Prompt + schema gen page |
| `pages/` | 21 file content `.md` đã gen sẵn |

---

## Lưu ý cho AI

- **KHÔNG đọc `villa-content-rules.md` cho task code app.** File đó là rules gen content villa, không liên quan code PXcanvas.
- **Có thể đọc `pages/01-home.md`, `_foundations/brand-voice.md`** khi cần reference format output cho Phase 9 implementation.
