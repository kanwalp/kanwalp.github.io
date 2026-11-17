# Deployment report

## Preflight - 2026-11-17

- GitHub CLI authenticated as `kanwalp`; repository and workflow scopes present.
- Both repository lookup and authenticated REST lookup returned repository not
  found (HTTP 404) for `kanwalp/kanwalp.github.io` before any creation.
- No existing repository or history was overwritten.
- Private PDF and handoff are ignored; email publication explicitly approved.

## Implementation

Eight approved chapters retained, static HTML/CSS/JavaScript, light-first theme,
traveling progress marker, mobile navigation, static work descriptions with
progressive selection, conceptual architecture, exact career chronology,
technical SEO/crawler assets and public-safe resume request links.

## Local validation

- `npm run test:html`: PASS (html-validate recommended rules).
- `npm test`: PASS, 13 Chromium acceptance tests (final run: 51.7 seconds).
- `npm audit`: PASS, zero vulnerabilities, including development tooling.
- 1440, 1024, 768, 375 and 320 px: both themes, all eight chapters, no horizontal
  overflow. Theme persistence and absence of browser JS errors verified.
- Axe WCAG A/AA checks passed across the viewport/theme matrix. Decorative,
  low-opacity chapter numerals are explicitly excluded from contrast scanning:
  they are aria-hidden decoration, not readable information.
- Case selectors, all four layer buttons, keyboard activation, focus, fragment
  navigation, marker interpolation, single-step wheel gestures, tall content,
  nested scroll regions, mobile touch/Next/Top, reduced motion and skip link passed.
- All six work articles remain readable with JS disabled; blocked localStorage
  is explicitly reported and does not break interactions.
- Raw HTML metadata, JSON-LD parsing/identity types, all anchors, local assets,
  1200 x 630 PNG, crawler files and absence of public PDF links passed.
- Settled desktop/work and 320 px light/dark screenshots visually checked against
  the supplied reference direction. A transient mid-transition capture was
  discarded; final states were checked after transitions settled.

### Performance evidence and limits

Final local mobile Lighthouse lab run (Chrome for Testing 159, simulated mobile):

| Category / metric | Result |
| --- | --- |
| Performance | 70/100 |
| Accessibility | 100/100 |
| Best practices | 100/100 |
| SEO | 100/100 |
| Largest Contentful Paint | 1.0 seconds |
| Cumulative Layout Shift | 0 |
| Total Blocking Time | 3,080 ms |

Performance is **not an all-pass**: blocking time remains above a desirable
mobile lab budget. Earlier runs measured 5-6 seconds of simulated blocking.
Trace inspection found expensive initial layout and an unattributed native
renderer task; it did not identify a long-running application script.
Geometry reads/writes were batched, external font requests removed, and marker
motion uses transforms. Font/effect isolation and disabling full-page audit
capture did not eliminate the blocking. Do not equate this investigation with a
proven browser/tooling defect or claim the remaining blocking has been fixed.
Further mobile performance profiling remains a follow-up.

These are local lab results, not 75th-percentile real-user Core Web Vitals.
INP and field LCP/CLS are NOT verified. No analytics were installed.
Raw local reports are ignored under `test-results/`; the measured summary is
persisted here so test runs may safely regenerate that folder.

### Not run / owner follow-up

- Real-device Safari/Firefox testing and a human screen-reader session.
- Google's official rich-result/schema testing UI (local JSON syntax and
  Person/WebSite identity shape were tested; rich results are not promised).
- Search Console ownership verification, sitemap submission and indexing checks.
- Approval of a separate public-safe resume PDF if a download is wanted.

## Release status

Local implementation and automated validation complete. Repository creation,
push and live GitHub Pages verification are the next release steps.
