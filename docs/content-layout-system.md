# Content Layout System

Use `ModularSection` to compose pages from columns. Layout logic is generic; there’s no special “cover” mode.

## Column types
- content: rich MDX content
- image: single image with optional caption
- gallery: carousel (ProjectGallery)
- model: 3D/AR model (ModelViewer)
- video: YouTube embed (YouTube.astro)
- summary: project summary block with metadata/metrics
- stack: two or more of the above stacked vertically in one column

## Two-column widths
- Provide `width` as percentage on each column (numbers sum to ~100), or a `layout` string like `60%|40%`.
- If omitted, columns split evenly.

## Stack columns
A column holds one block. To put several blocks in the same column, use
`type: 'stack'` with an `items` array — each item is an ordinary column
definition and takes the same props it would at the top level.

Optional `stackGap` (CSS length, default `1.5rem`) sets the spacing between items.

```mdx
{
  type: 'stack',
  width: 50,
  stackGap: '1rem',
  items: [
    { type: 'video', videoId: 'abc123', videoTitle: 'Demo' },
    { type: 'gallery', gallery, galleryOptions: { autoplayInterval: 8000 } },
  ]
}
```

## Automatic height balancing
Two-column sections balance their own heights at runtime: the client sweeps
candidate splits, measures both columns, and applies the one where the heights
match most closely. This runs per visitor, so the split adapts to whatever
screen width they're on.

- The authored `width` is the seed. It still drives SSR, no-JS and mobile, and
  is kept as-is if it's already within 8px of optimal.
- `autoBalance={false}` opts a section out.
- `balanceRange={[30, 70]}` clamps how far a column may move.
- Only applies to 2-column sections at >=1024px, where the grid is side by side.

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
