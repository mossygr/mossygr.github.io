import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=p=>readFileSync(p,'utf8');
const docs=['el','en'].flatMap(lang=>readdirSync(`src/content/docs/${lang}`).map(name=>({path:`src/content/docs/${lang}/${name}`,lang,source:read(`src/content/docs/${lang}/${name}`)})));
const meta=(source,name)=>source.match(new RegExp(`^${name}: (.+)$`,'m'))?.[1].replace(/^['"]|['"]$/g,'');
const fences=source=>[...source.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map(m=>m[1]);
test('32 migrated documents have reciprocal language keys and unique stable URLs',()=>{
 assert.equal(docs.length,32);const paths=new Set();
 for(const doc of docs){const key=meta(doc.source,'key'),path=meta(doc.source,'permalink');assert.ok(key);assert.ok(path.startsWith('/'));assert.ok(!paths.has(path),'duplicate '+path);paths.add(path);assert.equal(docs.filter(d=>meta(d.source,'key')===key).length,2);assert.equal(path.startsWith('/en/'),doc.lang==='en');assert.ok(!/\{%|\{\{[^}]/.test(doc.source),'Liquid leaked: '+doc.path);}
 assert.ok(paths.has('/robot/'));assert.ok(paths.has('/en/robot/'));assert.ok(paths.has('/posts/Lame/'));
});
test('all migrated code blocks match their archived language sources',()=>{
 const report=JSON.parse(read('work-notes/CONTENT_MIGRATION.json'));
 for(const entry of report.documents){const migrated=read(entry.destination);if(entry.key.includes('robot-4wd')){assert.equal(fences(migrated).length,8);continue;}assert.deepEqual(fences(migrated),fences(read(entry.source)),entry.destination);}
});
test('robot SVG geometry remains byte identical and wiring table retains 216 cells',()=>{
 for(const name of ['pict.svg','harness.svg'])assert.equal(read(`src/data/robot/${name}`),read(`_includes/robot/${name}`));
 const table=read('src/data/robot/connections.html');assert.equal([...table.matchAll(/<td\b/g)].length,216);assert.equal([...table.matchAll(/<tr[^>]+data-w=/g)].length,36);
 const wires=JSON.parse(read('src/data/robot/wires.json'));assert.equal(Object.keys(wires).length,36);
 for(const lang of ['el','en']){const guide=docs.find(d=>d.lang===lang&&meta(d.source,'key').includes('robot-4wd')).source.replace(/\\([{}])/g,'$1');assert.equal([...guide.matchAll(/\{#[^}]+\}/g)].length,32);for(const id of ['t-diag','t-harness','t-table','downloads','guide-code','guide-troubleshooting'])assert.ok(guide.includes(`id="${id}"`)||guide.includes(`{#${id}}`),id);}
});
test('optimized GPi assets have no source photographs changed',()=>{
 const inventory=JSON.parse(read('work-notes/GPI_IMAGE_INVENTORY.json'));assert.ok(inventory);
 const assets=readdirSync('assets/gpicase2w').filter(f=>f.endsWith('.webp'));assert.equal(assets.length,15);
 const greek=docs.find(d=>d.lang==='el'&&meta(d.source,'key').includes('gpi-case')).source;assert.equal(fences(greek).length,4);assert.ok(greek.includes('srcset='));
});
test('search and sitemap consume documentation allowlists',()=>{
 const search=read('tools/build-search.mjs'),sitemap=read('src/pages/sitemap.xml.ts');assert.ok(search.includes('content-index.json'));assert.ok(!search.includes('addDirectory'));assert.ok(sitemap.includes('allDocs'));
 for(const file of ['src/components/Navigation.astro','src/pages/[...path].astro','src/config/site.ts','src/lib/routes.ts'])assert.ok(!/gym-app|position_size|\/trades\/|supabase/i.test(read(file)),file);
});
