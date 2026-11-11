# QA TEST CASES — NUMEROLOGY (Discover Your Inner Energy)

---

## Master Test Cases Matrix (Phases 1 to 12)

| Test ID | Module | Scenario | Preconditions | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|
| **TC-01-01** | Source | Verify Project Structure & Entry Points | Source code cloned | Inspect root, `src/`, `public/`, `dist/` | 3 MPA HTML entry points exist, clean separation of concerns | Structure matches specifications, all modules present | **PASS** |
| **TC-01-02** | Source | Check Module Dependencies & Imports | `package.json` intact | Run dependency audit & inspect import declarations | Only jQuery & Vite installed; all local imports resolve | Clean dependencies, zero missing module errors | **PASS** |
| **TC-01-03** | Source | Dead Code & Unused Selector Scan | CSS & JS available | Scan CSS rules against HTML & dynamic JS classes | No dead code affecting bundle runtime | 4 utility classes in `components.css` and 2 in `quiz.css` unused | **PASS** (Low Warning) |
| **TC-02-01** | Typography | Font Family Declarations & Glyphs | CSS rules loaded | Query Google Fonts API for `Cinzel` glyph unicode-range | `Cinzel` supports Vietnamese diacritics | Missing 64/88 Vietnamese characters (only latin & latin-ext) | **FAIL** (High Bug BUG-001) |
| **TC-02-02** | Typography | Playfair Display Vietnamese Coverage | CSS loaded | Query Google Fonts API for `Playfair Display` unicode-range | Supports all 88 Vietnamese uppercase and lowercase diacritics | Full Vietnamese subset present (0 missing chars) | **PASS** |
| **TC-02-03** | Typography | Plus Jakarta Sans Vietnamese Coverage | CSS loaded | Query Google Fonts API for `Plus Jakarta Sans` unicode-range | Supports all 88 Vietnamese uppercase and lowercase diacritics | Full Vietnamese subset present (0 missing chars) | **PASS** |
| **TC-02-04** | Typography | Font Loading Waterfall Inspection | HTML loaded | Inspect `<head>` in `index.html`, `quiz.html`, `result.html` | Fonts preloaded / linked directly in HTML `<head>` | Fonts loaded via `@import` in `base.css`, creating waterfall | **FAIL** (Med Bug BUG-002) |
| **TC-02-05** | Typography | Vietnamese Characters in Quiz Counter Badge | Quiz page loaded | Check `.quiz-counter-badge` text "Câu hỏi 01 trên 10" | Renders consistently without character fallback | Letter 'ỏ' (U+1EA3) falls back from Cinzel to Playfair Display | **FAIL** (High Bug BUG-001) |
| **TC-03-01** | UI/Visual | Landing Page Hero & Mandala Visuals | Browser viewport 1440px | Load `index.html` | Hero title, subtitle, CTAs, and SVG Mandala render cleanly | Rendered with Organic Minimalism, SVG scales properly | **PASS** |
| **TC-03-02** | UI/Visual | 4 Archetype Cards Showcase | `index.html` | Scroll to `#archetypes` | 4 cards render with images, badges, descriptions | All 4 archetypes display cleanly with hover effects | **PASS** |
| **TC-03-03** | UI/Visual | How It Works Section | `index.html` | Scroll to `#how-it-works` | 3 numbered step cards render with proper spacing | Steps 01, 02, 03 render cleanly | **PASS** |
| **TC-03-04** | UI/Visual | Quiz Page Header & Layout Elements | `quiz.html` | Load `quiz.html` | Sticky header, language switch, progress bar, quiz card | All visual cards and layout structures render cleanly | **PASS** |
| **TC-03-05** | UI/Visual | Result Page Dossier & Matrix Visuals | `result.html` with data | Load valid quiz result | Dominant card, narrative cards, and animated matrix render | Visual hierarchy matches Jade Pebble Morning design | **PASS** |
| **TC-04-01** | Responsive | Mobile Viewport 320x568 (Small Mobile) | Viewport 320px | Inspect all 3 pages | No horizontal scroll, controls stack vertically | No overflow-x; font clamp scales down cleanly | **PASS** |
| **TC-04-02** | Responsive | Mobile Viewport 375x812 (Standard Mobile) | Viewport 375px | Open hamburger menu drawer | Drawer slides down, navigation links accessible | Drawer works as expected; focus moves to first link | **PASS** |
| **TC-04-03** | Responsive | Mobile Viewport 430x932 (Large Mobile) | Viewport 430px | Inspect quiz controls and result action buttons | Buttons stack with full-width tap targets | Touch target sizes >= 48px, accessible | **PASS** |
| **TC-04-04** | Responsive | Tablet Viewport 768x1024 | Viewport 768px | Inspect grid transitions | Grids adjust: archetypes 2 columns, narrative 1 column | Layouts transition cleanly without overlapping | **PASS** |
| **TC-04-05** | Responsive | Desktop Viewports 1366x768 & 1440x900 | Viewport 1366px / 1440px | Full site walkthrough | Container centered with max-width 1180px | Layout well-proportioned, editorial typography intact | **PASS** |
| **TC-04-06** | Responsive | Large Desktop Viewport 1920x1080 | Viewport 1920px | Full site walkthrough | Content centered, margins expand cleanly | Clean spacing, no visual distortion | **PASS** |
| **TC-05-01** | Functional | Landing Page CTA Navigation | `index.html` | Click "Bắt Đầu Trắc Nghiệm Ngay" | Navigates to `./quiz.html` | Successfully transitions to quiz | **PASS** |
| **TC-05-02** | Functional | Quiz Next Button Blocked on Unanswered | `quiz.html` Q1 active | Click "Câu Tiếp Theo" without selecting option | Warning banner displays; transition blocked | Alert banner displays with error message; stays on Q1 | **PASS** |
| **TC-05-03** | Functional | Option Selection & Radio State | `quiz.html` Q1 active | Click an option card | Option highlights, aria-checked="true", Next enables | State updates, warning banner disappears | **PASS** |
| **TC-05-04** | Functional | Previous Button Preserves Selection | Q2 active with Q1 answered | Click "Câu Trước" | Navigates to Q1; previously selected option selected | Q1 selection intact; changing selection updates answers | **PASS** |
| **TC-05-05** | Functional | Option Change Does Not Duplicate Scores | Q1 active | Change selection from 01 to 03 | Answers map has exactly 1 entry for Q1 ('03') | Engine updates key in-place; score remains single count | **PASS** |
| **TC-05-06** | Functional | Complete 10 Questions & Submit | All 10 answered | Click "Xem Kết Quả Ngay" on Q10 | Result calculated, stored in session, redirects | Redirects to `./result.html`, result dossier renders | **PASS** |
| **TC-05-07** | Functional | Direct Access to Result without Data | Clean session | Direct load `result.html` | Fallback empty state guard displayed | `#result-empty-state` shown; no crash, no fake winner | **PASS** |
| **TC-05-08** | Functional | Shared Result URL Query Parameter | URL `?type=01-03` | Load `result.html?type=01-03` | Renders shared view banner & composite tie profile | Correctly resolves 01-03 tie dossier from query param | **PASS** |
| **TC-05-09** | Functional | Retake Button Clears Storage | `result.html` | Click "Làm Lại Bài Trắc Nghiệm" | Session quiz state and result cleared; redirects to quiz | Data cleared; user starts fresh at Question 01 | **PASS** |
| **TC-05-10** | Functional | Share Button & Clipboard Fallback | `result.html` | Click "Chia Sẻ Kết Quả" | Copies URL to clipboard or opens copy modal | Shows toast on success or presents manual copy modal | **PASS** |
| **TC-06-01** | Scoring | Absolute Winner Archetype 01 | Answers: 10x '01' | Calculate score & percentages | Archetype 01 = 100%, dominantTypes = ['01'] | Dominant: 01 (100%), no tie | **PASS** |
| **TC-06-02** | Scoring | Absolute Winner Archetype 02 | Answers: 10x '02' | Calculate score & percentages | Archetype 02 = 100%, dominantTypes = ['02'] | Dominant: 02 (100%), no tie | **PASS** |
| **TC-06-03** | Scoring | Absolute Winner Archetype 03 | Answers: 10x '03' | Calculate score & percentages | Archetype 03 = 100%, dominantTypes = ['03'] | Dominant: 03 (100%), no tie | **PASS** |
| **TC-06-04** | Scoring | Absolute Winner Archetype 04 | Answers: 10x '04' | Calculate score & percentages | Archetype 04 = 100%, dominantTypes = ['04'] | Dominant: 04 (100%), no tie | **PASS** |
| **TC-06-05** | Scoring | 2-Way Tie (01 and 02 with 5-5) | 5x '01', 5x '02' | Calculate score & percentages | Dominant = ['01', '02'], isTie=true, 50% each | isTie=true, composite tieKey='01-02', 50%/50% | **PASS** |
| **TC-06-06** | Scoring | 3-Way Tie (01-02-03 with 3-3-3-1) | 3x '01', 3x '02', 3x '03', 1x '04' | Calculate score & percentages | Dominant = ['01', '02', '03'], 30% each, 04 = 10% | isTie=true, tieKey='01-02-03', sum strictly 100% | **PASS** |
| **TC-06-07** | Scoring | 4-Way Tie / Harmonic Equilibrium | Equal counts | Calculate percentages | All 4 archetypes equal 25% | Sum = 100%, all 4 types recognized | **PASS** |
| **TC-06-08** | Scoring | Zero Scores Across All Types | Scores: all 0 | Calculate percentages | Returns 25% for each, sum = 100%, no NaN | Sanitized to 25% each, zero NaN or Infinity | **PASS** |
| **TC-06-09** | Scoring | Incomplete Answers (< 10) | 3 answers | Call `validateAndNormalizeAnswers` | Throws descriptive Error | Threw: Expected exactly 10 answers, received 3 | **PASS** |
| **TC-06-10** | Scoring | Incomplete Question Map Dictionary | 3 keyed entries | Call `validateAndNormalizeAnswers` | Throws descriptive Error | Threw: Expected exactly 10 answers | **PASS** |
| **TC-06-11** | Scoring | Non-existent Option ID ('99') | Includes '99' | Call `validateAndNormalizeAnswers` | Throws descriptive Error | Threw: Invalid answer archetype '99' | **PASS** |
| **TC-06-12** | Scoring | Invalid Category/Archetype String | Includes 'invalid' | Call `validateAndNormalizeAnswers` | Throws descriptive Error | Threw: Invalid answer archetype 'invalid' | **PASS** |
| **TC-06-13** | Scoring | Malformed / Non-object Input | Input: 'string' | Call `validateAndNormalizeAnswers` | Throws descriptive Error | Threw: Answers must be non-null object/array | **PASS** |
| **TC-06-14** | Scoring | Storage Tampering (Corrupted State) | Storage with index 999 | Call `Storage.getQuizState()` | Sanitizes index to 0, filters invalid options | Returns index 0, purges invalid answers | **PASS** |
| **TC-06-15** | Scoring | Negative Scores Input | Negative values | Call `calculatePercentages` | Sanitizes negative numbers to 0, sums to 100% | Sanitized correctly; percentage sum = 100% | **PASS** |
| **TC-06-16** | Scoring | Incorrect Data Types (NaN, String, null) | Mixed types | Call `calculatePercentages` | Converts invalid types to 0, sums to 100% | Handled safely, sum = 100% | **PASS** |
| **TC-06-17** | Scoring | Duplicate Answer Modification | Change answer | Call `QuizEngine.selectOption` | Overwrites in-place without duplicate answer counts | Answers dictionary maintains single entry | **PASS** |
| **TC-06-18** | Scoring | Answers Exceeding Limit (> 10) | 11 answers | Call `validateAndNormalizeAnswers` | Throws descriptive Error | Threw: Expected exactly 10 answers, received 11 | **PASS** |
| **TC-07-01** | Bilingual | Translation Dictionary Symmetry | `translations.js` | Compare keys between VI and EN | Exactly 87 keys in VI and 87 keys in EN | 100% symmetrical key match; 0 missing keys | **PASS** |
| **TC-07-02** | Bilingual | Dynamic Language Switch on Landing | `index.html` | Click EN button in header | All `data-i18n` elements update to English | Language updates instantly without page reload | **PASS** |
| **TC-07-03** | Bilingual | Dynamic Language Switch on Quiz | `quiz.html` Q5 active | Click EN button | Question, options, counter, and buttons update | Language switches, current answered state preserved | **PASS** |
| **TC-07-04** | Bilingual | Dynamic Language Switch on Result | `result.html` | Click EN button | Dossier, quotes, strengths, matrix update to English | Re-renders cleanly in English | **PASS** |
| **TC-07-05** | Bilingual | Language Preference Persistence | Switched to EN | Refresh page / navigate across pages | Language remains EN via `localStorage` | Restored from `localStorage` seamlessly | **PASS** |
| **TC-07-06** | Bilingual | Untranslated Copy Button in Modal | `result.html` modal | Inspect `#btn-copy-modal-action` | Button text localized based on current language | Button hardcodes "Copy" / "Copied!" | **FAIL** (Low Bug BUG-004) |
| **TC-08-01** | Accessibility | Semantic HTML Structure | All pages | Inspect landmarks and heading hierarchy | Semantic `<header>`, `<main>`, `<section>`, `<footer>`, H1-H3 | Clean hierarchy, no skipped heading levels | **PASS** |
| **TC-08-02** | Accessibility | Dark Jade Text Contrast Ratio | `#404E3B` on `#E6E6E6` | Measure contrast ratio | Ratio >= 4.5:1 (WCAG AA) | Ratio = 7.10:1 | **PASS** |
| **TC-08-03** | Accessibility | Primary Button Contrast Ratio | `#526E43` on `#FFFFFF` | Measure contrast ratio | Ratio >= 4.5:1 (WCAG AA) | Ratio = 5.72:1 | **PASS** |
| **TC-08-04** | Accessibility | Slate Jade Text Contrast Ratio | `#6C8480` on `#E6E6E6` / `#F4F6F2` | Measure contrast ratio | Ratio >= 4.5:1 for normal body text | Ratio = 3.21:1 on base, 3.68:1 on subtle (< 4.5:1) | **FAIL** (Med Bug BUG-003) |
| **TC-08-05** | Accessibility | Keyboard Navigation in Quiz Radiogroup | `quiz.html` | Use Tab, Space, Arrow keys | Radiogroup navigable and selectable via keyboard | Fully navigable; options selectable via Enter/Space/Arrows | **PASS** |
| **TC-08-06** | Accessibility | Radiogroup Roving Tabindex | `quiz.html` | Inspect `tabindex` on `.option-card` | Only selected item has `tabindex="0"`; others `-1` | All 4 options have static `tabindex="0"` | **FAIL** (Low Bug BUG-005) |
| **TC-08-07** | Accessibility | Prefers-Reduced-Motion Support | OS reduced motion | Check CSS media query | Animations and transitions neutralized | `responsive.css` disables animations / transitions | **PASS** |
| **TC-09-01** | Security | DOM XSS via Question/Option Rendering | Dynamic questions | Inject `<script>` or `<img>` tag in data | String escaped before DOM insertion | `escapeHtml` used in all dynamic template literals | **PASS** |
| **TC-09-02** | Security | URL Query Parameter Poisoning | `result.html` | Access with `?type=<script>alert(1)</script>` | Payload rejected; falls back to empty state | Strict filter against valid `archetypes` dictionary | **PASS** |
| **TC-09-03** | Security | Session Storage Poisoning | Storage injection | Inject malicious dominantTypes or object payload | Storage parser sanitizes or rejects payload | Validated against `VALID_TYPES`; invalid rejected | **PASS** |
| **TC-09-04** | Security | External Link Hardening | All external links | Check `<a>` attributes | All external links contain `rel="noopener noreferrer"` | All 4 external links in footer properly hardened | **PASS** |
| **TC-10-01** | Performance | Production JavaScript Bundle Size | `npm run build` | Inspect bundled JS chunks in `dist/assets/` | Compressed JS bundle < 150 kB | Total JS ~146 kB uncompressed, ~58 kB gzipped | **PASS** |
| **TC-10-02** | Performance | Production CSS Bundle Size | `npm run build` | Inspect bundled CSS in `dist/assets/` | Total CSS < 50 kB | Total CSS ~28 kB uncompressed, ~7.4 kB gzipped | **PASS** |
| **TC-10-03** | Performance | Static Asset Optimization | `dist/assets/` | Inspect SVG icons and mandala | All SVGs optimized, vector-based | Zero raster bloat; SVGs < 8 kB each | **PASS** |
| **TC-11-01** | Automation | Scoring Test Suite Execution | `scoring.test.js` | Run `npm run test:scoring` | 22/22 tests PASS | 22/22 tests PASS (0 failures) | **PASS** |
| **TC-11-02** | Automation | Quiz Engine Test Suite Execution | `quiz-engine.test.js` | Run `npm run test:quiz` | 26/26 tests PASS | 26/26 tests PASS (0 failures) | **PASS** |
| **TC-11-03** | Automation | QA Audit Test Suite Execution | `qa-audit.test.js` | Run `npm run test:qa` | 18/18 tests PASS | 18/18 tests PASS (0 failures) | **PASS** |
| **TC-11-04** | Automation | Custom 18-Case Boundary Suite | `test-phase-6.js` | Run node test script | 18/18 tests PASS | 18/18 tests PASS (0 failures) | **PASS** |
| **TC-12-01** | Deployment | Vite Production MPA Build | `npm run build` | Check `dist/` output | Builds 3 HTML files with base `/numerology-web/` | Builds cleanly in ~820ms | **PASS** |
| **TC-12-02** | Deployment | GitHub Actions Workflow Configuration | `.github/workflows/deploy.yml` | Check steps, permissions, Node version | Node 20, `npm ci`, test, build, deploy to Pages | Complete and valid GitHub Actions workflow | **PASS** |
| **TC-12-03** | Deployment | Live Production HTTP Availability | Production URL | Query `index.html`, `quiz.html`, `result.html` | HTTP 200 OK on all 3 pages | All 3 pages return HTTP 200 OK | **PASS** |

