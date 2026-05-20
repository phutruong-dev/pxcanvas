# Page Output Schema — Wireframe-ready Content Brief

File `pages/[NN]-[slug].md` là **content brief đẹp** — render thành document có visual hierarchy rõ ràng. Không "Label: value", không SEO meta, không code fence, không italic.

---

## Hard rules

1. **Không dùng italic** `*...*` ở bất cứ đâu. Subtitle / intro / tagline đều là plain paragraph.
2. **Không dùng "Label: content" pattern.** Heading IS the heading. Subtitle IS the line below.
3. **Không có** SEO meta block, OG image, alt text, internal links list, NEEDS_INPUT list.
4. **Tags / chips:** `` `Tag text` `` (backtick).
5. **Buttons / CTA:** `**[ Button label ]**` (bold + bracket).
6. **Reviews / quotes:** `> Quote text` (blockquote).
7. **Section break:** dòng `---` riêng.
8. **English copy** (website primary). Comment / metadata trong file dùng tiếng Việt nếu cần (chỉ ở đầu file dưới dạng `>` blockquote).

---

## Markdown level convention

| Element | Markdown |
|---|---|
| Page name | `# Villa T — [Page name]` |
| Section name | `## [Section name]` |
| Hero headline / Section headline | `### [Headline text]` |
| Card / Item / Question / Review number | `#### Card 1` (hoặc `#### Item 1`, `#### Question 1`, `#### Review 1`) |
| Card title (inside card) | `**Card title**` (bold) |
| Q in FAQ (inside question) | `**Question text?**` (bold) |
| Body / paragraph | Plain text |
| Subtitle line (under heading) | Plain text (1 dòng riêng, không styling) |
| Tag / chip | `` `Tag` `` |
| Button / CTA | `**[ Button label ]**` |
| Inline highlight (stats bar) | `**bold text**` |
| Quote (review) | `> Quote text` |
| Author of quote | `— Name, Location` (plain text dưới blockquote) |

---

## Template — Section types

### Hero section

```
## Hero

### [Big headline that sells the page in one sentence]

[Subtitle paragraph — one or two lines explaining the headline.]

**[ Primary button ]**  **[ Secondary button ]**
```

### Stats / strip section

```
## Stats Bar — At a Glance

**stat 1 · stat 2 · stat 3 · stat 4 · stat 5**
```

### Welcome / paragraph section

```
## Welcome

### [Section headline]

[Subtitle paragraph.]

[Body paragraph 1.]

[Body paragraph 2.]

**[ Section CTA ]**
```

### Cards section (rooms, services) — COMPACT

```
## [Section name]

### [Section headline]

[Subtitle paragraph.]

#### `Tag` · Card title

Card description.

**[ CTA ]**

#### `Tag` · Card title

Card description.

**[ CTA ]**

**[ Section CTA ]**
```

### Icon grid section — COMPACT

```
## [Section name]

### [Section headline]

[Subtitle paragraph.]

#### `Tag` · Item title

Item description.

#### `Tag` · Item title

Item description.

**[ Section CTA ]**
```

### FAQ section — COMPACT

```
## FAQ

### [Section headline]

[Subtitle paragraph.]

#### Question text?

Answer paragraph.

#### Question text?

Answer paragraph.

**[ See all FAQs ]**
```

### Reviews section — COMPACT

```
## Guest Reviews

### [Section headline]

[Subtitle paragraph.]

#### Author Name, City — `Tag (stay type · month)`

> Quote text.

#### Author Name, City — `Tag`

> Quote text.

**[ Read more ]**
```

### Form section (for `/check-availability`, `/contact`)

```
## [Form name]

### [Form headline]

[Form subtitle paragraph.]

#### Field 1

**Label:** Full name
**Placeholder:** Jane Doe
**Required:** Yes

#### Field 2

**Label:** Email
**Placeholder:** you@example.com
**Helper:** We'll reply here within 24 hours.
**Required:** Yes

[...]

**[ Submit Button Label ]**

[Below-submit microcopy paragraph, if any.]
```

> **Note for forms:** field meta dùng `**Label:** value` vì là spec data của field (not user-facing copy). Còn user-facing copy (helper text, error text) viết plain.

### Pre-footer CTA section

```
## Pre-footer CTA

### [Big closing question]

[Subtitle paragraph.]

**[ Primary CTA ]**  **[ Secondary CTA ]**
```

---

## Tag dimensions per section (reference)

| Section type | Tag content |
|---|---|
| Room cards | Room type — `Master Suite`, `Standard Rooms (×4)` |
| Amenities | Category — `Wellness`, `Dining`, `Comfort`, `Entertainment`, `Tech` |
| Services | Inclusion — `Included`, `Add-on` |
| Location items | Distance — `8 min on foot`, `25 min by car` |
| Reviews | Stay type + month — `Couples · June 2025` |
| Day trips | Duration — `Half day`, `Full day` |

---

## File naming

```
pages/[NN]-[slug].md
```

NN = 2 chữ số. Sub-pages thêm chữ cái (`03a-master-sea.md`).

---

## Self-check trước khi save

- [ ] Không có `*italic*` ở đâu
- [ ] Không có "Heading: ..." pattern
- [ ] Buttons dạng `**[ Label ]**`
- [ ] Tags dạng `` `Tag` ``
- [ ] Section break `---`
- [ ] Không SEO meta, OG image, alt text
- [ ] Không từ blacklist (`luxury`, `5-star`, `best`, `amazing`, ...)
