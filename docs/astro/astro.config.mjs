import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: `https://hibohiboo.github.io/`,
  base: 'odyssage',
  integrations: [mdx(), sitemap()],
});

// https://docs.astro.build/ja/recipes/bun/

