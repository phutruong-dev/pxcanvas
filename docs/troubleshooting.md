# Troubleshooting — PXcanvas

> Cập nhật dần khi gặp lỗi thực tế. Mỗi entry: triệu chứng → nguyên nhân → fix.

---

## AI Provider

### "Claude Code not detected" khi Mode A
- **Nguyên nhân:** `claude` CLI chưa trong PATH, hoặc chưa `claude login`.
- **Fix:** Chạy `claude login` trong terminal, sau đó nhấn "Re-check" trong Settings. Hoặc chuyển sang Mode B (API key).

### SDK timeout (mặc định 120s)
- **Nguyên nhân:** Prompt quá dài hoặc model bị throttle. Từ v1.0.1 trở đi, URL được fetch server-side rồi pass content cho AI → ít timeout hơn nhiều.
- **Fix:**
  - Settings → switch sang Mode B (Anthropic API key) — thường nhanh hơn SDK subprocess.
  - Bump timeout: thêm `CLAUDE_AGENT_TIMEOUT_MS=180000` vào `.env.local` rồi restart dev server.

### URL fetch failed (Step 1 hoặc Step 3)
- **Triệu chứng:** `nav_structure` hoặc brand_input chứa dòng `Reference URL provided (...) but fetch failed: ...`.
- **Nguyên nhân thường gặp:**
  - **403/Bot block** — Site (Cloudflare, etc.) chặn user-agent generic. Thử URL khác.
  - **Timeout** — Server site chậm > 15s. Thử lại hoặc dùng URL nhẹ hơn.
  - **SPA JS-rendered** — App chỉ đọc HTML tĩnh, SPA shell rỗng → ít content. Cung cấp mô tả text thêm.
  - **Non-HTML** — URL trỏ tới PDF/JSON/image → bị reject. Phải là HTML page.
  - **Private/localhost URL** — Bị block để chống SSRF. Dùng URL public.
- **Fix:** AI vẫn chạy với fallback (project description) — không cần làm gì, chỉ là kết quả ít chính xác hơn. Hoặc paste content thủ công vào text input.

### API key "401 Unauthorized"
- **Nguyên nhân:** Key sai, hết hạn, hoặc bị revoke giữa session.
- **Fix:** Vào Settings → Mode B → nhập lại key → Test connection. Test result là ephemeral, tự clear khi sửa key.

### First-run wizard không xuất hiện
- **Nguyên nhân:** Đã dismiss trước đây (`dismissedFirstRun: true` trong settings localStorage).
- **Fix:** Mở DevTools → Application → Local Storage → xóa key `pxcanvas:settings`, hoặc setProvider trực tiếp trong Settings page.

---

## Canvas (React Flow — Step 2)

### Canvas không render sau khi AI generate
- **Nguyên nhân:** State chưa sync từ store vào React Flow nodes/edges.
- **Fix:** Check `useEffect([layout])` re-syncs `setNodes`/`setEdges` khi sitemap thay đổi.

### Drag re-parent bị block "Cannot move into own descendant"
- **Nguyên nhân:** Drop target là con/cháu của node đang drag → tạo cycle.
- **Fix:** Đúng behavior. Drop sang sibling hoặc ancestor khác.

### Drag re-parent không nhả node
- **Nguyên nhân:** Drop target không nhận hit-test (drag center không nằm trong bbox).
- **Fix:** Drop chính giữa node target. Cursor center phải nằm trong vùng node card.

### Undo/Redo (Ctrl+Z) không hoạt động
- **Nguyên nhân:** Focus đang ở input/textarea/contenteditable (handler bypass).
- **Fix:** Click ra ngoài input rồi Ctrl+Z. Hoặc dùng nút undo/redo trên toolbar.

---

## Brand Voice (Step 3)

### Upload PDF báo "Only .md or .txt files are supported"
- **Nguyên nhân:** MVP chỉ accept text files. PDF support deferred (xem `docs/decisions/0001-pdf-parsing-deferred.md`).
- **Fix:** Mở PDF, copy text, paste vào textarea "Brand description".

### File > 10 MB
- **Nguyên nhân:** Hard limit trong `brand-voice-input.tsx`.
- **Fix:** Trim file content trước khi upload, hoặc paste portion vào textarea.

### Continue button vẫn disabled sau khi Save
- **Nguyên nhân:** Local form state divergent từ store (typing trong field nhưng chưa onBlur).
- **Fix:** Click ra ngoài input → onBlur commit → Save lại.

---

## Content Generation (Step 4)

### "Brand voice is missing" khi Generate All
- **Nguyên nhân:** Step 3 chưa save → `brandVoice` trong store = `null`.
- **Fix:** Quay lại Step 3, fill form, click "Save brand voice".

### Page list trống mặc dù sitemap có node
- **Nguyên nhân:** Workflow store chưa hydrate cho project hiện tại (race với `loadProject`).
- **Fix:** Reload page. Nếu lặp lại → check `pxcanvas:workflow:{id}` trong localStorage.

### Generate All bị cancel nhưng badge vẫn "generating"
- **Nguyên nhân:** Page đang generating khi cancel sẽ giữ trạng thái cho đến khi promise hoàn tất.
- **Fix:** Chờ vài giây, hoặc click Retry trên page đó.

### Write to folder báo "Cannot write to folder"
- **Nguyên nhân:** Output folder không tồn tại hoặc thiếu write permission.
- **Fix:** Settings → Output Folder → nhập path → "Ensure folder" để tự tạo. Hoặc check permission của folder ngoài hệ thống.

### Import ZIP báo "Invalid zip: missing meta.json"
- **Nguyên nhân:** ZIP không xuất từ PXcanvas (cấu trúc khác).
- **Fix:** Chỉ import file `.pxcanvas.zip` xuất từ chính app (Step 4 → Export ZIP).

### Overwrite modal xuất hiện liên tục
- **Nguyên nhân:** File `{slug}.md` đã tồn tại trong output folder.
- **Fix:** Chọn Overwrite (ghi đè) hoặc Rename (nhập slug mới) cho mỗi file. Skip để bỏ qua.

---

## Storage

### "Storage is almost full" toast trên Home
- **Nguyên nhân:** localStorage quota (~5MB) sắp hết, thường do `pageContents` (markdown) lớn.
- **Fix:** Export project → ZIP download → xóa project cũ.

### Reload trang mất state
- **Nguyên nhân:** Zustand persist chưa được setup, hoặc localStorage bị clear (privacy mode).
- **Fix:** Kiểm tra browser không trong incognito. Check `pxcanvas:workflow:{id}` và `pxcanvas:projects` keys trong DevTools.

---

## Settings

### Output folder hiện "Not writable"
- **Nguyên nhân:** Folder không tồn tại (onBlur check `noCreate:true`), hoặc thiếu permission OS.
- **Fix:** Click "Ensure folder" để app mkdir, hoặc chạy app với quyền cao hơn (Run as administrator trên Windows).

### "Restore default" không restore prompt
- **Nguyên nhân:** Server không có write permission vào `prompts/` (rare).
- **Fix:** Check folder owner. Nếu chạy trong Docker, mount volume với write permission.

---

## Development

### `npm run dev` lỗi port 3000 busy
```bash
# Windows: kill process dùng port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### TypeScript error sau khi thêm package
```bash
npm run typecheck  # xem full error
```

### Prompt file không được pick up sau khi sửa
- **Nguyên nhân:** Server-side cache. `prompt-loader.ts` đọc file mỗi request (no module-level cache).
- **Fix:** Đã đúng implementation. Nếu file thực sự chưa được pick up → check file path đúng `prompts/{key}.md`.

### React-Flow infinite loop / "Maximum update depth"
- **Nguyên nhân:** `useEffect` với dependency mảng không stable (e.g., new object mỗi render).
- **Fix:** Memoize objects truyền vào React Flow, hoặc dùng `useMemo` cho `nodes`/`edges`.

---

## AI Output

### Content chứa blacklist word
- App tự highlight yellow trong preview.
- Click "Regenerate" trên page đó để gen lại.
- Nếu lặp lại nhiều → mở `prompts/05-content-generate.md`, thêm rule explicit vào prompt.

### Brand voice output thiếu field
- Field rỗng, user tự điền hoặc Regenerate.
- Nếu consistent thiếu → mở `prompts/03-brand-voice-extract.md`, clarify output format.

### Sitemap trả về < 3 node
- **Nguyên nhân:** Input quá nghèo, AI không có signal đủ.
- **Fix:** Click "Regenerate" chip trong toolbar (Step 2), bổ sung mô tả chi tiết hơn trong Step 1.
