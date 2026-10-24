# Independent Astro visual and browser QA — 2026-10-24

Reviewer: `greek_visual_reviewer`. Local preview only; no remote mutations or production publication. This report separates observed rendering from authored assertions and records failures before fixes.

## Tested environment and build identity

- Repository: `mossygr/mossygr.github.io`, branch `feat/astro-docs-portal`, base checkpoint `26e9319` plus local migration/fix changes.
- Actual browser: Chromium **156.0.8078.4**, matching the installed Playwright Chromium v1248; downloaded under `/tmp/m0ss1-playwright-browsers`.
- Preview: `http://127.0.0.1:4321`, serving the real Astro static build. Initial connection failures were diagnosed and corrected as IPv6-only preview binding, not a site defect.
- Build v2 frozen by coordinator at 07:00:37. `dist/robot/index.html` SHA256: `55b27b87c48ce2766b6740f66840e1b15522223ce6c160b91c3f95592472474b`. Full identity file: `/tmp/astro-visual-review/v2-build-hashes.json`.

## Executed v1/v2 rounds

- V1 custom capture matrix completed 30 route/language/viewport combinations: home, Robot, GPi, Arduino category and Lame, EL/EN, 390/768/1440. Every requested page returned HTTP 200, with zero document overflow and zero captured page JavaScript errors. Both themes were captured. Evidence: `/tmp/astro-visual-review/v1/report.json` and PNGs.
- V1 independent axe testing found serious `nested-interactive`: category links were nested inside interactive `<summary>` controls. The coordinator replaced the nested anchor with a separate category overview link. V2 no longer fails this rule.
- V2 complete Playwright matrix: **37 executed, 23 passed, 14 failed** (8.7 minutes). Ten mobile cases failed the unnamed icon-only search trigger; four Robot tablet/desktop cases failed dark-code comment contrast. These are real failures, not a QA pass. All six locale-aware search/keyboard/language-routing tests passed; the 200%-equivalent reflow/system-dark test passed.
- One test issue was corrected: intentionally hidden responsive list thumbnails must not be scrolled into view. Alt text is still checked for all images, and all visible images are scrolled/decoded. Tests now reflect actual displayed responsive content.

## Visual inspection actually performed on v2

- Captured the **entire expanded Greek Robot guide** in 101 overlapping viewport images: 62 at 390×844 and 39 at 1440×900. Disclosure notes were opened before capture. Files and exact scroll coordinates: `/tmp/astro-visual-review/v2-whole-guide/report.json`.
- Opened and inspected **all 62 mobile frames**, arranged without resizing into 16 annotated contact sheets. This covered introduction, materials, assembly, both diagrams, firmware/upload, all eight code excerpts and explanations, troubleshooting, every technical note, the wiring-table rows, downloads, discrepancy notes and reference images.
- Opened eight desktop frames (contact sheets 00/03/08/12), plus separate English diagram/harness frames; also reviewed home/Robot/GPi/category tops, tablet dark home and English mobile dark Robot.
- The body is readable in Greek/English, with coherent spacing and no document clipping. SVG viewers retain geometry and readable controls; the full-diagram overview requires the intended zoom/pan on mobile. Code lines and wide tables scroll internally.
- Actual font verification used CDP `CSS.getPlatformFontsForNode`, not only computed CSS: v1 really used Lato; v2 uses the locally hosted **Inter** for Greek heading/body glyphs. Evidence: `/tmp/astro-visual-review/v2-fonts.json`.
- Rendered Robot counts remained 36 rows, 216 data cells, 359 SVG text labels and eight code blocks. The browser tests exercised table keyboard selection, wire highlighting, zoom, exact clipboard text, ZIP HTTP response and actual TOC section positioning before the known axe failures.

## Findings sent for the v3 fix batch

1. **Critical, mobile accessible name:** `.search-trigger` loses its visible text below 768px and had no `aria-label`. Coordinator added the localized label.
2. **Serious, dark code contrast:** GitHub-dark comments used `#6A737D` over `#24292E`, measured contrast 3.04:1 instead of 4.5:1. Coordinator selected bundled `github-dark-high-contrast` for a general token-palette correction.
3. **Medium, real keyboard focus:** Enter on table row 11 scrolled to the diagram while focus remained in row 11; the following Tab jumped back to row 12 and the table. Coordinator moved focus to the diagram after navigation and after closing its wire info. New assertions check both focus transfers.
4. **Usability:** wide mobile wiring table needed an explicit horizontal-scroll hint. Coordinator added a localized visible hint without changing the table data.
5. **Design refinement:** replaced the visibly calligraphic Greek Lato with self-hosted variable Inter, narrowed reading width to 760px, enlarged TOC typography, and placed the Robot first in the homepage project list. These visual changes were already inspected in v2.

## Final v3 status

**PASS for the observed local-preview scope.** The coordinator's final v3 build completed at 07:12:33; its built root HTML SHA256 is `b9d4277a039e7e6775041bac0ad91d40b9f2055049b468f1be0ebc8c14f8d25f`. The authoritative build hashes are also recorded in `ASTRO_BROWSER_CAPTURE.json`.

- Complete final Playwright run: **37 passed, 0 failed, exit code 0**, 5.6 minutes, two independent workers. Both languages, all three widths, both themes, open mobile menus/search dialogs, axe checks, real TOC navigation, exact clipboard copy, rendered-image loading, ZIP requests, diagram/table controls, language switching, per-language search and 200%-equivalent reflow passed. New focus-transfer assertions passed after Enter on a wiring row and after closing its information panel.
- The test command was `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4321 PLAYWRIGHT_BROWSERS_PATH=/tmp/m0ss1-playwright-browsers ASTRO_TELEMETRY_DISABLED=1 npm run test:browser -- --reporter=list`. Full final log: `ASTRO_BROWSER_TESTS.log`.
- Final custom capture audit: **30/30 page/language/viewport combinations**, every page HTTP 200, **zero document horizontal overflow and zero captured page JavaScript exceptions**. It generated 80 fresh top/technical PNGs. Durable measurements and actual font samples: `ASTRO_BROWSER_CAPTURE.json` and `ASTRO_FONT_QA.json`.
- Actual touch verification used **`isMobile: true`, `hasTouch: true`, 390×844**, with CDP touch events rather than resized desktop mouse actions. Two horizontal touch swipes moved the wiring table from **0 → 215 → 436px**, reaching its actual rightmost scroll limit and exposing the full critical notes. A one-finger drag moved the SVG **55px horizontally / 35px vertically**. A two-finger pinch changed scale **0.224747 → 0.417387 (1.86×)**. Document overflow remained zero. Evidence: `ASTRO_TOUCH_QA.json` and touch screenshots.
- Fresh v3 home/Robot desktop/mobile, dark code desktop/mobile, the visible horizontal-scroll hint, open mobile TOC and touch-result screenshots were opened and inspected. The corrected dark comments are readable; the search control is named; table instructions and notes remain accessible; no new visual blocker was observed. Home/Robot, GPi, category and Lame were captured in both themes/languages across the matrix.
- V2's entire-guide scroll evidence remains valid for its unchanged prose/layout: all 62 mobile frames were visually inspected, with desktop and English technical samples as described above. V3 changed accessibility labels, dark code colors, keyboard focus, a localized table hint and the license asset; affected visible areas received fresh v3 inspection.

Final selected screenshots are saved in `work-notes/astro-portal-screenshots/`. Raw 80-frame v3 evidence is under `/tmp/astro-visual-review/v3/`; 101 overlapping full-guide frames are under `/tmp/astro-visual-review/v2-whole-guide/`. There are **no unresolved observed readability, navigation, touch or automated-accessibility blockers in this tested scope**. This is a local QA sign-off, not permission to publish.

## Scope limits

This is Chromium responsive emulation, not physical-device or Safari/Firefox certification. Full-page/viewport screenshots and manual inspection are local preview evidence only. No production or publication verification is claimed.

Coordinator's additional temporary-preview check: the externally reachable HTTP preview at `http://38.242.155.129:4321/robot/` renders successfully. As expected for an insecure non-localhost origin, Chromium reports `isSecureContext=false` and no Clipboard API. The existing fallback selects the code (217 characters in the checked first snippet) and labels the button `Ctrl/Cmd+C`. Automatic clipboard copying was verified by the 37-test run on the secure-context localhost preview; the HTTP fallback is a temporary preview constraint, not a production HTTPS verification.
