# Plan — Generation Roadmap

Roadmap chia làm **3 PHASE × 14 STEP**. Mỗi step có đầu vào, đầu ra, và check-list rõ ràng để AI biết khi nào "done".

> **Quy tắc vận hành:**
> - Làm tuần tự từng step. Không nhảy bước.
> - Mỗi step bắt đầu bằng việc đọc lại `_foundations/*` và `_templates/page-output-schema.md`.
> - Sau mỗi step → user review → mới sang step kế.
> - Khi user chưa trả lời "Open questions" trong sitemap.md → AI dùng placeholder `{{...}}` thay vì bịa.

---

## PHASE A — Setup & Foundations  ✅ ĐANG LÀM

| Step | Tên | Trạng thái | Output |
|---|---|---|---|
| A0 | Sitemap + IA | ✅ Done | `sitemap.md` |
| A1 | Foundation files | ✅ Done | `_foundations/*.md` |
| A2 | Templates | ✅ Done | `_templates/*.md` |
| A3 | User trả lời open questions | ✅ Done (mockup cho phần còn lại) | (đã update `_foundations/villa-facts.md`) |

**Done criteria phase A:**
- Có file blueprint cho mọi page.
- Có brand voice, facts, personas, SEO, UX patterns sẵn sàng.
- User đã confirm tên villa thật + pricing approach + tech stack.

---

## PHASE B — Generate Content (page by page)

> Thứ tự ưu tiên theo **conversion impact** (page nào ảnh hưởng booking nhiều nhất → làm trước).

### Step B1 — `/check-availability` (Primary conversion page)
**Tại sao làm trước:** Đây là đích đến cuối. Khi đã có copy form ổn thì mọi CTA upstream đều "trỏ về nhà".

- **Input:** `_foundations/*` + `sitemap.md §4.12`
- **Output:** `pages/12-check-availability.md`
- **Sections cần copy:**
  - Top hero band (H1, sub)
  - 12 trường form (label + helper + placeholder + error states)
  - Right-column trust mini-blocks (3 cái)
  - FAQ inline (5 câu)
  - Submit button states (default / loading / success / failure)
- **Done khi:** Copy đầy đủ cho mọi state, không có placeholder pending.

### Step B2 — `/` Home
- **Input:** `_foundations/*` + `sitemap.md §4.1`
- **Output:** `pages/01-home.md`
- **Sections (12):** Hero · At a Glance bar · Welcome snippet · The Villa preview (3 cards) · Amenities highlights (8 icons + 1-liners) · Services preview (4 cards) · Eat & Drink · Gallery teaser · Location preview · Reviews snippet · FAQ short (4 Q) · Pre-footer CTA.
- **Done khi:** Có ≥ 2 phương án (A/B) cho Hero H1, Hero sub, primary CTA.

### Step B3 — `/the-villa` hub + 3 subpages
- **Outputs:**
  - `pages/03-the-villa.md` (hub)
  - `pages/03a-master-sea.md`
  - `pages/03b-master-old-town.md`
  - `pages/03c-standard-rooms.md`
- **Done khi:** Mỗi phòng có spec block + emotional 1-liner + "Best for" hint.

### Step B4 — `/amenities`
- **Output:** `pages/04-amenities.md`
- **Done khi:** 5 groups (Wellness/Entertainment/Kitchen/Comfort/Outdoor) đầy đủ icon labels + 1-liner mỗi item.

### Step B5 — `/services`
- **Output:** `pages/05-services.md`
- **Done khi:** "Included" list + "Add-on" list (mỗi add-on có 2 câu giới thiệu + price placeholder).

### Step B6 — `/eat-drink` (hub)
- **Output:** `pages/06-eat-drink.md`
- **Done khi:** Chef story + Wine story + 5 pairing experience labels.

### Step B7 — `/location`
- **Output:** `pages/07-location.md`
- **Done khi:** Distance table + 6 day-trip cards (mỗi card: H3 + 25 words).

### Step B8 — `/rates` (reframed: no public pricing)
- **Output:** `pages/08-rates.md`
- **Done khi:** "Why personalised pricing" + "What every quote includes" + min-stay table (no prices) + 5-step booking process + cancellation summary.
- **Lưu ý:** KHÔNG show "from €X" hay rate table. CTA primary = `Request a Quote`.

### Step B9 — `/faq`
- **Output:** `pages/09-faq.md`
- **Done khi:** 5 categories × 3–5 Q&A. Trả lời ngắn (≤ 60 words).

### Step B10 — `/gallery`
- **Output:** `pages/10-gallery.md`
- **Done khi:** Filter tab labels + 6 category descriptions + alt-text template.

### Step B11 — `/about`
- **Output:** `pages/02-about.md`
- **Done khi:** Story 3–4 đoạn + design philosophy + 4 promises + team intro placeholder.

### Step B12 — `/reviews`
- **Output:** `pages/11-reviews.md`
- **Done khi:** Hero + 3 review templates (placeholder content + structure).
- **Lưu ý:** Cần review thật — placeholder until user cung cấp.

### Step B13 — `/contact` + `/thank-you`
- **Output:** `pages/13-contact.md`, `pages/14-thank-you.md`
- **Done khi:** Đủ 2 đường rẽ (booking vs. khác) + thank-you với 3 next-step cards.

### Step B14 — Legal pages
- **Output:** `pages/15-house-rules.md`, `pages/16-cancellation.md`, `pages/17-privacy.md`, `pages/18-terms.md`
- **Done khi:** Đủ cả 4 legal page (có thể là draft chờ legal review).

---

## PHASE C — Polish & Handoff

### Step C1 — Cross-check vocabulary
- Scan toàn `pages/*.md` chống từ blacklist (`luxury`, `luxurious`, `5-star`, `best`, v.v.).

### Step C2 — Consistency check
- Tên CTA (`Check Availability`) đồng nhất, không lúc `Book Now` lúc `Check Dates`.
- Số liệu (12 guests, 6 BR) đồng nhất.

### Step C3 — Conversion review
- Mỗi page có CTA trỏ về `/check-availability`? Pre-footer CTA đầy đủ?

### Step C4 — Export bundle cho Figma
- Tạo file `pages/_master.md` gộp toàn bộ — Figma plugin "Content Reel" / "Copydoc" có thể đọc 1 file.
- Hoặc xuất `.json` nếu dùng Figma plugin lấy data dạng JSON.

---

## Order chuẩn để generate (sequence)

```
A3 (user input) →
B1 (form) → B2 (home) → B3 (villa+rooms) → B4 (amenities) → B5 (services) →
B6 (eat-drink) → B7 (location) → B8 (rates) → B9 (faq) → B10 (gallery) →
B11 (about) → B12 (reviews) → B13 (contact+thank-you) → B14 (legal) →
C1 → C2 → C3 → C4
```

**Tổng:** 18 file output trong `pages/` + 1 file master.

---

## Estimate (chỉ tham khảo)

- 1 page nhỏ (FAQ inline, Thank you): ~1 generation turn.
- 1 page trung bình (About, Services, Location): ~1 turn.
- 1 page lớn (Home, Villa hub, Form check-availability): ~2 turns (gen + revise).
- Legal: ~1 turn (draft, user mang đi cho legal review sau).

→ Tổng ~ 20 turn để hoàn thành phase B nếu user trả lời input nhanh.

---

## Status board (live)

| Step | Status | File output |
|---|---|---|
| A0 | ✅ | `sitemap.md` |
| A1 | ✅ | `_foundations/*` |
| A2 | ✅ | `_templates/*` |
| A3 | ✅ | `villa-facts.md` updated (8 confirmed + 13 mockups marked) |
| B1 | ✅ | `pages/12-check-availability.md` |
| B2 | ✅ | `pages/01-home.md` |
| B3 | ✅ | `pages/03*.md` (hub + 3a/3b/3c) |
| B4 | ✅ | `pages/04-amenities.md` |
| B5 | ✅ | `pages/05-services.md` |
| B6 | ✅ | `pages/06-eat-drink.md` |
| B7 | ✅ | `pages/07-location.md` |
| B8 | ✅ | `pages/08-rates.md` |
| B9 | ✅ | `pages/09-faq.md` |
| B10 | ✅ | `pages/10-gallery.md` |
| B11 | ✅ | `pages/02-about.md` |
| B12 | ✅ | `pages/11-reviews.md` (mockup reviews) |
| B13 | ✅ | `pages/13-contact.md`, `pages/14-thank-you.md` |
| B14 | ✅ | `pages/15..18-*.md` (legal, draft for legal review) |
| C1 | ✅ | Blacklist scan passed |
| C2 | ⏳ | Consistency check (CTA wording, numbers) — optional |
| C3 | ⏳ | Conversion review — optional |
| C4 | ✅ | `pages/_master.md` (92KB bundle) |

> Mỗi lần làm 1 step xong, cập nhật status table này.
