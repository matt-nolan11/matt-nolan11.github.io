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

## Content columns
A `title` renders as an unstyled `<h3>`, so it picks up the same prose styling
as a `###` written in MDX or inside the `content` string itself. Use `###` in
the content for sub-headings beneath it.

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

## Stack order on narrow screens
Below 1024px every column count collapses out of its side-by-side arrangement
and the columns stack in authored order. `stackOrder` on the section changes
that order:

- `stackOrder="reverse"` — back to front.
- `stackOrder={[2, 1]}` — 1-based column numbers listed top to bottom, so
  column 2 stacks above column 1. Each column must appear exactly once;
  anything else throws at build time.

```mdx
<ModularSection stackOrder={[2, 1]} columns={[
  { type: 'gallery', width: 60, gallery },
  { type: 'summary', width: 40, summaryTitle: 'Project X' },
]} />
```

Implemented as CSS `order` inside a `max-width: 1023.98px` media query, so the
DOM is untouched: desktop layout, source/reading order, and the height balancer
(which indexes columns by DOM position) all behave exactly as before. For 3- and
4-column sections the order also applies to the two-across `md` grid, which is
itself a partial stack.

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
- `aspectRatio` — `"16:9"`, `"4:3"`, or a number (width / height)

Without `aspectRatio` the shape is derived from the **widest** image in the set,
so one unusually wide photo reshapes the whole gallery and can leave it visibly
out of step with other galleries on the page. Set it explicitly to keep several
galleries consistent.

## Model columns
Pass `modelSrc`, optional `modelAlt`, and `modelOptions` forwarded to `ModelViewer`.
`modelSrc` must be an **imported** `.glb`/`.gltf`, not a string path — the same
rule as images. A raw path is not bundled and 404s in the built site.

`modelTitle` (or the column's `title`) renders a heading above the viewer, styled
like a `###` so it lines up with a content column's title in the same row.
`modelCaption` (or the column's `caption`) renders small centered text below it,
matching image and gallery captions.

## Examples
```mdx
<ModularSection columns={[
  { type: 'gallery', width: 60, gallery, galleryOptions: { autoplay: true } },
  { type: 'summary', width: 40, summaryTitle: 'Project Y', startDate: '2025-02', status: 'completed' }
]} />
```
