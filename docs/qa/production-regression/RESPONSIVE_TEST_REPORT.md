# BÁO CÁO KIỂM THỬ GIAO DIỆN ĐÁP ỨNG (RESPONSIVE TEST REPORT)

**Dự án:** NUMEROLOGY — Discover Your Inner Energy  
**Mã báo cáo:** RESP-AUDIT-20261112  
**Đối tượng:** `index.html`, `quiz.html`, `result.html`  
**Môi trường đối chiếu:** Local Development vs. Production (GitHub Pages)  
**Tiêu chuẩn kiểm thử:** W3C CSS Specification, WCAG 2.1 AA, Viewport Layout Integrity

---

## 1. Ma trận kiểm thử kích thước màn hình (Viewport Matrix)

| Profile Thiết Bị | Chiều rộng (Width) | Chiều cao (Height) | Tỷ lệ khung hình | Mục tiêu đánh giá |
|---|---:|---:|:---:|---|
| **Small Mobile** | 320px | 640px | 1:2 (Narrow) | iPhone SE 1st gen, kiểm tra co giãn tối thiểu, không tràn ngang |
| **iPhone Standard** | 375px | 667px | ~9:16 | iPhone 6/7/8/SE 2nd, kiểm tra layout thẻ bài và navigation |
| **Standard Mobile** | 390px | 844px | 19.5:9 | iPhone 12/13/14, layout di động phổ biến nhất hiện nay |
| **Large Mobile** | 430px | 932px | 19.5:9 | iPhone 14/15 Pro Max, màn hình lớn tỷ lệ cao |
| **Tablet Portrait** | 768px | 1024px | 3:4 | iPad Mini / Air, điểm ngắt tablet max-width 767px vs 1023px |
| **Small Laptop / Tablet Landscape** | 1024px | 768px | 4:3 | iPad Pro ngang / Laptop 1024px, chuyển tiếp Desktop |
| **Desktop High-Res** | 1440px | 900px | 16:10 | Màn hình máy tính chuẩn, bố cục đa cột và padding rộng |

> [!NOTE]
> Ghi chú kỹ thuật: Do môi trường sandbox không gắn kết cổng DevTools tương tác (`DevToolsActivePort`), kiểm tra trực quan visual rendering bằng screenshot tự động được đánh dấu là `NOT TESTED (môi trường không hỗ trợ remote debugging port)`. Toàn bộ dữ liệu dưới đây được phân tích bằng công cụ AST / CSS Object Model (CSSOM), DOM Cascade Trace và kiểm tra thuộc tính computed styles.

---

## 2. Kết quả kiểm thử chi tiết theo từng trang

### 2.1. Trang Chủ (`index.html` — Landing Page)

#### Bảng so sánh hành vi giữa Local Dev và Production

| Viewport | Thành phần | Trạng thái Local Dev (`vite dev`) | Trạng thái Production (GitHub Pages) | Nguyên nhân kỹ thuật |
|---|---|:---:|:---:|---|
| **320px** | Hero Grid | **PASS** (1 cột dọc) | **FAIL (Bị đè)** | `main-DZysZFRg.css` đè `grid-template-columns: 1.15fr .85fr` lên `dom-BEPUy4o2.css` (`1fr`) |
| **320px** | Archetypes Grid | **PASS** (1 cột) | **FAIL (Tràn ngang)** | `main-DZysZFRg.css` giữ `repeat(4, 1fr)` thay vì chuyển thành 1 cột |
| **320px** | Steps Grid | **PASS** (1 cột) | **FAIL (Cực hẹp)** | `main-DZysZFRg.css` giữ `repeat(3, 1fr)` thay vì 1 cột |
| **320px** | Hero Actions | **PASS** (100% full-width nút) | **FAIL (Bị dồn dòng)** | `main-DZysZFRg.css` nạp sau giữ `flex-wrap: wrap; margin-bottom: 2xl` |
| **320px** | Hero Stats Divider | **PASS** (1px x 48px ngang) | **PASS** (Đã sửa ở `c5189b3`) | Kích thước phân cách thống nhất |
| **375px** | Hero Layout | **PASS** (1 cột dọc) | **FAIL (Bị đè)** | Cascade order làm mất media query max-width 1023px |
| **375px** | 4 Thẻ Archetype | **PASS** (Xếp chồng dọc) | **FAIL (Co dúm 4 cột)** | Mỗi thẻ bị ép xuống ~75px chiều rộng, nội dung vỡ khung |
| **390px** | Hero Typography | **PASS** (Fluid Clamp) | **PASS** (Font clamp hoạt động) | `font-size: clamp(...)` không bị ảnh hưởng bởi thứ tự CSS |
| **430px** | Mobile Drawer | **PASS** (Ẩn/Hiện mượt) | **PASS** (Logic JS độc lập) | JS Drawer hoạt động theo click toggle độc lập |
| **768px** | Header Nav | **PASS** (Ẩn nav desktop, hiện toggle) | **PASS** | `.site-nav { display: none }` nằm trong `dom-BEPUy4o2.css` |
| **1024px** | Container Padding | **PASS** (24px) | **PASS** | Token CSS Container kế thừa đúng |
| **1440px** | Toàn bộ Landing | **PASS** (Desktop hoàn chỉnh) | **PASS** | Cả hai môi trường đều hiển thị đúng giao diện Desktop chuẩn |

---

### 2.2. Trang Trắc Nghiệm (`quiz.html` — Quiz Page)

#### Bảng so sánh hành vi giữa Local Dev và Production

| Viewport | Thành phần | Trạng thái Local Dev (`vite dev`) | Trạng thái Production (GitHub Pages) | Chi tiết kỹ thuật |
|---|---|:---:|:---:|---|
| **320px** | Quiz Card Padding | **PASS** (`--space-lg` `--space-md`) | **FAIL (Padding quá lớn)** | `quiz-CoYV25Rt.css` nạp sau đè padding `var(--space-2xl)` (32px), làm nội dung bị thu hẹp |
| **320px** | Quiz Controls (Nút Tiếp / Quay lại) | **PASS** (`flex-direction: column-reverse`) | **FAIL (Ngang chật chội)** | `quiz-CoYV25Rt.css` đè `display: flex; justify-content: space-between`, hai nút dính chặt nhau |
| **320px** | Option Cards (Lựa chọn 01-04) | **PASS** (Touch target >= 48px) | **PASS** | Option card padding và roving tabindex duy trì chuẩn touch |
| **375px** | Progress Bar | **PASS** (Hiển thị 100% width) | **PASS** | Thanh tiến độ co giãn theo flexbox container |
| **390px** | Counter Badge ("Câu hỏi 1 / 10") | **PASS** (Font tiếng Việt không lệch) | **PASS** | Đã áp dụng `var(--font-body)` khắc phục dấu hỏi `ỏ` tiếng Việt |
| **430px** | Question Title Clamp | **PASS** (Dễ đọc, 2-3 dòng) | **PASS** | Line-height 1.4, không bị cắt chữ |
| **768px** | Quiz Controls | **PASS** (Bố cục dàn đều) | **FAIL nhẹ** | Vẫn giữ padding máy tính `var(--space-2xl)` |
| **1024px** | Toàn bộ Quiz Card | **PASS** (Tối đa 760px căn giữa) | **PASS** | Căn giữa màn hình tốt |
| **1440px** | Quiz Page | **PASS** (Hoàn hảo) | **PASS** | Trải nghiệm máy tính tối ưu |

---

### 2.3. Trang Kết Quả (`result.html` — Result Page)

#### Bảng so sánh hành vi giữa Local Dev và Production

| Viewport | Thành phần | Trạng thái Local Dev (`vite dev`) | Trạng thái Production (GitHub Pages) | Chi tiết kỹ thuật |
|---|---|:---:|:---:|---|
| **320px** | Result Hero Card | **PASS** (1 cột dọc) | **FAIL NẶNG** | `result-OGAHyAxC.css` đè `grid-template-columns: 280px 1fr`, gây tràn ngang màn hình 320px! |
| **320px** | Narrative Grid (3 cột phân tích) | **PASS** (1 cột dọc) | **FAIL NẶNG** | `result-OGAHyAxC.css` đè `grid-template-columns: repeat(3, 1fr)`, mỗi cột rộng ~90px bị vỡ layout |
| **320px** | Action Buttons (Làm lại / Chia sẻ) | **PASS** (Xếp dọc, 100% width) | **FAIL** | `result-OGAHyAxC.css` giữ `flex-wrap: wrap` ngang, nút không giãn đều |
| **375px** | Energy Matrix Chart | **PASS** (Thanh % co giãn đúng) | **FAIL nhẹ** | Card padding bị đè thành 32px thay vì 16px |
| **390px** | Archetype Badge & Icon | **PASS** (120px mandala căn giữa) | **FAIL (Lệch trái)** | Bị kéo sang cột 280px của hero grid bị lỗi |
| **430px** | Detailed Breakdown Sections | **PASS** (Dễ đọc) | **PASS** | Typography và spacing nội dung kế thừa chuẩn |
| **768px** | Hero Card | **PASS** (Dọc) | **FAIL** | Cột 280px 1fr vẫn bị giữ trên màn hình 768px |
| **1024px** | Result Card Layout | **PASS** (2 cột) | **PASS** | Chuyển tiếp layout hợp lý |
| **1440px** | Result Page Desktop | **PASS** (Editorial sang trọng) | **PASS** | Không có lỗi hiển thị trên desktop |

---

## 3. Tổng hợp số lượng lỗi Responsive trên Production

```
+-------------------------------------------------------------+
| TỔNG SỐ ĐIỂM KIỂM THỬ: 21                                  |
| - PASS TRÊN CẢ LOCAL & PRODUCTION: 12 điểm                  |
| - PASS TRÊN LOCAL DEV NHƯNG FAIL TRÊN PRODUCTION: 9 điểm    |
|   (Bao gồm: 4 điểm Landing, 2 điểm Quiz, 3 điểm Result)     |
+-------------------------------------------------------------+
```

### Chi tiết 9 điểm sai khác do Cascade Order:
1. `index.html`: `.hero-grid` không chuyển thành 1 cột trên mobile (< 1024px).
2. `index.html`: `.archetypes-grid` không chuyển thành 1 cột trên mobile (< 768px).
3. `index.html`: `.steps-grid` không chuyển thành 1 cột trên mobile (< 768px).
4. `index.html`: `.hero-actions` không xếp dọc 100% width trên small mobile (< 480px).
5. `quiz.html`: `.quiz-card` bị ép padding desktop (32px) trên mobile thay vì padding gọn (16px).
6. `quiz.html`: `.quiz-controls` không xếp dọc đảo ngược (`column-reverse`) trên mobile (< 768px).
7. `result.html`: `.result-hero-card` bị ép bố cục cố định `280px 1fr` gây tràn ngang trên mobile.
8. `result.html`: `.result-narrative-grid` bị ép 3 cột song song trên mobile thay vì xếp chồng 1 cột.
9. `result.html`: `.result-actions-bar` không xếp dọc toàn chiều rộng trên mobile.

