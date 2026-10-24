import { test, expect, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Authored browser checks are not evidence of a pass until run on the Astro build.
// Open the emitted PNGs independently: automated assertions cannot assess design.
const widths = [390, 768, 1440] as const;
const languages = ['el', 'en'] as const;
const routes = {
  el: { home: '/', robot: '/robot/', category: '/categories/arduino/', lame: '/posts/Lame/', gpi: '/posts/gpi-case-2w-pi-zero-w-recalbox/' },
  en: { home: '/en/', robot: '/en/robot/', category: '/en/categories/arduino/', lame: '/en/posts/lame/', gpi: '/en/posts/gpi-case-2w-pi-zero-w-recalbox/' },
};
type Kind = keyof typeof routes.el;
const hiddenRoutes = /\/(?:gym-app|position_size|trades|norobots)(?:\/|$)/;

async function overflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'document must fit; tables/code may scroll internally').toBeLessThanOrEqual(1);
}
async function capture(page: Page, info: TestInfo, name: string, fullPage = true) {
  const path = info.outputPath(`${name}.png`);
  await page.screenshot({ path, fullPage, animations: 'disabled' });
  await info.attach(name, { path, contentType: 'image/png' });
}
async function accessibility(page: Page, info: TestInfo, name: string) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  await info.attach(`${name}-axe`, { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
  expect(results.violations, `${name}: automated accessibility findings`).toEqual([]);
}
async function anchorClick(page: Page, width: number, info: TestInfo) {
  const links = page.locator(width >= 1024 ? '.toc a' : '.mobile-toc a');
  if (!await links.count()) return;
  // Real click and settled geometry, including the fixed header; not href-only QA.
  const indexes = [...new Set([0, Math.floor((await links.count()) / 2), (await links.count()) - 1])];
  for (const index of indexes) {
    if (width < 1024) await page.locator('.mobile-toc summary').click();
    const link = links.nth(index), href = await link.getAttribute('href');
    await link.click();
    const id = decodeURIComponent(href!.slice(1));
    await expect.poll(() => page.evaluate(target => {
      const h = document.getElementById(target), header = document.querySelector('.topbar');
      if (!h || !header) return false;
      const top = h.getBoundingClientRect().top;
      return top >= header.getBoundingClientRect().bottom - 2 && top < innerHeight - 30;
    }, id), { timeout: 5000, message: `actual section position: ${id}` }).toBe(true);
    if (width < 1024) await expect(page.locator('.mobile-toc')).not.toHaveAttribute('open', '');
  }
  await capture(page, info, 'toc-clicked');
}

for (const lang of languages) for (const width of widths) for (const kind of Object.keys(routes[lang]) as Kind[]) {
  test(`${lang} ${kind} ${width}: content, navigation, SEO, themes and accessibility`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 960 });
    const errors: string[] = [], failedAssets: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400 && new URL(response.url()).origin === new URL(page.url()).origin) failedAssets.push(`${response.status()} ${response.url()}`); });
    const response = await page.goto(routes[lang][kind]);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('#main h1')).toHaveCount(1);
    await expect(page.locator('#main h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await overflow(page);

    const canonical = `https://mossygr.github.io${routes[lang][kind]}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    for (const alternate of ['el', 'en', 'x-default'] as const) {
      const targetLang = alternate === 'x-default' ? 'el' : alternate;
      await expect(page.locator(`link[rel="alternate"][hreflang="${alternate}"]`))
        .toHaveAttribute('href', `https://mossygr.github.io${routes[targetLang][kind]}`);
    }
    await expect(page.locator('.language-switch')).toHaveAttribute('href', routes[lang === 'el' ? 'en' : 'el'][kind]);
    const navHrefs = await page.locator('nav a[href]').evaluateAll(nodes => nodes.map(node => (node as HTMLAnchorElement).pathname));
    expect(navHrefs.filter(href => hiddenRoutes.test(href))).toEqual([]);

    if (width < 768) {
      await page.locator('[data-open="navigation-dialog"]').click();
      await expect(page.locator('#navigation-dialog')).toBeVisible();
      await accessibility(page, info, 'mobile-menu');
      await capture(page, info, 'mobile-menu');
      await page.keyboard.press('Escape');
      await expect(page.locator('#navigation-dialog')).not.toBeVisible();
      await expect(page.locator('[data-open="navigation-dialog"]')).toBeFocused();
    } else await expect(page.locator('.sidebar')).toBeVisible();

    if (kind === 'home') {
      await expect(page.locator('.home-intro a')).toHaveAttribute('href', routes[lang].robot);
      await page.locator('.home-intro a').click();
      await expect(page).toHaveURL(new RegExp(`${routes[lang].robot}$`));
      await page.goto(routes[lang].home);
    }
    if (kind === 'robot') {
      await expect(page.locator('#viewer-pict svg')).toBeVisible();
      await expect(page.locator('#viewer-harness svg')).toHaveCount(1);
      await expect(page.locator('#viewer-pict svg text, #viewer-harness svg text')).toHaveCount(359);
      await expect(page.locator('#conn tbody tr')).toHaveCount(36);
      await expect(page.locator('#conn tbody td')).toHaveCount(216);
      await expect(page.locator('.prose .code-copy')).toHaveCount(8);
      const row = page.locator('#conn tbody tr[data-w="11"]');
      await row.focus();
      await page.keyboard.press('Enter');
      await expect(row).toHaveClass(/sel/);
      await expect(page.locator('#viewer-pict')).toBeFocused();
      await expect(page.locator('#info')).toBeVisible();
      await expect(page.locator('#pict [data-w="11"].sel').first()).toHaveCount(1);
      await page.locator('#info .x').click();
      await expect(page.locator('#info')).not.toBeVisible();
      await expect(page.locator('#viewer-pict')).toBeFocused();
      const svg = page.locator('#viewer-pict svg');
      const previousTransform = await svg.getAttribute('style');
      await page.locator('#viewer-pict [data-z="in"]').click();
      await expect.poll(() => svg.getAttribute('style')).not.toBe(previousTransform);
      await page.locator('#viewer-pict').focus();
      await page.keyboard.press('Home');
      const downloads = await page.locator('.prose a[href$=".zip"]').evaluateAll(nodes => nodes.map(n => (n as HTMLAnchorElement).href));
      expect(downloads.length).toBeGreaterThan(0);
      for (const href of new Set(downloads)) expect((await page.request.get(href)).ok()).toBe(true);
    }
    // Scroll actual images into view to trigger lazy loading; decode the real bytes.
    for (const image of await page.locator('#main img').all()) {
      expect((await image.getAttribute('alt'))?.trim(), 'content images require useful alt').toBeTruthy();
      // Responsive list thumbnails are intentionally display:none below 1200px.
      // Decode and scroll the images actually presented in this viewport.
      if (!await image.isVisible()) continue;
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
    if (kind === 'gpi') expect(await page.locator('.article-cover img, .prose img').count()).toBeGreaterThanOrEqual(5);
    const code = page.locator('.prose pre code').first();
    if (await code.count()) {
      const expected = await code.textContent();
      await page.locator('.code-copy').first().click();
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
    }
    await anchorClick(page, width, info);
    if (kind === 'robot' && lang === 'el' && width !== 768) {
      // Viewport images supplement the long full-page image for manual inspection.
      for (const id of ['guide-section-1', 'guide-section-2', 'guide-code', 'code-driving', 'guide-section-3']) {
        const target = page.locator(`[id="${id}"]`);
        await expect(target, `required Robot section ${id}`).toHaveCount(1);
        await target.evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
        await capture(page, info, `section-${id}-light`, false);
      }
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await capture(page, info, 'light');
    await accessibility(page, info, 'light');
    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await capture(page, info, 'dark');
    await accessibility(page, info, 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await overflow(page);
    expect(errors).toEqual([]);
    expect(failedAssets).toEqual([]);
  });
}

for (const lang of languages) for (const width of widths) test(`${lang} search keyboard and language routing ${width}`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 960 });
  await page.goto(routes[lang].home);
  await page.locator('[data-open="search-dialog"]').focus();
  await page.keyboard.press('Control+k');
  await expect(page.locator('#search-dialog')).toBeVisible();
  await expect(page.locator('#search-input')).toBeFocused();
  await page.locator('#search-input').fill('ESP32');
  const results = page.locator('#search-results a');
  await expect(results.first()).toBeVisible();
  const urls = await results.evaluateAll(nodes => nodes.map(n => (n as HTMLAnchorElement).pathname));
  expect(urls).toContain(routes[lang].robot);
  expect(urls.every(path => lang === 'en' ? path.startsWith('/en/') : !path.startsWith('/en/'))).toBe(true);
  expect(urls.some(path => hiddenRoutes.test(path))).toBe(false);
  await accessibility(page, info, 'search');
  await capture(page, info, 'search');
  await page.keyboard.press('ArrowDown');
  await expect(results.first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#search-dialog')).not.toBeVisible();
  await expect(page.locator('[data-open="search-dialog"]')).toBeFocused();
  await page.locator('.language-switch').click();
  await expect(page).toHaveURL(new RegExp(`${routes[lang === 'el' ? 'en' : 'el'].home}$`));
});

test('200% equivalent reflow and system dark preference', async ({ page }, info) => {
  // 1440 physical pixels at 200% browser zoom provide 720 CSS pixels.
  await page.setViewportSize({ width: 720, height: 480 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto(routes.el.robot);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await overflow(page);
  await capture(page, info, 'reflow-200-equivalent');
});
