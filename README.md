# m0ss1 — technical documentation

Custom static Astro portal with Greek/English Markdown and MDX articles. The active build uses Node 24, TypeScript, Astro, and Pagefind.

```sh
npm ci
npm test
ASTRO_TELEMETRY_DISABLED=1 npm run build
ASTRO_TELEMETRY_DISABLED=1 npm run preview -- --port 4322 --ignore-lock
```

The `feat/retro-amber-a` branch implements the selected **Minimal Amber Terminal (A)** as one theme across every documentation route. The comparison toolbar and B/C compositions have been removed. Dark is the default, with an explicit saved light-mode choice. Navigation uses the same accessible off-canvas menu at every screen width; article TOCs remain available on desktop and mobile. Source content and URLs remain unchanged. The owner explicitly approved production publication of this selected theme on 2026-10-25.

See [SITE_EDITING_GUIDE.md](SITE_EDITING_GUIDE.md) for content and [THEME_ARCHITECTURE.md](THEME_ARCHITECTURE.md) for the new design system.

Historical article sources and immutable compatibility snapshots are retained for provenance and existing public URLs. They are not imported as an active theme. Relevant third-party licenses remain in the repository.

Production publication requires explicit owner approval and must preserve the existing deployed history and unrelated routes.
