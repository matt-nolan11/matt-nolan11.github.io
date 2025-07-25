# Content System Quick Reference

A comprehensive reference for Matt Nolan's portfolio content system, covering both Markdown (.md) and MDX (.mdx) formats.

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
```

### Projects (Portfolio)
```yaml
---
title: "Project Name"
description: "Project description" 
cover: "./cover.png"
startDate: "2024-01"
status: "completed"  # completed | in-progress | planned
featured: true       # Show in homepage featured section
featuredOrder: 2     # Optional 1-6 manual order in featured section
tags: ["robotics", "arduino"]
githubUrl: "https://github.com/user/repo"
---
```

**Featured Project Ordering:**
- Set `featured: true` to include in homepage featured section
- Optionally set `featuredOrder: N` (1-6, gaps allowed)
- Remaining slots filled by other featured/recent projects by date

### Competition & Metrics System

**Project Metrics:**
```yaml
metrics:
  sectionTitle: "Robot Specifications"  # Custom title
  customFields:
    - label: "Fighting Weight"
      value: "3.0 lbs"
    - label: "Weapon Tip Speed" 
      value: "8,000+ RPM"
    - label: "Design Iterations"
      value: 4
```

**Competition History:**
```yaml
competitions:
  - name: "RCL Nationals 2025"
    date: "2025-01" 
    placement: "Quarterfinals"  # Number (1,2,3) or string
    record: "3-1"               # Optional win-loss record
    url: "/posts/event-recap/"  # Optional link to recap
```

**Competition Statistics:**
```yaml
competitionStats:
  sectionTitle: "Combat Record"
  customStats:
    - label: "Fight Record"
      value: "12-4"
    - label: "Success Rate"
      value: "75%"
      highlight: true
      color: "success"
```

**Display Options:**
```yaml
competitionsOptions:
  sectionTitle: "Tournament History"
  maxDisplay: 0  # 0 = show all, N = limit to N entries
```

## Content Formats

### Markdown (.md) Files
Traditional markdown with YAML frontmatter and sections:
```yaml
sections:
  - columns:
    - type: "content"
      title: "Section Title"
      content: "Content text with **markdown**"
```

### MDX (.mdx) Files  
Markdown with embedded JSX components for maximum flexibility:
```mdx
import ModularSection from '../../../components/ModularSection.astro';
import heroImage from './images/hero.jpg';
import modelFile from './3Dmodels/model.glb';

# Your Content

Write **markdown** normally with full syntax highlighting.

<ModularSection columns={[
  { type: "content", title: "Title", content: "Content..." },
  { type: "image", src: heroImage, alt: "Hero image" },
  { type: "model", modelSrc: modelFile, ... }
]} />

More markdown content here...
```

## ModularSection Component

### YAML Syntax (Legacy)
```yaml
sections:
  - columns:
    - type: "content"
      title: "Column Title"
      content: "Column content"
```

### MDX Syntax (Recommended)
```mdx
<ModularSection columns={[
  {
    type: "content",
    title: "Column Title", 
    content: "Column content"
  }
]} />
## Column Types

### Content Column
Text content with markdown support:
```javascript
{
  type: "content",
  title: "Column Title",
  content: `Text with **markdown** support
  
  - Lists work
  - **Bold** and *italic*
  - [Links](https://example.com)`
}
```

### Image Column  
Single optimized image:
```javascript
// With import (MDX)
import myImage from './images/photo.jpg';
{
  type: "image",
  title: "Image Title",
  src: myImage,
  alt: "Image description",
  caption: "Optional caption"
}

// With string path (legacy)
{
  type: "image",
  title: "Image Title", 
  src: "./images/photo.jpg",
  alt: "Image description",
  caption: "Optional caption"
}
```

### Gallery Column
Multiple images with navigation:
```javascript
// With imports (MDX)
import photo1 from './images/photo1.jpg';
import photo2 from './images/photo2.jpg';
{
  type: "gallery", 
  title: "Photo Gallery",
  gallery: [
    { src: photo1, alt: "Description 1", caption: "Caption 1" },
    { src: photo2, alt: "Description 2", caption: "Caption 2" }
  ],
  galleryOptions: {
    autoplay: true,
    autoplayInterval: 4000,
    showThumbnails: true,
    size: "medium"
  }
}

// With string paths (legacy)
{
  type: "gallery",
  title: "Photo Gallery",
  gallery: [
    { src: "./images/photo1.jpg", alt: "Description 1", caption: "Caption 1" },
    { src: "./images/photo2.jpg", alt: "Description 2", caption: "Caption 2" }
  ],
  galleryOptions: { /* same options */ }
}
```

### 3D Model Column
Interactive 3D model viewer:
```javascript
// With import (MDX) - Recommended
import modelFile from './3Dmodels/model.glb';
import posterImage from './images/poster.jpg';
{
  type: "model",
  title: "3D Model",
  modelSrc: modelFile,
  alt: "3D model description",
  poster: posterImage,
  caption: "Model caption",
  modelOptions: {
    autoRotate: true,
    cameraControls: true,
    ar: true,
    size: "large",
    cameraOrbit: "0deg 75deg 1.5m",
    fieldOfView: "35deg",
    exposureCompensation: 1.0,
    shadowIntensity: 0.8,
    shadowSoftness: 1.2,
    interactionPrompt: "auto",
    loading: "lazy"
  }
}

// With string path (legacy)
{
  type: "model",
  title: "3D Model", 
  modelSrc: "./3Dmodels/model.glb",
  alt: "3D model description",
  poster: "./images/poster.jpg",
  caption: "Model caption",
  modelOptions: { /* same options */ }
}
```

## 3D Model Options

### Camera Control
- `cameraOrbit`: `"azimuth polar distance"` (e.g., `"0deg 75deg 1.5m"`)
- `fieldOfView`: Zoom level (smaller = more zoomed in, e.g., `"25deg"`)
- `minCameraOrbit` / `maxCameraOrbit`: Interaction limits
- `minFieldOfView` / `maxFieldOfView`: Zoom limits

### Interaction
- `cameraControls`: Enable user interaction (default: `true`)
- `autoRotate`: Automatic rotation (default: `false`)
- `autoRotateDelay`: Delay before auto-rotation starts (ms)
- `rotationPerSecond`: Rotation speed (e.g., `"20deg"`)
- `interactionPrompt`: `"auto"` | `"none"` | `"wiggle"`

### Lighting & Rendering
- `exposureCompensation`: Brightness adjustment (0.0-2.0)
- `shadowIntensity`: Shadow strength (0.0-1.0)
- `shadowSoftness`: Shadow softness (0.0-2.0)
- `loading`: `"auto"` | `"lazy" | "eager"`

### AR Support
- `ar`: Enable AR button on supported devices
- `arPlacement`: `"floor"` | `"wall"`
- `iosSource`: Separate .usdz file for iOS AR

### Size Options
- `size`: `"small"` | `"medium"` | `"large"` | `"full"` | number (200-1200)

## Gallery Options

### Navigation
- `autoplay`: Auto-advance slides (default: `false`)
- `autoplayInterval`: Time between slides (ms, default: 4000)
- `showThumbnails`: Show thumbnail navigation (default: `true`)

### Layout
- `size`: `"small"` | `"medium"` | `"large"` | `"full"`

## File Organization

### Content Structure
```
src/content/
├── posts/
│   └── post-name/
│       ├── index.md or index.mdx
│       ├── cover.webp
│       ├── images/           # Co-located images
│       │   ├── hero.jpg
│       │   └── gallery1.jpg
│       └── 3Dmodels/         # Co-located 3D models (if needed)
└── projects/
    └── project-name/
        ├── index.md or index.mdx  
        ├── cover.png
        ├── images/           # Co-located images
        │   ├── photo1.jpg
        │   └── photo2.jpg
        └── 3Dmodels/         # Co-located 3D models
            └── model.glb
```

## Project Versions

Add versioning to projects for iterative development:
```yaml
versions:
  - version: "v2.0"
    title: "Major Redesign"
    description: "Complete overhaul with new features"
    startDate: "2024-06"
    status: "completed"
    achievements: ["Improved performance", "New UI design"]
    learnings: ["Important lesson learned"]
    githubUrl: "https://github.com/user/repo/tree/v2.0"
    content: "Optional detailed markdown content"
```

### Version Headers
Customize or hide the versions section header:
```yaml
versionsTitle: "Development History"  # Custom header
versionsTitle: ""                    # Hide header completely  
# versionsTitle: undefined           # Default "Project Versions"
```

## Best Practices

### Performance
- Use `.glb` models (smaller than `.gltf`)
- Optimize images with appropriate formats (`.webp` for covers)
- Keep 3D models under 5MB for best performance
- Use `loading: "lazy"` for off-screen content

### Organization  
- Co-locate images with content in same directory
- Use descriptive alt text for accessibility
- Organize assets in project subdirectories
- Use consistent naming conventions

### Content Strategy
- **MDX for complex layouts**: Use when you need fine control over content flow
- **Markdown for simple content**: Use for straightforward blog posts
- **Mix both formats**: Start with `.md`, convert to `.mdx` when needed

### Camera Positioning Tips
- **Closer models**: `cameraOrbit: "0deg 75deg 0.8m"`, `fieldOfView: "25deg"`
- **Wide views**: `cameraOrbit: "0deg 60deg 2m"`, `fieldOfView: "45deg"`  
- **Top-down**: `cameraOrbit: "0deg 30deg 1.5m"`
- **Side view**: `cameraOrbit: "90deg 90deg 1.5m"`

## Common Examples

### Two-Column Layout
```mdx
import heroImage from './images/hero.jpg';
import modelFile from './3Dmodels/model.glb';

<ModularSection columns={[
  { type: "content", title: "Description", content: "Text here..." },
  { type: "model", modelSrc: modelFile, modelOptions: { autoRotate: true } }
]} />
```

### Photo Gallery with Text
```mdx
import photo1 from './images/photo1.jpg';
import photo2 from './images/photo2.jpg';

<ModularSection columns={[
  { 
    type: "gallery",
    gallery: [
      { src: photo1, alt: "Photo 1", caption: "First photo" },
      { src: photo2, alt: "Photo 2", caption: "Second photo" }
    ],
    galleryOptions: { autoplay: true, showThumbnails: true }
  }
]} />
```

### Single Column Content
```mdx
<ModularSection columns={[
  { type: "content", title: "Full Width", content: "Content spans full width..." }
]} />
```
    learnings:
      - "Lesson learned"
    gallery: [...]
    sections: [...]
```

## Layout Patterns

### Two Columns (50/50)
**MDX (Recommended):**
```mdx
import photo from './images/photo.jpg';

<ModularSection columns={[
  { type: "content", content: "Left column text..." },
  { type: "gallery", gallery: [{ src: photo, alt: "Photo" }] }
]} />
```

**YAML (Legacy):**
```yaml
sections:
  - columns:
    - type: "content"
      content: "Left column"
    - type: "gallery"  
      gallery: 
        - src: "./images/photo.jpg"
          alt: "Photo"
```

### Three Columns (33/33/33)
**MDX (Recommended):**
```mdx
import photo from './images/photo.jpg';

<ModularSection columns={[
  { type: "content", content: "Left column" },
  { type: "gallery", gallery: [{ src: photo, alt: "Photo" }] },
  { type: "content", content: "Right column" }
]} />
```

### Single Full-Width Column
**MDX (Recommended):**
```mdx
<ModularSection columns={[
  { type: "content", title: "Full Width", content: "Content spans entire width..." }
]} />
```

### Header Gallery
Replace cover image with carousel:
```yaml
---
title: "Project"
gallery:
  - src: "./images/hero1.png"
    alt: "Hero image 1"
  - src: "./images/hero2.png"
    alt: "Hero image 2"
---
```

## Gallery Features

### Navigation Methods
- **Thumbnails**: Primary navigation with visual highlights
- **Arrows**: Hover to show navigation arrows
- **Keyboard**: `←/→` to navigate, `Space` to play/pause, `Home/End` for first/last
- **Touch**: Swipe gestures on mobile devices
- **Autoplay**: Optional automatic slideshow with smart pause/resume

### Key Features
- **Performance Optimized**: Reduced complexity and better memoization
- **Touch-Friendly**: Optimized swipe gestures and mobile interactions
- **Keyboard Accessible**: Full keyboard navigation support
- **Smart Autoplay**: Intelligently resumes only when appropriate

## Responsive Behavior

- **Mobile**: All columns stack vertically for optimal mobile experience
- **Tablet**: 2-column layouts maintained, 3+ columns may stack
- **Desktop**: Full multi-column layouts display side-by-side

## Complete Schema Reference

### All Available Fields

**Posts Schema:**
```yaml
title: string
description: string
cover: string (image path)
date: string (YYYY-MM-DD)
tags: string[]
featured?: boolean
featuredOrder?: number (1-6)
gallery?: ImageObject[]
galleryOptions?: GalleryOptions
```

**Projects Schema:**
```yaml
title: string
description: string
cover: string (image path)
startDate: string (YYYY-MM)
endDate?: string (YYYY-MM)
status: "completed" | "in-progress" | "planned"
featured?: boolean
featuredOrder?: number (1-6)
tags: string[]
githubUrl?: string
metrics?: ProjectMetrics
competitions?: Competition[]
competitionStats?: CompetitionStats
competitionsOptions?: CompetitionsOptions
gallery?: ImageObject[]
galleryOptions?: GalleryOptions
```

**Metrics Configuration:**
```yaml
metrics:
  sectionTitle?: string
  customFields:
    - label: string
      value: string | number
```

**Competition Entry:**
```yaml
competitions:
  - name: string
    date: string (YYYY-MM)
    placement: string | number
    record?: string (e.g., "3-1")
    url?: string (link to event recap)
```

**Competition Statistics:**
```yaml
competitionStats:
  sectionTitle?: string
  customStats:
    - label: string
      value: string | number
      highlight?: boolean
      color?: "success" | "warning" | "error"
```

**Gallery Options:**
```yaml
galleryOptions:
  autoplay?: boolean
  autoplayInterval?: number (milliseconds)
  showThumbnails?: boolean
  size?: "small" | "medium" | "large"
  columns?: number (1-4)
  aspectRatio?: "auto" | "square" | "wide" | "tall"
```

## File Organization

### Content Structure
```
src/content/
├── posts/
│   └── post-name/
│       ├── index.md|mdx      # Post content (use .mdx for components)
│       ├── cover.png         # Card thumbnail image
│       ├── images/           # Additional post images
│       │   ├── hero.jpg
│       │   └── gallery1.jpg
│       └── 3Dmodels/         # 3D models (if needed)
└── projects/
    └── project-name/
        ├── index.md|mdx      # Project content (use .mdx for components) 
        ├── cover.png         # Card thumbnail image
        ├── images/           # Project images
        │   ├── photo1.jpg
        │   └── photo2.jpg
        └── 3Dmodels/         # Project 3D models
            └── model.glb
```

### Asset Guidelines
- **Co-locate assets**: Keep images and models with their content in organized subfolders
- **Use imports in MDX**: `import image from './images/photo.jpg'` for better optimization
- **Organize with subfolders**: Use `images/` and `3Dmodels/` subfolders within content directories
- **Use .webp**: For cover images when possible (better compression)
- **Use .glb**: For 3D models (smaller than .gltf)
- **Descriptive naming**: Use clear, descriptive filenames
- **Optimize sizes**: Keep models under 5MB, compress images appropriately

### Import Benefits
- **Better performance**: Astro optimizes imported assets automatically
- **Type safety**: Import errors caught at build time
- **Hot reload**: Changes reflected immediately during development
- **Bundle optimization**: Unused assets automatically excluded

For comprehensive documentation, see `content-layout-system.md`.
