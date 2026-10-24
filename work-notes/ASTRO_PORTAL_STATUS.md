# Astro documentation portal — 2026-10-24

Local development branch: `feat/astro-docs-portal`. Production remains unchanged at gh-pages `9cbb233`. Publication explicitly authorized by the owner on 2026-10-24. Production rollout is in progress through a source PR and a non-destructive overlay on the existing gh-pages history.

## Current verified state

- Network restored: registry.npmjs.org and github.com both returned HTTP 200.
- Dependencies installed, `package-lock.json` created. A separate clean `npm ci` verification installed 399 packages and audited 400 with zero reported vulnerabilities. CI now uses `npm ci`.
- Real production build **PASS**: Astro 7.4.2, TypeScript check with zero errors/warnings/hints, 109 generated pages, Pagefind indexes exactly 32 documentation documents.
- Source/unit/tool tests **15/15 PASS**. Migration invariants PASS: 32 documents / 16 Greek-English pairs / 32 unique article URLs.
- Actual output audit **PASS**: 114 HTML files, 13,090 local links/anchors, 90 exact rendered code blocks, all 186 previous deployed file URLs retained, all 36 compatibility snapshots byte identical.
- Independent v3 touch emulation **PASS**: horizontal table swipe, diagram pan and two-finger pinch, with zero document overflow.
- Independent final v3 Playwright/axe matrix: **37/37 PASS** (5.6 minutes). See `ASTRO_VISUAL_QA.md` for the previous observed failures, fixes and final rerun evidence.

## Design and implementation

Custom Astro + TypeScript + Markdown/MDX static documentation portal, with self-hosted Inter Variable Greek/Latin, light/dark themes, organized left navigation, 760px reading width, right TOC/mobile contents, code highlighting/copy, responsive photographs, scrollable tables and interactive wiring diagrams. The overview features the Robot first, real projects, categories and recent entries; it is not a magazine homepage.

Greek public article URLs remain stable, with full English pairs under `/en/`, manual same-article language links, self canonicals, reciprocal hreflang, sitemap and RSS. Search uses the actual full documentation content and a strict allowlist. Independent legacy routes remain outside new portal navigation, search and sitemap.

Active article sources are `src/content/docs/{el,en}`. Archived Jekyll sources remain provenance, not a parallel build. Robot diagrams/table/data share one technical source, with translated labels and preserved firmware ZIP. Optional typed project sections support materials, cost, wiring, steps, downloads and troubleshooting without inventing absent data.

## Local preview and reproduction

```sh
npm ci
npm test
ASTRO_TELEMETRY_DISABLED=1 npm run build
ASTRO_TELEMETRY_DISABLED=1 npm run preview -- --port 4321 --ignore-lock
```

Preview listens on port 4321: `http://localhost:4321/` in the workspace, or the temporary reachable `http://38.242.155.129:4321/`. The HTTP external preview uses manual clipboard fallback; see the QA scope note. `--ignore-lock` keeps Astro 7 in the foreground inside the managed execution environment. Do not pass another `--host`: the npm script already binds 0.0.0.0. Telemetry is disabled for these commands because the managed home config directory is read-only; this does not change site behavior.

Against an already running preview:

```sh
ASTRO_TELEMETRY_DISABLED=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:4321 PLAYWRIGHT_BROWSERS_PATH=/tmp/m0ss1-playwright-browsers npm run test:browser
```

The browser cache path is local to this environment. Elsewhere, install Chromium with `npx playwright install chromium`, then use the default Playwright cache.

## Evidence and maintenance

- `ASTRO_MIGRATION_AUDIT.json` / `.md`: actual current output audit and immutable tree hash.
- `ASTRO_VISUAL_QA.md`: independent browser, visual, font and touch evidence; explicitly separates failed earlier rounds from the final rerun.
- `ASTRO_BROWSER_CAPTURE.json`, `ASTRO_TOUCH_QA.json`, `ASTRO_FONT_QA.json`: all 30 responsive combinations, actual touch gestures and actual custom Greek/English fonts.
- `astro-portal-screenshots/`: actual new-portal mobile/desktop captures. Historical Chirpy screenshots are not used as new-portal proof.
- `CONTENT_MIGRATION.json`, `CONTENT_MIGRATION_INVARIANTS.json`, `GPI_IMAGE_INVENTORY.json`: content, code and photo provenance.
- `SITE_EDITING_GUIDE.md`, `templates/new-post.md.example`: adding the next paired article, assets, taxonomy language mappings and appearance settings.

## Actual remaining work

- One historical article, `Brutforce attack technics`, already had no body in the original source. Its URL and metadata are retained in both languages; missing article prose cannot be recovered by migration.
- Production publication is now authorized. Preserve unknown deployed paths, use normal Git history and verify the live revision after deployment.

The earlier DNS/install/browser blockers are resolved. No production modification or remote mutation was performed.

## Production publication authorization

Owner approved production on 2026-10-24. Source release branch preserves master history and imports the verified Astro tree. GitHub rejected the original feature push because the PAT lacks workflow scope. The existing remote workflow is therefore unchanged (its trigger is main, not master); it is not the Astro build or publication mechanism. Proposed Astro CI is saved inactive at tools/ci-reference/astro-checks.yml.example. Production uses the existing GitHub Pages gh-pages branch and an additive dist overlay after local production build/tests. Rollback tags: pre-astro-chirpy-source-20261024 and pre-astro-chirpy-pages-20261024. No force push or rule bypass.
