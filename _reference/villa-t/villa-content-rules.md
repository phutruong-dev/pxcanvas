# CLAUDE.md — Villa T Content Project

> File AI luôn đọc đầu tiên khi vào project này. Ngắn gọn, đầy đủ rules. Chi tiết xem `_templates/page-output-schema.md`.

---

## 1. Mục đích project

Generate **nội dung wireframe-ready** cho website Villa T Dubrovnik. Người dùng (designer) sẽ paste content vào Figma để build wireframe / UI mockup. **Đây không phải SEO content, không phải spec data.** Đây là **content brief đẹp**, render như một document.

---

## 2. Order đọc file (BẮT BUỘC)

Trước khi generate 1 page, đọc theo thứ tự:

1. `CLAUDE.md` *(file này)*
2. `_foundations/villa-facts.md` — không bịa fact ngoài file này
3. `_foundations/brand-voice.md` — blacklist từ (`luxury`, `5-star`, `best`, `amazing`, …)
4. `_foundations/personas.md` — persona target của page
5. `_foundations/ux-patterns.md` — CTA labels chuẩn
6. `_templates/page-output-schema.md` — format output đầy đủ
7. `sitemap.md` — section nào cần generate cho page

Bỏ qua `_foundations/seo-keywords.md` — KHÔNG đưa SEO vào page output.

---

## 3. Hard rules — output format

### 3.1 KHÔNG dùng

- `*italic*` — bỏ hoàn toàn. Subtitle / intro / tagline đều plain paragraph.
- `Heading: ...` pattern (label colon value).
- SEO meta block (title / description / OG / keywords).
- Code-fence ` ```text ` quanh body.
- Section "Internal links", "NEEDS_INPUT", "Self-check" trong file output.
- Alt text cho image.
- Emoji.
- Từ blacklist: `luxury`, `luxurious`, `5-star`, `best`, `amazing`, `incredible`, `breathtaking`, `stunning`, `unforgettable`, `magical`, `paradise`, `sanctuary`, `oasis`, `haven`.

### 3.2 DÙNG (compact convention)

| Element | Markdown |
|---|---|
| Page name | `# Villa T — [Page name]` |
| Section name | `## [Section name]` |
| Hero / Section headline | `### [Headline]` |
| Card | `` #### `Tag` · Card title `` (inline, không tách riêng Tag và Title) |
| Item (icon grid, location list) | `` #### `Tag` · Item title `` |
| FAQ question | `#### Question text?` (đặt câu hỏi trực tiếp ở H4) |
| Review | `` #### Author, City — `Tag` `` (author + tag inline ở H4) |
| Quote (review body) | `> Quote text` |
| Tag / chip (standalone) | `` `Tag` `` |
| Button / CTA | `**[ Button label ]**` |
| Stats bar items | `**stat 1 · stat 2 · stat 3**` |
| Section break | `---` (dòng riêng) |
| Body | Plain paragraph |
| Subtitle | Plain paragraph (1 dòng dưới headline) |

**Compact rule:** KHÔNG dùng `#### Card 1` + blank + `` `Tag` `` + blank + `**Title**` (5 dòng). Gộp thành 1 dòng `` #### `Tag` · Title ``.

### 3.3 Form spec (special case)

Cho `/check-availability`, `/contact`:

```
#### Field 1

**Label:** Full name
**Placeholder:** Jane Doe
**Required:** Yes
```

Form là spec data → dùng `**Label:** value` pattern.

---

## 4. Reference template (compact)

Khi gen 1 page, dùng pattern này. Không cần intro `>` comment ở đầu (đã có trong CLAUDE.md).

```markdown
# Villa T — [Page Name]

---

## [Section 1 Name]

### [Section headline]

[Subtitle line — plain.]

[Body paragraph.]

**[ CTA ]**

---

## [Cards Section]

### [Section headline]

[Subtitle line.]

#### `Tag` · Card title

Card description.

**[ CTA ]**

#### `Tag` · Card title

Card description.

**[ CTA ]**

**[ Section CTA ]**

---

## [Icon Grid Section]

### [Section headline]

[Subtitle line.]

#### `Tag` · Item title

Item body.

#### `Tag` · Item title

Item body.

**[ Section CTA ]**

---

## FAQ — Short

### [Section headline]

[Subtitle line.]

#### Question text?

Answer paragraph.

#### Question text?

Answer paragraph.

**[ See all FAQs ]**

---

## Reviews Preview

### [Section headline]

[Subtitle line.]

#### Author Name, City — `Tag (stay type · month)`

> Quote text.

#### Author Name, City — `Tag`

> Quote text.

**[ Read more ]**

---

## Pre-footer CTA

### Your Dubrovnik stay begins with a single question.

Tell us your dates and group size — we'll reply within 24 hours with a personalised quote.

**[ Check Availability ]**  **[ Email Us ]**
```

---

## 5. Tag dimensions (per section type)

| Section | Tag |
|---|---|
| Room cards | `Master Suite`, `Standard Rooms (×4)` |
| Amenities | `Wellness`, `Dining`, `Comfort`, `Entertainment`, `Tech` |
| Services | `Included`, `Add-on` |
| Location items | `8 min on foot`, `25 min by car`, `Half day`, `Full day` |
| Reviews | `Couples · June 2025` (stay type · month) |

---

## 6. CTA labels (luôn dùng đúng)

| Context | Label |
|---|---|
| Primary CTA (most pages) | `Check Availability` |
| Primary CTA (`/rates`) | `Request a Quote` |
| Secondary — explore villa | `Tour the Villa` |
| Secondary — gallery | `See the Gallery` |
| Secondary — reviews | `Read Guest Stories` |
| Secondary — eat & drink | `Browse the Menu` |
| Secondary — rooms | `See the room` / `See the rooms` |
| Secondary — services | `Explore services` |
| Secondary — location | `Explore the area` |
| Secondary — FAQ | `See all FAQs` |
| Email | `Email Us` |
| Form submit (inquiry) | `Send Inquiry` |
| Form submit (contact) | `Send Message` |

---

## 7. Voice (quick reference)

- 3 keywords: **Effortless · Curated · Warm**
- Specifics over labels: *"heated infinity pool"* not *"luxury pool"*.
- Short and varied sentence rhythm.
- Active voice. *We / you*, not *the guest will*.
- Numbers ≤ 12 → write out (*six bedrooms*, *eight minutes*).

---

## 8. When user asks to generate a page

1. Confirm page slug (e.g. `/about`, `/the-villa/master-suite-sea`).
2. Read order in §2.
3. Generate output in `pages/[NN]-[slug].md` per format in §3, §4.
4. Run self-check: no italic, no blacklist, format matches schema.
5. Report file path + 1-sentence summary.

---

## 9. When user asks to update format

- Edit `_templates/page-output-schema.md` (detailed spec).
- Edit `CLAUDE.md` (this file — quick rules).
- Re-apply to existing pages if format change is breaking.

---

## 10. Reference: Home page

File `pages/01-home.md` là canonical example đã được user approve. Khi unsure về format → mở Home và copy pattern.
