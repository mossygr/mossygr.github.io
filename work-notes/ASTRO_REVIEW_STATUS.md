> Historical source-only checkpoint from the earlier DNS-blocked phase. Superseded by `ASTRO_VISUAL_QA.md` and the current `ASTRO_PORTAL_STATUS.md`; the blocked statements below are not the current runtime status.

# Independent review status — 2026-10-24

**Browser/visual QA: BLOCKED, not passed.** No screenshot of the new portal has been produced or inspected. Production approval has not been requested or granted.

Two existing agents were reused: `pages_maintainer` for content migration/preservation/audit tooling and `greek_visual_reviewer` for independent source review and browser test preparation. The coordinator implemented the frontend and addressed the reported findings.

## Independent source findings and corrections

1. Native navigation/search dialogs lacked accessible names. Added localized `aria-label` to both.
2. White wire numbers had insufficient contrast on orange/green/gray fills. Changed only number foregrounds in the table, SVG tag presentation and info overlay. Technical fills, SVG geometry and wire data remain unchanged.
3. Future structured project sections were absent from the right TOC. Added their generated headings alongside Markdown headings.
4. Category singular labels said “1 άρθρα / 1 articles”. Corrected count-aware labels.
5. The coordinator found MDX would parse unescaped `{#id}` as a JavaScript expression. Escaped the two Robot MDX sources; the migration converter now emits the same valid syntax. Rendered anchor behavior still requires the real compiler/browser check.
6. Historical article headings/font colors need the shared reading hierarchy/palette. Added Markdown AST hierarchy normalization and scoped font-color styling without changing prose/code or technical SVG fills.

The reviewer confirmed current taxonomy language mappings, source EL/EN pairing and technical label coverage. All corrections remain subject to actual rendered/a11y recheck.

## Authored browser matrix

`tests/portal.spec.ts` and `playwright.config.ts` contain 37 browser tests, **not executed**:

- Home, Robot, Arduino category, Lame and GPi × Greek/English × 390/768/1440 widths.
- Light/dark screenshots, full-page and selected Robot section captures; image decode/alt, overflow and 200%-equivalent reflow.
- Canonicals, hreflang, same-page language links, no unrelated routes in new portal navigation/search.
- Search keyboard operation and per-language results, mobile menu/focus restoration, theme persistence.
- Real TOC clicks/scroll position, exact clipboard content, ZIP requests, 36 wiring rows/216 cells/359 SVG labels, keyboard wire selection and zoom.
- Axe checks in both themes and open dialogs.

Actual attempt:

```sh
npm run test:browser -- --list
```

```text
sh: 1: playwright: not found
```

Syntax checks of the two TypeScript test/config files passed. Existing Node/content tests passed. Neither syntax checks nor authored assertions are browser evidence. After dependencies/build become available, run the matrix, **open the screenshots**, fix findings and rerun before presenting a preview for approval.
