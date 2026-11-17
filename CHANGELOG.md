# Changelog

## 1.2.0 - 2026-11-18

- Flagship chapter is now a slider covering one platform from each role:
  PETE (Ingrain Systems / Gap Inc.), EPS & OACS (Delasoft) and Pharma
  Investigator (Light Pharma). Tabs, arrows, arrow keys and swipe; all slides
  stay in the initial HTML.
- Work chapter: removed the privacy footnote; the case list and detail panel
  are now equal height, and the selected case joins the panel on desktop.
- Career timeline line now runs exactly from the first dot to the last.
- Certifications shown as cards (Microsoft C#, Google AI Specialization).

## 1.1.0 - 2026-11-17

- GitHub Pages now deploys through GitHub Actions: each push to `main` runs
  HTML validation and the Playwright suite, then publishes only `index.html`,
  `robots.txt`, `sitemap.xml`, `favicon.svg` and `og-cover.png`.
- Removed `.nojekyll` (unneeded without a Jekyll build) and `DEPLOYMENT_REPORT.md`
  (superseded by `CLAUDE_VALIDATION_REPORT.md`; still in git history).
- Removed unused CSS (`.icon-btn`, `.mono`) and two unreferenced element IDs.
- robots.txt reverted to a plain allow-all; dev files are no longer served at all.

## 1.0.1 - 2026-11-17 (independent Claude validation)

- Fixed wide-screen layout: above 1450px chapter content stretched edge to edge
  and ran underneath the fixed chapter rail (`.chapter-inner` overrode `.container`).
- Deep links (e.g. `/#contact`) now land directly instead of animating from the top.
- Saved dark theme is applied from `<head>`, avoiding a light flash on load.
- On stacked mobile layouts, selecting a work case scrolls its details into view.
- Exact certification wording in the hero; PETE service work worded as on the resume.
- Meta description shortened to 160 characters or fewer; added ProfilePage JSON-LD.
- robots.txt asks crawlers to skip published development files (tests, package, docs).
- Added resume-fidelity, wide-viewport, deep-link, theme-bootstrap, robots and
  mobile case-selection regression tests (21 tests total).

## 1.0.0 - 2026-11-17

- Preserved the approved eight-chapter white-first static career journey.
- Reconciled employment, work stories, skills and certification against the
  latest resume, including exact Delasoft role periods and client attribution.
- Retained interactive work/architecture selectors, saved dark mode, traveling
  desktop marker and responsive mobile navigation.
- Fixed tall-chapter scroll trapping, wheel momentum skipping, navigation focus,
  crawlable case content, mobile targets, theme contrast and blocked storage.
- Added canonical/social metadata, Person/WebSite JSON-LD, local favicon and
  actual social cover, robots and sitemap.
- Withheld the private PDF, removed broken downloads, and provided resume requests.
- Added repeatable responsive, keyboard, reduced-motion, accessibility and HTML checks.
