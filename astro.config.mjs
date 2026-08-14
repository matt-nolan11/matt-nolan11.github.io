// @ts-check
import { defineConfig } from 'astro/config';


import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import astroExpressiveCode from 'astro-expressive-code';
import pagefind from 'astro-pagefind';
import basicSsl from '@vitejs/plugin-basic-ssl';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeExternalLinks from 'rehype-external-links';
import remarkUnderConstruction from './src/plugins/remark-under-construction.mjs';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';


const expressiveCode = astroExpressiveCode({
    // You can set configuration options here
    themes: ['github-dark'],
    styleOverrides: {
      // You can also override styles
      borderRadius: '0.5rem',
      frames: {
        shadowColor: '#124',
      },
    },
  })

// https://astro.build/config
export default defineConfig({
  site: 'https://matt-nolan11.github.io',
  vite: {
    plugins: [
      tailwindcss(),
      basicSsl(),
    ],
    build: {
      chunkSizeWarningLimit: 1500,
    },
    assetsInclude: ['**/*.glb', '**/*.gltf'],
    optimizeDeps: {
      // ModelViewer reaches @google/model-viewer through a dynamic import()
      // inside a client:load island, which Vite's startup scanner does not
      // see. Without this it is only discovered when a page first requests it,
      // and the resulting re-optimisation bumps the dep hash and kills that
      // very request ("Failed to fetch dynamically imported module").
      include: ['@google/model-viewer'],
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkUnderConstruction],
      rehypePlugins: [
        rehypeKatex,
        // Open external links in a new tab. `rel` must be set explicitly —
        // the plugin defaults to ['nofollow'], and `noopener` is what keeps
        // the new tab from getting a window.opener handle on this page.
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      ],
    }),
  },
  integrations: [sitemap(), react(), pagefind(), expressiveCode, mdx()]
});