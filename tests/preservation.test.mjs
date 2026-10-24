import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { preparePublic, verifySnapshots, sha256 } from '../tools/prepare-public.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('deployed snapshots and original technical sources retain their recorded bytes', () => {
  const manifest = verifySnapshots(root);
  const paths = new Set(manifest.snapshot_files.map((entry) => entry.path));
  for (const file of ['position_size/index.html', 'trades/index.html', 'norobots/index.html']) {
    assert.ok(paths.has(file), 'Missing deployed route: ' + file);
  }
  assert.match(readFileSync(join(root, 'preserved/deployed/norobots/index.html'), 'utf8'),
    /name="robots" content="noindex"/);
  assert.ok(!manifest.snapshot_files.some((entry) => entry.path.startsWith('gym-app/')));
});

test('public preparation preserves complete calculator/trading pages and compatibility assets', () => {
  const temporary = mkdtempSync(join(tmpdir(), 'm0ss1-preservation-'));
  try {
    const result = preparePublic({ root, output: temporary });
    const manifest = verifySnapshots(root);
    assert.equal(result.preservedFiles, manifest.snapshot_files.length);
    for (const entry of manifest.snapshot_files) {
      assert.equal(sha256(readFileSync(join(temporary, entry.path))), entry.sha256, entry.path);
    }
    const compatibility = new Set(manifest.snapshot_files.map((entry) => entry.path));
    for (const entry of manifest.original_assets_provenance) {
      if (compatibility.has(entry.path)) continue;
      assert.equal(sha256(readFileSync(join(temporary, entry.path))),
        sha256(readFileSync(join(root, entry.path))), entry.path);
    }
    assert.equal(existsSync(join(temporary, 'gym-app')), false);
    assert.equal(existsSync(join(temporary, 'sitemap.xml')), false);
    assert.equal(existsSync(join(temporary, 'robots.txt')), false);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

test('Astro connection data preserves all 216 cells, 36 wires and both original SVGs', () => {
  const manifest = verifySnapshots(root);
  const decode = (value) => value
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#([0-9]+);/g, (_, n) => String.fromCodePoint(Number(n)));
  const html = readFileSync(join(root, 'src/data/robot/connections.html'), 'utf8');
  const cells = [...html.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)]
    .map((match) => decode(match[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim());
  assert.equal(cells.length, 216);
  assert.deepEqual(cells, manifest.technical_payload.connection_cells);
  const wires = JSON.parse(readFileSync(join(root, 'src/data/robot/wires.json'), 'utf8'));
  assert.equal(Object.keys(wires).length, 36);
  assert.deepEqual(wires, manifest.technical_payload.wires);
  for (const name of ['pict.svg', 'harness.svg']) {
    assert.deepEqual(readFileSync(join(root, 'src/data/robot', name)),
      readFileSync(join(root, '_includes/robot', name)));
  }
});

test('legacy root entrypoints and every known omitted asset remain inactive compatibility snapshots', () => {
  const manifest = verifySnapshots(root);
  const paths = new Set(manifest.snapshot_files.map(entry => entry.path));
  for (const path of ['app.js', 'app.min.js', 'sw.min.js', 'redirects.json', 'posts/index.html', 'assets/index.html', 'assets/js/notebook.js', 'assets/css/jekyll-theme-chirpy.css.map', 'assets/img/favicons/site.webmanifest']) {
    assert.ok(paths.has(path), 'Existing public URL missing from preservation: ' + path);
  }
  const portal = readFileSync(join(root, 'src/layouts/Portal.astro'), 'utf8');
  assert.doesNotMatch(portal, /src=["']\/(?:app(?:\.min)?|sw\.min)\.js["']/);
});
