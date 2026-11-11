# NHẬT KÝ THAY ĐỔI VÀ TÁI CẤU TRÚC (REFACTOR CHANGELOG)
## DỰ ÁN: NUMEROLOGY — DISCOVER YOUR INNER ENERGY

**Mã tài liệu:** CHANGELOG-20261112  
**Phiên bản:** 1.1.0-prod-ready  
**Ngày cập nhật:** 2026-11-12  

---

## 1. Bảng tổng hợp các file thay đổi (Implementation Changelog Table)

| STT | File | Vấn đề phát hiện | Nội dung điều chỉnh | Phương thức xác minh |
|:---:|---|---|---|---|
| 1 | `src/css/landing.css` | `.archetypes-grid` và `.steps-grid` khai báo 4 cột và 3 cột ở root level, bị đè bẹp luật mobile khi đóng gói production (CRITICAL BUG 01 & 02). | Chuyển đổi toàn bộ sang chuẩn **Mobile-First**: Mặc định 1 cột cho mobile; chỉ kích hoạt `repeat(2, 1fr)` tại `@media (min-width: 768px)` và `repeat(4, 1fr)` tại `@media (min-width: 1024px)`. Áp dụng tương tự cho `.hero-grid`, `.hero-actions`, `.hero-stats`, `.hero-visual`. | Chạy `npm run test:responsive` (PASS), `npm run build` và kiểm tra AST CSS chunks. |
| 2 | `src/css/quiz.css` | `.quiz-card` bị ép padding desktop 32px trên mobile; `.quiz-controls` dàn ngang gây chật chội nút bấm. | Tái cấu trúc Mobile-First: padding mặc định 20px 16px, `.quiz-controls` mặc định `column-reverse`, `.quiz-controls-right` 100% width. Chỉ kích hoạt dàn ngang tại `@media (min-width: 768px)`. | Chạy `npm run test:responsive` (PASS) và kiểm tra computed styles. |
| 3 | `src/css/result.css` | `.result-hero-card` cố định cột 280px gây tràn ngang màn hình di động; `.result-narrative-grid` giữ 3 cột song song làm vỡ layout. | Tái cấu trúc Mobile-First: `.result-hero-card` mặc định 1 cột căn giữa; `.result-narrative-grid` mặc định 1 cột; `.result-actions-bar` mặc định xếp dọc. Chỉ kích hoạt đa cột tại `@media (min-width: 1024px)`. | Chạy `npm run test:responsive` (PASS) và kiểm tra 320px/375px. |
| 4 | `src/css/layout.css` | `.footer-grid` khai báo đa cột ở root level gây rủi ro tràn ngang. | Tái cấu trúc Mobile-First: Mặc định 1 cột cho footer, mở rộng 2 cột ở tablet (768px) và 4 cột ở desktop (1024px). | Chạy kiểm tra bố cục footer trên các viewport. |
| 5 | `src/js/tests/responsive-regression.test.js` | Chưa có bộ kiểm thử tự động ngăn chặn regression cho các layout mobile và palette màu. | Tạo test suite mới gồm 26 test cases: kiểm tra Mobile-First rules cho Archetype Cards, Process Steps, Hero, Quiz, Result, kiểm tra 5 mã màu Jade Pebble Morning và Semantic HTML. | `node src/js/tests/responsive-regression.test.js` (26/26 PASS). |
| 6 | `package.json` | Lệnh `npm test` chưa tích hợp kiểm thử responsive regression. | Bổ sung script `"test:responsive": "node src/js/tests/responsive-regression.test.js"` và tích hợp vào `"test"`. | Chạy `npm test` thành công với 92 tests tổng cộng. |

---

## 2. Chi tiết kỹ thuật các giải pháp tái cấu trúc

### 2.1. Giải pháp Mobile-First Scoped CSS cho CRITICAL BUG 01 & 02

```css
/* TRƯỚC (Desktop-First Không Bọc): */
.archetypes-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Áp dụng vô điều kiện */
  gap: var(--space-lg);
}

/* SAU (Mobile-First Scoped): */
.archetypes-grid {
  display: grid;
  grid-template-columns: 1fr; /* Mặc định 1 cột cho Mobile (<768px) */
  gap: var(--space-lg);
}

@media (min-width: 768px) {
  .archetypes-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 cột cho Tablet */
  }
}

@media (min-width: 1024px) {
  .archetypes-grid {
    grid-template-columns: repeat(4, 1fr); /* 4 cột cho Desktop */
  }
}
```

*Lợi ích kiến trúc:*
- Trên màn hình di động (< 768px), các khối `@media (min-width: 768px)` và `@media (min-width: 1024px)` hoàn toàn không được kích hoạt (`evaluates to false`).
- Do đó, dù Vite/Rollup có sắp xếp các chunk CSS theo bất kỳ thứ tự nào trong bản build production, layout 4 cột hoặc 3 cột không bao giờ bị rò rỉ vào giao diện mobile.

