# AI contributor guide for this repo

This is an Astro 5 site with Tailwind/DaisyUI and a few React islands. Content is file-based (Markdown/MDX) with strict schemas and co-located assets.

## Big picture
- Astro + Vite; React used sparingly for islands (`src/components/ModelViewer.tsx`, `ProjectGallery.tsx`).
- Styling: Tailwind v4 + DaisyUI themes. Default dark theme `business`, light `corporate`.
- Content: `src/content/config.ts` defines Zod schemas for `posts` and `projects` and enforces `image()` types.
- Routing: file-based under `src/pages/**`; projects rendered by `src/pages/projects/[slug].astro`.
- Versions: project folders can include `v1.mdx`, `v2.mdx`, etc. Only `index.mdx` is routable; versions are referenced in-page.

## Key files and patterns
- Schema: `src/content/config.ts` — read before changing frontmatter. In MDX, import assets (e.g., `import cover from './images/cover.jpg'`).
- Projects route: `src/pages/projects/[slug].astro` renders the MDX `<Content />` of `index.mdx` and appends “Related Content” via `getRelatedContent` (`src/utils/tagUtils.ts`).
- Modular content: `src/components/ModularSection.astro` accepts `columns` with types: `content | image | gallery | model | video | summary | stack`. Layout is generic; two-column sections use unified width logic and class names. Image columns accept `src/alt/caption` or legacy `image/imageAlt/imageCaption`. A `stack` column takes `items: [...]` to render several blocks in one column. Two-column sections auto-balance their heights client-side; the authored `width` is the seed (`autoBalance={false}` opts out).
- 3D/AR: `src/components/ModelViewer.tsx` wraps `@google/model-viewer` (responsive camera, AR). Hydrates early (`client:load`) and dynamically imports on mount. `.glb` allowed via `assetsInclude` in `astro.config.mjs`.
- Theme: `src/scripts/themeController.ts` syncs `.theme-controller` checkboxes + `localStorage.theme` (tests: `__tests__/themeController.test.ts`).
- Layout/SEO: `src/layouts/Layout.astro` sets theme early, uses `astro-seo`, embeds JSON-LD.
 - Gallery styles: `src/components/ProjectGallery.tsx` keeps logic only; all CSS lives in `src/styles/global.css` under `.project-gallery`.

## Conventions
- Co-locate assets with content:
  - Projects: `src/content/projects/<slug>/index.mdx` with `images/` and `3Dmodels/`.
  - Posts: `src/content/posts/<slug>/index.mdx` similarly.
- Import assets in MDX and reference variables to satisfy `image()` schema and enable optimization.
- Only `index.mdx` becomes a route for projects; versions live alongside and are used by components.
- Prefer `ModularSection` for complex layouts; examples in `docs/content-layout-system.md` and `docs/quick-reference.md`.
- For authoring walkthroughs and examples, see `docs/authoring-guide.md`.

## Dev/build/test
- Dev: `npm run dev` (LAN via `--host`). For AR tests, run over HTTPS (Vite basic-ssl plugin is configured).
- Build: `npm run build` → `dist/`; Preview: `npm run preview`.
- Test: `npm test` (Vitest + jsdom). DOM tests use `@vitest-environment jsdom`.
- CI: `.github/workflows/deploy.yml` builds with Node 22 and deploys to GitHub Pages.
- Performance: Vite `chunkSizeWarningLimit` is raised in `astro.config.mjs` to account for `@google/model-viewer` bundle size.

## AR and assets
- AR requires HTTPS + compatible device. For quick checks, serve `public/ar-test.html` over HTTPS.
- Prefer `.glb` for models; compress images; keep assets near MDX for import-based optimization.

## Footguns
- Don’t use raw string image paths where schema expects `image()`; import files.
- Don’t try to route `v1.mdx`/`v2.mdx`; only `index.mdx` is included by `[slug].astro`.
- Keep theme values aligned to `themeController.ts` (`business`/`corporate`) so toggles stay in sync.
