# UX Copy Patterns — Villa T

> **AI INSTRUCTION:** Mọi CTA, error, success, button label trong toàn site phải lấy từ file này.
> Khi 1 trang cần microcopy mới chưa có ở đây → AI **gợi ý 2–3 phương án**, user chọn → user (hoặc AI) update file này → các trang sau dùng phiên bản chuẩn.

---

## 1. CTA labels (chuẩn cho toàn site)

### 1.1 Primary CTA (always → /check-availability)

Mọi CTA primary đều dẫn về cùng 1 form. Wording đổi theo ngữ cảnh:

- **Default (most pages):** `Check Availability`
- **Mobile sticky:** `Check Dates`
- **In-content (urgency / pricing context):** `Request a Quote`
- **On `/rates` page:** `Request a Quote`
- **In-content (rooms / villa):** `Hold Your Dates`

> Rule: trong cùng 1 page chỉ dùng tối đa **1 wording** cho primary CTA (đừng lúc `Check Availability` lúc `Request a Quote` trong cùng 1 trang).

### 1.2 Secondary CTAs
- **Explore villa:** `Tour the Villa` *(or `See the Villa`)*
- **Gallery:** `See the Gallery`
- **Reviews:** `Read Guest Stories`
- **Eat & drink:** `Browse the Menu`
- **Rooms detail:** `See the Room`
- **Services:** `Explore Services`
- **Location:** `Explore the Area`
- **Rates / how-booking-works:** `How Booking Works`

### 1.3 Tertiary / inline
- **Contact via email:** `Email Us`
- **Phone:** `Call +385 91 396 6352`
- **WhatsApp:** `Message on WhatsApp`
- **Newsletter:** `Stay in Touch`
- **PDF download:** `Download Sample Menu` / `Download Wine List`

### 1.4 Form action
- **Submit form:** `Send Inquiry`
- **Submit (contact form):** `Send Message`
- **Submit (newsletter):** `Subscribe`

---

## 2. Form — `/check-availability`

### 2.1 Field labels

| Field | Label | Placeholder | Helper |
|---|---|---|---|
| Name | Full name | Jane Doe | — |
| Email | Email | you@example.com | We'll reply here within 24 hours, with availability and a quote. |
| Phone | Phone (optional) | +1 555 0100 | Optional, but helps us reply faster. |
| Check-in | Check-in date | DD / MM / YYYY | Earliest stay date you'd like. |
| Check-out | Check-out date | DD / MM / YYYY | Minimum stay depends on season. |
| Guests | Number of guests | — | Sleeps up to twelve. |
| Children | Children (0–17) | — | Cribs and high chairs available. |
| Purpose | Purpose of stay | Select… | Helps us prepare. |
| Add-ons | Interested in | (multi-checkbox) | Tick anything you'd like included in your quote. |
| Message | Anything else? | What would make this stay perfect? | Optional. |
| Consent | Email/phone consent | (checkbox) | I'm happy to be contacted about this inquiry. |

### 2.2 Purpose dropdown values
- Family vacation
- Couples / honeymoon
- Celebration (birthday, anniversary)
- Group of friends
- Corporate retreat
- Other

### 2.3 Add-ons checkboxes
- Private chef
- Wine tasting
- Airport transfer
- Massage in your suite
- Boat charter
- Babysitting

### 2.4 Validation messages

| Trigger | Message |
|---|---|
| Empty required (name) | We'd love a name to write back to. |
| Empty required (email) | Email is how we'll reply — please add yours. |
| Invalid email | That email doesn't look right — please check. |
| Check-out before check-in | Check-out should be after check-in. |
| Stay below min nights | This season has a {{N}}-night minimum stay. |
| Guests > 12 | Villa T sleeps up to twelve guests. For larger groups, email us. |
| Generic server error | Something went wrong on our side. Try again, or email info@villatdubrovnik.com. |
| Network error | Looks like the connection dropped. Try again? |

### 2.5 Submit states

| State | Button label |
|---|---|
| Default | `Send Inquiry` |
| Hover | (no copy change) |
| Loading | `Sending…` |
| Success | (redirect → `/thank-you`) |
| Error | `Try Again` |

### 2.6 Success page hero (`/thank-you`)

```text
Thank you, {{first_name}}.
Your inquiry is in good hands.

We'll reply within 24 hours with availability and a personalised quote — usually faster.
In the meantime, here are a few ways to keep planning.
```

---

## 3. Contact form — `/contact`

### 3.1 Field labels

| Field | Label |
|---|---|
| Name | Your name |
| Email | Email |
| Reason | Reason for contact (Booking / Press / Partnership / Other) |
| Message | Message |

### 3.2 Submit
- Label: `Send Message`
- Success: *Thanks. We've received your message and will reply within 24 hours.*

---

## 4. Headings & section labels (reusable)

### 4.1 Section headings
- *Welcome to Villa T*
- *About the Villa*
- *Inside the Villa*
- *Amenities, in detail*
- *What's included*
- *Add-on services*
- *Eat & Drink*
- *Around the Villa*
- *Rates & Booking*
- *Guest stories*
- *Frequently asked*

### 4.2 Pre-footer CTA block (global)
```text
H2:  Your Dubrovnik stay begins with a single question.
Sub: Tell us your dates and group size — we'll reply within 24 hours with a personalised quote.
Primary CTA: Check Availability
Secondary:   Email Us
```

---

## 5. Empty / loading / error states

### 5.1 Empty states
- **Gallery filter no result:** *No photos in this filter yet — try another.*
- **Reviews not loaded:** *Loading guest stories…*
- **Search no result:** *Nothing here yet. Try a different word.*

### 5.2 Loading
- **Page load:** *(skeleton)* — no text needed.
- **Gallery image:** *Loading image…*
- **Map:** *Loading map…*

### 5.3 404 page
```text
H1: This page is on holiday.

Sub: The link you followed isn't here anymore. Try the homepage, or check the villa.

CTA primary: Back to Home
CTA secondary: See the Villa
```

### 5.4 500 / server error
```text
H1: Something's not quite right on our side.

Sub: Try again in a moment, or email info@villatdubrovnik.com — we'll help.

CTA: Try Again
```

---

## 6. Cookie / consent banner (GDPR)

```text
We use cookies to make the site work and to understand how it's used.
You can accept all, or choose what's on.

[Accept all]   [Customise]   [Reject non-essential]
```

---

## 7. Newsletter (optional)

```text
H3: Stay in touch.
Sub: A short note from us, two or three times a year. Seasonal availability, a new menu, an offer.

Input placeholder: you@example.com
CTA: Subscribe
Success: Thank you. We'll be in touch soon — no spam, ever.
Consent line: By subscribing, you agree to our Privacy Policy.
```

---

## 8. Trust strip (used in hero / pre-footer)

> **Note:** Chỉ dùng KHI true. Không gắn nếu chưa có proof.

- *Reply within 24 hours, often within 2*
- *Quote includes everything — no surprise fees*
- *Speak to a real person — not a bot*
- *Hold dates free for 48 hours*
- *Family-run, owner-on-site*
- *Verified on TripAdvisor / Booking.com*

---

## 9. Microcopy ngắn (button tooltips, helpers)

- **Map zoom in:** `Zoom in`
- **Map zoom out:** `Zoom out`
- **Gallery next:** `Next photo`
- **Gallery prev:** `Previous photo`
- **Gallery close:** `Close`
- **Phone tooltip:** `Tap to call`
- **Copy email:** `Copy email`
- **Email copied:** `Copied to clipboard`
- **Share page:** `Share this page`

---

## 10. Footer microcopy

- **Address line:** `Bruna Bušića 42, Dubrovnik, Croatia`
- **Hours line (optional):** `Reservations: 7 days · 9am–9pm CET`
- **Copyright:** `© {{YEAR}} Villa T Dubrovnik. All rights reserved.`
- **Legal nav:** `Privacy · Terms · House Rules · Cancellation`

---

## 11. Tone of error messages

3 nguyên tắc:
1. **Đồng cảm** trước khi sửa lỗi (*"That email doesn't look right"*, không *"Invalid input"*).
2. **Chỉ rõ** việc cần làm.
3. **Không đổ lỗi** lên user (*"please double-check"*, không *"you entered wrong"*).

---

## 12. Update protocol

Khi cần thêm microcopy mới (vd: feature mới, page mới):

1. AI propose 2–3 phương án, có rationale.
2. User chọn.
3. Add vào file này, đánh dấu `(added YYYY-MM-DD)` ngay sau label.
4. Mọi page generate sau đó dùng phiên bản đã chọn.

Ví dụ:
- `Browse the Menu` *(added 2026-05-18)* → CTA cho `/eat-drink`.
