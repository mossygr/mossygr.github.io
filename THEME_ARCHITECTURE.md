# Minimal Amber Terminal — selected design A

The owner selected **A**. It is now one theme across the documentation site, not a runtime comparison system or a visual override over B/C. The owner explicitly approved production publication on 2026-10-25.

## Entry points

- `src/styles/portal.css`: imports only the five selected-theme modules.
- `src/design/tokens.css`: black/amber dark/light tokens, Handjet/Inter typography and dimensions.
- `src/design/primitives.css`: controls, explicit avatar placeholder, 160ms page/120ms dialog CSS reveals, cursor and reduced-motion handling.
- `src/design/layout.css`: open centered layout, off-canvas navigation at every width, article TOC, dialogs, search and no-JavaScript fallback.
- `src/design/prose.css`: quiet long-form typography, exact-code containers, tables and photographs.
- `src/design/home.css`: minimal author/workbench area, real article/project counts and directory-style lists.
- `src/components/design`: PageSession, RetroAvatar and HomeOverview.

## Consolidation from the comparison preview

`ConceptSwitcher.astro`, `src/scripts/concepts.ts` and `src/design/concepts.css` were removed. There is no DESIGN LAB toolbar, permanent sidebar, B window chrome, C dashboard composition, `data-concept` attribute, concept query parser or concept localStorage preference. A's values are the direct defaults in the five modules, rather than an additional selector layer.

Homepage, guides, projects, article archives, categories, tags, search, all articles, 404 and EL/EN pairs use this same shell. The menu remains available at desktop, tablet and mobile widths. Large articles retain a right desktop TOC and mobile contents control. All pages share canonical routes and the unchanged content collection.

Dark is the default regardless of OS preference; an explicit light/dark choice persists in `m0ss1-amber-theme`. Normal links and the no-script navigation fallback work without JavaScript. CSS entry reveals have no artificial navigation delay and are disabled for reduced motion. The native View Transition API is not used. Handjet provides actual Greek pixel glyphs; long prose remains Inter. RetroAvatar is explicitly labelled as a placeholder until the owner supplies a photograph.

## Regression checks

The browser suite opens and keyboard-closes the same navigation dialog at every viewport. General light/dark cases use a context-only initial light preference so a reload can still verify real saved state; the independent fresh-context reflow case verifies default dark on a light OS and persistence of explicit light on a dark OS. Technical content, actual clipboard, localized search, TOC, language links, image decoding and diagram assertions are retained.

## Removed inactive theme/build files

Dependency audit found no active Astro imports of these files. They supported only the retired Jekyll presentation/build, not article content, immutable compatibility routes, or independent applications. They remain recoverable from Git history.

- `Gemfile`
- `Gemfile.lock`
- `_config.yml`
- `index.html`
- `tools/build-site.rb`
- `_data/share.yml`
- `_data/contact.yml`
- `_data/locales/el-GR.yml`
- `_data/locales/en.yml`
- `_layouts/robot.html`
- `_plugins/i18n-routes.rb`
- `_plugins/posts-lastmod-hook.rb`
- `_includes/metadata-hook.html`
- `_includes/footer.html`
- `_includes/topbar.html`
- `_includes/language-switcher.html`
- `_tabs/archives.md`
- `_tabs/categories.md`
- `_tabs/search.html`
- `_tabs/tags.md`
- `_translations/en/_tabs/archives.md`
- `_translations/en/_tabs/categories.md`
- `_translations/en/_tabs/search.html`
- `_translations/en/_tabs/tags.md`

## Deliberately retained

`_posts`, `_translations/en/_posts`, `_includes/robot` and translated Robot includes remain source provenance used by migration audits. The protected source SVGs/firmware and `preserved/` hashes remain untouched. Historical independent application source tabs remain untouched. Old compiled CSS/JS and original assets needed by preserved public URLs remain compatibility artifacts, not active imports. `LICENSE.chirpy-7.6` remains to license those retained artifacts.

The old active `portal.css` has been completely replaced. The earlier green preview lives only in its separate checkpoint branch; no `retro-preview.css` or green theme toggle is imported here. The functional search/copy/TOC/dialog script is retained because it is site behavior, not a retired theme.

Public routes, article files, technical data and independent applications remain unchanged. The owner selected design A; this branch consolidates that approved design, and explicitly approved its production publication on 2026-10-25.

## Production source release

The retired Jekyll workflow is removed. Proposed Astro checks are preserved as an inactive example in tools/ci-reference; enabling a new workflow requires workflow permission. Actual local checks and native GitHub Pages branch deployment validate releases. No Jekyll runtime or workflow is reactivated.
