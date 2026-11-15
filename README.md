# Hello Kitty 🌸 – Theo dõi chu kỳ

Webapp theo dõi kì kinh nguyệt dễ thương, tiếng Việt, tối ưu cho iPhone.
Linh vật: **Mèo Sakura** (nhân vật vẽ riêng cho app).
Không đăng nhập, không server: mọi dữ liệu lưu trên máy (IndexedDB + localStorage).

Link app: https://hoanganhkiet14021996.github.io/hellokitty/

## Chạy thử trên máy

```bash
npm install
npm run dev        # mở http://localhost:5173
npm test           # test logic chu kỳ
npm run build      # build ra thư mục dist/
```

## Cập nhật app

```bash
git add .
git commit -m "Mô tả thay đổi"
git push
```

GitHub Actions sẽ tự build và đưa lên GitHub Pages (Settings → Pages → Source: GitHub Actions).

## Cài lên iPhone

Mở link bằng **Safari** → nút Chia sẻ → **Thêm vào MH chính**.
Luôn mở app từ biểu tượng trên màn hình chính để iOS không tự xoá dữ liệu.
Nhớ thỉnh thoảng vào **Cài đặt → Sao lưu**.

## Cấu trúc

- `src/lib/cycle.ts` – tính chu kỳ, dự đoán, rụng trứng (có test `cycle.test.ts`)
- `src/lib/storage.ts` – lưu/đọc/khôi phục dữ liệu
- `src/screens/` – Onboarding, Hôm nay, Lịch, Thống kê, Cài đặt
- `src/components/Mascot.tsx` – linh vật Mèo Sakura (SVG, nhiều biểu cảm)
- `scripts/make-icons.mjs` – tạo icon PNG từ `public/icons/favicon.svg`
