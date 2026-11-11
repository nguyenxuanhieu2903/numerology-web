# UI/UX AUDIT REPORT — NUMEROLOGY (Discover Your Inner Energy)

---

## 1. Executive Summary

- **Mục tiêu:** Rà soát toàn diện trải nghiệm người dùng (UX), độ phản hồi trên thiết bị di động (Mobile Responsiveness) và chất lượng thị giác (Visual & Typography Quality) của 3 trang: Landing Page (`index.html`), Quiz Page (`quiz.html`), và Result Page (`result.html`).
- **Phạm vi Viewport đánh giá:**
  - `320px × 568px`: Small Mobile (iPhone SE 1st gen).
  - `375px × 812px`: Mobile tiêu chuẩn (iPhone X/12 mini/13 mini).
  - `390px × 844px`: Mobile phổ biến (iPhone 13/14/15, Galaxy S series).
  - `430px × 932px`: Mobile kích thước lớn (iPhone 14/15/16 Pro Max, Plus).
  - `768px × 1024px`: Tablet đứng (iPad Portrait).
  - `1024px × 768px`: Tablet ngang / Laptop nhỏ.
  - `1440px × 900px`: Desktop tiêu chuẩn.
- **Tiêu chuẩn áp dụng:** Mobile-First Design, WCAG 2.2 AA Accessibility, Jade Pebble Morning Design System.

---

## 2. Chi Tiết Các Vấn Đề Được Phát Hiện (Findings & Defects)

### A. Vấn đề Mobile Layout & UX (Ưu tiên cao nhất)

#### 1. Header Navigation & Nút Quay Lại trên Mobile
- **Hiện tượng:** Tại breakpoint `@media (max-width: 767px)`, quy tắc `.header-actions .btn { display: none; }` trong `responsive.css` ẩn toàn bộ nút trong header.
- **Hệ quả UX:**
  - Trên `result.html`, nút `"Về Trang Chủ"` trong header biến mất hoàn toàn trên mobile. Người dùng sau khi xem kết quả muốn quay lại trang chủ không có nút điều hướng ở phần đầu trang, buộc phải cuộn hết xuống footer.
- **Đề xuất xử lý:**
  - Giữ lại nút Home dạng icon hoặc pill nhỏ gọn (`icon-arrow-left` + nhãn rút gọn hoặc icon) trên mobile header cho cả Quiz và Result page.

#### 2. Hero Stats Section trên Mobile (Landing Page)
- **Hiện tượng:** Khi màn hình <= 767px, `.hero-stats` chuyển sang `flex-direction: column`. Các thanh phân cách `.stat-divider` vốn có kích thước dọc (`width: 1px; height: 32px`) bị thả trôi lơ lửng theo phương dọc giữa 3 khối thống kê xếp chồng.
- **Hệ quả Visual:** Đường kẻ 1px dọc đứng trơ trọi giữa các dòng thống kê nằm dọc, tạo cảm giác layout bị lỗi hoặc đứt gãy.
- **Đề xuất xử lý:**
  - Trên mobile, đổi `.stat-divider` thành đường phân cách ngang mềm mại (`width: 48px; height: 1px; background: rgba(186, 200, 177, 0.4)`) hoặc chuyển `.hero-stats` thành dạng grid 3 cột thu nhỏ có đường viền tinh tế.

#### 3. Hero CTA Buttons căn chỉnh trên Mobile hẹp (320px - 375px)
- **Hiện tượng:** Hai nút bấm `.hero-actions .btn` ("Bắt Đầu Trắc Nghiệm Ngay" và "Khám Phá 4 Nhóm Năng Lượng") bị ngắt dòng không đồng đều khi chiều rộng viewport dưới 375px. Nút chính dài hơn nút phụ, tạo ra bố cục răng cưa không vững chãi.
- **Đề xuất xử lý:**
  - Thiết lập `.hero-actions { flex-direction: column; width: 100%; }` và `.hero-actions .btn { width: 100%; justify-content: center; }` trên màn hình <= 480px để tạo khối CTA liền mạch, bề thế và dễ bấm bằng ngón tay cái.

#### 4. Khoảng cách đệm (Padding) của thẻ Archetype trên Mobile nhỏ (320px)
- **Hiện tượng:** `.archetype-card` có `padding: var(--space-xl)` (32px). Trên màn hình 320px, sau khi trừ padding của container (16px mỗi bên = 32px), bề ngang thẻ chỉ còn 288px. Padding 32px mỗi bên của thẻ khiến diện tích hiển thị nội dung bị ép hẹp chỉ còn 224px.
- **Đề xuất xử lý:**
  - Điều chỉnh padding của card trên mobile (<= 480px) thành `var(--space-md)` (16px) hoặc `18px-20px`, tăng tỷ lệ hiển thị cho hình ảnh minh họa và nội dung mô tả.

#### 5. Quiz Option Cards: Căn chỉnh Radio Indicator khi Text nhiều dòng
- **Hiện tượng:** `.option-card` đang dùng `align-items: center;`. Khi câu trả lời dài từ 2–3 dòng trên màn hình mobile (320px - 390px), vòng tròn radio indicator bị đẩy xuống chính giữa theo chiều cao của cả đoạn văn, thay vì căn thẳng hàng với dòng chữ đầu tiên.
- **Đề xuất xử lý:**
  - Điều chỉnh sang `align-items: flex-start;` kết hợp `margin-top: 2px;` cho `.option-radio-indicator` để radio luôn gắn liền với dòng mở đầu, đúng chuẩn UX Editorial.

#### 6. Trạng thái Hover trên Mobile Touch Screen
- **Hiện tượng:** Hiệu ứng hover (`transform: translateY(-2px)`, `box-shadow`) được viết trực tiếp mà không bọc trong media query `@media (hover: hover)`. Trên thiết bị cảm ứng, thao tác chạm (tap) lưu lại trạng thái "sticky hover" khó chịu.
- **Đề xuất xử lý:**
  - Phân tách rõ ràng: `@media (hover: hover)` cho desktop và `:active` (nhấn chạm phản hồi tức thì với `transform: scale(0.98)`) cho mobile touch devices.

#### 7. Matrix Row Name & Stats Colliding trên màn hình hẹp (Result Page)
- **Hiện tượng:** Hàng thống kê phân bổ năng lượng `.matrix-row-meta` hiển thị tên archetype bên trái ("01 — The Leader — Người Lãnh Đạo") và điểm số/tỷ lệ bên phải ("4 / 10   40%"). Trên màn hình 320px - 375px, chuỗi tên dài có nguy cơ đè lên khối điểm số nếu không cho phép wrap linh hoạt.
- **Đề xuất xử lý:**
  - Thêm `flex-wrap: wrap; gap: var(--space-2xs);` và tối ưu cỡ chữ nhãn tên trên mobile để bảo đảm không bao giờ xảy ra tràn chữ hay đè lấn.

---

### B. Vấn đề Typography & Font Quality

#### 1. Lỗi chắp vá ký tự tiếng Việt trên Counter Badge (Quiz Page)
- **Mức độ:** **Cao (High Bug BUG-001)**
- **Hiện tượng:** `.quiz-counter-badge` dùng `--font-numeral` (`Cinzel`). Font Cinzel là font La Mã cổ chỉ có Small-Caps và **thiếu 64/88 ký tự tiếng Việt**, dẫn đến chữ `"ỏ"` trong `"Câu hỏi 01 trên 10"` bị fallback sang font serif chữ thường, lệch hoàn toàn so với các chữ in hoa La Mã xung quanh (`CÂU H[ỏ]I 01 TRÊN 10`).
- **Giải pháp:** Chuyển `.quiz-counter-badge` sang dùng `--font-body` (`Plus Jakarta Sans`), đảm bảo 100% tiếng Việt mượt mà, đồng bộ và thanh thoát.

#### 2. Hiệu năng Font Loading & FOUT (Flash of Unstyled Text)
- **Mức độ:** **Trung bình (Medium Bug BUG-002)**
- **Hiện tượng:** Google Fonts được gọi thông qua `@import url(...)` tại đầu file `src/css/base.css` thay vì thẻ `<link rel="stylesheet">` trong `<head>` HTML. Điều này tạo ra chuỗi tải tuần tự làm chậm hiển thị font từ 200–500ms trên 3G/4G di động.
- **Giải pháp:** Chuyển link Google Fonts vào `<head>` của `index.html`, `quiz.html`, `result.html` với `display=swap` và bỏ `@import` trong CSS.

---

### C. Vấn đề Hệ Thống Màu Sắc & Độ Tương Phản (Color & Contrast)

#### 1. Độ tương phản chưa đạt chuẩn WCAG 2.2 AA của `--color-slate-jade`
- **Mức độ:** **Trung bình (Medium Bug BUG-003)**
- **Hiện tượng:** Token màu chữ phụ `--color-slate-jade: #6C8480` có độ tương phản:
  - Trên nền Pebble Base (`#E6E6E6`): **3.21:1** (tiêu chuẩn yêu cầu tối thiểu **4.5:1** cho cỡ chữ thông thường).
  - Trên nền Pebble Subtle (`#F4F6F2`): **3.68:1** (tiêu chuẩn yêu cầu **4.5:1**).
  - Trên nền Pure White (`#FFFFFF`): **4.00:1** (dưới 4.5:1).
- **Hệ quả:** Phụ đề hero, nhãn thống kê, tagline thương hiệu và chú thích biểu đồ mờ nhạt, khó đọc dưới ánh sáng ngoài trời trên điện thoại.
- **Giải pháp:** Nâng cấp hệ thống token màu, bổ sung token `--color-text-secondary: #4A615D;` (đạt tỷ lệ tương phản **5.32:1**, vượt chuẩn WCAG 2.2 AA).

#### 2. Chiều sâu thị giác (Visual Depth & Rhythm)
- **Hiện tượng:** Toàn bộ landing page sử dụng nền Pebble sáng liên tục, thiếu sự chuyển tiếp nhịp điệu (Visual Rhythm) giữa các section.
- **Giải pháp:** Xây dựng nhịp điệu section:
  - Hero Section: Nền Soft Pebble (`#E6E6E6`) kết hợp hiệu ứng hào quang tinh tế (`radial-gradient` ngọc bích mờ ảo).
  - Archetypes Showcase: Nền Pebble Subtle sáng trong (`#F4F6F2`) với viền card tinh xảo.
  - How It Works: Nền Slate Pebble chuyển tiếp nhẹ nhàng.
  - Footer: Nền Deep Forest Obsidian (`#2D3729`) đậm đà, sang trọng, mang lại cảm giác kết thúc vững chãi.

---

### D. Vấn đề Hình Ảnh & Minh Họa (Visual Assets)

1. **Mandala Hero:** Hiện tại là SVG xoay 360 độ đẹp nhưng chưa có chiều sâu ánh sáng khi đặt trên nền mobile. Cần thêm lớp ánh sáng hào quang (Celestial Ambient Aura) mờ nhẹ phía sau để biểu tượng thần số học nổi bật như một bảo vật năng lượng.
2. **Archetype SVG Cards:** Bộ 4 SVG hiện tại rất đồng nhất về phong cách hình học huyền bí (Geometric Mystical). Cần bảo đảm khi hiển thị trên mobile, tỷ lệ khung hình `1 / 1` giữ nguyên vẹn, hình ảnh sắc nét, viền bo đồng điệu với thẻ card.
3. **Subtle Celestial Textures:** Bổ sung các họa tiết hình học thiên văn (chòm sao, tia hào quang góc, tọa độ năng lượng) dạng vector SVG siêu nhẹ (< 1 kB) chìm dưới nền để gia tăng chất Modern Mystical mà không làm rối mắt hay nặng trang.

---

## 3. Bảng Phân Cấp Mức Độ Ưu Tiên Xử Lý

| Hạng mục | Vấn đề | Độ ưu tiên | File ảnh hưởng |
|---|---|---|---|
| **Typography** | Sửa lỗi font chữ tiếng Việt `ỏ` trên Quiz Counter Badge | **P1 (Critical/High)** | `src/css/quiz.css` |
| **Mobile Layout** | Sửa thanh divider dọc bị trôi lơ lửng trên Hero Stats mobile | **P1 (High)** | `src/css/responsive.css`, `landing.css` |
| **Mobile UX** | Full-width cho các cụm nút CTA trên mobile <= 480px | **P1 (High)** | `src/css/responsive.css` |
| **Color Contrast** | Nâng cấp token màu chữ phụ đạt chuẩn WCAG 2.2 AA (>= 4.5:1) | **P2 (Medium)** | `src/css/base.css`, `layout.css`, `components.css` |
| **Performance** | Loại bỏ `@import` CSS, chuyển font link vào HTML `<head>` | **P2 (Medium)** | `src/css/base.css`, 3 file HTML |
| **Mobile Nav** | Khôi phục nút Home tinh gọn trên mobile header cho Quiz & Result | **P2 (Medium)** | `src/css/responsive.css`, `layout.css` |
| **Touch UX** | Tách biệt `@media (hover: hover)` và phản hồi `:active` cảm ứng | **P3 (Medium)** | `src/css/components.css`, `quiz.css` |
| **Quiz UX** | Radio indicator căn lề `flex-start` cho câu trả lời nhiều dòng | **P3 (Low)** | `src/css/quiz.css` |
| **Visual Depth** | Thêm ambient glow và celestial geometric subtle background | **P3 (Visual)** | `src/css/landing.css`, `base.css` |

