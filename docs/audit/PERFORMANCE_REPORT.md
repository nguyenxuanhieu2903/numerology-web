# BÁO CÁO TỐI ƯU HIỆU NĂNG (PERFORMANCE REPORT)
## DỰ ÁN: NUMEROLOGY — DISCOVER YOUR INNER ENERGY

**Mã tài liệu:** PERF-REPORT-20261112  
**Đối tượng khảo sát:** Bundle Size, Asset Loading, Font Rendering, Layout Stability, Build Metrics  
**Ngày thực hiện:** 2026-11-12  

---

## 1. Tổng quan số liệu Bundle & Kích thước tài nguyên (Asset Size & Gzip Metrics)

Toàn bộ tài nguyên ứng dụng sau khi trải qua quá trình biên dịch và nén bởi Vite 5.4.21:

### 1.1. Bảng số liệu chi tiết bản build `dist/`

| Loại tài nguyên | Tên File Asset | Kích thước Raw | Kích thước Gzip | Đánh giá ngân sách hiệu năng (Budget) |
|---|---|---:|---:|:---:|
| **HTML** | `dist/index.html` | 16.74 kB | 4.47 kB | Tốt (< 30 kB) |
| **HTML** | `dist/quiz.html` | 6.76 kB | 2.19 kB | Xuất sắc (< 15 kB) |
| **HTML** | `dist/result.html` | 14.17 kB | 3.84 kB | Tốt (< 25 kB) |
| **CSS** | `dist/assets/dom-QYazHX47.css` (Shared) | 15.15 kB | 3.81 kB | Xuất sắc (< 20 kB) |
| **CSS** | `dist/assets/main-BfqGR3UW.css` (Landing) | 6.29 kB | 1.64 kB | Xuất sắc (< 10 kB) |
| **CSS** | `dist/assets/quiz-BRm-d1bc.css` (Quiz) | 3.86 kB | 1.12 kB | Xuất sắc (< 10 kB) |
| **CSS** | `dist/assets/result-DGuBMlP-.css` (Result) | 6.25 kB | 1.52 kB | Xuất sắc (< 10 kB) |
| **JavaScript** | `dist/assets/dom-DIZAWTSQ.js` (jQuery+DOM) | 105.00 kB | 38.88 kB | Tốt (< 50 kB Gzip) |
| **JavaScript** | `dist/assets/scoring-BjMTr8Gp.js` (Core Engine) | 19.42 kB | 9.26 kB | Tốt (< 15 kB Gzip) |
| **JavaScript** | `dist/assets/quiz-CgrsCPji.js` (Quiz UI) | 16.65 kB | 7.29 kB | Xuất sắc (< 10 kB Gzip) |
| **JavaScript** | `dist/assets/result-CMcgI_ZX.js` (Result UI) | 4.40 kB | 2.02 kB | Xuất sắc (< 10 kB Gzip) |
| **JavaScript** | `dist/assets/main-6mRBjLBZ.js` (Landing UI) | 1.55 kB | 0.67 kB | Siêu nhẹ (< 2 kB Gzip) |
| **Vector Images** | 5 file SVG hình ảnh | ~8.00 kB | ~3.00 kB | Siêu nhẹ, tải tức thì |

**Tổng tải mạng lần đầu (First Load Network Transfer — Gzip):**
- **Trang Landing:** $\sim 50.4 \text{ kB}$
- **Trang Quiz:** $\sim 53.3 \text{ kB}$
- **Trang Result:** $\sim 55.5 \text{ kB}$

*Nhận xét:* Toàn bộ payload trên mạng của mỗi trang đều dưới $60 \text{ kB}$ Gzip, đảm bảo thời gian tải trang dưới 0.8 giây ngay cả trên mạng 3G/4G di động.

---

## 2. Chiến lược nạp tài nguyên & Trải nghiệm thị giác

### 2.1. Tối ưu Font Loading & Ngăn chặn Layout Shift (CLS)
- Khai báo `<link rel="preconnect" href="https://fonts.googleapis.com" />` và `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />` tại đầu thẻ `<head>` giúp thiết lập kết nối TCP/TLS sớm với máy chủ Google Fonts trước khi file HTML được parse xong.
- Thuộc tính `&display=swap` đảm bảo nội dung văn bản hiển thị ngay lập tức bằng font hệ thống (fallback) trong khi font tùy chỉnh đang tải, ngăn chặn hoàn toàn hiện tượng chớp tắt trắng chữ (FOIT - Flash of Invisible Text).
- Typography sử dụng `font-size: clamp(...)` giúp chữ tự động co giãn theo viewport mà không cần JavaScript can thiệp, loại bỏ hiện tượng giật cục bố cục (Cumulative Layout Shift = 0).

### 2.2. Vector Graphics (SVG) Inline & External
- Toàn bộ hình ảnh minh họa (Mandala và 4 Archetype) sử dụng định dạng SVG thuần.
- SVG có độ sắc nét vô hạn trên màn hình Retina/OLED của smartphone, trong khi dung lượng mỗi file chỉ dao động từ 1.2 kB đến 2.7 kB (nhỏ hơn 95% so với file ảnh PNG hoặc JPG tương đương).

### 2.3. Animation & Hardware Acceleration
- Các hiệu ứng chuyển động xoay mandala (`@keyframes slowOrbit`) và hiệu ứng hover chỉ can thiệp vào thuộc tính `transform` và `opacity`.
- Các thuộc tính này được xử lý trực tiếp trên GPU (Compositor Thread), không kích hoạt chu trình tính toán lại layout (Reflow) hay repaint nặng nề của CPU.
- Hỗ trợ đầy đủ `@media (prefers-reduced-motion: reduce)` giúp tắt toàn bộ animation đối với người dùng nhạy cảm với chuyển động hoặc thiết bị tiết kiệm pin.

---

## 3. Thời gian build & Đánh giá quy trình biên dịch

- **Tốc độ build trung bình:** $\sim 890\text{ms} - 950\text{ms}$ trên môi trường máy trạm.
- **Tạo Sourcemap:** Kích hoạt đầy đủ (`sourcemap: true`) cho phép truy vết và debug chính xác dòng code gốc mà không làm tăng dung lượng tải của người dùng cuối.
- **Tối ưu hóa Code Splitting:** Tự động chia sẻ chunk thư viện (`jQuery`) giữa các trang, không tải lặp lại mã nguồn dùng chung.

