const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const chapters = ['intro', 'flagship', 'work', 'experience', 'architecture', 'expertise', 'principles', 'contact'];
const BASE = (process.env.BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const cases = ['azure', 'cicd', 'reliability', 'tools', 'gov', 'pharma'];

test('raw HTML, structured data, local assets and crawler files', async ({ request, page }) => {
  const response = await request.get('/');
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).not.toMatch(/name="keywords"|noindex|\.pdf["']|SupportStrings|CatalumeX|TechVodka|Kryspar/i);
  for (const text of ['Ingrain', 'Delasoft', 'Light Pharma', 'Entity Framework Code-First', 'Pharma Investigator']) {
    expect(html).toContain(text);
  }
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main > section')).toHaveCount(8);
  expect(await page.locator('main > section').evaluateAll(nodes => nodes.map(n => n.id))).toEqual(chapters);
  const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(graph['@graph'].map(item => item['@type'])).toEqual(['Person', 'ProfilePage', 'WebSite']);
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(description.length).toBeLessThanOrEqual(160);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://kanwalp.github.io/');
  const links = await page.locator('[href], [src]').evaluateAll(nodes => nodes.map(n => n.getAttribute('href') || n.getAttribute('src')));
  for (const link of links) {
    if (link.startsWith('#')) await expect(page.locator(link)).toHaveCount(1);
    else if (!/^(https?:|mailto:)/.test(link)) expect((await request.get(link)).status()).toBe(200);
  }
  for (const asset of ['/robots.txt', '/sitemap.xml', '/favicon.svg', '/og-cover.png']) {
    expect((await request.get(asset)).status()).toBe(200);
  }
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap: https://kanwalp.github.io/sitemap.xml');
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect((sitemap.match(/<loc>/g) || []).length).toBe(1);
  expect(sitemap).toContain('<loc>https://kanwalp.github.io/</loc>');
  const image = await (await request.get('/og-cover.png')).body();
  expect(image.readUInt32BE(16)).toBe(1200);
  expect(image.readUInt32BE(20)).toBe(630);
});

for (const width of [1440, 1024, 768, 375, 320]) {
  test(`responsive, both themes, all chapters and axe at ${width}px`, async ({ page }) => {
    test.setTimeout(90000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    for (const theme of ['light', 'dark']) {
      if (theme === 'dark') await page.locator('#themeToggle').click();
      for (const id of chapters) {
        await page.evaluate(id => {
          document.documentElement.style.scrollBehavior = 'auto';
          document.getElementById(id).scrollIntoView({ behavior: 'instant' });
        }, id);
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        const overflow = await page.locator(`#${id} h1, #${id} h2, #${id} h3, #${id} button, #${id} .btn`).evaluateAll(nodes =>
          nodes.filter(node => {
            const r = node.getBoundingClientRect();
            return r.width && (r.left < -1 || r.right > innerWidth + 1);
          }).map(n => n.textContent));
        expect(overflow).toEqual([]);
      }
      // These low-opacity, aria-hidden numerals are decoration, not readable content.
      const accessibility = await new AxeBuilder({ page }).exclude('.chapter-mark').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(accessibility.violations).toEqual([]);
    }
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(errors).toEqual([]);
  });
}

test('case selectors retain crawlable content and work by keyboard', async ({ page }) => {
  await page.goto('/#work');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const id of cases) {
    const button = page.locator(`[data-case="${id}"]`);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`#case-${id}`)).toBeVisible();
    await expect(page.locator('.case-panels > article:visible')).toHaveCount(1);
    await expect(page.locator('#caseStatus')).toContainText('Selected:');
  }
  for (const layer of ['ui', 'api', 'data', 'ops']) {
    const button = page.locator(`[data-layer="${layer}"]`);
    await button.focus();
    await page.keyboard.press('Space');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#layerTitle')).not.toBeEmpty();
  }
  await expect(page.locator('#layerTitle')).toHaveText('Reliability continues after release.');
});

test('anchors, focus, history, continuous desktop marker and chapter wheel gestures', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('.rail-button[data-go="flagship"]').click();
  await expect(page).toHaveURL(/#flagship$/);
  await expect(page.locator('#flagship')).toBeFocused();
  await expect.poll(() => page.evaluate(() => Math.abs(scrollY - document.getElementById('flagship').offsetTop) < 2)).toBe(true);
  await expect(page.locator('.rail-button[data-go="flagship"]')).toHaveAttribute('aria-current', 'step');
  await page.evaluate(() => {
    const start = document.getElementById('intro').offsetTop;
    const end = document.getElementById('flagship').offsetTop;
    scrollTo({ top: (start + end) / 2, behavior: 'instant' });
  });
  await expect.poll(() => page.locator('#railTraveler').evaluate(el => {
    const buttons = [...document.querySelectorAll('.rail-button')];
    const center = el.getBoundingClientRect().top + el.offsetHeight / 2;
    const first = buttons[0].getBoundingClientRect();
    const next = buttons[1].getBoundingClientRect();
    return Math.abs(center - (first.top + first.height / 2 + next.top + next.height / 2) / 2) < 2;
  })).toBe(true);
  await page.goto('/');
  await page.mouse.move(800, 450);
  await page.mouse.wheel(0, 80);
  await page.mouse.wheel(0, 80);
  await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(900);
  await page.waitForTimeout(1000);
  expect(await page.evaluate(() => Math.round(scrollY))).toBe(900);
  await page.goBack();
  await expect(page.locator('h1')).toBeVisible();
});

test('tall chapters and nested scroll areas are not wheel-trapped', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/#flagship');
  const geometry = await page.locator('#flagship').evaluate(el => ({ top: el.offsetTop, height: el.offsetHeight }));
  expect(geometry.height).toBeGreaterThan(768);
  await page.mouse.move(500, 400);
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 120);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 30);
  expect(await page.evaluate(() => scrollY)).toBeLessThan(geometry.top + geometry.height - 100);
  await page.evaluate(() => {
    const box = document.createElement('div');
    box.id = 'scroll-test';
    box.style.cssText = 'position:fixed;inset:100px auto auto 100px;width:200px;height:200px;overflow:auto;z-index:200;background:white';
    const content = document.createElement('div');
    content.style.height = '1000px';
    box.append(content);
    document.body.append(box);
  });
  await page.waitForTimeout(300);
  const documentBefore = await page.evaluate(() => scrollY);
  await page.mouse.move(150, 150);
  await page.mouse.wheel(0, 100);
  await expect.poll(() => page.locator('#scroll-test').evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => scrollY)).toBe(documentBefore);
});

test('mobile touch, next, final chapter and deep links', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(BASE + '/');
  await page.locator('#mobileNext').tap();
  await expect(page).toHaveURL(/#flagship$/);
  await expect(page.locator('#mobileStep')).toHaveText('02 / 08');
  await page.locator('.mobile-dot[data-go="contact"]').tap();
  await expect(page.locator('#mobileStep')).toHaveText('08 / 08');
  await expect(page.locator('#mobileNext')).toHaveAccessibleName('Back to introduction');
  await page.locator('#mobileNext').tap();
  await expect(page.locator('#mobileStep')).toHaveText('01 / 08');
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.goto(BASE + '/#expertise');
  await expect(page.locator('.mobile-dot[data-go="expertise"]')).toHaveAttribute('aria-current', 'step');
  await context.close();
});

test('reduced motion, skip link and browser keyboard scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#intro')).toBeFocused();
  await page.mouse.wheel(0, 80);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  expect(await page.evaluate(() => scrollY)).toBeLessThan(300);
  await page.keyboard.press('PageDown');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(300);
  await page.locator('.rail-button[data-go="contact"]').click();
  await expect(page.locator('.rail-button[data-go="contact"]')).toHaveAttribute('aria-current', 'step');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

test('all case studies are readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(BASE + '/');
  for (const id of cases) await expect(page.locator(`#case-${id}`)).toBeVisible();
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('a[href^="mailto:"]').first()).toHaveAttribute('href', /mailto:/);
  await context.close();
});

test('blocked storage reports unavailable persistence without breaking interactions', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
    Storage.prototype.setItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
  });
  await page.goto('/');
  await expect(page.locator('#storageNotice')).toBeVisible();
  await page.locator('#themeToggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('[data-case="pharma"]').click();
  await expect(page.locator('#case-pharma')).toBeVisible();
});

test('resume fidelity: titles, dates, client attribution and exact certification', async ({ request, page }) => {
  const html = (await (await request.get('/')).text()).replace(/&amp;/g, '&');
  for (const fact of [
    'MARCH 2021 — PRESENT', 'INGRAIN SYSTEMS PVT. LTD. · GAP INC. (CLIENT)', 'Software Development Engineer (.NET Developer)',
    'JULY 2019 — FEBRUARY 2021', 'Development Team Lead: Jul 2020 – Feb 2021.', 'Senior .NET Developer: Jul 2019 – Jun 2020.',
    'MAY 2016 — JULY 2019', 'LIGHT PHARMA PVT. LTD.', 'Microsoft Certified Professional — Programming in C#',
    'Google AI Specialization — Google via Coursera, June 2026',
    'https://www.coursera.org/account/accomplishments/professional-cert/WXJD7VOTM1YK',
    'Entrance Permitting System (EPS)', 'Outdoor Advertising Control System (OACS)', 'Pharma Investigator (PI)'
  ]) expect(html).toContain(fact);
  // The resume headline is ".NET Full Stack Engineer"; no unverified seniority, employment at the client, or metrics.
  expect(html).not.toMatch(/Senior \.NET Full Stack|Gap Inc\. employee|worked at Gap/i);
  expect(html).not.toMatch(/\+91|8977306749/);
  await page.goto('/');
  // No invented performance figures in visible copy.
  expect(await page.locator('main').innerText()).not.toMatch(/\d+\s?%|\$\s?\d|\d+x faster/i);
});

test('only public site files are deployed; crawler rules allow the whole site', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toMatch(/^Allow: \/$/m);
  expect(robots).not.toMatch(/^Disallow:/m);
  // The local test server serves the whole checkout, so publication is only checked against a deployment.
  test.skip(!process.env.BASE_URL, 'set BASE_URL to check a deployed site');
  for (const path of ['/package.json', '/tests/portfolio.spec.js', '/README.md', '/CLAUDE_VALIDATION_REPORT.md', '/.github/workflows/pages.yml']) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

for (const width of [1536, 1920, 2560]) {
  test(`wide ${width}px layout keeps content clear of the chapter rail`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const result = await page.evaluate(() => {
      const rail = document.querySelector('.journey-rail').getBoundingClientRect();
      const boxes = [...document.querySelectorAll('main .container')].map(el => el.getBoundingClientRect());
      return { railLeft: rail.left, maxRight: Math.max(...boxes.map(b => b.right)), maxWidth: Math.max(...boxes.map(b => b.width)) };
    });
    expect(result.maxWidth).toBeLessThanOrEqual(1140);
    expect(result.maxRight).toBeLessThan(result.railLeft);
  });
}

test('deep links land immediately instead of animating from the top', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#contact');
  const top = await page.locator('#contact').evaluate(el => el.offsetTop);
  await page.waitForTimeout(150);
  expect(Math.abs(await page.evaluate(() => scrollY) - top)).toBeLessThan(3);
});

test('saved dark theme is applied from <head> before body content renders', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('kanwal-journey-theme-v1', 'dark'));
  // Remove the end-of-body script so only the head bootstrap can apply the theme.
  await page.route('**/', async route => {
    const response = await route.fetch();
    const body = (await response.text()).replace(/<script>\s*\(\(\) => \{[\s\S]*?<\/script>/, '');
    await route.fulfill({ response, body });
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('on stacked mobile layout selecting a case brings its details into view', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 700 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(BASE + '/#work');
  await page.locator('[data-case="pharma"]').tap();
  await expect(page.locator('#case-pharma')).toBeInViewport();
  await context.close();
});
