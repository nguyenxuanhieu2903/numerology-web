/**
 * NUMEROLOGY — Responsive Regression & CSS Architecture Test Suite
 * Validates Mobile-First Scoped Rules, Jade Pebble Morning Palette,
 * and Regression Prevention for Critical Bugs 01 & 02.
 */

import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed += 1;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed += 1;
  }
}

console.log('\n--- [RESPONSIVE REGRESSION: Critical Bug 01 — Archetype Cards Layout] ---');

const landingCss = fs.readFileSync('src/css/landing.css', 'utf-8');

// 1. Archetype cards must default to 1fr on mobile
const archGridDefaultMatches = landingCss.match(/\.archetypes-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
assert(Boolean(archGridDefaultMatches), 'CRITICAL BUG 01: .archetypes-grid defaults to 1fr for mobile viewports');

// 2. Archetype cards 4-column must be scoped to desktop (min-width >= 1024px)
const archGridDesktopMatches = landingCss.match(/@media\s*\(\s*min-width:\s*1024px\s*\)[\s\S]*?\.archetypes-grid\s*\{[^}]*repeat\(4,\s*1fr\)/);
assert(Boolean(archGridDesktopMatches), 'CRITICAL BUG 01: .archetypes-grid 4-column layout is strictly scoped inside @media (min-width: 1024px)');

// 3. Archetype cards 2-column must be scoped to tablet (min-width >= 768px)
const archGridTabletMatches = landingCss.match(/@media\s*\(\s*min-width:\s*768px\s*\)[\s\S]*?\.archetypes-grid\s*\{[^}]*repeat\(2,\s*1fr\)/);
assert(Boolean(archGridTabletMatches), '.archetypes-grid 2-column layout is strictly scoped inside @media (min-width: 768px)');

console.log('\n--- [RESPONSIVE REGRESSION: Critical Bug 02 — Process Steps Cards Layout] ---');

// 4. Process steps must default to 1fr on mobile
const stepsGridDefaultMatches = landingCss.match(/\.steps-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
assert(Boolean(stepsGridDefaultMatches), 'CRITICAL BUG 02: .steps-grid defaults to 1fr for mobile viewports');

// 5. Process steps 3-column must be scoped to desktop (min-width >= 1024px)
const stepsGridDesktopMatches = landingCss.match(/@media\s*\(\s*min-width:\s*1024px\s*\)[\s\S]*?\.steps-grid\s*\{[^}]*repeat\(3,\s*1fr\)/);
assert(Boolean(stepsGridDesktopMatches), 'CRITICAL BUG 02: .steps-grid 3-column layout is strictly scoped inside @media (min-width: 1024px)');

console.log('\n--- [RESPONSIVE REGRESSION: Global Responsive Components] ---');

// 6. Hero grid defaults to 1fr on mobile and 1.15fr 0.85fr on desktop
const heroGridDefaultMatches = landingCss.match(/\.hero-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
const heroGridDesktopMatches = landingCss.match(/@media\s*\(\s*min-width:\s*1024px\s*\)[\s\S]*?\.hero-grid\s*\{[^}]*1\.15fr\s*0\.85fr/);
assert(Boolean(heroGridDefaultMatches && heroGridDesktopMatches), '.hero-grid is mobile-first (1fr mobile, 1.15fr 0.85fr on min-width: 1024px)');

// 7. Quiz controls on mobile
const quizCss = fs.readFileSync('src/css/quiz.css', 'utf-8');
const quizControlsMobile = quizCss.match(/\.quiz-controls\s*\{[^}]*flex-direction:\s*column-reverse/);
const quizControlsDesktop = quizCss.match(/@media\s*\(\s*min-width:\s*768px\s*\)[\s\S]*?\.quiz-controls\s*\{[^}]*flex-direction:\s*row/);
assert(Boolean(quizControlsMobile && quizControlsDesktop), '.quiz-controls is mobile-first (column-reverse mobile, row on min-width: 768px)');

// 8. Result hero card on mobile
const resultCss = fs.readFileSync('src/css/result.css', 'utf-8');
const resultHeroDefault = resultCss.match(/\.result-hero-card\s*\{[^}]*grid-template-columns:\s*1fr/);
const resultHeroDesktop = resultCss.match(/@media\s*\(\s*min-width:\s*1024px\s*\)[\s\S]*?\.result-hero-card\s*\{[^}]*280px\s*1fr/);
assert(Boolean(resultHeroDefault && resultHeroDesktop), '.result-hero-card is mobile-first (1fr mobile, 280px 1fr on min-width: 1024px)');

// 9. Result narrative grid on mobile
const resultNarrativeDefault = resultCss.match(/\.result-narrative-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
const resultNarrativeDesktop = resultCss.match(/@media\s*\(\s*min-width:\s*1024px\s*\)[\s\S]*?\.result-narrative-grid\s*\{[^}]*repeat\(3,\s*1fr\)/);
assert(Boolean(resultNarrativeDefault && resultNarrativeDesktop), '.result-narrative-grid is mobile-first (1fr mobile, repeat(3, 1fr) on min-width: 1024px)');

console.log('\n--- [DESIGN SYSTEM: Jade Pebble Morning Palette Integrity] ---');

const baseCss = fs.readFileSync('src/css/base.css', 'utf-8');
assert(baseCss.includes('#7B9669'), 'Palette contains Muted Jade / Sage (#7B9669)');
assert(baseCss.includes('#E6E6E6'), 'Palette contains Soft Pebble (#E6E6E6)');
assert(baseCss.includes('#6C8480'), 'Palette contains Slate Jade (#6C8480)');
assert(baseCss.includes('#BAC8B1'), 'Palette contains Mist Jade (#BAC8B1)');
assert(baseCss.includes('#404E3B'), 'Palette contains Deep Forest (#404E3B)');

console.log('\n--- [HTML SEMANTIC & ACCESSIBILITY AUDIT] ---');

for (const page of ['index.html', 'quiz.html', 'result.html']) {
  const html = fs.readFileSync(page, 'utf-8');
  assert(html.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0"'), `${page} has standard responsive viewport meta tag`);
  assert(html.includes('<html lang="vi">'), `${page} specifies lang="vi" root attribute`);
  assert(html.includes('<header class="site-header">'), `${page} has semantic <header> landmark`);
  assert(html.includes('<link rel="icon"'), `${page} defines favicon link`);
}

console.log('\n=============================================');
console.log(`TOTAL RESPONSIVE & AUDIT TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('=============================================\n');

if (failed > 0) process.exit(1);

