# Authoring Guide

This site uses Astro 5 with Tailwind/DaisyUI and a few React islands. Content is file-based (MDX) with strict schemas and co-located assets.

## Content types and locations
- Projects: `src/content/projects/<slug>/index.mdx`
  - Optional versions (not routable): `v1.mdx`, `v2.mdx`, ...
  - Co-locate `images/` and `3Dmodels/`
- Posts: `src/content/posts/<slug>/index.mdx`

## Frontmatter schema essentials
Defined in `src/content/config.ts`.

Common fields
- title (string)
- description (<=160 chars)
- cover: import an image and assign to cover
- date (posts) or startDate/endDate (projects)
- tags: []
- draft: boolean

Project-only
- status: "completed" | "in-progress" | "planned"
- featured, featuredOrder
- Optional versions header fields: headerTitle, tabTitle, headerDescription
  - For version files (e.g., v2.mdx), `title` is optional. Tabs will use `tabTitle` or `version` as the label, and internal logic falls back to filename if needed.

## Import assets (important)
In MDX, import images/files and use the variable, not a raw string path. This satisfies the `image()` schema and enables optimization.

Example:

```mdx
import cover from './images/cover.jpg'

---
title: My Project
description: Short summary
cover: {cover}
startDate: 2025-05
---
```

## Modular layouts with `ModularSection`
Use the `columns` array to compose sections. Types: `content`, `image`, `gallery`, `model`, `summary`, `video`, `stack`.

Example (two columns):

```mdx
import ModularSection from '../../components/ModularSection.astro'

<ModularSection columns={[
  {
    type: 'gallery',
    gallery: [
      { src: image1, alt: 'Front', caption: 'Front view' },
      { src: image2, alt: 'Back' },
    ],
    galleryOptions: { autoplay: true, autoplayInterval: 5000, showThumbnails: true },
  },
  {
    type: 'summary',
    summaryTitle: 'Project X',
    summaryDescription: 'What, why, how',
    startDate: '2025-05',
    status: 'completed',
    tags: ['robotics', 'cad'],
  }
]} />
```

Notes
- Layouts are unified. Two-column widths can be driven by `galleryOptions.layout` or `layout` strings like `60%` or `3:2`, else equal split.
- Image columns accept either `src/alt/caption` (preferred) or legacy `image/imageAlt/imageCaption`.
- Two-column sections auto-balance their heights per visitor; `width` acts as the seed. See `docs/content-layout-system.md`.
- `columnGap` sets the spacing between columns, default `1.5rem`, e.g.
  `<ModularSection columnGap="3rem" columns={[...]} />`. Any CSS length works.
  Below 1024px the grid collapses to one column and it becomes the vertical
  spacing between them. The per-column `stackGap` is the equivalent inside a
  `type: 'stack'` column. Changing the gap does not disturb the auto-balancer,
  which solves in `fr` units after the gap is subtracted.
- `stackOrder` changes the order the columns stack in below 1024px. See below.

### Stack order on narrow screens
Below 1024px every layout leaves its side-by-side arrangement, and columns
stack in the order they were authored. `stackOrder` overrides that order
without touching the desktop layout:

```mdx
{/* wide: gallery left, summary right — narrow: summary on top */}
<ModularSection stackOrder="reverse" columns={[
  { type: 'gallery', gallery: [...] },
  { type: 'summary', summaryTitle: 'Project X' },
]} />
```

- `stackOrder="reverse"` stacks the columns back to front.
- `stackOrder={[2, 1]}` lists **1-based column numbers top to bottom**, so this
  puts column 2 above column 1. Three and four column sections work the same
  way: `stackOrder={[3, 1, 2]}`.
- Every column must appear exactly once, or the build fails with a message
  naming the problem.
- It is CSS-only (`order`), so nothing else moves: the desktop arrangement, the
  source order screen readers and search indexing read, and the two-column
  height balancer are all unaffected.
- For 3- and 4-column sections the new order also applies to the two-across
  `md` grid (768–1023px), since that is already a partial stack.
- Ordering *inside* a `type: 'stack'` column is just the order of `items` —
  those never reflow, so there is nothing to flip.

### Action buttons
A summary block ends with a row of buttons, one per entry in `links`. The same
array is valid in **project frontmatter**, where it drives the buttons on
project cards — so a link written once looks the same in the grid and on the
page (cards just draw it smaller).

```mdx
{
  type: 'summary',
  summaryTitle: 'Project X',
  links: [
    { url: 'https://github.com/you/project-x', label: 'GitHub', color: 'neutral' },
    { url: 'https://you.github.io/project-x/', label: 'Live Demo' },
    { url: 'https://.../bom.csv', label: 'Bill of Materials', color: 'green', icon: 'download' },
    { url: 'https://youtu.be/xxxx', label: 'Build Video', color: 'red' },
  ],
}
```

- `label` is required; `color` and `icon` are optional.
- `color`: `blue` (default), `green`, `orange`, `red`, `yellow`, `neutral`
  (outlined — what the GitHub button has always used).
- `icon`: `external`, `download`, `document`, `link`, `code`, `cube`, `cart`,
  `play`, `github`, `youtube`, `none`.
- **Omit `icon` and it is guessed from the URL**: `github.com` links get the
  GitHub logo, YouTube links the play button, everything else the external-link
  arrow. Name one only to override that. (`*.github.io` is a Pages site, not
  GitHub, so it gets the arrow.)
- Buttons render in authored order. There are no dedicated fields for repo or
  demo links — `githubUrl` and `liveUrl` were removed, so a GitHub button is
  just a `links` entry like any other (and picks up its logo automatically).

### Stacking blocks in one column
A column renders a single block. Use `type: 'stack'` to put several in the same
column — each entry in `items` is an ordinary column definition and accepts the
same props it would at the top level (so `galleryOptions`, `videoCaption`, etc.
all work unchanged). `stackGap` sets the spacing, default `1.5rem`.

```mdx
<ModularSection columns={[
  {
    type: 'stack',
    width: 50,
    items: [
      { type: 'video', videoId: 'dQw4w9WgXcQ', videoTitle: 'Build walkthrough' },
      {
        type: 'gallery',
        gallery: [{ src: image1, alt: 'Machining' }, { src: image2, alt: 'Assembly' }],
        galleryOptions: { autoplayInterval: 8000 },
      },
    ],
  },
  { type: 'content', width: 50, title: 'Details', content: `...` },
]} />
```

### YouTube video embeds
Use a `video` column to embed a privacy-enhanced YouTube `<iframe>` via the `YouTube.astro` component.

Props on the column
- `videoId` (required): YouTube video ID (the part after `v=`, or after
  `/shorts/` — see below)
- `videoTitle`: accessible `<title>` for the iframe, **and** the caption drawn
  over the thumbnail. Omit it and no overlay is drawn.
- `videoAspect`: aspect ratio string like `16:9`, `4:3`, or `1:1` (default `16:9`)
- `videoStart`: start time in seconds
- `videoAutoplay`: boolean
- `videoMuted`: boolean (often required by browsers for autoplay)
- `videoControls`: show/hide player controls
- `videoCaption`: small caption below the video

Every one of these is prefixed `video`. A bare `aspect:` (or `title:`, `id:`) on
the column is not an error — it is silently ignored and you get the default.

#### Shorts and other vertical video
Shorts embed like any other video: take the ID out of the
`youtube.com/shorts/<id>` URL and set the aspect.

```mdx
{ type: 'video', width: 40, videoId: 'UaFP-7mlcT0', videoAspect: '9:16' }
```

Anything taller than it is wide gets handled automatically from there — the
embed caps its width so it can never exceed ~80% of viewport height, and centres
itself in the column, so a stacked phone or tablet layout does not hand over
several screenfuls to one video. It also switches to YouTube's original-aspect
thumbnail, which is sharp, instead of the 4:3 one with the blurred side fill.

Match `videoAspect` to the real frame rather than assuming `9:16`. Shorts are
commonly 9:16 but not always; if you see black bars down the sides, the source
is narrower and the ratio needs to say so.

Example:

```mdx
import ModularSection from '../../components/ModularSection.astro'

<ModularSection columns={[
  {
    type: 'video',
    width: 60,
    videoId: 'dQw4w9WgXcQ',
    videoTitle: 'Project X demo',
    videoAspect: '16:9',
    videoStart: 12,
    videoAutoplay: false,
    videoMuted: false,
    videoControls: true,
    videoCaption: 'Short demo clip with key behavior at 0:12.'
  },
  {
    type: 'content',
    width: 40,
    title: 'What to watch for',
    content: `Call out the interesting moments or technical details the viewer should look for.`
  }
]} />
```

## UnderConstruction (hold back unfinished content)
Marks the rest of a file as unfinished. Everything below the marker is removed
from the syntax tree at build time, so it is never rendered — not hidden.

```mdx
import UnderConstruction from '../../components/UnderConstruction.astro'

Finished content renders normally.

<UnderConstruction />

Anything below here never ships.
```

Props: `title`, `message`, `class`. Children override `message`:
`<UnderConstruction>Waiting on final photos.</UnderConstruction>`

Notes
- Put it at the top of a file for a whole page, or partway down to publish what
  is ready and hold back the rest. Works in `index.mdx`, version files and posts.
- Because the content is dropped rather than hidden, it stays out of the HTML
  source, out of the Pagefind search index, and its images are never built.
  A CSS-based approach would leak on all three counts.
- Keep imports at the top of the file — imports *below* the marker are dropped
  along with everything else.
- Only root-level markers count; one nested inside another element is ignored.
- Implemented by `src/plugins/remark-under-construction.mjs`, registered in
  `astro.config.mjs`.

## ProjectGallery (carousel)
Props
- `images`: [{ src, alt?, caption? }]
- `autoplay`: boolean (default false)
- `autoplayInterval`: ms (default 3000)
- `showThumbnails`: boolean (default true)
- `loop`: boolean (default true)

Behavior
- Sizes to the container with minimal chrome. Thumbnails wrap onto multiple rows rather than scrolling horizontally; the active one is ringed.
- Navigation is via the hover arrows, the thumbnails, or swipe. There are no keyboard shortcuts.
- Re-measures itself when its container resizes (the ModularSection height balancer changes column widths after mount).

Authoring tip: Keep aspect ratios similar for more stable heights. Captions render as a subtle bottom overlay.

## ModelViewer (3D/AR)
Import the `.glb` and pass the imported value, exactly like an image — a bare
string path is not processed by the bundler and 404s in the built site.

```mdx
import botModel from './3Dmodels/bot.glb'

<ModularSection columns={[
  {
    type: 'model',
    width: 50,
    modelSrc: botModel,
    modelAlt: 'Interactive 3D model of the robot',
    modelTitle: 'Drivetrain assembly',
    modelCaption: 'Drag to rotate • scroll to zoom',
    modelOptions: { cameraControls: true, autoRotate: true, ar: true },
  },
  { type: 'content', width: 50, content: `...` },
]} />
```

- `astro.config.mjs` lists `.glb`/`.gltf` in `vite.assetsInclude`, so the import
  resolves to a fingerprinted URL in `dist/_astro/`.
- Hydration: `client:load` for early readiness.
- Internals: dynamically imports `@google/model-viewer` on mount.
- The model file itself is `loading: 'lazy'` by default, so a large `.glb` is
  not fetched until it approaches the viewport.
- AR requires HTTPS and compatible devices.

- `modelTitle` (falls back to the column's `title`) renders a heading above the
  viewer. It uses the prose typography, so it matches a `###` or a content
  column's title beside it.
- `modelCaption` (falls back to the column's `caption`) renders small centered
  text below the viewer, same treatment as an image or gallery caption.
- Both appear in the loading and error states too, so the column does not shift
  when the model arrives.

Recommended options (in column `modelOptions`)
- `title` / `caption`: the same two, when using `ModelViewer` directly rather
  than through a column
- `cameraControls: true`, `autoRotate: false`
- `poster`: pre-rendered screenshot for perceived speed
- `interactionPrompt: 'auto' | 'when-focused' | 'none'`

## Theming
- Toggle in UI uses `.theme-controller` checkboxes. Values are `business` (dark) and `corporate` (light).
- Script: `src/scripts/themeController.ts` synchronizes state and persists to `localStorage`.

## Tags and related content
- Posts and projects use `tags`. Project detail pages append related content via `getRelatedContent`.

## Deployment (GitHub Pages)
- Build: `npm run build` → `dist/`
- Deployed via GitHub Pages (see `.github/workflows/deploy.yml`).

## Gotchas
- Always import images into frontmatter fields that use `image()`.
- Only `index.mdx` becomes a route for a project; `vX.mdx` files are not directly routable.
- Keep assets near their MDX for easy imports and image optimization.
