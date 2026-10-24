# Preserved public behaviour and asset provenance

The deployed HTML for /position_size/, /trades/, and /norobots/ is retained byte for byte from the gh-pages commit recorded in manifest.json. The snapshots include compiled compatibility CSS/JavaScript and root-only service-worker retirement files required by those pages. No /gym-app files are read, copied, or modified.

Run node tools/prepare-public.mjs to copy the current editable assets directory to public/assets, then overlay immutable deployed compatibility files. The Astro frontend owns the new 404, robots.txt, sitemap, navigation and search output. The hidden redirect remains noindex and is not added to any new navigation or sitemap.

The original_assets_provenance records today's source asset hashes for traceability. It does not prevent editing future article images. Edit ordinary assets in assets/, then run prepare-public. Do not edit generated public/assets directly. Compiled legacy compatibility paths come from preserved/deployed instead.

The protected firmware ZIP and original wiring SVG sources are checked against recorded hashes. A future explicit firmware/wiring change must deliberately update these records and review the technical change. Normal preparation never silently regenerates hashes.

Snapshot changes should be explicit reviewed changes with a new origin commit and hashes. Preparing public files never changes this manifest or the snapshots. Tests compare exact deployed bytes, including calculator/trading HTML and embedded executable logic.

The complete snapshot set also retains older root script URLs, redirect files, the notebook runtime, generated favicon variants and the CSS source map. These files stay available at their original paths for compatibility. The new portal must never load app.js, app.min.js or sw.min.js: root service-worker retirement remains the only permitted compatibility lifecycle script. The posts/ and assets/ directory index pages remain their original noindex redirects, outside all portal discovery mechanisms.

robot/release.json is retained solely as the historical receipt for the production release dated inside that file. Its old hashes and theme identity describe that historical release, never the new Astro build. It is not linked from any new public discovery surface.
