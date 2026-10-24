#!/usr/bin/env node
/** Audit actual Astro output: routes, reciprocal metadata, links and preserved pages. */
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve, join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { preservationManifest, sha256 } from './prepare-public.mjs';

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
}

function scalar(front, key) {
  const found = front.match(new RegExp('^' + key + ':\\s*(.+)$', 'm'));
  if (!found) throw new Error('Missing content frontmatter field: ' + key);
  const value = found[1].trim();
  if (value.startsWith('"')) return JSON.parse(value);
  if (value.startsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
  return value;
}

function documents(root) {
  return walk(join(root, 'src/content/docs'))
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const front = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!front) throw new Error('Missing content frontmatter: ' + file);
      return {
        file: relative(root, file),
        codePayloads: [...readFileSync(file, 'utf8').matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map(match => match[1]),
        key: scalar(front[1], 'key'),
        lang: scalar(front[1], 'lang'),
        permalink: scalar(front[1], 'permalink'),
      };
    });
}

function decodeHtml(text) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };
  return text.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_all, entity) => {
    if (entity[0] !== '#') return named[entity.toLowerCase()];
    return String.fromCodePoint(entity[1].toLowerCase() === 'x'
      ? parseInt(entity.slice(2), 16) : Number(entity.slice(1)));
  });
}

function attrs(text) {
  const result = {};
  for (const match of text.matchAll(/([^\s=<>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    result[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return result;
}

function nodes(html) {
  // Inline JS search templates contain apparent HTML that is not rendered markup.
  const markup = html.replace(/(<script\b[^>]*>)[\s\S]*?(<\/script>)/gi, '$1$2')
    .replace(/(<style\b[^>]*>)[\s\S]*?(<\/style>)/gi, '$1$2');
  return [...markup.matchAll(/<([a-z][\w:.-]*)\b([^>]*)>/gi)]
    .map((match) => ({ tag: match[1].toLowerCase(), attrs: attrs(match[2]) }));
}

function htmlFile(dist, pathname) {
  const path = pathname.replace(/^\/+/, '');
  const candidates = [];
  for (const value of [decodeURIComponent(path), path]) {
    candidates.push(join(dist, value));
    if (!extname(value) || value.endsWith('/')) candidates.push(join(dist, value, 'index.html'));
  }
  if (!path) candidates.unshift(join(dist, 'index.html'));
  return candidates.find((file) => existsSync(file) && !readdirSafeDirectory(file)) ?? null;
}

function readdirSafeDirectory(file) {
  try { readdirSync(file); return true; } catch { return false; }
}

function languageCode(value) {
  const lower = value.toLowerCase();
  return lower === 'x-default' ? lower : lower.split('-')[0];
}

export function auditDist({ root = PROJECT_ROOT, dist = join(root, 'dist'), site = 'https://mossygr.github.io' } = {}) {
  if (!existsSync(join(dist, 'index.html'))) {
    throw new Error('No actual built dist/index.html. Run the Astro build before this audit.');
  }
  const origin = new URL(site).origin;
  const docs = documents(root);
  if (!docs.length) throw new Error('No Markdown/MDX documents found; audit cannot pass an empty content set.');
  const manifest = preservationManifest(root);
  const errors = [];
  const pairs = new Map();
  const htmlCache = new Map();
  const hiddenPath = (pathname) => {
    const local = pathname.replace(/^\/en(?=\/)/, '');
    return manifest.hidden_paths.some((path) =>
      local === path.replace(/\/$/, '') || local.startsWith(path));
  };
  let checkedLocalLinks = 0;

  function htmlInfo(file) {
    if (!htmlCache.has(file)) {
      const html = readFileSync(file, 'utf8');
      const elements = nodes(html);
      htmlCache.set(file, {
        html, elements,
        ids: new Set(elements.map((node) => node.attrs.id).filter(Boolean)),
      });
    }
    return htmlCache.get(file);
  }

  function checkLocal(reference, fromFile, fromUrl, context) {
    if (!reference || /^(?:data|blob|mailto|tel|javascript):/i.test(reference)) return;
    let url;
    try { url = new URL(reference, fromUrl); } catch {
      errors.push(context + ': malformed URL ' + reference); return;
    }
    if (url.origin !== origin || !/^https?:$/.test(url.protocol)) return;
    checkedLocalLinks++;
    const target = htmlFile(dist, url.pathname);
    if (!target) {
      errors.push(context + ': missing local target ' + url.pathname);
      return;
    }
    if (url.hash && extname(target) === '.html') {
      let fragment;
      try { fragment = decodeURIComponent(url.hash.slice(1)); } catch { fragment = url.hash.slice(1); }
      if (!htmlInfo(target).ids.has(fragment)) {
        errors.push(context + ': missing anchor ' + url.pathname + '#' + fragment);
      }
    }
  }

  for (const doc of docs) {
    const key = doc.key;
    if (!pairs.has(key)) pairs.set(key, {});
    if (pairs.get(key)[doc.lang]) errors.push('Duplicate language/key: ' + doc.lang + '/' + key);
    pairs.get(key)[doc.lang] = doc;
  }

  for (const doc of docs) {
    const file = htmlFile(dist, doc.permalink);
    if (!file) { errors.push(doc.file + ': missing built document ' + doc.permalink); continue; }
    const { html, elements } = htmlInfo(file);
    const renderedCode = [...html.matchAll(/<pre\b[^>]*>\s*<code\b[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi)]
      .map(match => decodeHtml(match[1].replace(/<[^>]*>/g, '')).replace(/\n+$/, ''));
    const expectedCode = doc.codePayloads.map(code => code.replace(/\n+$/, ''));
    if (JSON.stringify(renderedCode) !== JSON.stringify(expectedCode)) {
      errors.push(doc.permalink + ': rendered code blocks differ from the canonical Markdown/MDX source');
    }
    const htmlNode = elements.find((node) => node.tag === 'html');
    if (!htmlNode?.attrs.lang || languageCode(htmlNode.attrs.lang) !== doc.lang) {
      errors.push(doc.permalink + ': wrong or missing html language');
    }
    const canonical = elements.filter((node) => node.tag === 'link'
      && (node.attrs.rel ?? '').split(/\s+/).includes('canonical'));
    const expected = new URL(doc.permalink, origin).href;
    if (canonical.length !== 1 || new URL(canonical[0]?.attrs.href ?? '/', origin).href !== expected) {
      errors.push(doc.permalink + ': requires exactly one correct self canonical');
    }
    const pair = pairs.get(doc.key);
    if (!pair.el || !pair.en) {
      errors.push(doc.permalink + ': missing complete el/en content pair');
      continue;
    }
    const required = { el: pair.el.permalink, en: pair.en.permalink, 'x-default': pair.el.permalink };
    for (const [lang, url] of Object.entries(required)) {
      const alternate = elements.filter((node) => node.tag === 'link'
        && (node.attrs.rel ?? '').split(/\s+/).includes('alternate')
        && node.attrs.hreflang && languageCode(node.attrs.hreflang) === lang);
      if (alternate.length !== 1
        || new URL(alternate[0]?.attrs.href ?? '/', origin).href !== new URL(url, origin).href) {
        errors.push(doc.permalink + ': missing/incorrect reciprocal alternate ' + lang);
      }
      if (!htmlFile(dist, url)) errors.push(doc.permalink + ': alternate target missing ' + url);
    }
    const other = pair[doc.lang === 'el' ? 'en' : 'el'].permalink;
    const visibleCounterpart = elements.some((node) => node.tag === 'a' && node.attrs.href
      && new URL(node.attrs.href, expected).href === new URL(other, origin).href);
    if (!visibleCounterpart) errors.push(doc.permalink + ': no actual link to the counterpart article');
  }

  const files = walk(dist);
  for (const file of files.filter((file) => extname(file) === '.html')) {
    const { html, elements } = htmlInfo(file);
    let served = '/' + relative(dist, file).replaceAll('\\', '/');
    if (served.endsWith('index.html')) served = served.slice(0, -10);
    const pageUrl = new URL(served, origin).href;
    for (const node of elements) {
      for (const key of ['href', 'src', 'poster', 'xlink:href']) {
        if (node.attrs[key]) checkLocal(node.attrs[key], file, pageUrl, served);
      }
      if (node.attrs.srcset && !node.attrs.srcset.trim().startsWith('data:')) {
        for (const candidate of node.attrs.srcset.split(',')) {
          checkLocal(candidate.trim().split(/\s+/)[0], file, pageUrl, served + ' srcset');
        }
      }
    }
    // Exact legacy utilities are not the new portal navigation; retain their original menus.
    if (!hiddenPath(served)) for (const navigation of html.matchAll(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi)) {
      for (const node of nodes(navigation[0])) {
        if (node.tag !== 'a' || !node.attrs.href) continue;
        const url = new URL(node.attrs.href, pageUrl);
        if (url.origin === origin && hiddenPath(url.pathname)) {
          errors.push(served + ': hidden app exposed in navigation: ' + url.pathname);
        }
      }
    }
  }

  for (const file of files.filter((file) => extname(file) === '.css')) {
    const base = new URL('/' + relative(dist, file).replaceAll('\\', '/'), origin).href;
    for (const match of readFileSync(file, 'utf8').matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g)) {
      checkLocal(match[2], file, base, relative(dist, file));
    }
  }

  const sitemaps = files.filter((file) => /sitemap[^/]*\.xml$/.test(file));
  if (!sitemaps.length) errors.push('No generated sitemap XML exists');
  const sitemapLocations = new Set();
  for (const file of sitemaps) {
    const xml = readFileSync(file, 'utf8');
    for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
      const value = decodeHtml(match[1]);
      const url = new URL(value, origin);
      sitemapLocations.add(url.href);
      if (hiddenPath(url.pathname)) {
        errors.push(relative(dist, file) + ': hidden app listed in sitemap ' + url.pathname);
      }
      checkLocal(value, file, new URL('/', origin).href, relative(dist, file));
    }
  }
  for (const doc of docs) {
    if (!sitemapLocations.has(new URL(doc.permalink, origin).href)) {
      errors.push(doc.permalink + ': missing from sitemap');
    }
  }

  for (const file of files.filter((file) => /search[^/]*\.json$/.test(file))) {
    const value = readFileSync(file, 'utf8');
    for (const path of manifest.hidden_paths) {
      if (value.includes('"' + path)) errors.push(relative(dist, file) + ': hidden app leaked into search data');
    }
  }

  // Pagefind must use exactly the documentation allowlist, never scan legacy utilities.
  const expectedRoutes = docs.map((doc) => new URL(doc.permalink, origin).href).sort();
  for (const [name, readRoutes] of [
    ['content-index.json', (value) => value.map((row) => row.path)],
    ['pagefind/indexed-routes.json', (value) => value],
  ]) {
    const file = join(dist, name);
    if (!existsSync(file)) {
      errors.push('Missing explicit search allowlist: ' + name);
      continue;
    }
    try {
      const values = readRoutes(JSON.parse(readFileSync(file, 'utf8')));
      const actual = values.map((value) => new URL(value, origin).href).sort();
      if (JSON.stringify(actual) !== JSON.stringify(expectedRoutes)) {
        errors.push(name + ': indexed routes must match every documentation route exactly once');
      }
      for (const value of actual) {
        if (hiddenPath(new URL(value).pathname)) errors.push(name + ': hidden app indexed: ' + value);
      }
    } catch (error) {
      errors.push(name + ': invalid route allowlist: ' + error.message);
    }
  }

  for (const entry of manifest.protected_sources.filter((entry) => entry.path.startsWith('assets/'))) {
    const file = join(dist, entry.path);
    if (!existsSync(file) || sha256(readFileSync(file)) !== entry.sha256) {
      errors.push('Protected download changed in built output: ' + entry.path);
    }
  }

  for (const entry of manifest.snapshot_files) {
    const actual = join(dist, entry.path);
    if (!existsSync(actual) || sha256(readFileSync(actual)) !== entry.sha256) {
      errors.push('Built compatibility snapshot is missing or modified: ' + entry.path);
    }
  }
  return {
    status: errors.length ? 'fail' : 'pass',
    builtDirectory: dist,
    documents: docs.length,
    languagePairs: pairs.size,
    htmlFiles: htmlCache.size,
    checkedLocalLinks,
    preservedFiles: manifest.snapshot_files.length,
    errors: [...new Set(errors)],
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const flag = process.argv.indexOf('--dist');
    const dist = flag >= 0 ? resolve(process.argv[flag + 1]) : undefined;
    const report = auditDist({ dist });
    mkdirSync(join(PROJECT_ROOT, 'work-notes'), { recursive: true });
    writeFileSync(join(PROJECT_ROOT, 'work-notes/DIST_AUDIT.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
    if (report.status !== 'pass') process.exitCode = 1;
  } catch (error) {
    console.error('AUDIT NOT PASSED: ' + error.message);
    process.exitCode = 1;
  }
}
