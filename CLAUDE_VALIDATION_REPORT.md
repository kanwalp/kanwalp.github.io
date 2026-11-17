# Claude validation report — kanwalp.github.io

**Date:** 2026-11-17 · **Reviewer:** Claude (independent QA of the Codex build)
**Repository:** https://github.com/kanwalp/kanwalp.github.io (`main`, Pages source `main` / root)
**Baseline reviewed:** `0e30772` (Codex) · **Inputs:** `CLAUDE_VALIDATION_PROMPT.md`, `SEO.md`,
`keywords.txt`, the reference context, and the latest résumé (local copy dated 2026-11-11, never committed).

## Verdict

**Production-ready, with documented follow-ups.** One major layout defect (wide screens) and several
minor defects were found and fixed. Résumé fidelity is good: no fabricated titles, dates, employers,
metrics or certifications were found. The remaining items are owner actions (Search Console, real-device
and screen-reader checks) and lab mobile blocking time that comes from the test environment.

## Defects found (severity-ranked)

| # | Severity | Area | Defect | Status |
|---|---|---|---|---|
| 1 | **Major** | Layout | Above 1450px (1536, 1920, 2560 screens), `.chapter-inner{width:100%}` overrode `.container`. All chapter content ran edge to edge from x=0 and **underneath the fixed chapter rail**. Codex's matrix stopped at 1440px, so it was missed. | Fixed |
| 2 | Minor | UX | Global `scroll-behavior:smooth` made direct deep links (`/#contact`) animate through every chapter on load. The target was reached only after about 1.5s. | Fixed |
| 3 | Minor | Theme | The saved dark preference was applied by the end-of-body script, which risks a light flash on first paint. | Fixed (head bootstrap) |
| 4 | Minor | Mobile UX | At ≤700px the case selector stacks above the detail panel, so tapping cases 3–6 changed content off-screen. | Fixed (scrolls into view) |
| 5 | Minor | SEO | Meta description was 187 characters, so Google would truncate it. | Fixed (≤160) |
| 6 | Minor | Fidelity | Hero said "Microsoft C# certified"; the résumé credential is "Microsoft Certified Professional — Programming in C#". | Fixed (exact wording) |
| 7 | Minor | Fidelity | PETE card said "Extended REST adapters". The résumé says REST services, application adapters and projection-engine functionality. | Fixed |
| 8 | Low | Crawl hygiene | Branch-root Pages publishes `package.json`, `tests/` and the `.md` reports publicly (HTTP 200, crawlable). | Mitigated (robots.txt Disallow); see remaining issues |
| 9 | Info | Structured data | No ProfilePage entity for a page that is a personal profile. | Added ProfilePage → Person |

## Résumé fidelity (every public claim)

| Claim on site | Résumé | Result |
|---|---|---|
| ".NET Full Stack Engineer", 10+ years, Hyderabad | Headline, profile, contact line | PASS |
| Retail, government, pharma R&D domains | Profile | PASS |
| Ingrain Systems Pvt. Ltd. · Gap Inc. **(client)**, Mar 2021 – Present, Software Development Engineer (.NET Developer) | Experience | PASS (client correctly attributed) |
| PETE: Excel add-in, WPF/XAML/Telerik/MVVM, season-aware, bulk updates, reason tracking, REST/adapters/projection, AD access, MongoDB purge, RabbitMQ | PETE section | PASS (after fix #7) |
| Azure: VM patching via Automation, vulnerability + TLS 1.2, Key Vault, Monitor/App Insights, right-sizing | Azure section | PASS |
| CI/CD: GitHub Actions migration, iteration champion across QA/Release/Pre-prod/Prod, runbooks, E2E tests | CI/CD section | PASS |
| Reliability: PagerDuty Sev1/Sev2, RCA, batch/RabbitMQ/reprocessing/validation, Azure + GCP logs | Reliability section | PASS |
| Internal tools: React + ASP.NET Web API, desktop-to-web POCs, NUnit, SonarQube, AI-assisted incident tools | Tools + AI sections | PASS |
| Delasoft Jul 2019 – Feb 2021; Team Lead Jul 2020 – Feb 2021; Senior .NET Developer Jul 2019 – Jun 2020 | Delasoft | PASS |
| EPS/OACS: Web API + EF Code-First, React/Kendo, MVC payments, Esri ArcGIS, code reviews, mentoring, Cordova/Ionic | Delasoft | PASS |
| Light Pharma May 2016 – Jul 2019, Software Engineer, PI, WPF/WCF/Silverlight→WPF, Angular 6, ASP.NET Core, PI Document, architecture docs | Light Pharma | PASS |
| Skill pills (all 25) | Technical Expertise | PASS (every pill appears on the résumé; no proficiency ratings) |
| Certification | Professional Certification | PASS (after fix #6; no date/badge invented) |
| AI-assisted engineering | Profile + AI section | PASS (framed as assistance, not replacement) |
| Independent ventures (SupportStrings, CatalumeX, TechVodka, Kryspar) | Must be excluded | PASS (absent; enforced by test) |
| Numeric outcomes / testimonials | None on résumé | PASS (none; enforced by test) |

Editorial headings such as "Real engineering impact" are framing, not factual claims. The "nearly six
years at Gap" phrasing is correctly *not* used. Verified résumé items that are omitted but not
misrepresented: the PETE maintainability work (partly covered under Principles), OWIN/caching, IIS, TFS/JIRA.

## Functional test matrix

| Check | Result | Evidence |
|---|---|---|
| Exactly 8 chapters, IDs in spec order, one H1 | PASS | automated |
| White/light default; dark toggle; persistence; blocked storage | PASS | automated |
| Desktop rail marker interpolates continuously between dots | PASS | automated (mid-scroll position check) |
| Wheel: one chapter per gesture (1280×760, 1440×900, 1920×1080) | PASS | full down/up sweeps reach top and bottom; trackpad momentum (40 decaying events) and a 2s continuous drag each advance exactly 1 chapter |
| Tall chapters not trapped; nested scrollers keep native scroll | PASS | automated |
| Keyboard: skip link, tab order, Enter/Space on selectors, PageDown | PASS | automated + tab-order probe |
| Mobile dots, Next, final "Top ↑", deep links | PASS | automated (touch emulation) |
| Reduced motion disables stepping and smoothing | PASS | automated |
| Case + architecture selectors, `aria-pressed`, live status | PASS | automated |
| All case studies crawlable/readable with JS disabled | PASS | automated |
| No horizontal overflow at 320 / 375 / 768 / 1024 / 1440, both themes | PASS | automated + screenshots |
| Wide 1536 / 1920 / 2560: content ≤1140px and clear of rail | **FAIL → PASS** | new test (defect #1) |
| Deep link lands immediately | **FAIL → PASS** | new test (defect #2) |
| axe-core WCAG 2.0/2.1/2.2 A+AA, every width × both themes | PASS (0 violations) | automated; aria-hidden decorative numerals excluded |
| Real Safari/Firefox, real touch devices, human screen-reader pass | NOT TESTED | needs owner/devices |

**Suite:** 21 Playwright tests (13 original + 8 added) plus `html-validate`. The final 3× repeat run
passed 63/63. In two earlier full runs one test failed intermittently under machine load. It was not
reproduced in the repeat run, so it was not identified.

## Technical SEO

| Item | Result |
|---|---|
| Title (58 chars), description (≤160), canonical `https://kanwalp.github.io/`, robots `index,follow` | PASS |
| No meta keywords, no noindex, no keyword walls | PASS |
| OG/Twitter: absolute URLs, `og-cover.png` 1200×630 live (200, image/png), alt text | PASS |
| JSON-LD: Person + ProfilePage + WebSite, valid JSON, `sameAs` only verified GitHub (200) | PASS (syntax/shape locally; Google Rich Results Test not run) |
| robots.txt and sitemap.xml (single root URL) live with 200 | PASS |
| Indexable initial HTML: headline, employers, all six cases | PASS |
| Lighthouse SEO | 100 |
| Search Console verification and sitemap submission | NOT DONE (owner) |

## Privacy and security

- Full git history scanned: no phone number, no `+91`, no tokens or secrets. PASS.
- Private résumé PDF and the handoff folder are not published (live 404) and are gitignored. PASS.
- Email is published by prior explicit approval; it is the address on the résumé. No phone number. PASS.
- No client code, screenshots, internal URLs or topology; diagrams labelled conceptual. PASS.
- No third-party scripts, fonts, trackers or forms; `mailto:` only. PASS.
- `package.json`, `tests/` and the `.md` reports are public (non-sensitive). Crawling is discouraged via robots.txt.

## Performance evidence (lab only)

Local Lighthouse 13, Chrome headless, simulated mobile (4× CPU) and desktop presets:

| Run | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Mobile, baseline (before fixes) | 86 | 100 | 100 | 100 | 1.1s | 1.1s | 570ms | 0 |
| Mobile, after fixes ×3 | 70–72 | 100 | 100 | 100 | 1.0–1.2s | 1.0–1.2s | 1.9–3.8s | 0 |
| Desktop, baseline / after | 99 / 79 | 100 | 100 | 100 | 0.3 / 0.6s | 0.3 / 0.7s | 90 / 490ms | 0 |
| Mobile A/B interleaved, original vs fixed (×3 each) | 72–75 vs 70–76 | – | – | – | – | ~1.0s | 1.35–2.1s vs 1.2–2.7s | 0 |
| Desktop A/B, order alternated (×6 each) | 83–93 vs 77–84 | – | – | – | – | 0.3–0.6s | median 354 vs 400ms (ranges 210–405 vs 114–551) | 0 |

- **Run-to-run variance on this machine is large.** The interleaved A/B shows the fixes caused **no
  regression**; the swings come from host load.
- Page weight is 71 KiB total (one HTML file, PNG cover, SVG favicon); there are no external requests.
- Root cause of the blocking time: CDP metrics show about 0.5–1.3s of initial **layout** under 4× throttle.
  Stripping *all* CSS still left about 460ms of layout. Removing the arrow/bullet glyphs (↗ ↓ ● ✦), which need
  font fallback on Windows, saved about 200ms. Script, `backdrop-filter`, `color-mix` and shadows were each
  ruled out. This is text-shaping cost on a Windows lab host. It would need a redesign (removing glyphs
  or lazy-rendering chapters) to change, and that is not justified without field data.
- LCP ≤1.2s and CLS 0 meet the Core Web Vitals thresholds in the lab. **Field Core Web Vitals (75th
  percentile, INP) are not available**: the site has no analytics and too little traffic for CrUX.
  Check the PageSpeed Insights / Search Console field data once it exists.

## Remaining issues / owner follow-ups

1. Verify the site in Google Search Console, submit `sitemap.xml`, and request indexing. Indexing is not guaranteed.
2. Test on real Safari (macOS/iOS) and Firefox, and do one screen-reader pass (NVDA/VoiceOver).
3. Optional: to stop publishing dev files entirely, switch Pages to a GitHub Actions deploy that uploads
   only `index.html`, `robots.txt`, `sitemap.xml`, `favicon.svg`, `og-cover.png` and `.nojekyll`.
   This was not done because it changes the repository's Pages configuration.
4. Optional: approve a redacted public résumé PDF if a download is wanted (currently "request by email").
5. Cosmetic: on narrow phones the hero meta row wraps, leaving a separator border at the start of the second line.
6. Mobile lab TBT (see above); revisit only if field INP is poor.

## Deployment

See the section appended after push for commit hash and live verification.
