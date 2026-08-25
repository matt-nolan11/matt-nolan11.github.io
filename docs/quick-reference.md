# Quick Reference

## Frontmatter
- Import assets and assign to fields using `image()` schema inputs.

## ModularSection
- Column types: content | image | gallery | model | video | summary | stack
- Two-col widths: set `width` per column or omit for equal split.
- Image column: use `src/alt/caption` or legacy `image/imageAlt/imageCaption`.
- Stack column: `{ type: 'stack', items: [...] }` puts several blocks in one
  column. Items take the same props they would as columns. `stackGap` optional.
- Heights auto-balance at runtime for 2-column sections (>=1024px). `width` is
  the seed; `autoBalance={false}` opts out, `balanceRange` clamps the search.
- `stackOrder` re-orders the columns below 1024px only: `"reverse"`, or 1-based
  column numbers top to bottom, e.g. `stackOrder={[2, 1]}`. CSS-only.

## UnderConstruction
- `<UnderConstruction />` truncates the file: everything below it is dropped at
  build time (not hidden), so it never reaches the HTML or the search index.
- Props: `title`, `message`, `class`. Children override `message`.
- Keep imports above the marker — ones below are dropped too.

## ProjectGallery
- Props: images, autoplay, autoplayInterval, showThumbnails, loop
- Set via `galleryOptions` on the column (or stack item): e.g.
  `galleryOptions: { autoplayInterval: 8000, showThumbnails: false }`
- Defaults are content-derived: autoplay on if >1 image, thumbnails if >2,
  interval 5000ms.
- CSS lives under `.project-gallery` in `src/styles/global.css`.

## ModelViewer
- `modelTitle` = heading above; `modelCaption` = small centered text below.
  Both fall back to the column's `title` / `caption`.
- Hydrates on `client:load`; dynamic import on mount.
- Use `.glb` models; test AR via `public/ar-test.html` over HTTPS.
- Draco-compress every model before committing — raw exports are 10-20x larger
  and ship to visitors in full. See `docs/3d-model-compression.md`.

## Analytics
- Cloudflare Web Analytics, cookieless, no consent banner needed.
- Set the token in `src/config/analytics.ts`; empty = fully disabled.
- Production-only, so `astro dev` never reports itself. See `docs/analytics.md`.

## Theming
- `business` (dark) / `corporate` (light). Managed by `src/scripts/themeController.ts`.
