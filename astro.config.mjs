import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import codeMeta from './tools/shiki-code-meta.mjs';
import explicitHeadings from './tools/remark-headings.mjs';
export default defineConfig({
  site: 'https://mossygr.github.io', output: 'static', trailingSlash: 'always',
  integrations: [mdx()],
  markdown: {
    processor: unified({ remarkPlugins: [explicitHeadings] }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-high-contrast' }, wrap: false, transformers: [codeMeta], langAlias: { terminal: 'shellscript', shell: 'shellscript', cmd: 'bat' } },
  },
});
