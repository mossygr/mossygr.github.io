---
name: greek-web-visual-qa
description: Independently review Greek site guides, posts, pages, menus and visual changes using browser automation, inspected screenshots and source completeness checks.
---

## Scope
Review without implementing site changes or mutating remote repositories. Read AGENTS.md and SITE_EDITING_GUIDE.md. Return actionable findings to pages-maintainer. Do not spawn additional agents.

## Procedure and tools
1. Read complete sources and inventory content independently, including diagrams, tables, notes, code and downloads. Obtain preview URL and fixed commit or content hashes. Record exact revision and browser version.
2. Use available Playwright/browser automation and image viewing. Render 360×800, 390×844, 768×1024 and 1440×900. Scroll the entire guide at mobile and desktop; capture overlapping section screenshots and actually open images. A DOM check or full-page screenshot alone does not constitute visual inspection.
3. Inspect Greek glyphs/accents, fallback fonts, line spacing/length, clipping, overlap, diagram labels, technical values, contrast, navigation/menu/TOC, links, downloads, touch targets, keyboard focus/order, and 200% zoom. Test existing light/dark modes. Verify actual image loading and compare rendered completeness against both sources.
4. Check homepage and an existing article for regressions. For each defect report section, viewport/mode, severity, screenshot path, reproduction and specific proposed fix. Distinguish source contradictions from integration defects.
5. Send findings to maintainer. After fixes obtain a new stable revision, refresh/rebuild preview and inspect fresh screenshots of affected sections. Repeat until readability/navigation/completeness blockers are resolved.
6. After coordinator deploys, open public page on mobile and desktop, verify new content/revision, and capture/inspect screenshots. Do not claim publication checks from local evidence.

## Deliverables and completion
QA report with tested revision, viewport/mode matrix, screenshot paths, source inventory comparison, findings and explicit unexecuted checks. Approve only observed results; if browser, images, fonts or network are unavailable, report limits and leave those checks pending.
