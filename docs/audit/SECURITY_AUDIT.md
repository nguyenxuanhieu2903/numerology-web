# BÁO CÁO ĐÁNH GIÁ AN TOÀN BẢO MẬT (SECURITY AUDIT REPORT)
## DỰ ÁN: NUMEROLOGY — DISCOVER YOUR INNER ENERGY

**Mã tài liệu:** SEC-AUDIT-20261112  
**Đối tượng khảo sát:** Mã nguồn Frontend, DOM Manipulation, Web Storage, Dependencies, URL Handlers  
**Tiêu chuẩn đối chiếu:** OWASP Top 10 Web Application Security Risks, OWASP Client-Side Security  
**Ngày thực hiện:** 2026-11-12  

---

## 1. Tổng quan tình trạng bảo mật (Executive Security Summary)

Ứng dụng **NUMEROLOGY** là một ứng dụng Client-Side Multi-Page Application (MPA) không có cơ sở dữ liệu phía máy chủ trực tiếp. Toàn bộ dữ liệu trắc nghiệm được xử lý tại thiết bị của người dùng (In-Browser Computation) và lưu trữ cục bộ qua `sessionStorage` và `localStorage`.

```
======================================================
KẾT QUẢ ĐÁNH GIÁ LỖ HỔNG BẢO MẬT
======================================================
- Lỗ hổng nghiêm trọng (Critical Vulnerabilities):   0 (NONE)
- Nguy cơ DOM-based XSS:                            0 (MITIGATED)
- Nguy cơ Storage Poisoning:                        0 (MITIGATED)
- Lỗ hổng thư viện phụ thuộc (npm audit):          0 (0 vulnerabilities)
- Rò rỉ thông tin nhạy cảm:                         0 (NONE)
======================================================
ĐÁNH GIÁ CHUNG: BẢO MẬT ĐẠT CHUẨN SẢN XUẤT (SECURE)
======================================================
```

---

## 2. Đánh giá chi tiết từng khía cạnh bảo mật

### 2.1. Phòng chống DOM-based Cross-Site Scripting (XSS)

- **Vùng nguy cơ:** Các hàm render HTML động (`quiz-ui.js`, `result-ui.js`, `dom.js`).
- **Cơ chế phòng vệ đã kiểm chứng:**
  1. Tất cả dữ liệu chèn vào chuỗi HTML động bắt buộc phải đi qua hàm `escapeHtml(str)` trong `src/js/utils/dom.js`:
     ```javascript
     export function escapeHtml(str) {
       if (!str) return '';
       return String(str)
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#039;');
     }
     ```
  2. Đối với các nội dung thuần văn bản (như tiêu đề archetype, trích dẫn, mô tả), mã nguồn sử dụng hàm `.text()` của jQuery thay vì `.html()`, đảm bảo trình duyệt xử lý nội dung dưới dạng Plain Text an toàn.
  3. Kiểm thử tự động `qa-audit.test.js` đã đưa các payload chứa thẻ `<script>alert(1)</script>` vào storage và xác nhận hệ thống loại bỏ hoàn toàn các payload này.

### 2.2. Kiểm soát và khử độc Web Storage (Storage Poisoning Defense)

- **Vùng nguy cơ:** Dữ liệu trong `sessionStorage` có thể bị người dùng hoặc các tiện ích mở rộng trình duyệt (browser extensions) sửa đổi tùy ý.
- **Cơ chế phòng vệ trong `src/js/core/storage.js`:**
  1. `getQuizState()`:
     - Kiểm tra kiểu dữ liệu `currentQuestionIndex`, chỉ chấp nhận số nguyên trong khoảng `0` đến `9`. Mọi giá trị khác đều tự động fallback về `0`.
     - Duyệt từng câu trả lời trong `answers`, chỉ chấp nhận các ID câu hỏi từ `1` đến `10` và giá trị archetype thuộc danh sách cho phép `['01', '02', '03', '04']`. Bất kỳ giá trị lạ nào đều bị thanh lọc ngay lập tức.
  2. `getResult()`:
     - Yêu cầu cờ `isValid === true`.
     - Kiểm tra mảng `dominantTypes`: nếu chứa bất kỳ phần tử nào không nằm trong danh sách 4 archetype chuẩn, toàn bộ dữ liệu bị từ chối (`return null`), kích hoạt màn hình Fallback an toàn trên trang Kết Quả.
     - Khử độc bảng điểm `scores`: ép kiểu `Number()`, nếu là `NaN` hoặc số âm thì tự động chuyển về `0`.

### 2.3. Xử lý an toàn tham số URL (Safe URL Query Parsing)

- Trên trang `result.html`, ứng dụng hỗ trợ tính năng xem kết quả chia sẻ qua tham số `?type=01` hoặc `?type=01-03`.
- **Cơ chế phòng vệ:**
  - `resolveResultData()` trong `result-ui.js` chỉ chấp nhận các mã archetype tồn tại trong từ điển `archetypes[s]`.
  - Giới hạn số lượng nhóm kết hợp từ 1 đến tối đa 4 nhóm.
  - Mọi chuỗi ký tự lạ, đường dẫn URL ngoài, hoặc ký tự điều khiển đều bị lọc bỏ, không gây ra Open Redirect hay XSS.

### 2.4. Kiểm tra lỗ hổng phụ thuộc (Dependency Vulnerability Audit)

Kiểm tra trực tiếp với cơ sở dữ liệu bảo mật npm:
- Package runtime: `jquery@3.7.1` (Phiên bản mới nhất và an toàn nhất của dòng jQuery 3.x, đã khắc phục các lỗ hổng `CVE-2020-11022` và `CVE-2020-11023`).
- Package build-tool: `vite@5.4.14` (Không có lỗ hổng bảo mật đã biết).

### 2.5. Tài nguyên bên ngoài & Giao thức truyền tải

- 100% tài nguyên nội bộ được phục vụ qua giao thức mã hóa `HTTPS` trên GitHub Pages CDN.
- Tài nguyên bên ngoài duy nhất là Google Fonts (`fonts.googleapis.com` và `fonts.gstatic.com`) được liên kết với thuộc tính `crossorigin="anonymous"` và `preconnect` hợp lệ.
- Không sử dụng bất kỳ third-party analytics script hoặc tracking library nào.

