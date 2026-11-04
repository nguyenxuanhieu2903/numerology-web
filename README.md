# NUMEROLOGY — Discover Your Inner Energy

> **Website trắc nghiệm khám phá tính cách & năng lượng cá nhân lấy cảm hứng từ Thần Số Học hiện đại.**  
> *Dự án bài tập môn Lập trình Web — Xây dựng theo kiến trúc Multi-Page Application (MPA) với HTML5, CSS3, ES6+, jQuery 3.7.1, Vite 5.x và triển khai tự động qua GitHub Actions lên GitHub Pages.*

---

## 1. Giới thiệu dự án (Project Overview)

**NUMEROLOGY — Discover Your Inner Energy** là một sản phẩm web khám phá bản thân trực quan và giàu tính thẩm mỹ. Người dùng trải nghiệm trả lời 10 câu hỏi trắc nghiệm tình huống mang tính phản chiếu. Hệ thống scoring engine phía client sẽ tính toán, phân tích trọng số và xác định nhóm năng lượng chiếm ưu thế (hoặc giải mã trường hợp đồng hạng), từ đó mở khóa hồ sơ cá nhân hóa bao gồm: danh xưng, điểm mạnh, điểm cần cải thiện, định hướng phát triển và biểu đồ phân bổ năng lượng.

*Lưu ý: Đây là sản phẩm giải trí và khám phá bản thân phục vụ môn học, không phải công cụ đánh giá tâm lý hay phương pháp khoa học chính thống.*

---

## 2. Công nghệ sử dụng (Technology Stack)

| Công nghệ | Phiên bản | Vai trò trong dự án |
|---|---|---|
| **HTML5** | Chuẩn W3C | Cấu trúc ngữ nghĩa (Semantic HTML) cho 3 trang MPA độc lập |
| **CSS3** | Hiện đại | Design tokens, Flexbox/Grid, CSS variables theo bảng màu *Jade Pebble Morning* |
| **JavaScript** | ES6+ Modules | Kiến trúc module hóa tách biệt: `data/`, `core/`, `ui/`, `utils/` |
| **jQuery** | 3.7.1 | Thao tác DOM tương tác, animation chuyển câu, scroll reveal, menu mobile, toasts |
| **Vite** | 5.4.x | Module bundler & dev server tối ưu cho MPA với relative base (`./`) |
| **GitHub Actions** | v4 Actions | Tự động test, build và deploy lên GitHub Pages khi push nhánh `main` |
| **GitHub Pages** | Static Hosting | Lưu trữ và phân phối website tĩnh tốc độ cao |

*Cam kết chuẩn kỹ thuật: Không sử dụng React, Vue, Angular, TypeScript, Bootstrap, Tailwind CSS hay backend framework.*

---

## 3. Hệ thống Thiết kế (Design Tokens) — Jade Pebble Morning

Website được định hình theo phong cách **Premium Editorial • Modern Mystical • Organic Minimalism**:

| Tên màu | Mã Hex | Vai trò trong giao diện |
|---|---|---|
| **Sage / Muted Jade** | `#7B9669` | Màu nhấn chủ đạo (Primary Accent): Nút CTA, thanh tiến trình, icon |
| **Soft Pebble Off-White** | `#E6E6E6` | Nền sáng tự nhiên (Light Background) |
| **Slate Jade** | `#6C8480` | Màu phụ (Secondary Accent): Phân cấp phụ, viền mềm |
| **Mist Jade / Pale Sage** | `#BAC8B1` | Bề mặt phụ: Nền thẻ, đường phân cách, highlight |
| **Deep Forest / Dark Jade** | `#404E3B` | Màu chữ chính, tiêu đề nổi bật và nền tối tương phản |

---

## 4. Bốn Nhóm Năng Lượng & Cơ chế Tính Điểm

### 4.1. Bốn Trường Năng Lượng Cốt Lõi
1. **01 — The Leader (Người Lãnh Đạo):** Bản lĩnh tiên phong, quyết đoán, độc lập, có tầm nhìn chiến lược và khát vọng dẫn lối.
2. **02 — The Harmonizer (Người Hòa Ái / Kết Nối):** Đồng cảm sâu sắc, tinh tế, biết lắng nghe, cầu nối hóa giải mâu thuẫn và xây dựng bình yên.
3. **03 — The Creator (Người Sáng Tạo):** Trí tưởng tượng bất tận, tư duy đột phá, truyền cảm hứng và yêu thích biểu đạt tự do.
4. **04 — The Builder (Người Kiến Tạo / Xây Dựng):** Kỷ luật sắt đá, thực tế, bền bỉ, kiên nhẫn xây dựng các nền tảng trường tồn.

### 4.2. Scoring Engine & Thuật toán Tỷ lệ 100%
- Mỗi câu trả lời cộng 1 điểm cho nhóm năng lượng tương ứng (tổng điểm đúng bằng 10).
- Tính tỷ lệ phần trăm bằng thuật toán **Largest Remainder Method (Hare-Niemeyer)** để đảm bảo tổng phần trăm của 4 nhóm luôn luôn bằng chính xác **100%** mà không gặp lỗi làm tròn.
- **Xử lý hòa điểm (Ties):** Tuyệt đối không chọn ngẫu nhiên. Nếu có từ 2 nhóm bằng điểm cao nhất trở lên, hệ thống sẽ tự động ghép thành hồ sơ kết hợp độc đáo (ví dụ: *01 + 03 = The Visionary Pioneer / Nhà Cách Tân Tầm Nhìn*).

---

## 5. Cấu trúc Thư mục Dự án

```
numerology/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD tự động deploy lên GitHub Pages
├── public/
│   ├── favicon.svg             # Favicon biểu tượng năng lượng
│   └── assets/
│       ├── images/             # Ảnh minh họa SVG cho 4 nhóm & Hero Mandala
│       │   ├── archetype-01-leader.svg
│       │   ├── archetype-02-harmonizer.svg
│       │   ├── archetype-03-creator.svg
│       │   ├── archetype-04-builder.svg
│       │   └── hero-energy-mandala.svg
│       ├── videos/             # Thư mục cho video nền (nếu cần bổ sung)
│       └── icons/              # Bộ SVG icons dùng trong giao diện
├── src/
│   ├── css/
│   │   ├── base.css            # Typography, CSS reset, design tokens
│   │   ├── layout.css          # Header, navigation, footer, containers
│   │   ├── components.css      # Buttons, badges, cards, progress, toasts
│   │   ├── landing.css         # Styling Landing page & scroll reveals
│   │   ├── quiz.css            # Styling Quiz card, options, animation
│   │   ├── result.css          # Styling Result card, matrix distribution
│   │   └── responsive.css      # Responsive Mobile/Tablet & prefers-reduced-motion
│   │
│   └── js/
│       ├── data/
│       │   ├── questions.js    # 10 câu hỏi trắc nghiệm song ngữ (Việt - Anh)
│       │   ├── results.js      # Hồ sơ 4 nhóm & cấu hình đồng hạng
│       │   └── translations.js # Từ điển UI song ngữ tập trung
│       │
│       ├── core/
│       │   ├── scoring.js      # Scoring Engine thuần độc lập DOM
│       │   ├── quiz-engine.js  # Điều phối câu hỏi, lưu trữ và submit
│       │   └── storage.js      # Quản lý an toàn sessionStorage & localStorage
│       │
│       ├── ui/
│       │   ├── landing.js      # Tương tác jQuery Landing page
│       │   ├── quiz-ui.js      # Tương tác jQuery Quiz & animation chuyển câu
│       │   └── result-ui.js    # Tương tác jQuery Result & animate chart
│       │
│       ├── utils/
│       │   ├── language.js     # Trình quản lý i18n động
│       │   └── dom.js          # Helpers: Toast, Clipboard fallback, Scroll
│       │
│       ├── tests/
│       │   ├── scoring.test.js # Kiểm thử scoring, tie, 100% sum
│       │   └── quiz-engine.test.js # Kiểm thử luồng câu hỏi và storage
│       │
│       ├── landing.js          # Entry script cho index.html
│       ├── quiz.js             # Entry script cho quiz.html
│       └── result.js           # Entry script cho result.html
│
├── index.html                  # Trang chủ (Landing Page)
├── quiz.html                   # Trang trắc nghiệm (Quiz Page)
├── result.html                 # Trang kết quả (Result Page)
├── package.json                # Quản lý script & dependencies
├── vite.config.js              # Cấu hình Rollup 3 entry points MPA
└── README.md                   # Tài liệu hướng dẫn
```

---

## 6. Hướng dẫn Cài đặt & Chạy Local

### Yêu cầu môi trường:
- Node.js LTS (>= 18.x, khuyến nghị 20.x hoặc 24.x).
- npm (>= 9.x).

### Các bước thực hiện:

1. **Clone hoặc mở thư mục dự án:**
   ```bash
   cd d:\LapTrinhWeb\Project\Numerology
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   # Hoặc trên Windows PowerShell:
   npm.cmd install
   ```

3. **Chạy máy chủ phát triển (Development Server):**
   ```bash
   npm run dev
   # Hoặc:
   npm.cmd run dev
   ```
   Mở trình duyệt tại: `http://localhost:3000`

4. **Chạy kiểm thử tự động (Unit & Integration Tests):**
   ```bash
   npm test
   # Hoặc:
   npm.cmd run test
   ```
   *Kết quả: 48/48 bài kiểm tra tự động vượt qua (Scoring Engine, Tie Combinations, Percentage 100% guarantee, Session Navigation).*

5. **Build đóng gói bản phát hành (Production Build):**
   ```bash
   npm run build
   # Hoặc:
   npm.cmd run build
   ```
   *Thư mục đầu ra `dist/` chứa mã nguồn tĩnh đã được nén và tối ưu với đường dẫn tương đối.*

6. **Chạy bản xem trước production (Production Preview):**
   ```bash
   npm run preview
   # Hoặc:
   npm.cmd run preview
   ```

---

## 7. Hướng dẫn Triển khai Lên GitHub Pages (Separate Repository)

Dự án tuân thủ chiến lược **Existing — Separate Repository** độc lập hoàn toàn với website Portfolio nhóm.

### Bước 1: Tạo Repository mới trên GitHub
1. Đăng nhập vào tài khoản GitHub của bạn (ví dụ: `Hieunx_2903`).
2. Nhấn nút **New Repository**.
3. Đặt tên Repository: `Numerology` (hoặc tên tùy chọn).
4. Để chế độ **Public** và **không tích chọn** Initialize with README (vì ta đã có sẵn mã nguồn local).

### Bước 2: Liên kết Remote và Push mã nguồn
Mở terminal tại thư mục dự án và chạy:
```bash
# Kiểm tra nhánh chính
git branch -M main

# Thêm remote origin trỏ đến repository của bạn
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# Push mã nguồn lên GitHub
git push -u origin main
```

### Bước 3: Cấu hình GitHub Pages
1. Trên giao diện GitHub repository của bạn, vào tab **Settings** -> mục **Pages** (cột menu bên trái).
2. Tại phần **Build and deployment** -> **Source**: Chọn **GitHub Actions**.
3. Ngay lập tức, workflow `.github/workflows/deploy.yml` sẽ tự động kích hoạt:
   - Tải source code.
   - Chạy toàn bộ test suites (`npm run test`).
   - Build ứng dụng (`npm run build`).
   - Đóng gói thư mục `dist/` và triển khai lên GitHub Pages.
4. Sau khoảng 1-2 phút, URL chính thức của bạn sẽ xuất hiện tại tab Pages (dạng `https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/`).

---

## 8. Hướng dẫn Thay thế Hình ảnh, Video & Backgrounds

Dự án đã được thiết kế sẵn sàng để người dùng tự thay đổi media mà không làm hỏng giao diện:

1. **Hình ảnh 4 nhóm năng lượng:**
   - Đặt ảnh của bạn vào `public/assets/images/`:
     - Nhóm 01: `archetype-01-leader.svg` (hoặc `.png`, `.jpg`, `.webp`)
     - Nhóm 02: `archetype-02-harmonizer.svg`
     - Nhóm 03: `archetype-03-creator.svg`
     - Nhóm 04: `archetype-04-builder.svg`
   - Nếu đổi đuôi file (ví dụ sang `.png`), hãy cập nhật đường dẫn tương ứng trong [`src/js/data/results.js`](file:///d:/LapTrinhWeb/Project/Numerology/src/js/data/results.js).

2. **Video nền (Background Video):**
   - Đặt video định dạng `.mp4` hoặc `.webm` vào thư mục `public/assets/videos/` (ví dụ: `ambient-energy.mp4`).
   - Khi có video, bạn có thể kích hoạt thẻ `<video>` trong Hero Section với thuộc tính `autoplay loop muted playsinline`.

3. **Favicon & Logo:**
   - Thay thế file [`public/favicon.svg`](file:///d:/LapTrinhWeb/Project/Numerology/public/favicon.svg) bằng logo hoặc biểu tượng riêng của bạn.

---

## 9. Bản quyền & Thông tin Nhóm

- **Môn học:** Lập trình Web
- **Nhóm thực hiện:** Nhóm 02
- **Tác giả:** Hieunx_2903
- **Giấy phép:** MIT License
