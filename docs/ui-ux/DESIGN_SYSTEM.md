# DESIGN SYSTEM SPECIFICATION — JADE PEBBLE MORNING
## Project: NUMEROLOGY — Discover Your Inner Energy

---

## 1. Visual Philosophy & Design Principles

- **Core Aesthetic:** **Jade Pebble Morning** (Sự giao thoa giữa ánh sớm mai thanh tịnh, đá cuội sông mềm mại và sắc ngọc bích huyền bí).
- **Style Archetype:**
  - **Premium Editorial:** Typography tinh tế, khoảng cách thoáng đãng, phân cấp thông tin rõ ràng như một tạp chí phong cách sống cao cấp.
  - **Modern Mystical:** Các biểu tượng hình học thần số học, mandala tinh xảo, đường nét thanh mảnh, chiều sâu ánh sáng tự nhiên.
  - **Organic Minimalism:** Tối giản tự nhiên, không rườm rà, loại bỏ gradient gắt, không neon sặc sỡ, tôn trọng sự cân bằng và tĩnh lặng.
- **Mobile-First Experience:** Mọi tương tác được đo lường theo vùng chạm ngón tay cái (Thumb Zone), khoảng cách tối thiểu 48px cho interactive targets, phản hồi tức thì khi chạm mà không bị dính hover.

---

## 2. Color System & Semantic Tokens

### 2.1. Bảng màu nền tảng (Base Palette)

| Tên Màu | Hex Code | Vai trò trong hệ thống | Độ tương phản kiểm chứng |
|---|---|---|---|
| **Sage / Muted Jade** | `#7B9669` | Primary Brand Accent, thanh trạng thái, viền active | 3.28:1 (dùng cho icon/viền/card focus) |
| **High-Contrast Sage** | `#526E43` | Primary Action Buttons (nền nút chính) | **5.72:1** trên White (Đạt WCAG AA) |
| **Dark Forest Jade** | `#404E3B` | Primary Text & Dark Accents | **7.10:1** trên Pebble Base (Đạt WCAG AAA) |
| **Slate Jade Text** | `#4A615D` | Secondary Text & Labels (Nâng cấp) | **5.32:1** trên Pebble Base (Đạt WCAG AA) |
| **Mist Jade** | `#BAC8B1` | Borders, subtle tracks, soft decorative fills | Dùng cho viền và đường kẻ phân cách |
| **Soft Pebble Base** | `#E6E6E6` | Base Background (Nền tổng thể ứng dụng) | Ánh xám trắng tự nhiên của đá cuội |
| **Pebble Light Tint** | `#F4F6F2` | Surface Subtle (Nền card phụ, header blur) | Êm dịu, chống mỏi mắt |
| **Pure White** | `#FFFFFF` | Surface Pure (Nền thẻ câu hỏi, card chính) | Tối đa độ rõ nét cho nội dung |
| **Deep Forest Obsidian**| `#2D3729` | Deep Surface (Footer, dark elevation) | Kết thúc trang vững chãi, trang trọng |

### 2.2. Phân cấp ngữ nghĩa (Semantic Tokens)

```css
:root {
  /* Surfaces & Backgrounds */
  --color-bg-base: #E6E6E6;           /* Nền trang tổng thể */
  --color-bg-subtle: #F4F6F2;         /* Nền section chuyển tiếp & card phụ */
  --color-surface-pure: #FFFFFF;      /* Nền card chính */
  --color-surface-dark: #2D3729;      /* Nền footer & dark elements */

  /* Text & Content Hierarchy */
  --color-text-primary: #404E3B;      /* Chữ chính (tiêu đề, câu hỏi, nội dung chính) - Contrast 7.10:1 */
  --color-text-secondary: #4A615D;    /* Chữ phụ (tagline, nhãn, subtitle, chú thích) - Contrast 5.32:1 */
  --color-text-muted: #647C78;        /* Chữ mờ (counter numbers, helper hints) - Contrast 4.52:1 */
  --color-text-inverse: #FFFFFF;      /* Chữ sáng trên nền tối */

  /* Interactive & Accent Tokens */
  --color-accent-primary: #7B9669;    /* Điểm nhấn ngọc bích */
  --color-accent-hover: #678056;      /* Hover ngọc bích */
  --color-btn-primary: #526E43;       /* Nền nút bấm chính (High Contrast WCAG AA) */
  --color-btn-hover: #435B36;         /* Nền nút bấm khi tương tác */
  --color-border-subtle: rgba(186, 200, 177, 0.55); /* Viền thanh mảnh */
  --color-border-focus: #7B9669;      /* Viền khi focus/selected */

  /* Feedback Semantics */
  --color-error: #A34E45;
  --color-error-bg: #FBEFED;
  --color-success: #537E56;
  --color-success-bg: #EDF5EE;
}
```

---

## 3. Typography Scale & Hierarchy

### 3.1. Phân bổ Font Family
1. **`Playfair Display` (Serif):** Dành riêng cho tiêu đề chính (H1, H2, H3), tên các nhóm năng lượng và trích dẫn triết lý. Hỗ trợ 100% tiếng Việt có dấu.
2. **`Plus Jakarta Sans` (Sans-Serif):** Dành cho toàn bộ nội dung đọc (Body), nút bấm, nhãn điều hướng, thông số bài kiểm tra, badge câu hỏi. Hỗ trợ 100% tiếng Việt có dấu.
3. **`Cinzel` (Roman Serif):** Chỉ dùng nghiêm ngặt cho chữ số La Mã thuần ASCII ("01", "02", "03", "04") và nhãn logo thương hiệu ("NUMEROLOGY"). Tuyệt đối **không** áp dụng cho văn bản có dấu tiếng Việt.

### 3.2. Bảng tỷ lệ Typography (Fluid Typographic Scale)

| Token | Desktop Size | Mobile Size (< 768px) | Font Family | Weight | Line Height |
|---|---|---|---|---|---|
| **Display H1** | `clamp(2.1rem, 4.5vw, 3.4rem)` | `2.1rem` (33.6px) | Playfair Display | 600 | 1.25 |
| **Heading H2** | `clamp(1.75rem, 3.2vw, 2.5rem)` | `1.65rem` (26.4px) | Playfair Display | 600 | 1.30 |
| **Heading H3** | `clamp(1.35rem, 2.2vw, 1.75rem)` | `1.30rem` (20.8px) | Playfair Display | 600 | 1.35 |
| **Subtitle / Subhead** | `1.05rem` (16.8px) | `0.98rem` (15.7px) | Plus Jakarta Sans | 500 / Italic | 1.55 |
| **Body Standard** | `1.00rem` (16.0px) | `0.95rem` (15.2px) | Plus Jakarta Sans | 400 | 1.65 |
| **Button Text** | `0.95rem` (15.2px) | `0.95rem` (15.2px) | Plus Jakarta Sans | 600 | 1.20 |
| **Badge / Tag** | `0.80rem` (12.8px) | `0.75rem` (12.0px) | Plus Jakarta Sans | 600 | 1.20 |
| **Numeral Large** | `2.20rem` (35.2px) | `1.80rem` (28.8px) | Cinzel | 700 | 1.00 |

---

## 4. Spacing, Radii & Depth Tokens

### 4.1. Spacing Scale
- `--space-2xs`: `4px`
- `--space-xs`: `8px`
- `--space-sm`: `12px`
- `--space-md`: `16px` (Khoảng cách tiêu chuẩn di động)
- `--space-lg`: `24px`
- `--space-xl`: `32px`
- `--space-2xl`: `48px`
- `--space-3xl`: `64px`
- `--space-4xl`: `96px` (Khoảng cách section trên desktop)

### 4.2. Border Radii
- `--radius-sm`: `8px` (Tags, badges, inputs nhỏ)
- `--radius-md`: `14px` (Button, option cards)
- `--radius-lg`: `20px` (Cards, dialogs)
- `--radius-xl`: `28px` (Hero cards, main containers)
- `--radius-full`: `9999px` (Pill badges, progress tracks)

### 4.3. Elevation & Shadows (Hữu cơ & Mềm mại)
- `--shadow-subtle`: `0 2px 8px rgba(64, 78, 59, 0.05);`
- `--shadow-card`: `0 8px 24px -4px rgba(64, 78, 59, 0.08);`
- `--shadow-elevated`: `0 16px 36px -6px rgba(64, 78, 59, 0.12);`
- `--shadow-glow`: `0 0 24px rgba(123, 150, 105, 0.22);`

---

## 5. Component Design Standards

### 5.1. Buttons
- **Primary Button (`.btn-primary`):** Nền `#526E43`, chữ trắng, viền trong suốt, chiều cao tối thiểu 48px trên mobile. Hiệu ứng active thu nhỏ nhẹ (`scale(0.98)`).
- **Outline Button (`.btn-outline`):** Nền trong suốt, viền 1.5px `#404E3B`, chữ `#404E3B`.
- **Ghost Button (`.btn-ghost`):** Không viền, không nền, phản hồi chuyển màu chữ khi tap/hover.
- **Mobile Touch Targets:** Mọi nút bấm trên viewport <= 767px đều đảm bảo kích thước tối thiểu `48px × 48px`, khoảng đệm an toàn giữa các nút tối thiểu `12px`.

### 5.2. Quiz Option Cards
- **Cấu trúc:** Flexbox, `align-items: flex-start`, gap 14px.
- **Trạng thái Mặc định:** Nền `#F4F6F2`, viền `1.5px solid rgba(186, 200, 177, 0.65)`.
- **Trạng thái Được chọn (`.is-selected`):** Nền `rgba(123, 150, 105, 0.12)`, viền `1.5px solid #7B9669`, radio dot lấp đầy ngọc bích, bóng viền mềm mại.
- **Touch Interaction:** Phản hồi cảm ứng bằng độ sáng viền và scale nhẹ, loại bỏ chuyển dịch `translateX` dễ gây giật layout trên mobile.

### 5.3. Progress Bar & Badges
- **Thanh tiến trình:** Chiều cao 8px, bo góc tròn 9999px, nền track `rgba(186, 200, 177, 0.4)`, thanh fill chạy hiệu ứng chuyển sắc từ `#6C8480` sang `#7B9669`.
- **Badge câu hỏi:** Nền `rgba(186, 200, 177, 0.4)`, chữ `#404E3B`, sử dụng font `Plus Jakarta Sans` 600.

---

## 6. Responsive Breakpoints Strategy

```
 320px         375px         390px         430px         768px         1024px        1440px
   |-------------|-------------|-------------|-------------|-------------|-------------|
[ Small Mobile ] [ Standard ] [ Modern Mob ] [ Max Mobile ] [ Tablet Port] [ Laptop/Tab ] [ Desktop ]
```

1. **Small Mobile (320px – 374px):** Container padding 16px, CTA xếp chồng dọc 100%, Card padding 18px.
2. **Standard & Modern Mobile (375px – 430px):** Layout 1 cột, Hamburger drawer mượt mà, Quiz controls Next ở trên, Back ở dưới.
3. **Tablet (768px – 1023px):** Archetypes grid 2 cột, Narrative cards 1 cột, Hero căn giữa đối xứng.
4. **Desktop (>= 1024px):** Container max 1180px, Hero grid 2 cột (55/45), Archetypes grid 4 cột, Navigation menu ngang đầy đủ.

---

## 7. Image & Illustration Guidelines

- **Format:** 100% Vector SVG, nhúng trực tiếp hoặc tải qua `<img>` với `loading="lazy"`.
- **Bảng màu minh họa:** Đồng bộ 5 màu của Jade Pebble Morning (`#7B9669`, `#BAC8B1`, `#6C8480`, `#404E3B`, `#F4F6F2`).
- **Archetype Identity:**
  - **01 The Leader:** Biểu tượng sao Bắc Đẩu 8 cánh (North Star / Compass Ray), thể hiện định hướng và tiên phong.
  - **02 The Harmonizer:** Hai vòng tròn giao thoa (Twin Circles) và trăng khuyết cân bằng, thể hiện thấu cảm và hòa hợp.
  - **03 The Creator:** Lăng kính tam giác đa chiều (Hexagram / Prism of Sparks), thể hiện trí tưởng tượng và sáng tạo.
  - **04 The Builder:** Khối lập phương vững chãi (Isometric Foundation Cube), thể hiện kỷ luật và nền tảng sắt đá.
- **Aura Mandala:** Tích hợp hiệu ứng ánh sáng hào quang thiên văn mờ ảo (Celestial Ambient Aura) phía sau biểu tượng Mandala trên hero section để tăng chiều sâu thị giác.

