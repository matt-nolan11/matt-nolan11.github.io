# Content Layout System

Use `ModularSection` to compose pages from columns. Layout logic is generic; there’s no special “cover” mode.

## Column types
- content: rich MDX content
- image: single image with optional caption
- gallery: carousel (ProjectGallery)
- model: 3D/AR model (ModelViewer)
- summary: project summary block with metadata/metrics

## Two-column widths
- Provide `width` as percentage on each column (numbers sum to ~100), or a `layout` string like `60%|40%`.
- If omitted, columns split evenly.

## Image columns
Preferred props: `src`, `alt?`, `caption?`. Legacy props `image`, `imageAlt`, `imageCaption` still work.

## Gallery columns
Pass `gallery` (array of { src, alt?, caption? }) and optional `galleryOptions`:
- `autoplay` (boolean), `autoplayInterval` (ms)
- `showThumbnails` (boolean)
- `loop` (boolean)

## Model columns
Pass `modelSrc`, optional `modelAlt`, and `modelOptions` forwarded to `ModelViewer`.

## Examples
```mdx
<ModularSection columns={[
  { type: 'gallery', width: 60, gallery, galleryOptions: { autoplay: true } },
  { type: 'summary', width: 40, summaryTitle: 'Project Y', startDate: '2025-02', status: 'completed' }
]} />
```
