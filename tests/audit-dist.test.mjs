import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { auditDist } from '../tools/audit-dist.mjs';
import { sha256 } from '../tools/prepare-public.mjs';

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'portal-audit-fixture-'));
  const dist = join(root, 'dist');
  const write = (path, value) => {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value));
  };
  const routes = ['/article/', '/en/article/'];
  const legacy = '<html><nav><a href="/trades/">Legacy utility</a></nav></html>';
  write('preserved/manifest.json', {
    hidden_paths: ['/trades/', '/gym-app/'], protected_sources: [],
    snapshot_files: [{ path: 'trades/index.html', sha256: sha256(legacy) }],
  });
  write('dist/trades/index.html', legacy);
  write('dist/index.html', '<html><nav><a href="/article/">Article</a></nav></html>');
  for (const [index, lang] of ['el', 'en'].entries()) {
    write('src/content/docs/' + lang + '/article.md', '---\nkey: article\nlang: ' + lang + '\npermalink: ' + routes[index] + '\n---\nBody');
    write('dist' + routes[index] + 'index.html', '<html lang="' + lang + '"><head>' +
      '<link rel="canonical" href="https://mossygr.github.io' + routes[index] + '">' +
      ['el', 'en', 'x-default'].map((code) => '<link rel="alternate" hreflang="' + code + '" href="' + routes[code === 'en' ? 1 : 0] + '">').join('') +
      '</head><body><a href="' + routes[1 - index] + '">Language</a><h2 id="section">Body</h2><a href="#section">Section</a></body></html>');
  }
  write('dist/sitemap.xml', '<urlset>' + routes.map((path) => '<url><loc>https://mossygr.github.io' + path + '</loc></url>').join('') + '</urlset>');
  write('dist/content-index.json', routes.map((path) => ({path})));
  write('dist/pagefind/indexed-routes.json', routes);
  return {root, dist, write, routes, clean: () => rmSync(root, {recursive: true, force: true})};
}

test('audit accepts reciprocal fixture metadata and byte-identical legacy menus, not a portal build claim', () => {
  const f = fixture();
  try { assert.equal(auditDist(f).status, 'pass'); } finally { f.clean(); }
});

test('audit rejects hidden portal navigation and Pagefind allowlist duplication or leakage', () => {
  const f = fixture();
  try {
    f.write('dist/index.html', '<nav><a href="/trades/">Utility</a></nav>');
    f.write('dist/pagefind/indexed-routes.json', [f.routes[0], f.routes[0], '/trades/']);
    const report = auditDist(f);
    assert.equal(report.status, 'fail');
    assert.ok(report.errors.some((e) => e.includes('hidden app exposed')));
    assert.ok(report.errors.some((e) => e.includes('match every documentation route exactly once')));
    assert.ok(report.errors.some((e) => e.includes('hidden app indexed')));
  } finally { f.clean(); }
});

test('audit rejects broken document anchors, missing metadata and modified legacy bytes', () => {
  const f = fixture();
  try {
    const path = 'dist/article/index.html';
    f.write(path, readFileSync(join(f.root, path), 'utf8').replace('rel="canonical"', 'rel="invalid"').replace('id="section"', 'id="different"'));
    f.write('dist/trades/index.html', '<html>Modified</html>');
    const report = auditDist(f);
    assert.equal(report.status, 'fail');
    for (const fragment of ['self canonical', 'missing anchor', 'snapshot is missing or modified']) {
      assert.ok(report.errors.some((e) => e.includes(fragment)), fragment);
    }
  } finally { f.clean(); }
});

test('audit compares rendered highlighted code with source without double-decoding literals', () => {
  const f = fixture();
  try {
    const sourcePath = 'src/content/docs/el/article.md';
    const htmlPath = 'dist/article/index.html';
    const code = 'const label = "<x> &lt; Ω";\n';
    f.write(sourcePath, readFileSync(join(f.root, sourcePath), 'utf8') + '\n```cpp\n' + code + '```\n');
    const html = readFileSync(join(f.root, htmlPath), 'utf8');
    const block = '<pre class="astro-code"><code><span class="line">const label = &quot;&lt;x&gt; &amp;lt; Ω&quot;;</span>\n</code></pre>';
    f.write(htmlPath, html.replace('</body>', block + '</body>'));
    assert.equal(auditDist(f).status, 'pass');
    f.write(htmlPath, html.replace('</body>', block.replace('label =', 'changed =') + '</body>'));
    const report = auditDist(f);
    assert.ok(report.errors.some(error => error.includes('rendered code blocks differ')));
  } finally { f.clean(); }
});
