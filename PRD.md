# PRD — PXcanvas

> Mô tả ngắn: Web app local cho UI/UX designer, biến link website tham khảo hoặc mô tả yêu cầu thành sitemap edit được trên canvas, rồi generate ra file `.md` content wireframe-ready theo conversion-focus format và brand voice của project.

---

## ① Overview

- **App name:** PXcanvas
- **Tagline:** Content wireframe-ready trong vài phút.
- **Problem:** Mỗi project wireframe phải tự nghĩ sitemap từ đầu (tốn thời gian, dễ sót page). Dùng lorem ipsum thì wireframe trông fake, không test được hierarchy thật. Generate bằng ChatGPT thì content rời rạc, lệch brand voice, format lộn xộn không paste thẳng vào Figma được. Không có quy trình chuẩn, mỗi project lặp lại từ đầu.
- **Solution:** Input là link website tham khảo và/hoặc form mô tả yêu cầu. Step 1: AI phân tích input → đề xuất cải tiến UX → user chọn → generate sitemap render trên canvas để edit. Step 2: User tạo brand voice cho project (AI extract từ link/doc/text). Step 3: Từ sitemap + brand voice, generate file `.md` cho từng page theo conversion-focus format cố định, paste thẳng vào Figma.
- **Platform:** Web app local-only (chạy trên localhost, single-user, không deploy public, không auth).

---

## ② Target User

**Persona chính:**
- **Tên / độ tuổi / nghề nghiệp:** Phú, 30 tuổi, UI/UX Designer freelance.
- **Họ đang làm gì hàng ngày:** Thiết kế wireframe + UI mockup trong Figma cho nhiều loại website (villa, hotel, SaaS, landing page...).
- **Nỗi đau cụ thể:** Lặp lại sitemap mỗi project mới, dùng lorem ipsum thì wireframe trông fake, ChatGPT output rời rạc và lệch brand voice, không có quy trình chuẩn để tái sử dụng.
- **Họ dùng tool nào hiện tại:** Figma + ChatGPT/Claude (copy-paste tay) + markdown editor.

---

## ③ Features & User Stories

> Mỗi feature gồm: **ID · Status · Tên · Story · Done khi**. ID dùng để reference khi vibecode (ví dụ "implement US-004").

**Status Legend:** 📝 chưa làm · 🚧 đang làm · ✅ xong · ⏸️ tạm hoãn · ❌ hủy

---

### 🟢 MUST (bắt buộc có trong MVP)

#### `US-001` 📝 — Analyze input & propose UX improvements

**Story:** Là designer, tôi muốn AI phân tích input của tôi (URL crawl được hoặc form mô tả) và đề xuất các điểm cải tiến UX, để tôi quyết định cái nào muốn áp dụng vào sitemap trước khi generate.

**Steps to Complete:**
1. User submit input: paste URL tham khảo, điền form mô tả (loại site, mục tiêu, target user, tone), hoặc cả hai.
2. App crawl URL nếu có (đọc HTML, lấy nav structure + content overview).
3. App gửi data + form mô tả cho AI → AI luôn trả về UX analysis (kể cả khi chỉ có form mô tả).
4. AI output dạng list: mỗi item gồm `{ vấn đề, lý do, đề xuất cải tiến }`.
5. App render list lên UI, mỗi item có checkbox (default: tick sẵn tất cả).
6. User review, untick item không muốn apply, nhấn "Continue".

**Done khi:**
- ✅ Mỗi item trong list có đủ 3 field: vấn đề / lý do / đề xuất, render rõ ràng đọc được.
- ✅ User toggle được checkbox từng item; state lưu khi qua step sau.
- ✅ Có nút "Continue" để chuyển sang generate sitemap với các item đã tick.
- ❌ Không tự động apply improvement nào nếu user chưa nhấn Continue.

**Edge cases:**
| Tình huống | Hành vi mong muốn |
|---|---|
| URL crawl fail | Vẫn chạy phân tích dựa trên form mô tả |
| Form trống + URL trống | Block submit, hint "cần ít nhất 1 input" |
| AI trả 0 improvements | Hiện message "Input đã đủ tốt", cho phép skip sang generate |
| AI lỗi/timeout | Cho retry; hoặc nút "Skip analysis" để bỏ qua sang generate trực tiếp |

---

#### `US-002` 📝 — Generate sitemap & render canvas

**Story:** Là designer, tôi muốn từ input + improvements đã chọn, AI generate sitemap dạng cây render trên canvas, để có sitemap đề xuất hoàn chỉnh sẵn sàng edit.

**Steps to Complete:**
1. Sau khi user nhấn "Continue" ở US-001, app gom: form mô tả + nav structure đã crawl (nếu có) + danh sách improvements đã tick.
2. App gọi AI generate sitemap → AI trả về cây phân cấp (Home → page → sub-page) kèm 1 dòng description mỗi node.
3. App render sitemap lên canvas dạng cây (node + connection line).
4. Hiện indicator nhỏ trên các node được tạo/đổi do improvement (badge "improved").

**Done khi:**
- ✅ Sitemap render đầy đủ trên canvas trong < 15 giây sau khi nhấn Continue.
- ✅ Mỗi node hiển thị tên page + 1 dòng description.
- ✅ Node sinh ra/đổi do improvement có visual indicator (badge/màu khác).
- ❌ Chưa generate content `.md` ở step này (feature riêng).

**Edge cases:**
| Tình huống | Hành vi mong muốn |
|---|---|
| AI trả sitemap < 3 pages | Cho user nhấn "Regenerate" để thử lại |
| AI lỗi/timeout | Hiện retry button, giữ nguyên state improvements đã chọn |
| Sitemap quá lớn (>30 pages) | Canvas vẫn render, có zoom/pan; không crash |
| User muốn quay lại sửa improvements | Nút "Back" về US-001, giữ state đã tick |

---

#### `US-003` 📝 — Edit Sitemap trên Canvas

**Story:** Là designer, tôi muốn edit sitemap trên canvas (thêm/xóa/đổi tên/đổi description/đổi thứ tự/đổi parent, undo/redo, auto-save, zoom/pan), để có sitemap final đúng ý trước khi generate content.

**Steps to Complete:**
1. Sau khi sitemap render từ US-002, canvas vào chế độ editable.
2. Thao tác hỗ trợ: click "+" trên node parent → tạo child; double-click node → rename inline; click node → side panel sửa description; click delete → xác nhận nếu node có children; drag sibling → reorder; drag node sang parent khác → re-parent.
3. Mỗi action push vào undo stack; Ctrl+Z undo, Ctrl+Shift+Z redo.
4. Sau mỗi action, state auto-save vào localStorage (debounce ~1s).
5. Scroll/pinch để zoom, drag empty area để pan canvas.

**Done khi:**
- ✅ Cả 9 thao tác hoạt động: add, delete (kèm confirm khi có children), rename, edit description, reorder siblings, re-parent, undo/redo, auto-save, zoom/pan.
- ✅ Reload trang → sitemap khôi phục đúng state từ localStorage.
- ✅ Undo/redo phục hồi chính xác tên + description + cấu trúc cây; stack đủ tối thiểu 20 step.
- ✅ Zoom range tối thiểu 25% → 200%; pan smooth, không lag với sitemap ≤ 50 nodes.
- ❌ Không có collab/multi-user (local-only, single user).

**Edge cases:**
| Tình huống | Hành vi mong muốn |
|---|---|
| Xóa node có children | Modal confirm "Xóa cả N sub-pages?" — Yes xóa tree, No hủy |
| Drag node vào descendant của chính nó | Block, cursor "not-allowed", không đổi state |
| Đổi tên thành chuỗi rỗng | Revert về tên cũ |
| localStorage đầy/lỗi | Toast "Không save được, export sitemap ra file để backup" |
| Tab đóng đột ngột | Action gần nhất đã debounce-save, mất tối đa ~1s thay đổi cuối |
| Undo về state rỗng | Disable nút undo khi stack hết |

---

#### `US-004` 📝 — Create Brand Voice (AI-generated, editable)

**Story:** Là designer, tôi muốn AI tạo brand voice từ link/doc/mô tả brand của project, để mỗi project có brand voice riêng mà content generate ra đúng tone.

**Steps to Complete:**
1. Sau khi chốt sitemap (US-003), app mở step "Create Brand Voice".
2. User chọn input: paste link website brand, upload doc (.md/.txt/.pdf), hoặc điền text mô tả brand. Cho phép kết hợp nhiều input.
3. App gửi input cho AI → AI extract brand voice trả về structured output: **3 tone keywords** (vd: Effortless · Curated · Warm), **voice principles** (3-5 dòng), **do examples** (3-5 câu), **don't examples** (3-5 câu), **blacklist words**.
4. App render output dạng form editable, mỗi field sửa được trực tiếp.
5. User nhấn "Save Brand Voice" → lưu vào project state.

**Done khi:**
- ✅ Input ≥ 1 nguồn → AI trả về đủ 5 field trong < 15 giây.
- ✅ User edit được mọi field; save persist, reload không mất.
- ✅ Step "Generate Content" (US-005) đọc được brand voice của project hiện tại.
- ❌ Không có library brand voice tái dùng cross-project (chỉ per-project).

**Edge cases:**
| Tình huống | Hành vi mong muốn |
|---|---|
| Link brand không crawl được | Báo lỗi, cho thử input khác |
| Upload file định dạng không hỗ trợ | "Chỉ hỗ trợ .md/.txt/.pdf" |
| AI trả output thiếu field | Field thiếu để rỗng, user tự điền; có nút Regenerate |
| User Continue mà chưa save | Block, hint "Cần save brand voice trước khi generate content" |

---

#### `US-005` 📝 — Generate Content `.md` từ Sitemap + Brand Voice

**Story:** Là designer, tôi muốn từ sitemap đã chốt + brand voice của project, generate file `.md` cho từng page theo format conversion-focused cố định, để paste thẳng vào Figma làm wireframe.

**Steps to Complete:**
1. Sau khi save brand voice (US-004), app mở step "Generate Content".
2. Với mỗi page trong sitemap, AI propose **section list** (vd: Home → hero, social proof, features, FAQ, pre-footer CTA) dựa trên loại page + format conversion-focus built-in.
3. User review section list từng page, edit được: add/remove/rename/reorder section.
4. User chọn trigger: **"Generate All"** (toàn bộ sitemap) hoặc **"Generate this page"** (riêng từng node trên canvas).
5. App gọi AI: input = sitemap node + section list + brand voice + format rules cố định. AI trả về `.md` content cho page.
6. Output: render trong app (mỗi page 1 panel preview + copy button) **VÀ** lưu ra folder local user đã chọn (vd: `pages/01-home.md`).
7. User có thể **Regenerate** ở 2 mức: cả page, hoặc 1 section riêng trong page.

**Done khi:**
- ✅ "Generate All" gen toàn bộ sitemap, mỗi page ra 1 file `.md` đúng đường dẫn.
- ✅ "Generate this page" gen riêng, ghi đè file cũ trong folder local.
- ✅ Content tuân thủ format conversion-focus cố định (headline, subtitle, body, CTA, cards với tag inline, FAQ pattern, reviews pattern...).
- ✅ Content tuân thủ brand voice: dùng tone keywords, tránh blacklist words 100%.
- ✅ Copy button mỗi page copy content sạch (không gồm UI element của app).
- ✅ Regenerate 1 section chỉ thay phần đó, các section khác giữ nguyên.
- ❌ Không tự generate hình ảnh / asset; chỉ text markdown.

**Edge cases:**
| Tình huống | Hành vi mong muốn |
|---|---|
| Content chứa blacklist word | Auto-flag highlight đỏ, gợi ý Regenerate section đó |
| Folder local không tồn tại / không write được | Báo lỗi, fallback render trong app + cho download zip |
| Generate All cho sitemap > 20 pages | Queue tuần tự, progress bar, cho cancel giữa chừng |
| AI lỗi 1 page giữa batch | Skip page đó, tiếp tục batch; cuối flow hiện list failed + retry |
| Regenerate section khi page chưa generate | Block, yêu cầu generate cả page trước |
| File `.md` cùng tên đã có trong folder | Hỏi: Overwrite / Skip / Rename |

---

#### `US-006` 📝 — Project list (home screen)

**Story:** Là designer, tôi muốn thấy list project đã tạo ở màn home, để mở lại tiếp tục làm.

**Done khi:**
- ✅ Home render list project (tên + ngày tạo + ngày sửa gần nhất).
- ✅ Click vào project → mở đúng state (sitemap, brand voice, content).
- ✅ Empty state khi chưa có project nào, kèm CTA "Create new".
- ❌ Không có search/filter trong MVP.

---

#### `US-007` 📝 — Create new project

**Story:** Là designer, tôi muốn tạo project mới với tên riêng, để bắt đầu flow sitemap → brand voice → content.

**Done khi:**
- ✅ Nút "New Project" ở home → modal nhập tên.
- ✅ Project mới có timestamp, mở vào step đầu (input sitemap).
- ✅ Tên trùng → hậu tố `(2)`, `(3)`.
- ❌ Không cần template/preset, blank project.

---

#### `US-008` 📝 — Delete / rename project

**Story:** Là designer, tôi muốn xóa hoặc đổi tên project từ home, để quản lý sạch.

**Done khi:**
- ✅ Mỗi project có menu (3 chấm) với Rename + Delete.
- ✅ Delete có modal confirm "Xóa vĩnh viễn?".
- ✅ Rename inline, validate không rỗng.
- ❌ Không có soft-delete/trash.

---

#### `US-009` 📝 — Duplicate project

**Story:** Là designer, tôi muốn clone project để làm variant mà không ảnh hưởng bản gốc.

**Done khi:**
- ✅ Menu project có "Duplicate" → tạo bản copy với tên `[tên gốc] (copy)`.
- ✅ Copy giữ nguyên sitemap + brand voice + content đã generate.
- ✅ Đổi state copy không ảnh hưởng bản gốc.

---

#### `US-010` 📝 — Export sitemap (JSON / PNG)

**Story:** Là designer, tôi muốn export sitemap ra JSON hoặc PNG, để share/lưu ngoài app.

**Done khi:**
- ✅ Nút Export trên canvas → chọn format (JSON / PNG).
- ✅ JSON chứa đủ structure cây + tên + description.
- ✅ PNG render full canvas (zoom fit), background trắng, kích thước đủ rõ.
- ❌ Không có SVG.

---

#### `US-011` 📝 — Export project (zip)

**Story:** Là designer, tôi muốn export toàn bộ project thành zip, để backup hoặc handoff.

**Done khi:**
- ✅ Nút Export trong project → tạo file `[project-name].zip`.
- ✅ Zip chứa: `sitemap.json`, `brand-voice.md`, `pages/*.md`, `meta.json` (tên + timestamp + version).
- ✅ Tải về máy qua browser download.

---

#### `US-012` 📝 — Import project (zip)

**Story:** Là designer, tôi muốn import file zip project, để tiếp tục làm trên máy khác hoặc khôi phục.

**Done khi:**
- ✅ Nút Import ở home → chọn file `.zip`.
- ✅ Parse zip đúng cấu trúc → tạo project mới với state khôi phục.
- ✅ Zip sai format → báo lỗi rõ, không tạo project rỗng.

**Edge case:** zip có cùng tên project đã tồn tại → hậu tố `(imported)`.

---

#### `US-013` 📝 — AI Provider settings (Claude Code SDK / API key)

**Story:** Là designer đã có Claude Code trên máy, tôi muốn app dùng luôn tài khoản Claude Code của tôi (không cần API key), để chạy AI mà không tốn thêm chi phí.

**Steps to Complete:**
1. Settings có 2 provider mode:
   - **Mode A — Claude Agent SDK (default):** app gọi Claude Agent SDK từ Node trong Next.js API route, dùng auth sẵn của user.
   - **Mode B — API key:** user paste API key (Anthropic / OpenAI) vào field (mask input), lưu localStorage.
2. App detect Claude Code khi khởi động → auto-select Mode A nếu có; fallback Mode B nếu không.
3. User toggle được mode trong Settings.
4. Nút "Test connection" → Mode A ping SDK, Mode B ping API endpoint.

**Done khi:**
- ✅ Mode A: app gọi được AI qua Claude Agent SDK, không cần API key.
- ✅ Mode B: nhập API key hợp lệ → mọi action AI chạy bình thường.
- ✅ Auto-detect Claude Code khi mở app, nếu có → set Mode A làm default.
- ✅ "Test connection" báo OK/Fail rõ ràng cho cả 2 mode.
- ✅ Chưa có provider nào hoạt động → mọi action AI bị block, hint "Install Claude Code hoặc set API key in Settings".
- ❌ Không sync cloud, không share key giữa các máy.

**Edge cases:**
| Tình huống | Hành vi mong muốn |
|---|---|
| Máy không có Claude Code | Hint cài Claude Code, hoặc switch sang Mode B |
| Claude Code có nhưng chưa login | Báo lỗi rõ + link hướng dẫn `claude login` |
| API key sai/hết hạn | Báo lỗi cụ thể, không crash app |
| User switch mode giữa flow đang chạy | Action hiện tại finish bằng mode cũ, action sau dùng mode mới |
| SDK timeout / hang | Timeout 30s, kill process, báo lỗi |

---

#### `US-014` 📝 — Default output folder setting

**Story:** Là designer, tôi muốn set folder mặc định, để Generate Content tự lưu vào đó không phải chọn mỗi lần.

**Done khi:**
- ✅ Settings có field "Default output folder" (file picker hoặc paste path).
- ✅ Generate Content dùng path này, vẫn cho override per-project.
- ✅ Path không tồn tại / không write được → cảnh báo trong Settings + ở step generate.

---

#### `US-015` 📝 — Prompt files on disk (vibe-code via Claude Code)

**Story:** Là designer, tôi muốn các AI prompt nằm thành file `.md` riêng trên disk (không hard-code trong source), để khi cần cải tiến tôi mở Claude Code vibe-code sửa trực tiếp file đó — không cần app có UI editor.

**Steps to Complete:**
1. App tạo folder `prompts/` ở root project lần đầu chạy, sinh 5 file mặc định (global, không per-project):
   - `prompts/01-ux-analysis.md`
   - `prompts/02-sitemap-generate.md`
   - `prompts/03-brand-voice-extract.md`
   - `prompts/04-sections-propose.md`
   - `prompts/05-content-generate.md`
2. Mỗi file gồm: **System prompt** (rule cố định) + **Variables placeholder** (`{{url}}`, `{{form_input}}`, `{{sitemap_json}}`, `{{brand_voice}}`, `{{page_node}}`...).
3. Mỗi AI call → app đọc file prompt tại runtime, thay placeholder bằng data, gửi cho AI.
4. User sửa prompt = mở Claude Code, edit file `.md` trực tiếp; next call tự pick up.

**Done khi:**
- ✅ Folder `prompts/` + 5 file `.md` sinh ra ở lần đầu chạy app.
- ✅ Mỗi AI call đọc đúng file prompt, replace placeholder, gửi cho AI provider.
- ✅ Sửa file `.md` ngoài app → AI call kế tiếp dùng version mới, không cần restart server.
- ✅ File bị xóa → app auto-regen từ default khi cần.
- ❌ Không có UI edit prompt trong app.
- ❌ Không có version control / history (Claude Code + git lo).

**Edge cases:**
| Tình huống | Hành vi mong muốn |
|---|---|
| File prompt rỗng | Báo lỗi tại AI call, hint "Prompt rỗng, restore default" |
| Placeholder thiếu | Skip placeholder đó, vẫn call AI, log warning ra console |
| File `.md` corrupt / encoding lỗi | Báo lỗi rõ, đề xuất delete để auto-regen |

---

### 🔵 SHOULD (nên có, không gấp)

_(Không có — toàn bộ scope MVP đã đặt MUST.)_

---

### 🟠 NICE TO HAVE (sau này thêm)

- `US-016` 📝 — Re-ask AI per node — Click 1 node trên canvas, gọi AI đề xuất sub-pages riêng cho node đó (async với loading state).

---

## ④ Tech Stack

| Layer | Tech | Lý do chọn |
|---|---|---|
| Framework (FE + BE) | Next.js (App Router) + TypeScript | All-in-one: React UI + API routes làm backend local. Hợp Tailwind + shadcn. |
| UI / Style | Tailwind CSS + shadcn/ui | Component sẵn (button, modal, form, dropdown), nhất quán, dễ tùy biến. |
| Canvas (sitemap) | React Flow | Built-in diagram cây/node, drag-drop, zoom, pan, edge — phù hợp US-003. |
| State management | Zustand | Nhẹ, đủ dùng, persist localStorage dễ. |
| AI provider | Claude Agent SDK (default, gọi từ Next.js API route) hoặc Anthropic SDK (fallback API key) | Theo US-013. |
| URL "crawler" | Pass URL trực tiếp cho AI provider (Claude WebFetch / built-in web tool) | AI tự đọc & extract structure, không cần Cheerio/Playwright. |
| File ops | Node `fs/promises` + JSZip + html-to-image | US-010 / US-011 / US-012. |
| Storage | localStorage (state nhẹ) + file JSON / `.md` trên disk | Single-user local, không cần DB. |
| Auth | Không có | Local-only, single-user. |
| Hosting | Localhost (`npm run dev`) qua browser | Theo quyết định user. |

---

## ⑤ Integration Points

### Claude Agent SDK (mọi AI call, default)
1. App khởi động → API route detect Claude Code có trên máy không (check SDK init).
2. Mỗi AI call → import Claude Agent SDK trong Next.js API route, gọi với prompt + context phù hợp; capture response.
3. Parse output → trả về frontend.

❌ Không xử lý: user chưa `claude login` (chỉ báo lỗi, không tự login giúp).

### Anthropic API (fallback khi user nhập key)
1. User nhập API key trong Settings → lưu localStorage.
2. AI call → POST `https://api.anthropic.com/v1/messages` với `x-api-key` header.
3. Parse response → trả về frontend.

❌ Không xử lý: rate limit retry tự động (chỉ báo lỗi, user retry tay).

### AI WebFetch (đọc URL tham khảo)
1. User paste URL → app gửi prompt: "Đọc URL này, trích xuất nav structure và content overview" + URL.
2. AI provider (Claude) dùng built-in web tool tự fetch + parse.
3. Trả về structured JSON (nav tree + page overviews).

❌ Không xử lý: site cần auth/cookie để vào (báo lỗi nếu AI không đọc được).

---

## ⑥ Non-Functional Requirements

- **Performance:**
  - Sitemap render canvas < 1s với ≤ 50 nodes.
  - AI call (sitemap generate / brand voice / page content) < 15s mỗi lần.
  - Auto-save localStorage debounce 1s, không lag UI khi gõ.
- **Security:**
  - API key user nhập lưu localStorage (plain — chấp nhận được vì local-only), không gửi đi đâu ngoài Anthropic/OpenAI endpoint.
  - File ops chỉ trong folder user đã chọn (không cho path traversal ra ngoài).
- **Responsive:** Desktop only (1280px+). Không tối ưu mobile.
- **Concurrency:** 1 user, không multi-tab sync (mở 2 tab cùng project có thể conflict → cảnh báo).
- **Uptime:** N/A (chạy local).
- **Browser support:** Chrome / Edge / Firefox / Safari latest 2 versions.

---

## ⑦ Edge Cases & Error States

| Tình huống | Hành vi mong muốn |
|---|---|
| User nhập sai form (rỗng, sai format URL) | Inline validation, disable submit, hint cụ thể |
| Mất mạng giữa lúc gọi AI | Báo lỗi network, giữ nguyên input, nút Retry |
| File upload (brand doc, import zip) quá lớn (>10MB) | Báo lỗi "File quá lớn, max 10MB" |
| AI provider trả output sai format / JSON parse fail | Báo lỗi rõ, nút Regenerate; log raw output để debug |
| Claude SDK hang / timeout > 30s | Kill process, báo timeout, gợi ý retry hoặc switch sang API key mode |
| localStorage đầy (quota exceeded) | Toast "Storage đầy, export project ra zip để giải phóng" |
| User mở 2 tab cùng project | Tab thứ 2 cảnh báo "Project đang mở ở tab khác, có thể conflict" |
| Folder output local không tồn tại / không write được | Báo lỗi tại step generate, cho chọn folder khác hoặc download zip |
| AI gen content có blacklist word | Highlight đỏ trong preview, gợi ý Regenerate section |
| Crash JS / unhandled error | Error boundary "Something went wrong" + nút Reload, không mất state đã auto-save |

---

## ⑧ Success Metrics

**Tuần 1 (MVP launch):**
- App chạy local end-to-end: input → sitemap → brand voice → content `.md` cho 1 project pilot.
- Hoàn thành 1 project thật (vd: redo Villa T) trong < 2 giờ thay vì cả ngày như cũ.
- Content output paste vào Figma không cần edit format → ≥ 80% paste trực tiếp được.

**Tháng 1 (sau 4 tuần dùng thật):**
- Đã chạy ≥ 5 project khác nhau qua app.
- Tiết kiệm ≥ 50% thời gian so với workflow ChatGPT copy-paste cũ (đo bằng cách bấm giờ 1 project trước/sau).
- 0 lần phải mở ChatGPT/Claude bên ngoài để gen content cho wireframe.
- Brand voice generate ra chính xác ≥ 80% (đo: số field user phải edit / tổng field).

**Tháng 3 (mature):**
- ≥ 15 project đã chạy qua app.
- Workflow ổn định: từ kick-off đến wireframe content sẵn cho Figma < 1 giờ/project.
- App đủ tin tưởng để giới thiệu cho 2-3 designer bạn dùng thử.

---

## ⑨ Constraints & Assumptions

**Giới hạn:**
_(Không áp dụng — app tự dùng, không budget/timeline ràng buộc.)_

**Assumptions (giả định):**
- User (Phú) đã có Claude Code cài sẵn + đã `claude login`.
- User dùng máy Windows 11, có Node.js (≥ 20) và npm/pnpm.
- AI provider (Claude) đủ thông minh để extract nav structure từ URL qua WebFetch built-in, không cần Playwright.
- Content `.md` user paste thủ công vào Figma (không cần plugin Figma tự động).
- Brand voice generate từ 1-2 input là đủ chất lượng (không cần training data lớn).

---

## Changelog

| Ngày | Thay đổi | Người cập nhật |
|---|---|---|
| 2026-05-20 | v1 — draft đầu tiên | Phú |
