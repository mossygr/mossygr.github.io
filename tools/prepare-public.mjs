#!/usr/bin/env node
/** Prepare static provenance assets and exact compatibility routes for Astro. */
import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

export function preservationManifest(root = PROJECT_ROOT) {
  return JSON.parse(readFileSync(join(root, 'preserved/manifest.json'), 'utf8'));
}

export function verifySnapshots(root = PROJECT_ROOT) {
  const manifest = preservationManifest(root);
  for (const entry of manifest.snapshot_files) {
    const file = join(root, 'preserved/deployed', entry.path);
    if (!existsSync(file)) throw new Error('Missing preservation snapshot: ' + entry.path);
    const bytes = readFileSync(file);
    if (bytes.length !== entry.bytes || sha256(bytes) !== entry.sha256) {
      throw new Error('Preservation snapshot changed: ' + entry.path);
    }
  }
  for (const entry of manifest.protected_sources) {
    const bytes = readFileSync(join(root, entry.path));
    if (sha256(bytes) !== entry.sha256) throw new Error('Protected source changed: ' + entry.path);
  }
  return manifest;
}

export function preparePublic({ root = PROJECT_ROOT, output = join(root, 'public') } = {}) {
  const manifest = verifySnapshots(root);
  mkdirSync(output, { recursive: true });
  const assets = join(root, 'assets');
  if (!existsSync(assets)) throw new Error('Missing editable assets directory');
  cpSync(assets, join(output, 'assets'), { recursive: true, force: true });
  for (const entry of manifest.snapshot_files) {
    const target = join(output, entry.path);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(join(root, 'preserved/deployed', entry.path), target, { force: true });
    if (sha256(readFileSync(target)) !== entry.sha256) {
      throw new Error('Prepared compatibility bytes differ: ' + entry.path);
    }
  }
  for (const name of ['favicon.svg', 'favicon.ico']) {
    const original = join(output, 'assets/img/favicons', name);
    if (existsSync(original)) cpSync(original, join(output, name));
  }
  return {
    output,
    preservedFiles: manifest.snapshot_files.length,
    sourceAssetsBaseline: manifest.original_assets_provenance.length,
    provenanceCommit: manifest.source.commit,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const index = process.argv.indexOf('--output');
    const output = index >= 0 ? resolve(process.argv[index + 1]) : undefined;
    console.log(JSON.stringify(preparePublic({ output }), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
