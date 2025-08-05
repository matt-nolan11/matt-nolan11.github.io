# Matt Nolan's Portfolio - Copilot Instructions

Personal portfolio and blog built with Astro v5, focusing on robotics, engineering projects, and technical content.

## Architecture Overview

**Tech Stack**: Astro v5, React 19, TypeScript, TailwindCSS v4, DaisyUI v5, Vitest v3
**Content System**: Astro Content Collections with Zod schemas, supporting both `.md` and `.mdx` formats
**Styling**: Dark-first design using DaisyUI "business" (dark) ↔ "corporate" (light) themes
**Deployment**: GitHub Pages via automated workflow on main branch pushes

## Content Collections & Schema

**Two main collections** defined in `src/content/config.ts`:
- `posts/` - Blog entries with date-based organization  
- `projects/` - Engineering projects with versioning support

**Key schema features**:
- Flexible column types: `content`, `gallery`, `image`, `model`, `sections` (nested)
- Competition tracking with placement, records, and event links
- Custom metrics with dynamic fields for technical specs
- Version support for project evolution tracking
- Gallery optimization with WebP conversion and responsive sizing

## Modular Content System

**Core component**: `ModularSection.astro` - renders flexible multi-column layouts

**Two syntaxes supported**:
```yaml
# YAML frontmatter (traditional .md)
sections:
  - columns:
    - type: "content"
      content: "Markdown content..."
    - type: "model" 
      modelSrc: "./robot.glb"
```

```mdx
<!-- MDX embedded components (preferred) -->
<ModularSection columns={[
  { type: "content", content: "**Rich** markdown..." },
  { type: "model", modelSrc: robotModel, modelOptions: { autoRotate: true } }
]} />
```

**Column width system**: Uses CSS Grid with percentage-based widths (sum to 100%)

## Asset Management

**Co-located organization**:
```
src/content/projects/project-name/
├── index.mdx
├── images/           # Astro-optimized images
├── 3Dmodels/        # .glb files for ModelViewer
└── cover.png        # Project card thumbnail
```

**Asset handling**:
- Images: Automatic WebP optimization via Astro's `image()` schema
- 3D Models: `.glb` format, imported as ES modules in MDX
- Gallery images: Optimized at 800x600px, 80% quality

## Component Architecture

**Astro components** (`.astro`): Static content, layouts, theme system
**React components** (`.tsx`): Interactive elements requiring state

**Key components**:
- `ModelViewer.tsx` - Google Model Viewer wrapper with camera controls, AR support
- `ProjectGallery.tsx` - Touch-friendly carousel with thumbnails  
- `TagList.tsx` - Unified tag filtering across posts/projects
- `ThemeToggle.astro` - DaisyUI theme switching with persistence

## Development Workflow

**Essential commands**:
```bash
npm run dev          # Local dev server with --host flag
npm run build        # Production build
npm run test         # Vitest unit tests
```

**Key patterns**:
- Always update `src/content/config.ts` schema before adding new frontmatter fields
- Use `semantic_search` and `read_file` tools to understand existing patterns before changes
- Test components in both dark/light themes using DaisyUI theme toggle
- Validate changes with Astro's strict TypeScript checking

## Content Creation Patterns

**Project frontmatter essentials**:
```yaml
title: "Project Name"
description: "SEO-optimized description (max 160 chars)"
startDate: "2024-01"    # YYYY-MM format for month precision
status: "completed"     # completed | in-progress | planned
tags: ["tag1", "tag2"]  # Unified vocabulary across collections
cover: "./images/cover.jpg"
```

**Competition tracking**:
```yaml
competitions:
  - name: "Event Name"
    date: "2024-01"
    placement: 1
    record: "5-0"
    url: "/posts/event-recap/"  # Optional link to coverage
```

**3D model integration**:
```mdx
import robotModel from './3Dmodels/robot.glb';

<ModularSection columns={[{
  type: "model",
  modelSrc: robotModel,
  modelOptions: {
    autoRotate: true,
    cameraOrbit: "0deg 75deg 0.8m",
    ar: true
  }
}]} />
```

## Testing & Quality

**Testing framework**: Vitest v3 for React component testing
**Type safety**: Strict TypeScript + Zod schema validation
**Performance**: Astro's static generation + image optimization
**SEO**: astro-seo integration with automatic meta generation

**Testing focus areas**:
- React component functionality (galleries, model viewer)
- Responsive behavior across breakpoints  
- Theme compatibility (business/corporate)
- Content schema validation

## Deployment & CI

**Automated deployment**: GitHub Actions workflow triggers on main branch
**Build process**: Node.js 22, npm ci, astro build
**Asset handling**: Static files in `public/`, optimized assets in `dist/`
**Branch strategy**: Direct commits to main trigger immediate deployment

## Common Patterns

**MDX imports**: Always import components at file top for custom layouts
**Error handling**: Check for build errors after schema changes using get_errors tool
**Content co-location**: Keep assets next to content files for maintainability
**Responsive design**: Mobile-first with Tailwind breakpoints, test across devices
**Theme consistency**: Ensure all new components work in both dark/light modes
