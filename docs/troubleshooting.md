# Troubleshooting — PXcanvas

> Cập nhật dần khi gặp lỗi thực tế. Mỗi entry: triệu chứng → nguyên nhân → fix.

---

## AI Provider

### "Claude Code not detected" khi Mode A
- **Nguyên nhân:** `claude` CLI chưa trong PATH, hoặc chưa `claude login`.
- **Fix:** Chạy `claude login` trong terminal, sau đó reload app. Hoặc chuyển sang Mode B (API key).

### SDK timeout > 30s
- **Nguyên nhân:** Prompt quá dài, mạng chậm, hoặc model bị throttle.
- **Fix:** App tự kill process sau 30s, hiện retry button. Nếu lặp lại → switch Mode B.

### API key "401 Unauthorized"
- **Nguyên nhân:** Key sai hoặc hết hạn.
- **Fix:** Vào Settings → Mode B → nhập lại key → Test connection.

---

## Canvas (React Flow)

### Canvas không render sau khi AI generate
- **Nguyên nhân:** State chưa sync từ store vào React Flow nodes/edges.
- **Fix:** Check `useEffect` re-run khi store thay đổi.

### Drag re-parent bị lag với sitemap lớn
- **Nguyên nhân:** Node count > 50, re-render toàn bộ.
- **Fix:** Check `React.memo` trên custom node component.

---

## Storage

### "Storage đầy" toast xuất hiện
- **Nguyên nhân:** localStorage quota (~5MB) bị vượt, thường do content `.md` lớn.
- **Fix:** Export project → zip download → xóa project cũ trong app.

### Reload trang mất state
- **Nguyên nhân:** Zustand persist chưa được setup, hoặc `name` key sai.
- **Fix:** Check `name: "pxcanvas:project:{id}"` trong persist config.

---

## File Operations

### Generate Content không ghi được file
- **Nguyên nhân:** Output folder không tồn tại hoặc không có write permission.
- **Fix:** Vào Settings → Default output folder → Browse → chọn folder có quyền ghi.

### Import zip lỗi "Invalid format"
- **Nguyên nhân:** Zip không đúng cấu trúc (`sitemap.json`, `brand-voice.md`, `pages/`, `meta.json`).
- **Fix:** Chỉ import file `.zip` xuất từ chính app này. Kiểm tra `meta.json` có field `version`.

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
npm run build  # xem full error
```

### Prompt file không được pick up sau khi sửa
- **Nguyên nhân:** Server-side cache. `prompt-loader.ts` phải đọc file mỗi request (no cache).
- **Fix:** Check `prompt-loader.ts` không dùng module-level cache.

---

## AI Output

### Content chứa blacklist word
- App tự highlight đỏ trong preview.
- Click "Regenerate section" để gen lại phần đó.
- Nếu lặp lại nhiều → mở `prompts/05-content-generate.md`, thêm rule explicit vào system prompt.

### Brand voice output thiếu field
- Field rỗng, user tự điền hoặc Regenerate.
- Nếu consistent thiếu → mở `prompts/03-brand-voice-extract.md`, clarify output format.
