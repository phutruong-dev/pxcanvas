# Villa T — Website Content Project

Dự án này chứa toàn bộ **nội dung văn bản** cho website cho thuê Villa T, được tổ chức theo cách AI-friendly để generate, rà soát, và đưa vào Figma.

> **Quy ước quan trọng:** Project này chỉ chứa **nội dung** (copy/text). Không mô tả style, layout hay visual design. Style sẽ được thiết kế trực tiếp trong Figma.

---

## 1. Cấu trúc thư mục

```
content/
├── README.md                       ← BẮT ĐẦU TỪ ĐÂY
├── plan.md                         ← Roadmap từng step, output mỗi step
├── sitemap.md                      ← Blueprint toàn site (15 pages)
│
├── _foundations/                   ← AI luôn load các file này khi gen
│   ├── brand-voice.md              ← Tone, vocab whitelist/blacklist
│   ├── villa-facts.md              ← Source of truth — không bịa
│   ├── personas.md                 ← 4 personas chi tiết
│   ├── seo-keywords.md             ← Keywords map → page
│   └── ux-patterns.md              ← CTA, error, success, microcopy chuẩn
│
├── _templates/                     ← Prompt & schema để generate
│   ├── generate-page.md            ← Copy-paste prompt khi gen 1 page
│   └── page-output-schema.md       ← Format chuẩn của file output
│
└── pages/                          ← Output cuối — sẵn sàng cho Figma
    ├── 01-home.md                  (gen sau)
    ├── 02-about.md
    ├── ...
```

> Folder `pages/` sẽ được tạo dần khi generate từng trang theo `plan.md`.

---

## 2. Cách sử dụng

### 2.1 Nếu bạn là **user (Phú)**:

**Khi muốn generate 1 trang mới:**
1. Mở `plan.md` → chọn step kế tiếp.
2. Copy prompt từ `_templates/generate-page.md` (đã có sẵn placeholder).
3. Điền `[PAGE]`, `[PRIMARY_GOAL]` theo step trong plan.
4. Paste cho AI → AI sẽ tự load các foundation files cần thiết.
5. Review output → save vào `pages/[NN]-[slug].md`.

**Khi muốn sửa brand voice / facts:**
- Chỉ sửa file trong `_foundations/`. Mọi trang gen sau đó sẽ tự áp dụng.

### 2.2 Nếu bạn là **AI agent** đọc project này:

**Trước khi generate bất kỳ nội dung nào, BẮT BUỘC đọc theo thứ tự:**
1. `_foundations/villa-facts.md` — không được bịa fact ngoài file này
2. `_foundations/brand-voice.md` — kiểm tra blacklist
3. `_foundations/personas.md` — nếu page có persona target rõ
4. `_foundations/seo-keywords.md` — nhặt 2–3 keyword cho page
5. `_foundations/ux-patterns.md` — dùng CTA/microcopy chuẩn, không tự chế lại
6. `_templates/page-output-schema.md` — format output đúng schema
7. `sitemap.md` (section của page tương ứng) — biết section nào cần gen

**Nếu thiếu thông tin:** ghi `[NEEDS_INPUT: <câu hỏi>]` trong output, không tự bịa.

---

## 3. Convention

### 3.1 Đặt tên file output
- `pages/[NN]-[slug].md` với `NN` = 2 chữ số theo thứ tự trong plan.
- Ví dụ: `pages/01-home.md`, `pages/04-amenities.md`, `pages/12-check-availability.md`.

### 3.2 Style markdown nội bộ
- Headings dùng `##` cho section, `###` cho block trong section.
- Mọi đoạn text dài luôn nằm trong code-fence ` ```text ` để dễ copy nguyên si vào Figma.
- Mọi CTA dùng format: ``CTA: `Send Inquiry` ``.
- Mọi placeholder dùng `{{double-curly}}` để dễ tìm-thay sau.

### 3.3 Ngôn ngữ
- **Nội dung website:** English (primary, vì khách quốc tế).
- **Comment trong file, plan, instructions:** Tiếng Việt (cho user).

---

## 4. Mục tiêu cuối cùng

Khi project hoàn thành, bạn có thể:
- Mở từng file `pages/[NN]-[slug].md` → copy nguyên si block text vào Figma frame tương ứng.
- Không phải nghĩ thêm về wording, CTA, hay microcopy.
- Tất cả văn bản đều **conversion-focus** — mỗi trang đều dẫn về form "Check Availability".

---

## 5. Khi nào convert thành Skill

Sau khi hoàn tất 1 website và pattern proven, các file trong `_foundations/` + `_templates/` có thể đóng gói thành Claude skill `villa-content-generator` với:
- `SKILL.md` chứa instruction & invocation pattern
- `_foundations/*` → reference data
- `_templates/*` → prompt templates
- Examples = các `pages/*.md` đã generate

---

*Project version 0.1 · 2026-05-18*
