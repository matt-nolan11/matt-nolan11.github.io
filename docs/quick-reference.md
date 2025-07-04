# Content System Quick Reference

A quick reference guide for the Matt Nolan portfolio content system.

## Content Types

### Posts (Blog)
```yaml
---
title: "Post Title"
description: "SEO description"
cover: "./cover.png"
date: "2025-01-01"
tags: ["tag1", "tag2"]
---
Markdown content here...
```

### Projects (Portfolio)
```yaml
---
title: "Project Name" 
description: "Project description"
cover: "./cover.png"
startDate: "2024-01"
status: "completed"  # completed | in-progress | planned
featured: true
tags: ["robotics", "arduino"]
githubUrl: "https://github.com/user/repo"
---
Project description...
```

## Modular Sections

### Basic Layout
```yaml
sections:
  - columns:
    - type: "content"
      title: "Section Title"
      content: |
        Markdown content
    - type: "gallery"
      gallery:
        - src: "./image.png"
          alt: "Description"
```

### Column Types
- **`content`**: Markdown text with optional title
- **`gallery`**: Image carousel with options
- **`image`**: Single image with caption
- **`sections`**: Nested sections (unlimited depth)

### Gallery Options
```yaml
galleryOptions:
  size: "medium"        # small|medium|large|full or 200-1200px
  autoplay: false
  autoplayInterval: 4000
  showThumbnails: true
  showIndicators: true
```

## Project Versions

```yaml
versions:
  - version: "v2.0"
    title: "Version Name"
    description: "What changed"
    startDate: "2024-01"
    status: "completed"
    achievements:
      - "Key accomplishment"
    learnings:
      - "Lesson learned"
    gallery: [...]
    sections: [...]
```

## Layout Patterns

### Two Columns (50/50)
```yaml
sections:
  - columns:
    - type: "content"
      content: "Left column"
    - type: "gallery"  
      gallery: [...]
```

### Three Columns (33/33/33)
```yaml
sections:
  - columns:
    - type: "content"
      content: "Left"
    - type: "gallery"
      gallery: [...]
    - type: "content"
      content: "Right"
```

### Header Gallery
Replace cover image with carousel:
```yaml
---
title: "Project"
gallery:
  - src: "./hero1.png"
    alt: "Hero image 1"
  - src: "./hero2.png"
    alt: "Hero image 2"
---
```

## Responsive Behavior

- **Mobile**: All columns stack vertically
- **Tablet**: 2-column layouts maintained, 3+ may stack
- **Desktop**: Full multi-column layouts

## File Organization

```
src/content/
├── posts/
│   └── post-name/
│       ├── index.md
│       ├── cover.png
│       └── images/
└── projects/
    └── project-name/
        ├── index.md
        ├── cover.png
        └── images/
```

For detailed documentation, see `content-layout-system.md`.
