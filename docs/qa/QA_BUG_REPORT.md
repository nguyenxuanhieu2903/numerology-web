# QA BUG REPORT — NUMEROLOGY (Discover Your Inner Energy)

---

## 1. Defect Summary Table

| Bug ID | Severity | Module | Description | Root Cause | Status |
|---|---|---|---|---|---|
| **BUG-001** | **High** | Typography / Quiz | Character glyph mismatch & fallback on Vietnamese quiz counter badge ("Câu hỏi 01 trên 10") | `quiz.css:51` applies `font-family: var(--font-numeral)` (which loads `Cinzel`, an all-caps Roman font lacking 64/88 Vietnamese glyphs) | **OPEN** |
| **BUG-002** | **Medium** | Performance / Typography | Font loading waterfall via CSS `@import` in `base.css` causing render delay and FOUT/CLS | Google Fonts is imported inside `src/css/base.css:8` instead of preloaded `<link rel="stylesheet">` in HTML `<head>` | **OPEN** |
| **BUG-003** | **Medium** | Accessibility | Insufficient color contrast on secondary text token `--color-slate-jade` against light backgrounds | `#6C8480` has contrast 3.21:1 on `#E6E6E6` and 3.68:1 on `#F4F6F2`, failing WCAG 2.2 AA (4.5:1) for normal text | **OPEN** |
| **BUG-004** | **Low** | Bilingual / Result | Untranslated hardcoded English button in manual copy modal | `result.html:246` and `dom.js:128-129` hardcode `"Copy"` and `"Copied!"` without `data-i18n` | **OPEN** |
| **BUG-005** | **Low** | Accessibility / Quiz | Radiogroup options lack roving tabindex (all 4 options have static `tabindex="0"`) | `quiz-ui.js:60` hardcodes `tabindex="0"` on every option card regardless of selection | **OPEN** |
| **BUG-006** | **Info** | Clean Code / CSS | Redundant/unused CSS utility classes in production stylesheet | Leftover helper classes in `components.css` (`.btn-secondary`, `.badge-dark`, `.card-subtle`, `.card-elevated`) and `quiz.css` | **OPEN** |

---

## 2. Detailed Bug Reports

---

### BUG-001: Character Glyph Mismatch on Vietnamese Quiz Counter Badge

- **Severity:** High
- **Module:** Typography / Quiz Page
- **File & Line:** `src/css/quiz.css#L51`, `quiz.html#L63-L65`, `src/js/ui/quiz-ui.js#L41`
- **Component:** `.quiz-counter-badge` (`#quiz-counter-text`)

#### Steps to Reproduce
1. Open `quiz.html` or navigate to `https://nguyenxuanhieu2903.github.io/numerology-web/quiz.html`.
2. Ensure language is set to Vietnamese (default).
3. Observe the top meta-bar badge: `"Câu hỏi 01 trên 10"`.
4. Inspect the computed font family for the characters in `"Câu hỏi"`.

#### Expected Result
All text in the counter badge should render in a unified, harmonious font with complete Vietnamese diacritic glyph support (e.g. `Plus Jakarta Sans` or `Playfair Display`).

#### Actual Result
The badge text is styled with `font-family: var(--font-numeral)`. In `base.css`, `--font-numeral: 'Cinzel', 'Playfair Display', Georgia, serif;`.
Because `Cinzel` is an all-caps Roman font that **does not support Vietnamese diacritics** (missing 64 out of 88 Vietnamese letters, including `ỏ` U+1EA3 in `"hỏi"`):
- `"CÂU H"` renders in `Cinzel` as Roman small-caps.
- The letter `"ỏ"` is missing from `Cinzel` and falls back to `Playfair Display` in lowercase serif.
- `"i 01 trên 10"` renders back in `Cinzel`.
This results in an obvious visual glitch: `"CÂU H[ỏ]I 01 TRÊN 10"` with mismatched height, stroke weight, and letter casing.

#### Root Cause
`--font-numeral` was intended for Roman numerals ("01", "02") and brand titles ("NUMEROLOGY"), but was mistakenly applied to `.quiz-counter-badge`, which contains localized Vietnamese text.

#### Evidence
Automated glyph range query against Google Fonts API:
```
Cinzel Missing Vietnamese chars count: 64
Missing chars include: ỏ (U+1EA3), ạ (U+1EA1), ấ (U+1EA5), ầ (U+1EA7)...
```

#### Proposed Solution
In `src/css/quiz.css`, change the font family of `.quiz-counter-badge` to `var(--font-body)` or `inherit`:
```css
/* src/css/quiz.css line 51 */
.quiz-counter-badge {
  font-family: var(--font-body); /* Changed from var(--font-numeral) */
  font-size: 0.92rem;
  font-weight: 600;
  ...
}
```

---

### BUG-002: Font Loading Waterfall via CSS `@import`

- **Severity:** Medium
- **Module:** Performance / Typography
- **File & Line:** `src/css/base.css#L8`, `index.html#L9-L10`, `quiz.html#L9-L10`, `result.html#L9-L10`

#### Steps to Reproduce
1. Inspect the `<head>` element of `index.html`, `quiz.html`, and `result.html`.
2. Notice preconnect links to `fonts.googleapis.com` and `fonts.gstatic.com`.
3. Notice that the `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?...">` is missing from HTML `<head>`.
4. Inspect `src/css/base.css` line 8:
   `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Playfair+Display:...');`

#### Expected Result
Google Fonts stylesheets should be linked directly in the HTML `<head>` alongside `preconnect` tags so the browser can immediately initiate font metadata fetching in parallel with local CSS.

#### Actual Result
Loading fonts via `@import` in an external CSS file introduces a serialized network waterfall:
1. HTML downloaded.
2. `base.css` downloaded.
3. Browser parses `base.css` and discovers `@import`.
4. Browser downloads Google Fonts CSS.
5. Browser downloads `.woff2` font files.
This adds 200ms–500ms of latency, triggering visible Flash of Unstyled Text (FOUT) and Cumulative Layout Shift (CLS) on slower mobile connections.

#### Root Cause
Legacy CSS `@import` pattern used instead of modern `<link rel="stylesheet">` with `display=swap` in the HTML document head.

#### Evidence
Vite production build preserves the `@import` at the top of `dist/assets/dom-*.css`:
```css
@import"https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap";
```

#### Proposed Solution
1. Add Google Fonts `<link rel="stylesheet">` directly into `<head>` of `index.html`, `quiz.html`, and `result.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" />
```
2. Remove `@import url(...)` from `src/css/base.css`.

---

### BUG-003: Insufficient Color Contrast on Secondary Text Token (`--color-slate-jade`)

- **Severity:** Medium
- **Module:** Accessibility (WCAG 2.2 AA)
- **File & Line:** `src/css/base.css#L19`, `src/css/layout.css#L88`, `src/css/quiz.css#L37`, `src/css/landing.css#L73`

#### Steps to Reproduce
1. Measure the luminance of token `--color-slate-jade: #6C8480`.
2. Measure background colors `--color-bg-base: #E6E6E6` and `--color-bg-subtle: #F4F6F2`.
3. Calculate contrast ratio using the WCAG relative luminance formula.

#### Expected Result
For normal text (< 18pt or < 14pt bold), contrast ratio against the background must be at least **4.5:1** (WCAG 2.2 AA).

#### Actual Result
- Contrast of `#6C8480` on `#E6E6E6` is **3.21:1** (FAILS 4.5:1).
- Contrast of `#6C8480` on `#F4F6F2` is **3.68:1** (FAILS 4.5:1).
- Contrast of `#6C8480` on `#FFFFFF` is **4.00:1** (FAILS 4.5:1).
Text elements styled with `--color-slate-jade` at small font sizes (such as `.brand-tagline` at 0.72rem, `.quiz-meta-bar` back button, `.progress-header`, and section subtitles) are hard to read for users with low vision or in high ambient light.

#### Root Cause
`--color-slate-jade: #6C8480` was chosen for visual aesthetic softness without checking WCAG AA threshold for body-sized text.

#### Evidence
WCAG Luminance calculation script output:
```
slateJade (#6C8480) on bgBase (#E6E6E6): 3.21:1
slateJade (#6C8480) on bgSubtle (#F4F6F2): 3.68:1
slateJade (#6C8480) on surfacePure (#FFFFFF): 4.00:1
```

#### Proposed Solution
Introduce a high-contrast text variant `--color-slate-jade-text: #4E6360;` (contrast ratio 4.98:1 on `#E6E6E6` and 5.72:1 on `#F4F6F2`), or update `--color-slate-jade` to `#506662`.

---

### BUG-004: Untranslated Hardcoded English Button in Manual Copy Modal

- **Severity:** Low
- **Module:** Bilingual & Content / Result Page
- **File & Line:** `result.html#L246`, `src/js/utils/dom.js#L128-L129`

#### Steps to Reproduce
1. Complete the quiz or open `result.html?type=01`.
2. Trigger the manual copy modal (or inspect `result.html` line 246).
3. Switch language to Vietnamese (`vi`).
4. Observe the action button in `#copy-modal-overlay`.

#### Expected Result
The button should display localized text: `"Sao chép"` in Vietnamese and `"Copy"` in English. When clicked, it should temporarily show `"Đã sao chép!"` in Vietnamese and `"Copied!"` in English.

#### Actual Result
The button is hardcoded in HTML as `<button ...>Copy</button>` without `data-i18n`. When clicked, `dom.js` directly sets `$(this).text('Copied!')` and resets to `$(this).text('Copy')`.

#### Root Cause
Omission of `data-i18n` attribute and missing translation keys for the modal copy action in `translations.js`.

#### Proposed Solution
1. Add translation keys to `translations.js`:
   - `copyModalBtn: "Sao chép"` (vi) / `"Copy"` (en)
   - `copyModalBtnCopied: "Đã sao chép!"` (vi) / `"Copied!"` (en)
2. Add `data-i18n="copyModalBtn"` to `#btn-copy-modal-action` in `result.html`.
3. Use `t('copyModalBtnCopied')` and `t('copyModalBtn')` in `src/js/utils/dom.js`.

---

### BUG-005: Radiogroup Options Lack Roving Tabindex

- **Severity:** Low
- **Module:** Accessibility / Quiz Page
- **File & Line:** `src/js/ui/quiz-ui.js#L60`

#### Steps to Reproduce
1. Open `quiz.html`.
2. Press `Tab` repeatedly to navigate through the question.

#### Expected Result
According to W3C WAI-ARIA Authoring Practices Guide (APG) for Radio Groups:
- Pressing `Tab` enters the radiogroup, focusing only the currently selected radio button (or the first button if none is selected).
- Unselected radio buttons should have `tabindex="-1"`.
- Arrow keys navigate and select among the options.
- The next `Tab` press moves focus out of the radiogroup to the navigation buttons.

#### Actual Result
All 4 `.option-card` elements are rendered with `tabindex="0"`. A keyboard user is forced to press `Tab` through all 4 options sequentially before reaching the "Câu Tiếp Theo" button.

#### Root Cause
`tabindex="0"` was hardcoded into the template string in `quiz-ui.js`:
```javascript
<div class="option-card ${isSelected ? 'is-selected' : ''}" role="radio" tabindex="0" ...>
```

#### Proposed Solution
Update `quiz-ui.js` to assign `tabindex="0"` only to the selected option (or the first option if none is selected), and `tabindex="-1"` to all others:
```javascript
const isTabFocusable = selectedOption ? isSelected : index === 0;
// in template: tabindex="${isTabFocusable ? '0' : '-1'}"
```

---

### BUG-006: Redundant Unused CSS Utility Classes

- **Severity:** Info
- **Module:** Clean Code / CSS
- **File & Line:** `src/css/components.css#L54, L137, L150`, `src/css/quiz.css#L110`

#### Description
Static AST scan identified 6 CSS classes that are defined but never referenced in HTML templates or JavaScript:
- `components.css`: `.btn-secondary`, `.badge-dark`, `.card-subtle`, `.card-elevated`
- `quiz.css`: `.question-animating-out`, `.question-animating-in`

#### Proposed Solution
Prune unused classes or keep them under an internal design system token documentation section.

