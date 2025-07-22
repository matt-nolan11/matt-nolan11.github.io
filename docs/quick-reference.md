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

title: "Project Name" 
description: "Project description"
cover: "./cover.png"
startDate: "2024-01"
status: "completed"  # completed | in-progress | planned

### Projects (Portfolio)
```yaml
---
title: "Project Name" 
description: "Project description"
cover: "./cover.png"
startDate: "2024-01"
status: "completed"  # completed | in-progress | planned
featured: true                # Show in homepage featured section
featuredOrder: 2              # (Optional) 1-based manual order in featured section (see below)
tags: ["robotics", "arduino"]
githubUrl: "https://github.com/user/repo"
---
Project description...
```

**Featured Project Ordering:**
- Set `featured: true` to include in homepage featured section.
- Optionally set `featuredOrder: N` (1-based, e.g., 1 for first, 2 for second, up to 6).
- Gaps in ordering are allowed (e.g., 1 and 3, with 2 filled by another featured/recent project).
- Duplicate or out-of-bounds `featuredOrder` values (not 1–6) will throw a build error.
- Remaining slots are filled by other featured or recent projects, sorted by date.

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
- **`model`**: Interactive 3D model viewer
- **`sections`**: Nested sections (unlimited depth)

### Gallery Options
```yaml
galleryOptions:
  size: "medium"        # small|medium|large|full or 200-1200px
  autoplay: false
  autoplayInterval: 4000
  showThumbnails: true  # Shows thumbnail navigation strip
```

**Recent Gallery Improvements:**
- Thumbnail navigation replaces indicator dots for better UX
- Smart autoplay that only resumes if previously active
- Optimized event handlers and reduced code complexity
- Enhanced accessibility and keyboard navigation
- Better focus management and visual feedback


### Model Options
```yaml
- type: "model"
  title: "3D Model"
  modelSrc: "./model.glb"        # GLB/GLTF model file
  alt: "Description of 3D model"
  poster: "./preview.jpg"        # Loading poster image
  caption: "Model description"
  modelOptions:
    autoRotate: false            # Enable automatic rotation (default: false)
    cameraControls: true         # Allow user camera control (default: true)
    ar: false                    # Enable AR viewing on supported devices (default: false)
    size: "medium"               # Preset size ('small', 'medium', 'large', 'full') or pixel width
    exposureCompensation: 1      # Lighting brightness adjustment (default: 1)
    shadowIntensity: 1           # Shadow strength (default: 1)
    shadowSoftness: 1            # Shadow blur amount (default: 1)
    interactionPrompt: "auto"    # When to show interaction hints ('auto', 'when-focused', 'none')
    loading: "lazy"              # Loading strategy ('auto', 'lazy', 'eager')
    rotationPerSecond: "20deg"   # Auto-rotation speed (e.g., '20deg', '15deg')
    autoRotateDelay: 3000        # Delay before auto-rotation starts in ms (default: 3000)
```

**Model Viewer Features:**
- **Interactive Controls**: Mouse/touch orbit, zoom, and pan
- **Auto-rotation**: Optional automatic model rotation (`autoRotate`)
- **AR Support**: View models in augmented reality on mobile (AR button appears when supported; requires HTTPS and compatible device/browser)
- **Progressive Loading**: Poster images while models load (`poster`)
- **Environmental Lighting**: Realistic lighting and shadows (`exposureCompensation`, `shadowIntensity`, `shadowSoftness`)
- **Responsive Sizing**: Adapts to container size and device (`size`)
- **Accessibility**: Screen reader support and keyboard navigation
- **File Formats**: Supports GLTF (.gltf) and GLB (.glb) 3D models
- **Performance Optimizations**: Hardware acceleration, adaptive quality, optimized shadows, CSS transforms, and will-change for smooth animation

**Performance Tips:**
- Lower `rotationPerSecond` or `shadowIntensity` for smoother performance
- Use `loading: eager` for small models to avoid loading delays
- Keep models under 5MB for best results

**AR Support Notes:**
- AR button appears automatically when supported
- Requires mobile device with ARCore/ARKit
- Needs HTTPS connection to function
- Only works on compatible browsers (Chrome, Safari)
- Shows helpful tooltips when AR is unavailable

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

## ProjectGallery Component

The gallery component has been recently optimized for better performance and user experience:

### Key Features
- **Thumbnail Navigation**: Primary navigation method with visual highlights
- **Smart Autoplay**: Intelligently resumes only when appropriate
- **Touch-Friendly**: Optimized swipe gestures and mobile interactions
- **Keyboard Accessible**: Full keyboard navigation support
- **Performance Optimized**: Reduced code complexity and better memoization

### Navigation Methods
- **Thumbnails**: Click/tap thumbnails for direct navigation
- **Arrows**: Hover to show navigation arrows
- **Keyboard**: `←/→` to navigate, `Space` to play/pause, `Home/End` for first/last
- **Touch**: Swipe gestures on mobile devices
- **Autoplay**: Optional automatic slideshow with smart pause/resume

### Architecture Improvements (Recent)
- Removed redundant indicator dots (thumbnails serve this purpose)
- Consolidated repetitive autoplay logic into utility functions
- Optimized event handlers for better performance
- Enhanced focus management for accessibility
- Reduced component size by ~25% while maintaining functionality

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
