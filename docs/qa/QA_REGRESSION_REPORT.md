# QA REGRESSION REPORT — NUMEROLOGY (Discover Your Inner Energy)

---

## 1. Regression Test Baseline

Prior to conducting manual and exploratory testing, automated test baselines were executed against the codebase in the local environment:

- **Node.js Environment:** v24.22.1
- **Package Manager:** npm 10.x
- **Build Tool:** Vite 5.4.21
- **Date of Baseline Execution:** 2026-11-11

### 1.1. Automated Test Suite Results

```
> numerology-inner-energy@1.0.0 test
> npm run test:scoring && npm run test:quiz && npm run test:qa

--- [TEST SUITE: Validation & Normalization] ---
  ✓ PASS: Throws on null input
  ✓ PASS: Throws when fewer than 10 answers provided
  ✓ PASS: Throws when more than 10 answers provided
  ✓ PASS: Throws when invalid archetype token (99) is present
  ✓ PASS: Normalizes object dictionary to 10-element array

--- [TEST SUITE: Scoring Calculation] ---
  ✓ PASS: Correctly counts score distribution (4, 2, 2, 2)

--- [TEST SUITE: Single Winners for all 4 Archetypes] ---
  ✓ PASS: Dominant winner is Archetype 01 (The Leader)
  ✓ PASS: Dominant winner is Archetype 02 (The Harmonizer)
  ✓ PASS: Dominant winner is Archetype 03 (The Creator)
  ✓ PASS: Dominant winner is Archetype 04 (The Builder)

--- [TEST SUITE: Tie Handling (2-Way, 3-Way, 4-Way)] ---
  ✓ PASS: Handles 2-way tie (01 and 03) with composite key 01-03
  ✓ PASS: Handles 3-way tie (01-02-04) with composite tie data
  ✓ PASS: Handles 4-way tie evaluation identifying all 4 archetypes

--- [TEST SUITE: Percentage Calculation & 100% Sum Guarantee] ---
  ✓ PASS: 9 different distribution patterns sum strictly to 100%

[Scoring Suite Total: 22/22 PASS]

--- [TEST SUITE: Quiz Engine Navigation & Storage] ---
  ✓ PASS: 26 navigation, storage persistence, and state update tests

[Quiz Engine Suite Total: 26/26 PASS]

--- [TEST SUITE: QA Audit Validation] ---
  ✓ PASS: 18 translation completeness, question integrity, and storage poisoning tests

[QA Audit Suite Total: 18/18 PASS]
```

### 1.2. Extended Boundary Regression Suite (Phase 6 18-Case Matrix)
An extended regression test script (`test-phase-6.js`) was executed covering all 18 boundary cases specified in Phase 6:

```
=== RUNNING PHASE 6 SCORING ENGINE 18-CASE AUDIT ===
[PASS] Case 1: Archetype 01 Absolute Win
[PASS] Case 2: Archetype 02 Absolute Win
[PASS] Case 3: Archetype 03 Absolute Win
[PASS] Case 4: Archetype 04 Absolute Win
[PASS] Case 5: 2-Way Tie (01 & 02)
[PASS] Case 6: 3-Way Tie (01-02-03)
[PASS] Case 7: 4-Way Tie / Harmonic Equilibrium (25% each)
[PASS] Case 8: All Scores Equal 0
[PASS] Case 9: Missing Answers (< 10 throws Error)
[PASS] Case 10: Non-existent / Incomplete Question ID Map throws Error
[PASS] Case 11: Non-existent Option ID throws Error
[PASS] Case 12: Invalid Archetype/Category throws Error
[PASS] Case 13: Malformed JSON / String input throws Error
[PASS] Case 14: Tampered Storage Data Sanitized
[PASS] Case 15: Negative Scores Sanitized & Sum to 100%
[PASS] Case 16: Incorrect Data Types Handled Gracefully
[PASS] Case 17: Changing Answer Overwrites Without Duplicate Count
[PASS] Case 18: Answers Exceeding Limit (> 10) throws Error

TOTAL EXTENDED CASES: 18 | PASSED: 18 | FAILED: 0
```

---

## 2. Total Test Execution Summary

| Test Suite | Total Tests | Passed | Failed | Pass Rate |
|---|---|---|---|---|
| `scoring.test.js` | 22 | 22 | 0 | 100% |
| `quiz-engine.test.js` | 26 | 26 | 0 | 100% |
| `qa-audit.test.js` | 18 | 18 | 0 | 100% |
| Extended Phase 6 Suite | 18 | 18 | 0 | 100% |
| **Combined Regression Total** | **84** | **84** | **0** | **100%** |

---

## 3. Regression Risk Assessment per Module

When the proposed fixes for logged bugs are applied in a future approved fix phase, the following modules present regression risks that must be re-verified:

| Module | Files Impacted | Regression Risk | High-Risk Scenarios to Re-Test |
|---|---|---|---|
| **Quiz Page UI & Counter** | `src/css/quiz.css` (BUG-001) | Low | Changing `.quiz-counter-badge` font must not affect vertical centering, pill badge padding, or responsive alignment on mobile viewports. |
| **Global Font Loading** | `index.html`, `quiz.html`, `result.html`, `src/css/base.css` (BUG-002) | Medium | Moving `@import` to `<link rel="stylesheet">` in HTML head must be validated across all 3 HTML files to ensure font variables resolve immediately in both dev mode and production build. |
| **Design Tokens / Color Contrast** | `src/css/base.css`, `layout.css`, `components.css` (BUG-003) | Medium | Adjusting secondary text color must not clash with subtle pebble cards (`#F4F6F2`) or footer dark card (`#2D3729`). |
| **Language & Modal Helpers** | `result.html`, `src/js/utils/dom.js`, `translations.js` (BUG-004) | Low | Adding `data-i18n` to copy modal button must preserve copy feedback animation and clipboard execution. |
| **Option Card Keyboard Focus** | `src/js/ui/quiz-ui.js` (BUG-005) | Medium | Introducing roving tabindex must not break arrow-key navigation or selection synchronization via keyboard. |

---

## 4. Tests Blocked or Requiring Dedicated Environments

| Test Scenario | Status | Root Cause & Resolution |
|---|---|---|
| Chrome DevTools ActivePort Inspection via Browser Subagent | Blocked during automated run | Google Chrome local instance was not running with `--remote-debugging-port=9222`. |
| Workaround Applied | Validated | Verified visual layout, live HTTP endpoints, asset integrity, and font unicode mappings using direct programmatic fetching and AST inspection. |

---

## 5. Post-Fix Verification Plan

Once the user approves the Bug Fix phase:
1. Re-run `npm run test` (all 3 test suites).
2. Re-run `test-phase-6.js` (18 boundary tests).
3. Re-run `npm run build` to verify production bundle generation.
4. Verify typography rendering of `"Câu hỏi 01 trên 10"` in browser.
5. Re-measure color contrast of updated secondary text tokens.
6. Commit and push approved fixes to trigger GitHub Actions deployment.

