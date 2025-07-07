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
    autoRotate: false            # Automatic rotation
    cameraControls: true         # Mouse/touch controls
    ar: false                    # Augmented reality support
    size: "medium"               # small|medium|large|full or px
    exposureCompensation: 1      # Lighting adjustment
    shadowIntensity: 1           # Shadow strength
    shadowSoftness: 1            # Shadow blur amount
    interactionPrompt: "auto"    # auto|when-focused|none
    loading: "lazy"              # auto|lazy|eager
    rotationPerSecond: "20deg"   # Rotation speed (e.g., "15deg", "30deg")
    autoRotateDelay: 3000        # Delay before auto-rotation starts (ms)
```

**Model Features:**
- Interactive camera controls (orbit, zoom, pan)
- Support for GLTF/GLB 3D model formats
- Optional auto-rotation and animations
- Augmented Reality (AR) support for mobile devices
- Progressive loading with poster images
- Responsive sizing and accessibility
- Environmental lighting and shadow controls
- **Performance optimizations for smooth rotation**
- **Hardware acceleration and adaptive quality**

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
