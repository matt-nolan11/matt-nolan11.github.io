// @ts-check
import { defineConfig } from 'astro/config';

// Statically imported: `astro:build:done` runs after Vite's module runner has
// closed, so a dynamic import() inside the hook throws "module runner has been
// closed".
import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, extname, relative } from 'node:path';


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

/**
 * Drop emitted images that nothing in the built site links to.
 *
 * Astro emits the original file for every ESM-imported image in `src/`, so that
 * `ImageMetadata.src` is always a real URL — whether or not anything ends up
 * pointing at it. Since galleries and `<Image>` both render optimised `.webp`
 * variants, those originals are referenced by nothing and still accounted for
 * ~188 MB of a 249 MB `dist/`. They are never downloaded by a visitor, but they
 * are uploaded on every deploy and count against the Pages size limit.
 *
 * A filename is the safest possible probe: every URL form (plain, escaped in
 * JSON, inside a srcset) still contains it verbatim, so a file whose name
 * appears nowhere in the text output is genuinely unreachable. Anything that
 * *is* referenced is left alone, including originals kept deliberately.
 */
function pruneUnreferencedImages() {
  return {
    name: 'prune-unreferenced-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const TEXT = new Set(['.html', '.js', '.mjs', '.css', '.json', '.xml', '.txt', '.svg']);
        const IMAGE = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

        const walk = async (d) => {
          const out = [];
          for (const entry of await readdir(d, { withFileTypes: true })) {
            const p = join(d, entry.name);
            if (entry.isDirectory()) out.push(...(await walk(p)));
            else out.push(p);
          }
          return out;
        };

        const files = await walk(root);
        const haystack = (
          await Promise.all(
            files
              .filter((f) => TEXT.has(extname(f).toLowerCase()))
              .map((f) => readFile(f, 'utf8').catch(() => ''))
          )
        ).join('\n');

        const candidates = files.filter(
          (f) => IMAGE.has(extname(f).toLowerCase()) && relative(root, f).split(/[\\/]/)[0] === '_astro'
        );
        const orphans = candidates.filter((f) => !haystack.includes(f.split(/[\\/]/).pop()));

        // If nothing at all matched, the scan is broken rather than the site
        // being empty — deleting every image would be the wrong conclusion.
        if (candidates.length > 0 && orphans.length === candidates.length) {
          logger.warn('every image looked unreferenced; skipping prune as a precaution');
          return;
        }

        let freed = 0;
        for (const f of orphans) {
          freed += (await stat(f)).size;
          await unlink(f);
        }
        if (orphans.length) {
          logger.info(`pruned ${orphans.length} unreferenced image(s), ${(freed / 1048576).toFixed(1)} MB`);
        }
      },
    },
  };
}

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
  // Prune last: it reads the finished output, so it must run after pagefind has
  // written its index and every other integration has emitted its files.
  integrations: [sitemap(), react(), pagefind(), expressiveCode, mdx(), pruneUnreferencedImages()]
});