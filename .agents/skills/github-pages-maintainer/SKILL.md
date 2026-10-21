---
name: github-pages-maintainer
description: Maintain this Greek GitHub Pages site, including guides, posts, pages, menus, assets and shared appearance, using its verified theme and publishing workflow.
---

## Scope
Implement requested site and content changes. Keep unrelated content and working changes. Do not redesign beyond the request. Read repository AGENTS.md and SITE_EDITING_GUIDE.md first; unverified handoff notes are not repository facts.

## Procedure and tools
1. Inspect git status, remotes, applicable AGENTS.md, configuration, layouts, dependency locks and CI with rg, git and shell. Coordinator verifies repository identity, default branch, Pages source, write permission and branch rules using existing gh authentication. Never print credentials.
2. Read complete input documents; inventory headings, tables, notes, diagrams, code, downloads and referenced assets. Compare alternate versions. Preserve all distinct content and exact pins, values, units, polarity and functional code. Record contradictions; do not silently reconcile them.
3. Confirm routes are free. Use existing layouts, Markdown and menu conventions; organize assets by project. Reuse shared styles and scope guide-specific fixes. Preserve valid UTF-8, appropriate language and Greek font coverage. Make tables/code scroll within their containers and diagrams legible on mobile.
4. Run the project's actual lockfile/CI-backed build; record command, versions and result. Do not label an inferred command verified. Start preview of a stable revision; record commit or file hashes and URL. Exclude templates and maintenance files from generated content using verified project conventions.
5. Send preview and inventory to greek-visual-reviewer. Implement findings affecting readability, navigation or completeness; rebuild and ask for fresh screenshots of affected sections. Do not modify a snapshot during review.
6. Deliver diff, build evidence, content mapping, asset/link checks and remaining issues to coordinator. Only coordinator may push, create PRs, merge or deploy, and only within user authorization and repository rules. Never force push or bypass reviews.

## Deliverables and completion
Editable integrated content, appropriate menu entry and TOC, shared/scoped styles, organized assets, article template and updated Greek maintenance instructions. Build succeeds; content is accounted for; reviewer confirms affected pages plus homepage/existing article. Publishing is complete only after coordinator verifies deployment and reviewer checks the public revision. Report unavailable tools/access explicitly.
