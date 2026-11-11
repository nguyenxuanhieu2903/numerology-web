# BÁO CÁO TỔNG KẾT KIỂM THỬ TOÀN DIỆN (QA FINAL AUDIT REPORT)
## PRODUCTION vs LOCAL RESPONSIVE REGRESSION AUDIT

**Dự án:** NUMEROLOGY — Discover Your Inner Energy  
**Mã tài liệu:** QA-FINAL-REG-20261112  
**Phiên bản kiểm thử:** Git commit `c5189b3`  
**Production URL:** `https://nguyenxuanhieu2903.github.io/numerology-web/`  
**Đơn vị thực hiện:** Senior QA Engineer, Software Test Architect & Frontend Reviewer  
**Ngày phát hành:** 2026-11-12

---

## 1. Tóm tắt kết quả kiểm thử (Executive Summary)

Đợt kiểm thử chuyên sâu nhằm giải quyết bài toán: **Tại sao giao diện mobile hiển thị bình thường ở môi trường local development (`npm run dev`), nhưng khi deploy lên GitHub Pages production lại xuất hiện lỗi bố cục hoặc hiển thị không giống local?**

### Kết quả đánh giá chung:
- **Automated Tests:** **66/66 PASS (100%)** — Kiểm tra tính toán điểm số (22), luồng bài trắc nghiệm (26), và chất lượng song ngữ & bảo mật (18) hoàn toàn ổn định.
- **Tài nguyên mạng Production:** **15/15 tài nguyên HTTP 200 OK (100%)** — Không có lỗi 404, không có lỗi MIME type, không có lỗi cú pháp JS/CSS.
- **Giao diện Desktop (>= 1024px):** **HOÀN TOÀN ĐẠT CHUẨN** trên cả Local và Production.
- **Giao diện Di động (< 768px):** **XUẤT HIỆN LỖI NGHIÊM TRỌNG TRÊN PRODUCTION DO SỰ ĐẢO NGƯỢC THỨ TỰ CSS (CASCADE INVERSION).**

---

## 2. Thống kê số lượng kiểm thử & Trạng thái

```
========================================================================================
THỐNG KÊ TOÀN DIỆN ĐỢT AUDIT PRODUCTION vs LOCAL
========================================================================================
1. Automated Test Suites:
   - Scoring & Percentage Tests:      22 / 22 PASS (100%)
   - Quiz Engine & Storage Tests:     26 / 26 PASS (100%)
   - QA Integrity & Robustness Tests: 18 / 18 PASS (100%)
   -> TỔNG AUTOMATED TESTS:           66 / 66 PASS (100%)

2. Production Asset Integrity:
   - Document Pages (HTML):            3 / 3 PASS (200 OK, Exact Match)
   - Stylesheet Chunks (CSS):          4 / 4 PASS (200 OK, Exact Match)
   - JavaScript Modules (JS):          5 / 5 PASS (200 OK, Exact Match)
   - Vector Graphics (SVG):            6 / 6 PASS (200 OK, Exact Match)
   -> TỔNG TÀI NGUYÊN KIỂM CHỨNG:     18 / 18 PASS (100%)

3. Responsive Viewport Checkpoints:
   - Checkpoints đạt chuẩn cả hai môi trường:      12 / 21
   - Checkpoints đạt chuẩn Local nhưng FAIL Prod:    9 / 21
   -> TỶ LỆ ĐẠT CHUẨN RESPONSIVE TRÊN PRODUCTION:   57.1% (Cần xử lý)
========================================================================================
```

---

## 3. Bảng phân loại lỗi (Defect Registry)

| Mã lỗi | Mức độ | Phân loại | Tóm tắt lỗi | Vị trí phát sinh |
|---|:---:|---|---|---|
| **BUG-REG-01** | **CRITICAL** | Architecture / CSS Cascade | Vite/Rollup chia CSS thành shared chunk (`dom-*.css`) và page chunk (`main-*.css`), chèn shared chunk lên trước khiến các thuộc tính desktop trong page chunk đè bẹp các media queries mobile. | Toàn bộ 3 trang: `index.html`, `quiz.html`, `result.html` |
| **BUG-REG-02** | **HIGH** | CDN / Caching | Fastly CDN và trình duyệt mobile cache file HTML (`max-age=600`) không có version hash, khiến người dùng mobile tiếp tục tải các bundle CSS cũ khi vừa cập nhật. | GitHub Pages HTTP Header |
| **BUG-REG-03** | **MEDIUM** | Quality Assurance Process | Thiếu bước kiểm tra bắt buộc `npm run preview` trước khi commit, dẫn đến việc không phát hiện lỗi đóng gói CSS trong môi trường dev mode. | Quy trình phát triển nội bộ |

---

## 4. Bằng chứng trực tiếp về BUG-REG-01 (CSS Cascade Inversion)

### Cơ chế gây lỗi:
```
TRONG MÃ NGUỒN (index.html):
1. landing.css      <-- Định nghĩa desktop (.hero-grid: 1.15fr .85fr, .archetypes-grid: repeat(4, 1fr))
2. responsive.css   <-- Định nghĩa mobile (@media max-width 767px: 1fr)
=> Dev mode nạp responsive.css SAU CÙNG -> Mobile hiển thị ĐÚNG!

TRONG BẢN BUILD PRODUCTION (dist/index.html):
1. dom-BEPUy4o2.css  <-- Chứa responsive.css (@media max-width 767px: 1fr)
2. main-DZysZFRg.css <-- Chứa landing.css (.hero-grid: 1.15fr .85fr, .archetypes-grid: repeat(4, 1fr))
=> Production nạp landing.css SAU CÙNG -> Desktop đè bẹp Mobile -> Mobile hiển thị SAI!
```

---

## 5. Danh mục tài liệu kỹ thuật đã xuất bản

Toàn bộ 6 báo cáo chi tiết đợt audit này được lưu trữ có cấu trúc tại thư mục `docs/qa/production-regression/`:

1. [ENVIRONMENT_REPORT.md](file:///d:/LapTrinhWeb/Project/Numerology/docs/qa/production-regression/ENVIRONMENT_REPORT.md): Khảo sát thông số runtime, phiên bản Node/npm/Vite, cấu hình build và kiểm tra toàn vẹn byte-for-byte.
2. [RESPONSIVE_TEST_REPORT.md](file:///d:/LapTrinhWeb/Project/Numerology/docs/qa/production-regression/RESPONSIVE_TEST_REPORT.md): Ma trận kiểm thử 7 kích thước màn hình (320px đến 1440px) trên cả 3 trang, đối chiếu chi tiết Local vs Production.
3. [NETWORK_CONSOLE_REPORT.md](file:///d:/LapTrinhWeb/Project/Numerology/docs/qa/production-regression/NETWORK_CONSOLE_REPORT.md): Nhật ký yêu cầu mạng, HTTP status, MIME type, Cache-Control header, CSP/CORS và kiểm tra lỗi console runtime.
4. [PRODUCTION_LOCAL_DIFF.md](file:///d:/LapTrinhWeb/Project/Numerology/docs/qa/production-regression/PRODUCTION_LOCAL_DIFF.md): Bảng đối chiếu 10 tiêu chí kỹ thuật giữa Local Dev (`vite dev`), Local Preview (`vite preview`) và Production (`GitHub Pages`).
5. [ROOT_CAUSE_REPORT.md](file:///d:/LapTrinhWeb/Project/Numerology/docs/qa/production-regression/ROOT_CAUSE_REPORT.md): Phân tích chi tiết 3 nguyên nhân gốc rễ (Root Causes) với phân tích AST, độ đặc hiệu CSSOM và bằng chứng selector.
6. [QA_FINAL_REPORT.md](file:///d:/LapTrinhWeb/Project/Numerology/docs/qa/production-regression/QA_FINAL_REPORT.md): Bản tổng hợp điều hành, thống kê kiểm thử, danh mục lỗi và đề xuất hành động.

---

## 6. Đề xuất hành động tiếp theo cho Engineering Team

Tuân thủ nghiêm ngặt chỉ thị: **KHÔNG SỬA CODE HOẶC DEPLOY TRONG PHIÊN NÀY**. Các đề xuất sau đây sẵn sàng được triển khai ngay khi nhận được sự phê duyệt của Tech Lead:

1. **Khắc phục BUG-REG-01:**
   - Hợp nhất cấu trúc CSS bằng cách gom CSS theo entry-point (ví dụ: `src/css/pages/landing.css` nhập `@import './base.css'`, `@import './layout.css'`, `@import './components.css'`, và `@import './responsive.css'` ở dòng cuối cùng).
   - Đảm bảo khi Vite/Rollup đóng gói, các media queries trong `responsive.css` luôn luôn nằm ở phần đuôi của file bundle kết quả.
2. **Khắc phục BUG-REG-02:**
   - Hướng dẫn tester và người dùng di động xóa cache trình duyệt hoặc mở chế độ ẩn danh (Incognito Mode) để bỏ qua cache 600 giây của Fastly CDN khi nghiệm thu bản build mới.
3. **Củng cố quy trình CI/CD (BUG-REG-03):**
   - Bổ sung lệnh kiểm tra `npm run preview` hoặc script kiểm tra tính thứ tự của CSS bundle trong file `.github/workflows/deploy.yml`.

