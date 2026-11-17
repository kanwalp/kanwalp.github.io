# Kanwal Pokkula - Career Journey

Professional employment portfolio at https://kanwalp.github.io/.
Based on the approved eight-chapter white-theme reference, using static HTML,
inline CSS and vanilla JavaScript. No build step, runtime dependencies, tracking,
external font requests or backend.

## Run and validate

Open `index.html` directly, or run `python -m http.server 4173 --bind 127.0.0.1`.
For development-only validation:

```powershell
npm ci
npx playwright install chromium
npm run test:html
npm test
```

Tests start their own loopback server; stop a manually started server first.
To test the live deployment instead, set `BASE_URL`
(`$env:BASE_URL='https://kanwalp.github.io'; npm test`).
See `CLAUDE_VALIDATION_REPORT.md` for the independent validation results.
For Lighthouse, start the loopback server and run `npm run test:lighthouse`
with Chrome installed (or set `CHROME_PATH` to the Playwright Chromium executable).
Reports are written under ignored `test-results/`.

## Content and interactions

Chapters: intro, flagship, work, experience, architecture, expertise, principles,
contact. Career facts follow the latest supplied resume; see `CONTENT_AUDIT.md`.
All six work descriptions are in initial HTML and remain readable without JS.
Case selectors progressively show one story. Architecture buttons illustrate
engineering layers, not a client's actual topology.

Desktop wheel stepping applies only with a fine pointer at >=1024 x 740 and
normal motion. Tall sections and nested scroll containers retain native scroll.
Mobile/touch and reduced-motion users use natural scrolling. Keyboard navigation
is never intercepted. Both chapter navigators track document progress;
explicit navigation updates the fragment and moves focus to the chapter.

Light is the default. The optional dark theme is saved locally when available;
blocked browser storage is reported without disabling theme switching.
Manrope and DM Mono are preferred if installed, with system font fallbacks.

## Privacy and a public resume

The original PDF is **not** included, linked or committed. PDF files and the
private handoff folder are ignored. The user approved publishing the email
contact; no phone number is published. There are no independent projects.

To add a resume later, first approve a separate redacted public-safe PDF.
Review its contents and metadata. Add an exact exception such as
`!Kanwal_Pokkula_Public_Resume.pdf` to `.gitignore`, add that approved file,
replace the request links in `index.html` with its real URL and descriptive
download labels, remove the withholding note, and re-run link/privacy tests
after updating their deliberate no-PDF assertion. Never rename/copy the private
original directly into the published root.

## Publishing

GitHub Pages deploys through GitHub Actions (`.github/workflows/pages.yml`).
Every push to `main` runs HTML validation and the Playwright suite; only if they
pass is the site published. The deployed artifact contains **only**
`index.html`, `robots.txt`, `sitemap.xml`, `favicon.svg` and `og-cover.png`.
Tests, tooling and documentation stay in the repository and are not served.
If you add a public asset (for example an approved resume PDF), also add it to
the "Assemble site" step. The handoff and private source documents must remain local.
See `CLAUDE_VALIDATION_REPORT.md` for verified deployment and test evidence.
Search Console ownership verification and sitemap submission require the owner.
Indexing and real-user Core Web Vitals cannot be guaranteed by deployment.
