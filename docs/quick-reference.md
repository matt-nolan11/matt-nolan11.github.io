# Quick Reference

## Frontmatter
- Import assets and assign to fields using `image()` schema inputs.

## ModularSection
- Column types: content | image | gallery | model | summary
- Two-col widths: set `width` per column or omit for equal split.
- Image column: use `src/alt/caption` or legacy `image/imageAlt/imageCaption`.

## ProjectGallery
- Props: images, autoplay, autoplayInterval, showThumbnails, loop
- CSS lives under `.project-gallery` in `src/styles/global.css`.

## ModelViewer
- Hydrates on `client:load`; dynamic import on mount.
- Use `.glb` models; test AR via `public/ar-test.html` over HTTPS.

## Theming
- `business` (dark) / `corporate` (light). Managed by `src/scripts/themeController.ts`.
