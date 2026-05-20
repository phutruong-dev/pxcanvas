# Villa T — Sitemap & Content Blueprint

> Tài liệu nền tảng để generate nội dung cho website cho thuê **Villa T**.
> Tham khảo cấu trúc & tone từ [villatdubrovnik.com](https://www.villatdubrovnik.com/), đồng thời bổ sung những gì site gốc còn thiếu (form check availability rõ ràng, rates, FAQ, reviews, location, SEO content depth).
>
> **Mục tiêu chính (primary goal):** Đưa khách tiềm năng → tìm hiểu → submit form "Check Availability".
> **Mục tiêu phụ:** Tăng độ tin cậy (cảm giác riêng tư, thoải mái, dịch vụ trọn gói), tối ưu SEO cho từ khoá "private villa Dubrovnik / villa with pool rental".
>
> **Quy ước ngôn ngữ:** Tránh từ "luxury / luxurious / 5-star / premium-as-marketing". Truyền tải sự cao cấp qua **chi tiết cụ thể** (vd: *heated infinity pool*, *ensuite bedrooms*, *24-hour reply*) thay vì label sáo rỗng. Chi tiết xem [`_foundations/brand-voice.md`](./_foundations/brand-voice.md).

---

## 1. Tổng quan dự án

### 1.1 Định vị (Positioning)
- **Tagline gợi ý:** *"Simple. Considered. Yours for a while."*
- **Hạng:** Private full-service villa rental — không phải hotel, không phải Airbnb cơ bản.
- **Khác biệt cốt lõi (USP):**
  1. **Vị trí:** Đi bộ tới Old Town Dubrovnik, view biển Adriatic + đảo Lokrum.
  2. **Quy mô:** Villa 5 tầng, 6 phòng ngủ (2 master + 4 standard), sức chứa 12 khách — phù hợp 1–2 gia đình hoặc nhóm bạn.
  3. **Wellness on-site:** 2 hồ bơi infinity sưởi ấm (trong nhà + ngoài trời), jacuzzi, sauna hồng ngoại, sàn sưởi ấm phòng tắm.
  4. **Trọn gói dịch vụ:** Bữa sáng tuỳ chọn, dọn phòng hàng ngày, đầu bếp riêng, hầm rượu, massage, late check-out.
  5. **Giá trị:** Trải nghiệm "private resort" — không phải khách sạn nhưng đầy đủ tiện ích.

### 1.2 Persona khách hàng
| Persona | Mô tả | Pain points | Cần thấy gì để book |
|---|---|---|---|
| **The Family Planner** (35–55) | 1–2 gia đình đi cùng, có trẻ em, cần không gian riêng | An toàn cho trẻ, đủ phòng tắm, gần điểm tham quan | Phòng ngủ chi tiết, dịch vụ ăn uống tại villa, dễ liên hệ |
| **The Celebration Group** (30–50) | Sinh nhật, kỷ niệm, hen party, retreat bạn bè | Trải nghiệm "wow", chụp ảnh đẹp, đủ giường | Gallery chất lượng, hầm rượu, hồ bơi, không gian event |
| **The Discerning Couple** (40–65) | Cặp đôi cao cấp, anniversary, honeymoon | Riêng tư, sang trọng, service chu đáo | About story, chef service, location, reviews |
| **The Corporate Retreat** (35–55) | Team offsite, executive retreat | Wi-Fi mạnh, không gian họp, transfer | Wi-Fi tốc độ cao, sảnh chung, dịch vụ concierge |

### 1.3 Brand Voice
- **Tone:** Refined nhưng ấm áp, không phô trương. Tránh sáo rỗng kiểu "the most amazing".
- **Phong cách:** Câu ngắn, gợi giác quan (cảm giác, hình ảnh, mùi vị). Dùng động từ chủ động.
- **3 từ định nghĩa:** *Effortless · Curated · Warm.*
- **Không bao giờ dùng:** "best in the world", "5-star", emoji, slang, all-caps text marketing.
- **Ngôn ngữ chính:** English (primary). Khuyến nghị bản dịch: Croatian, French, German, Italian — pha 2 (Phase 2).

---

## 2. Information Architecture (Cây site)

```
/ (Home)
├── /about
├── /the-villa                        ← gộp Rooms vào đây
│   ├── /the-villa/master-suite-sea
│   ├── /the-villa/master-suite-old-town
│   └── /the-villa/standard-rooms
├── /amenities
├── /services                         ← tách riêng từ Home để SEO
├── /eat-drink
│   ├── /eat-drink/private-chef
│   └── /eat-drink/wine-cellar
├── /gallery
├── /location                         ← NEW: Old Town, Lokrum, transfer
├── /rates                            ← NEW: seasonal pricing & inclusions
├── /faq                              ← NEW
├── /reviews                          ← NEW: guest testimonials
├── /check-availability  ★ PRIMARY    ← form chính, mọi CTA đổ về đây
├── /contact                          ← phụ: email, phone, map
├── /thank-you                        ← post-submit
└── Legal
    ├── /house-rules
    ├── /cancellation-policy
    ├── /privacy
    └── /terms
```

**Nguyên tắc IA:**
- Tối đa 2 cấp trong main nav để không rối.
- `Check Availability` luôn xuất hiện dưới dạng nút sticky trên header + footer mọi trang.
- `Gallery`, `Reviews`, `Location` là 3 trang "thuyết phục" — phải linkable từ mọi CTA secondary.

### 2.1 Main Navigation (Header)
`Home · The Villa · Amenities · Eat & Drink · Gallery · Location · Reviews · [Check Availability] (button primary)`

### 2.2 Footer
- **Cột 1 — Brand:** Logo + tagline + 1 dòng mô tả.
- **Cột 2 — Explore:** The Villa, Amenities, Eat & Drink, Gallery.
- **Cột 3 — Plan Your Stay:** Rates, FAQ, Location, House Rules, Cancellation.
- **Cột 4 — Contact:** Address (Bruna Bušića 42, Dubrovnik), Email, Phone (+385 91 396 6352), Instagram.
- **Bar dưới:** © 2026 Villa T · Privacy · Terms · Sitemap

---

## 3. Global Elements (dùng lại trên mọi trang)

### 3.1 Sticky CTA (header)
- Desktop: nút `Check Availability` góc phải header, màu accent.
- Mobile: nút full-width fixed bottom — `Check Dates`.

### 3.2 Trust Bar (ngay dưới hero hoặc trước footer)
Logos/badges: *Featured in… · 4.9★ on Booking.com · TripAdvisor Travelers' Choice · Verified Host* (chỉnh theo thực tế).

### 3.3 Pre-footer CTA Block (mọi trang trừ /check-availability và /thank-you)
- **H2:** *Your Dubrovnik escape begins with a single question.*
- **Sub:** *Tell us your dates — we'll confirm availability within 24 hours.*
- **CTA primary:** `Check Availability`
- **CTA secondary:** `Email Us` (mailto:info@villatdubrovnik.com)

### 3.4 Form chính — "Check Availability" (component)
Trường (theo thứ tự):
1. Full name *
2. Email *
3. Phone (with country code) — optional but recommended
4. Check-in date *
5. Check-out date *
6. Number of guests * (dropdown 1–12)
7. Number of children (0–8)
8. Purpose of stay (dropdown: Family vacation / Couples / Celebration / Corporate retreat / Other)
9. Add-on interests (checkbox group): Private chef · Wine tasting · Airport transfer · Massage · Boat charter
10. Message — free text, optional
11. Consent (checkbox): *I agree to receive a reply by email/phone regarding my inquiry.*
12. Submit button: `Send Inquiry`

**Microcopy (form):**
- Heading: *Check Availability*
- Sub: *No obligation. We'll get back to you within 24 hours, often much sooner.*
- Below submit: *We respond personally — your inquiry goes straight to our reservations team, not a bot.*
- Success state: *Thank you, [first name]. We've received your inquiry and will reply within 24 hours. While you wait, [explore our gallery](/gallery).*

### 3.5 Form phụ — "Contact" (chỉ trên /contact)
Trường tối giản: Name, Email, Message. Dùng cho câu hỏi không liên quan booking.

---

## 4. Trang chi tiết — Content Blueprint

> Mỗi trang dưới đây gồm: **Meta · Mục tiêu · Sections · UX copy mẫu · SEO · Assets**. Dùng làm input trực tiếp cho generate nội dung sau này.

---

### 4.1 `/` — Home

**Meta**
- Title (≤60 ký tự): `Villa T Dubrovnik | Private Villa with Heated Pools`
- Meta description (≤155): `A 5-floor private villa near Dubrovnik's Old Town. Sleeps 12 in 6 ensuite bedrooms with heated pools, spa, and a private chef on request. Check dates.`
- Primary keywords: *private villa Dubrovnik, Dubrovnik villa with private pool, villa rental Dubrovnik Old Town*
- OG image: hero-twilight-pool.jpg

**Mục tiêu**
- 70% visitor hiểu villa là gì trong 8 giây đầu.
- 25%+ scroll xuống "Check Availability" hoặc click vào trang con thuyết phục (Gallery / The Villa / Reviews).
- 5–8% submit form ngay tại Home.

**Sections (theo thứ tự cuộn)**

| # | Section | Mục đích | Content blocks |
|---|---|---|---|
| 1 | **Hero** | Định vị tức thì + CTA | H1, sub, 1 CTA primary (`Check Availability`), 1 secondary (`Explore the Villa`), nền video/photo |
| 2 | **At a Glance** (sticky stats bar) | Trust nhanh | 6 BR · 12 guests · 5 floors · 2 heated pools · 8-min walk to Old Town |
| 3 | **Welcome / Story snippet** | Cảm xúc + thương hiệu | H2, 2–3 câu, link → /about |
| 4 | **The Villa preview** | Show rooms | 3 cards: Master Sea View, Master Old Town View, 4 Standard Rooms. Mỗi card → /the-villa/[slug] |
| 5 | **Amenities highlights** | Visual proof | Icon grid 8 mục đặc trưng: Heated infinity pools, Sauna, Hot tub, Wine cellar, Outdoor kitchen, Elevator, Sea view, Walk to Old Town. CTA → /amenities |
| 6 | **Services & Concierge** | Premium positioning | 4 cards: Breakfast, Daily Housekeeping, Private Chef, Massage. CTA → /services |
| 7 | **Eat & Drink** | Lifestyle hook | Image-led block, Chef story 2 câu + Wine cellar 2 câu, CTA → /eat-drink |
| 8 | **Gallery teaser** | Visual decision-maker | Masonry 6–9 ảnh, CTA → /gallery |
| 9 | **Location & Experiences** | Geo proof | Map preview + 3 highlights (Old Town, Lokrum, Cavtat). CTA → /location |
| 10 | **Reviews** | Social proof | 3 review cards (rotating), aggregate rating, CTA → /reviews |
| 11 | **FAQ short** | Reduce friction | 4 câu hỏi đầu: Pricing? Minimum stay? Pets? Transfer?, CTA → /faq |
| 12 | **Pre-footer CTA** (global) | Conversion | Form embed or button CTA |

**UX copy mẫu (Home Hero)**

- H1 option A: *Six bedrooms. Two heated pools. One view that earns its quiet mornings.*
- H1 option B: *Your private Dubrovnik villa, eight minutes from the Old Town walls.*
- H1 option C: *Villa T — where Dubrovnik slows down.*
- Sub: *A 5-floor private villa sleeping twelve, with sea views over Lokrum, two heated infinity pools, and a team that handles every detail.*
- CTA primary: `Check Availability`
- CTA secondary: `Tour the Villa`

**SEO notes**
- H1 phải chứa "private villa" + "Dubrovnik".
- Schema.org: `LodgingBusiness` + `Place` markup.
- Alt text mọi ảnh hero phải có "Villa T Dubrovnik" + chi tiết phòng/khu.
- Internal links: tối thiểu 8 link tới trang con.

**Assets cần**
- Hero hero-twilight-pool.mp4 (10s loop, ≤2MB) hoặc .jpg 1920×1080.
- 3 ảnh phòng (master sea, master old-town, standard).
- 9 ảnh gallery teaser.
- Logos trust bar.
- 3 ảnh portrait (review headshots).

---

### 4.2 `/about` — About Villa T

**Meta**
- Title: `About Villa T Dubrovnik | Our Story & Hospitality`
- Meta description: `Villa T was built around one idea: effortless comfort close to Dubrovnik's Old Town. Meet the team behind your stay.`
- Keywords: *Dubrovnik villa story, private villa hosts Dubrovnik*

**Mục tiêu**
- Tăng độ tin cậy & cảm xúc — biến "anonymous villa" thành "story you remember".
- Thu hút khách "values-driven" (couples, anniversary, repeat).

**Sections**
1. **Hero** — H1: *About Villa T* · Sub 1 dòng.
2. **Our Story** — 3–4 đoạn (founder background, why this villa, design philosophy).
3. **Design Philosophy** — 3 trụ cột: *Service · Design · Simplicity.* Mỗi trụ 2 câu.
4. **Meet the Team** — Owner/host portrait + bio + concierge lead + housekeeping lead (optional).
5. **Our Promise** — 4 cam kết (response time, cleaning standard, privacy, sustainability).
6. **Sustainability & Community** — 1 đoạn: solar, local sourcing, support local artisans.
7. **Pre-footer CTA.**

**UX copy mẫu**
- H1: *Where simple meets considered.*
- Promise block:
  - *Reply within 24 hours, every time.*
  - *Hospital-grade cleaning between every stay.*
  - *Your privacy, always.*
  - *Local, sustainable, and proud of it.*

---

### 4.3 `/the-villa` — The Villa (hub)

**Meta**
- Title: `The Villa | 6 Ensuite Bedrooms, 5 Floors, Sea Views | Villa T Dubrovnik`
- Meta description: `Tour Villa T — a 5-floor private villa with 2 master suites and 4 ensuite standard rooms, all with sea views, AC, and floor-heated bathrooms.`
- Keywords: *Dubrovnik villa 6 bedrooms, private villa 12 guests Dubrovnik*

**Mục tiêu**
- Show toàn bộ tầng + phòng để giải đáp "đủ chỗ cho nhóm tôi?"
- Định hướng tới subpage chi tiết theo từng loại phòng.

**Sections**
1. **Hero** — *Six bedrooms. Five floors. One view that never gets old.*
2. **Floor Plan / Layout overview** — Diagram 5 tầng (illustration). Caption từng tầng:
   - Tầng -1: Spa floor (indoor pool, sauna, hot tub, chill-out + bar + pool table)
   - Tầng 0: Living + outdoor kitchen + outdoor pool + dining terrace
   - Tầng 1: Master Suite Sea View + 2 Standard rooms
   - Tầng 2: Master Suite Old-Town View + 2 Standard rooms
   - Roof: Sunset deck
3. **Room Cards (3 cards → subpages)**
   - Master Suite Sea View
   - Master Suite Old-Town View
   - The Standard Rooms (×4)
4. **Shared Comforts** — Elevator, Sonos, AC, Wi-Fi, Smart locks.
5. **Pre-footer CTA.**

**Subpages:**

#### 4.3.a `/the-villa/master-suite-sea`
- **Mục tiêu:** Là phòng "anchor" cho couples/honeymoon.
- **Sections:** Hero photo + H1 · Quick specs (bed, view, m²) · 8 ảnh carousel · Bullet features (Super King XL bed, Hot-tub bath, Curated bath amenities, Satellite TV, AC, Bathroom floor heating, Sea view, Black-out drapes) · "Best for" block (1–2 guests, anniversary) · Adjacent rooms · CTA.

#### 4.3.b `/the-villa/master-suite-old-town`
- Tương tự, nhấn balcony + view Old Town walls.

#### 4.3.c `/the-villa/standard-rooms`
- 4 phòng giống nhau, mỗi phòng có biến thể nhỏ. Mô tả chung + grid 4 phòng.

**UX copy mẫu (room card)**
- Heading: *Master Suite — Sea View*
- 1-liner: *King-size comfort, a hot-tub bath, and the Adriatic at sunrise.*
- CTA: `See the room`

---

### 4.4 `/amenities` — Amenities

**Meta**
- Title: `Villa Amenities | Heated Pools, Spa, Sauna, Wine Bar | Villa T Dubrovnik`
- Meta description: `Indoor and outdoor heated pools, infrared sauna, hot tubs, outdoor kitchen, wine cellar, elevator — every amenity at Villa T.`

**Mục tiêu**
- Liệt kê đầy đủ tiện ích để comparison shopping → quyết định.
- Tăng SEO long-tail (e.g., "Dubrovnik villa with infrared sauna").

**Sections — group theo nhóm thay vì list đều như site gốc**

1. **Hero** — *Everything you'd expect from a hotel. Nothing you wouldn't want at home.*
2. **Wellness & Pools**
   - Indoor heated infinity pool with swim-jet
   - Outdoor heated infinity pool
   - Hot tub jacuzzi (indoor)
   - Hot-tub bath (in master)
   - Infrared sauna
   - Massage on request
3. **Entertainment & Living**
   - Pool/snooker table
   - Sonos sound system (whole house)
   - Satellite TV in every room
   - Chill-out room with bar
   - Wine cellar
4. **Kitchen & Dining**
   - Fully equipped indoor kitchen
   - Outdoor kitchen with barbecue
   - Outdoor dining for 12
   - Private chef on request
5. **Comfort & Convenience**
   - Elevator (5 floors)
   - Bathroom floor heating
   - Pool-area floor heating
   - AC in every room
   - High-speed Wi-Fi
   - Free on-site parking (2 cars)
6. **Pre-footer CTA.**

**UX copy mẫu**
- Mỗi item có icon + 1 dòng (tối đa 12 chữ).
- *"Indoor heated infinity pool — swim against the jet, year-round."*

---

### 4.5 `/services` — Services (NEW)

**Meta**
- Title: `Concierge Services | Chef, Housekeeping, Transfers | Villa T Dubrovnik`
- Meta description: `From private chefs to massage in your suite, our concierge handles every detail of your Dubrovnik stay.`

**Sections**
1. Hero — *A team, on call.*
2. **Included in every stay**
   - Daily housekeeping
   - High-speed Wi-Fi
   - Welcome basket
   - Local SIM (optional)
3. **Add-on services** (mỗi mục: ảnh + 1 đoạn + "from €X / inquire")
   - Breakfast service (Continental / English / American / Regional / Vegetarian / Vegan)
   - Private chef — lunch & dinner
   - Massage in your suite
   - Wine tasting from our cellar
   - Airport transfer (Dubrovnik DBV)
   - Boat charter — Lokrum, Elaphiti islands
   - Babysitting
   - Yacht & helicopter on request
4. **How requests work** — 3 bước: Inquire → Confirm → Enjoy.
5. Pre-footer CTA.

---

### 4.6 `/eat-drink` — Eat & Drink (hub)

**Meta**
- Title: `Private Chef & Wine Cellar | Villa T Dubrovnik`
- Meta description: `Seasonal menus by private chefs and a curated Croatian wine list — dine in at Villa T.`

**Sections**
1. Hero — *Dinner, the long way.*
2. **The Private Chef** — Story 2–3 đoạn (chef intro, philosophy, sample menu CTA → PDF link).
3. **Sample Menu** — Embed PDF preview hoặc list 5–7 món.
4. **The Wine Cellar** — Story + 4 producers highlight + PDF wine list link.
5. **Pairing experiences** — Wine flight, cooking class, market tour.
6. CTA: `Reserve a chef night` → form trên /check-availability với pre-checked add-on.

#### 4.6.a `/eat-drink/private-chef` & 4.6.b `/eat-drink/wine-cellar`
- Optional Phase 2 deep-dives.

---

### 4.7 `/gallery` — Gallery

**Meta**
- Title: `Photo Gallery | Villa T Dubrovnik`
- Meta description: `Photos of Villa T Dubrovnik — bedrooms, heated pools, sea views, dining, and the Old Town just minutes away.`

**Sections**
1. Hero — minimal: *See for yourself.*
2. **Filter tabs:** All · Exterior · Pools & Spa · Bedrooms · Dining · Living · Old Town & Surrounds
3. Masonry grid (lazy-load), lightbox.
4. Pre-footer CTA.

**Asset spec:** Tối thiểu 40 ảnh, 1920px width, .webp + .avif, alt text descriptive (e.g., "Outdoor heated infinity pool overlooking Old Town Dubrovnik at sunset").

---

### 4.8 `/location` — Location & Experiences (NEW)

**Meta**
- Title: `Location | Walking Distance to Dubrovnik Old Town | Villa T`
- Meta description: `Villa T sits 8 minutes from Dubrovnik's Old Town walls, with views over Lokrum island. See distances, transfers, and what to do.`

**Sections**
1. **Hero** — *Eight minutes from the walls.* Map preview.
2. **The neighborhood** — Bruna Bušića area: quiet, residential, safe.
3. **Distances** (table):
   | Destination | By foot | By car |
   |---|---|---|
   | Old Town (Pile Gate) | 8 min | 3 min |
   | Banje Beach | 12 min | 4 min |
   | Cable Car to Mount Srđ | 10 min | 4 min |
   | Dubrovnik Airport (DBV) | — | 25 min |
   | Cavtat | — | 20 min |
4. **Day-trip ideas** — 6 cards: Lokrum, Elaphiti islands, Mljet, Konavle wine country, Kotor (Montenegro), Korčula.
5. **Map** (Google Maps embed).
6. **Getting here** — Airport transfer info + driving directions + boat option.
7. Pre-footer CTA.

---

### 4.9 `/rates` — Rates & Booking Info  *(reframed: NO public pricing)*

**Meta**
- Title: `Rates & Booking | Villa T Dubrovnik`
- Meta description: `Rates at Villa T vary by season and group size. Tell us your dates and we'll send a personalised quote within 24 hours.`

**Mục tiêu:**
- Đặt kỳ vọng rằng giá **không công khai** (philosophy, không phải gimmick).
- Mô tả mọi thứ **không phải là số tiền**: what's included, min-stay, booking flow, cancellation policy.
- Đẩy 100% traffic xuống form Request-a-Quote.

> **Quy ước:** KHÔNG show "from €X". KHÔNG bảng rate có giá. Chỉ show min-stay & nguyên tắc.

**Sections**
1. **Hero** — Heading nhấn mạnh quote cá nhân hoá, sub giải thích vì sao.
   - Example H1: *Every quote, personalised within 24 hours.*
   - Sub: *Rates at Villa T depend on the season, length of stay, group size, and the services you choose. Tell us a little, we'll send a quote — no portals, no surprise fees.*
2. **Why personalised pricing** — 3 lý do ngắn:
   - *Quotes include everything: housekeeping, taxes, pool heating, welcome basket.*
   - *We don't add fees you didn't see on the website.*
   - *Long-stay guests get a fairer price — flat rates can't do that.*
3. **What every quote includes** — Bed linen & towels, daily housekeeping, Wi-Fi, free parking (2 cars), year-round pool heating, welcome basket, all taxes & cleaning.
4. **Add-ons available** (priced in quote, not on website) — Private chef, transfers, massage, wine tasting, boat charter, babysitting.
5. **Minimum stay by season** *(no prices)* — table:
   | Season | Months | Minimum nights |
   |---|---|---|
   | Low | Nov–Mar | 3 |
   | Shoulder | Apr, May, Oct | 4 |
   | Mid | Jun, Sep | 5 |
   | Peak | Jul, Aug | 7 |
   | Holidays | Xmas, NY, Easter | 7 |
6. **How booking works** — 5 bước:
   1. Send your dates and group size.
   2. We reply within 24 hours with availability and a quote.
   3. Quote held free for 48 hours.
   4. 30% deposit confirms your booking *(mockup — confirm)*.
   5. Balance due 30 days before check-in.
7. **Cancellation summary** + link → /cancellation-policy.
8. **CTA section** — Primary: `Request a Quote` (→ /check-availability with pre-filled context).
9. Pre-footer CTA (global).

---

### 4.10 `/faq` — FAQ (NEW)

**Meta**
- Title: `Frequently Asked Questions | Villa T Dubrovnik`
- Meta description: `Answers to common questions about Villa T — bookings, payments, pets, minimum stay, and more.`

**Categories & câu hỏi mẫu (gen full answer sau):**

**Booking & payment**
- How do I check availability?
- What's the minimum stay?
- How much is the deposit?
- Which payment methods do you accept?
- What's the cancellation policy?

**The villa**
- How many guests can stay?
- Are children welcome?
- Are pets allowed?
- Is the villa accessible?
- Is there an elevator?

**Services**
- Is breakfast included?
- Can you arrange a private chef?
- Do you offer airport transfers?

**Location & arrival**
- How far is the Old Town?
- Where is the nearest beach?
- How do we get from the airport?

**Stay rules**
- Can we host an event or party?
- What time is check-in / check-out?
- Is smoking allowed?

**SEO note:** Mark up with `FAQPage` schema.

---

### 4.11 `/reviews` — Reviews & Testimonials (NEW)

**Meta**
- Title: `Guest Reviews | Villa T Dubrovnik`
- Meta description: `Read what guests say about their stay at Villa T Dubrovnik — verified reviews from families, couples, and groups.`

**Sections**
1. Hero — *In their own words.* + aggregate rating + count.
2. **Featured story** — 1 long-form review (couples/family).
3. **Review grid** — 9–12 review cards (name, country, date, rating, quote, type of stay tag).
4. **External proof** — TripAdvisor / Booking.com / Google logos with rating.
5. CTA — *Plan your story.*

---

### 4.12 `/check-availability` ★ PRIMARY CONVERSION

**Meta**
- Title: `Check Availability & Request a Quote | Villa T Dubrovnik`
- Meta description: `Tell us your dates and group size. We'll reply within 24 hours with availability and a personalised quote.`
- No-index? **No** — keep indexable, but prioritize CTA UX.

**Mục tiêu:** Submission rate ≥ 40% landing visitors.

**Sections**
1. **Top hero band** — *Check Availability & Request a Quote* + sub *No obligation. We reply within 24 hours with availability and a personalised quote.*
2. **Form** (section 3.4 above) — chiếm 60% above-the-fold trên desktop.
3. **Right column** (desktop) — 3 mini blocks:
   - *Reply within 24 hours, often within 2.*
   - *Speak to a human — not a chatbot.*
   - *Hold dates for 48 hours, free.*
4. **Below form** — 3 ảnh villa rotating (giảm "form anxiety").
5. **FAQ inline** — 5 câu hỏi từ /faq embed (Pricing, Min stay, Deposit, Cancellation, Children).
6. **Trust strip** — same as global.
7. **Footer minimal** — không show pre-footer CTA giant (đã có form).

**UX copy chi tiết:**
- Field label "Check-in date": *When would you like to arrive?*
- Field helper "Phone": *Optional, but helps us reply faster.*
- Error empty name: *We'd love a name to write back to.*
- Error invalid email: *Please double-check your email — that's how we'll reply.*
- Submit pending: *Sending your inquiry…*
- Submit success → redirect to `/thank-you`.

---

### 4.13 `/contact` — Contact

**Meta**
- Title: `Contact Villa T Dubrovnik`
- Meta description: `Get in touch with Villa T Dubrovnik — for booking inquiries, press, or partnerships.`

**Sections**
1. Hero — *Get in touch.*
2. **2 đường rẽ rõ ràng:**
   - *Booking an inquiry?* → CTA to /check-availability (BIG button).
   - *Anything else?* → Mini contact form (Name, Email, Reason dropdown, Message).
3. **Direct details** — Email, Phone, Instagram, Address.
4. **Map embed.**
5. **Press & partnerships** — separate email if applicable.

---

### 4.14 `/thank-you` — Inquiry Submitted

**Meta** — `noindex,nofollow`

**Sections**
1. Headline: *Thanks, [first name]. Your inquiry is in good hands.*
2. Sub: *We'll reply within 24 hours — usually faster. In the meantime…*
3. **3 cards:** Browse the gallery · Read guest reviews · Discover Dubrovnik (location).
4. **Add to calendar** — placeholder block with check-in/out dates.
5. Trust strip + social follow.

---

### 4.15 Legal / Policy pages

#### `/house-rules`
- Check-in/out hours
- Quiet hours
- Smoking policy (no smoking indoors)
- Events & parties (case-by-case + fee)
- Children & pool safety
- Pets (case-by-case)
- Damage policy & security deposit
- Linens & towels usage

#### `/cancellation-policy`
- Free cancellation window
- Partial refund window
- Non-refundable window
- Force majeure clauses
- Refund process & timeline

#### `/privacy`
- Data collected (form fields)
- Cookies
- Third parties (Google Analytics, booking software)
- GDPR rights (right to access, delete)
- Contact for data requests

#### `/terms`
- Booking T&C
- Liability
- Image rights
- Jurisdiction (Croatian law)

---

## 5. Conversion Funnel & CTA Map

```
 Awareness            Consideration             Decision              Action
─────────────       ──────────────────       ──────────────         ──────────────
Home Hero        →  The Villa / Gallery   →  Rates + FAQ        →  /check-availability
 (or)              Eat&Drink / Services      Reviews / Location    /contact (secondary)
SEO landing      →  About                 →  Sticky CTA          
```

**CTA hierarchy:**
- **Primary CTA (every page above-the-fold):** `Check Availability`
- **Secondary CTA:** `Tour the Villa` / `See Gallery` / `Read Reviews`
- **Tertiary (footer/pre-footer):** `Email us` / `Call +385 91 396 6352`

**Exit-intent (optional):** Lightbox với *"Not ready yet? Get our 5-day Dubrovnik guide."* → email capture.

---

## 6. Mobile-first Considerations
- Hero H1 ≤ 8 từ, sub ≤ 14 từ.
- Sticky bottom bar trên mobile: nút full-width `Check Dates` + icon phone.
- Form date picker: native mobile, fallback Flatpickr.
- Gallery: 1-column scroll, swipe lightbox.
- Cuộn dài OK với điều kiện scannable (icons, headings, không khối text > 4 dòng).

---

## 7. SEO Content Strategy

### 7.1 Keyword clusters
| Cluster | Trang đích | Keywords chính |
|---|---|---|
| **Brand** | / | villa t dubrovnik |
| **Private villa** | / · /the-villa | private villa Dubrovnik, Dubrovnik villas with private pool, villa rental Dubrovnik |
| **Capacity** | /the-villa · /rates | villa for 12 guests Dubrovnik, 6 bedroom villa Dubrovnik |
| **Amenities long-tail** | /amenities | Dubrovnik villa heated pool, villa with sauna Dubrovnik |
| **Location** | /location | villa near Old Town Dubrovnik, walk to Old Town Dubrovnik |
| **Food** | /eat-drink | private chef villa Dubrovnik, Croatian wine villa rental |
| **Local intent** | /location | things to do Dubrovnik, day trips from Dubrovnik |
| **Booking flow** | /rates · /check-availability | request a quote Dubrovnik villa, Dubrovnik villa availability, minimum stay villa Dubrovnik, villa Dubrovnik cancellation |

### 7.2 Content blog ideas (Phase 2 — `/journal`)
- *"A week in Dubrovnik: a slow-paced itinerary"*
- *"The best beaches near Old Town Dubrovnik"*
- *"What to eat in Dubrovnik: a private chef's picks"*
- *"Lokrum island: half a day, a kayak, and a peacock"*
- *"Christmas at Villa T: the quiet season we love"*

### 7.3 Technical SEO
- Schema: `LodgingBusiness`, `Place`, `FAQPage`, `ImageObject` (gallery), `Review` + `AggregateRating`.
- Image alt: descriptive, "Villa T Dubrovnik" + context.
- Internal links: ≥ 4 per page.
- Sitemap.xml auto-gen.
- hreflang khi pha 2 (multilingual).

---

## 8. Content Generation Prompts (for future use)

Khi cần generate nội dung từng trang, dùng prompt template sau (Vietnamese instruction → English output):

```
ROLE: You are a hospitality copywriter writing for Villa T Dubrovnik.

BRAND VOICE:
- Refined but warm. Sensory, never flashy.
- 3 keywords: Effortless · Curated · Warm.
- Never use: "luxury", "luxurious", "5-star", "best", "amazing", emojis, all-caps marketing.
- Convey quality through specifics (heated, ensuite, on-call, hand-picked), not adjectives.

CONTEXT:
- Villa T is a 5-floor private villa, 6 ensuite bedrooms (2 master + 4 standard),
  sleeps 12, walking distance (8 min) to Dubrovnik Old Town, view over Lokrum.
- Heated indoor + outdoor infinity pools, sauna, hot tub, wine cellar,
  private chef on request, daily housekeeping, elevator.

PAGE: [trang nào, e.g., /the-villa/master-suite-sea]
PRIMARY GOAL: [goal trang, e.g., convince couples to book this room]
SECTION: [section nào, e.g., room features]
LENGTH: [e.g., 80–120 words]
TONE NOTES: [e.g., intimate, sunrise mood]

OUTPUT:
- H1, sub, body, 1 CTA copy
- Plain text, no markdown decoration unless requested.
```

---

## 9. Roadmap

### Phase 1 — Must-have (launch)
Home · About · The Villa (hub + master sea + master old-town + standard) · Amenities · Eat & Drink (hub) · Gallery · Location · Rates · FAQ · Check Availability · Contact · Thank-you · Legal (4).

### Phase 2 — Nice-to-have
Reviews (chờ thu thập đủ 12 reviews verified) · Services (tách trang) · Private chef & Wine cellar deep-dives · Journal/blog · Multilingual (HR/FR/DE/IT) · Online instant-quote calculator · Live chat.

### Phase 3 — Growth
Loyalty referral page · Press kit · Partner page (wedding planners, yacht charters) · Concierge marketplace integration · Direct booking engine.

---

## 10. Open Questions (cần user trả lời trước khi generate content)

1. **Tên villa:** "Villa T" là tên cuối hay placeholder? Có nằm ở Dubrovnik thật không hay địa điểm khác?
2. **Pricing:** Có công bố rate cụ thể không, hay chỉ "from €X / inquire"?
3. **Số phòng/sức chứa:** Giữ nguyên 6 BR / 12 guests, hay khác?
4. **Min stay & seasons:** Đã có dữ liệu mùa & min stay chưa?
5. **Reviews:** Đã có review thật chưa, hay cần placeholder?
6. **Ngôn ngữ:** Launch English-only, hay multilingual từ đầu?
7. **Tech stack:** Wix, Webflow, WordPress, hay custom? (ảnh hưởng form integration, schema markup.)
8. **Booking flow:** Form inquiry rồi confirm manually, hay tích hợp engine (Lodgify, Hostfully, Smoobu)?
9. **Add-ons mặc định:** Phần "Add-on services" giữ những mục nào (chef, massage, transfer, boat, baby-sitting)?
10. **Brand asset:** Đã có logo + colour + font system chưa, hay cần đề xuất?

---

*Sitemap version 1.0 · last updated 2026-05-18*
