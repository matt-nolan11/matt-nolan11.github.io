# Content Layout System Documentation

## Overview

This documentation covers the complete content and layout system for Matt Nolan's portfolio website. The system provides flexible, responsive layouts for both simple blog posts and complex engineering project documentation with support for both traditional Markdown and enhanced MDX formats.

### Key Features

- **Dual Content Format Support**: Both Markdown (.md) and MDX (.mdx) files supported
- **Flexible Content Architecture**: Support for posts and projects with different complexity levels
- **Enhanced ModularSection Component**: Simplified API with spacing controls, className support, and flexible layout options
- **Interactive 3D Models**: Full-featured model viewer with camera controls and AR support
- **Advanced Gallery System**: Touch-friendly carousels with thumbnail navigation
- **File-Based Project Versioning**: Interactive tabbed version system using separate MDX files with full component support
- **Competition & Metrics System**: Comprehensive tracking for competitive projects and custom specifications
- **Responsive Design**: Mobile-first approach with DaisyUI dark/light themes
- **TypeScript Schema Validation**: Type-safe content with automatic validation

## Content Formats

### Markdown (.md) - Traditional Approach
Use for straightforward content with YAML frontmatter and ModularSection in YAML format:

```yaml
---
title: "Project Title"
description: "Project description"
cover: "./cover.png"
# ... other frontmatter
sections:
  - columns:
    - type: "content"
      content: "Text content here"
    - type: "gallery"
      gallery: [...]
---

# Additional markdown content
Standard markdown content follows the frontmatter.
```

### MDX (.mdx) - Enhanced Approach (Recommended)
Use for complex layouts with embedded components and better developer experience:

```mdx
---
title: "Project Title"
description: "Project description"  
cover: "./cover.png"
# ... other frontmatter (no sections needed)
---

# Project Content

Regular markdown content with embedded components:

<ModularSection columns={[
  { 
    type: "content", 
    title: "Description",
    content: "Detailed **markdown** content with full formatting support..." 
  },
  { 
    type: "model", 
    modelSrc: "./robot.glb",
    modelOptions: { 
      autoRotate: true,
      cameraOrbit: "0deg 75deg 0.8m",
      fieldOfView: "25deg"
    }
  }
]} />

More markdown content can follow components...
```

## Asset Organization

### Co-located Assets (Recommended)

Assets are organized alongside content files using imports for better maintainability:

```
src/content/posts/my-post/
├── index.mdx                 # Main content
├── images/
│   ├── cover.jpg            # Cover image  
│   ├── diagram.png          # Content images
│   └── photo.webp           # Additional images
└── models/
    └── prototype.glb        # 3D models

src/content/projects/my-project/
├── index.mdx                # Main content
├── images/
│   ├── cover.png            # Project card image
│   ├── v1-photo.jpg         # Version photos
│   └── assembly.png         # Technical diagrams
└── 3Dmodels/
    ├── final.glb            # Current model
    └── prototype.glb        # Historical versions
```

### Import Approach for MDX

```mdx
---
title: "My Project"
cover: coverImage              # Use imported variable
---

import ModularSection from '../../../components/ModularSection.astro';
import coverImage from './images/cover.png';
import robotModel from './3Dmodels/robot.glb';
import diagramImage from './images/diagram.png';

<ModularSection columns={[
  {
    type: 'image',
    src: diagramImage,         # Use imported variable
    alt: 'Technical diagram'
  },
  {
    type: 'model', 
    modelSrc: robotModel,      # Use imported variable
    alt: '3D robot model'
  }
]} />
```

### Benefits of Co-located Assets

- **Better Organization**: Assets live with the content that uses them
- **Easier Maintenance**: Moving/renaming content moves assets automatically  
- **Build-time Validation**: Missing assets cause build failures (catch errors early)
- **Automatic Optimization**: Astro optimizes imported images automatically
- **Clear Dependencies**: Easy to see what assets each piece of content uses

### Legacy Public Path Support

For backwards compatibility, string paths are also supported:

```mdx
---
cover: "./images/cover.jpg"    # String path (still works)
---

<ModularSection columns={[
  {
    type: 'image',
    src: '/static/legacy-image.jpg'  # Public folder path
  }
]} />
```

**MDX Benefits:**
- **Better syntax highlighting**: Full component syntax highlighting in editors
- **Component intellisense**: Auto-completion and type checking
- **Flexible content flow**: Mix markdown and components naturally
- **Import support**: Import custom components and utilities
- **Better maintainability**: Easier to refactor and update

## Content Types

### 1. Posts (Blog Content)

Simple content structure for blog posts about robotics, engineering, and making.

**Basic Post Structure:**
```yaml
---
title: "10 Fun Facts About Stars"
description: "Surprising and fun facts about the stars above us."
cover: "./cover.png"
date: "2025-05-05"
tags: ["stars", "facts", "astronomy"]
draft: false  # Optional: hide from production
---

# Your markdown content here

Standard markdown with full support for:
- Headers, lists, links
- Code blocks with syntax highlighting  
- Images and media
- All CommonMark features
```

**Post Schema Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✓ | Post title |
| `description` | string | ✓ | SEO description (max 160 chars) |
| `cover` | image | ✓ | Post cover image |
| `date` | date | ✓ | Publication date |
| `tags` | array | | Topic tags for categorization |
| `draft` | boolean | | Hide from production if true |

### 2. Projects (Portfolio Content)

Rich, flexible content structure for showcasing engineering projects with support for versions, galleries, and complex layouts.

**Basic Project Structure (Markdown):**
```yaml
---
title: "6-DOF Robot Arm"
description: "Multi-version robotic arm project exploring different control systems."
cover: "./cover.png"
startDate: "2023-01"
endDate: "2024-06"
status: "in-progress"
featured: true
tags: ["robotics", "mechanical-design", "control-systems"]
githubUrl: "https://github.com/username/project"
sections:
  - columns:
    - type: "content"
      content: "Project description..."
    - type: "model"
      modelSrc: "./robot.glb"
---

Additional markdown content here.
```

**Enhanced Project Structure (MDX):**
```mdx
---
title: "6-DOF Robot Arm"
description: "Multi-version robotic arm project exploring different control systems."
cover: "./cover.png"
startDate: "2023-01"
endDate: "2024-06"
status: "in-progress"
featured: true
tags: ["robotics", "mechanical-design", "control-systems"]
githubUrl: "https://github.com/username/project"
---

# Robot Arm Project

This project explores advanced robotics control systems...

<ModularSection columns={[
  { 
    type: "content", 
    title: "Technical Details",
    content: `
## Specifications
- **Degrees of Freedom**: 6
- **Reach**: 850mm
- **Payload**: 2kg
- **Repeatability**: ±0.1mm

The arm uses custom servo controllers...
    `
  },
  { 
    type: "model", 
    modelSrc: "./robot-arm.glb",
    alt: "Interactive 3D model of the robot arm",
    modelOptions: { 
      autoRotate: true,
      cameraOrbit: "45deg 75deg 1.2m",
      fieldOfView: "30deg",
      exposureCompensation: 1.2
    }
  }
]} />

## Build Process

The construction involved several key phases...
```

**Project Schema Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✓ | Project name |
| `description` | string | ✓ | SEO description (max 160 chars) |
| `cover` | image | ✓ | Project cover image |
| `startDate` | date/string | ✓ | YYYY-MM or YYYY-MM-DD format |
| `endDate` | date/string | | Project completion date |
| `status` | enum | | "completed", "in-progress", "planned" |
| `featured` | boolean | | Show on homepage featured section |
| `featuredOrder` | number | | Manual position in homepage (1-6) |
| `tags` | array | | Technology/topic tags |
| `githubUrl` | url | | Project repository link |
| `liveUrl` | url | | Live demo/deployment link |
| `gallery` | array | | Header gallery (replaces cover) |
| `sections` | array | | Modular content sections (Markdown only) |
| `versionsTitle` | string | | Custom versions section title |
| `versions` | array | | Project version iterations |
| `metrics` | object | | Custom project metrics/specifications |
| `competitions` | array | | Competition history entries |
| `competitionsOptions` | object | | Competition display configuration |
| `competitionStats` | object | | Overall competition statistics |

**Dynamic Project Metrics:**
- `metrics.sectionTitle`: Custom section title (default: "Project Stats")
- `metrics.customFields`: Array of label/value pairs for flexible project data

**Competition System:**
- `competitions`: Individual competition entries with placement tracking
- `competitionsOptions`: Display settings (max entries, section title)
- `competitionStats`: Aggregate statistics with highlighting options

**Featured Project Ordering:**
- Set `featured: true` and optionally `featuredOrder: N` (1-6)
- Gaps in ordering are allowed (e.g., 1, 3, 5)
- Remaining slots filled by recent projects
- Duplicate orders or out-of-bounds values cause build errors

## ModularSection Component

The core layout component supports both legacy YAML syntax and modern component-based syntax.

### Modern Syntax (MDX - Recommended)

```mdx
<ModularSection 
  columns={[
    { type: "content", title: "Overview", content: "Markdown content..." },
    { type: "gallery", gallery: [...], galleryOptions: {...} },
    { type: "model", modelSrc: "./model.glb", modelOptions: {...} }
  ]}
  cameraOrbit="45deg 75deg 1.2m"
  fieldOfView="30deg"
/>
```

### Legacy Syntax (YAML - Supported)

```yaml
sections:
  - columns:
    - type: "content"
      title: "Overview"
      content: "Markdown content..."
    - type: "gallery"
      gallery: [...]
      galleryOptions: {...}
    - type: "model"
      modelSrc: "./model.glb"
      modelOptions: {...}
```

### Component Props

**ModularSection Props:**
- `columns`: Array of column objects (see Column Types below)
- `className`: Additional CSS classes for the section container
- `spacing`: Section spacing variant - 'default', 'compact', 'relaxed', 'none'
- `columnGap`: Gap between columns - 'sm', 'md', 'lg', 'xl', 'none'
- `cameraOrbit`: Default camera position for all 3D models in this section
- `fieldOfView`: Default field of view for all 3D models in this section
- `minCameraOrbit`: Minimum camera orbit constraint
- `maxCameraOrbit`: Maximum camera orbit constraint  
- `minFieldOfView`: Minimum field of view constraint
- `maxFieldOfView`: Maximum field of view constraint

**Note:** Camera props are passed to all model columns within the section. Individual model columns can override these settings via their `modelOptions`.

### Layout Controls

**Spacing Options:**
```mdx
<ModularSection spacing="compact" />     # Tighter spacing, minimal gaps
<ModularSection spacing="default" />     # Standard spacing (default)
<ModularSection spacing="relaxed" />     # Generous spacing, more breathing room
<ModularSection spacing="none" />        # No internal spacing, custom control
```

**Column Gap Control:**
```mdx
<ModularSection columnGap="sm" />        # Small gap between columns
<ModularSection columnGap="md" />        # Medium gap (default)
<ModularSection columnGap="lg" />        # Large gap
<ModularSection columnGap="xl" />        # Extra large gap
<ModularSection columnGap="none" />      # No gap between columns
```

**Custom Styling:**
```mdx
<ModularSection 
  className="bg-base-200 rounded-xl p-6" 
  spacing="compact"
  columnGap="lg"
/>
```

## Column Types

### 1. Content Columns
```yaml
- type: "content"
  title: "Optional Title"  # Rendered as h2-h6 based on nesting depth
  content: |
    Full **Markdown** support including:
    
    - Lists and formatting
    - [Links](https://example.com)
    - `Code blocks` with syntax highlighting
    - All standard markdown features
```

**Features:**
- Full markdown rendering with syntax highlighting
- Automatic heading level adjustment based on nesting depth
- Responsive typography with `prose` classes
- Dark mode compatible styling

### 2. Gallery Columns
```yaml
- type: "gallery"
  title: "Gallery Title"
  gallery:
    - src: "./image1.png"
      alt: "Required alt text"
      caption: "Optional caption"
    - src: "./image2.png"
      alt: "Another image"
  galleryOptions:
    size: "medium"          # small, medium, large, full, or 200-1200px
    autoplay: false
    autoplayInterval: 4000
    showThumbnails: true
```

**Gallery Features:**
- **Navigation Methods**: Thumbnails (primary), arrows (hover), keyboard (←/→, Space, Home/End), touch/swipe
- **Smart Autoplay**: Intelligent pause/resume based on user interaction
- **Performance Optimized**: Lazy loading, efficient rendering, reduced complexity
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Responsive**: Adapts to container size and device capabilities

### 3. Single Image Columns
```yaml
- type: "image"
  src: "./diagram.png"
  alt: "System architecture diagram"
  caption: "Optional caption"
```

**Features:**
- Optimized image loading and responsive sizing
- Caption support with consistent styling
- Accessibility compliance with alt text

### 4. 3D Model Columns
```yaml
- type: "model"
  title: "3D CAD Model"
  modelSrc: "./robot-arm.glb"
  alt: "Interactive 3D model of robot arm"
  poster: "./model-preview.jpg"
  caption: "Click and drag to rotate the model"
  aspectRatio: "16:10"        # Desktop aspect ratio (optional)
  mobileAspectRatio: "4:3"    # Mobile aspect ratio (optional)
  modelOptions:
    autoRotate: true
    cameraControls: true
    ar: true
    exposureCompensation: 1.2
    shadowIntensity: 0.8
    interactionPrompt: "auto"
    loading: "lazy"
    cameraOrbit: "45deg 75deg 1.2m"      # Desktop camera position
    mobileCameraOrbit: "0deg 85deg 1.5m" # Mobile camera position (optional)
    fieldOfView: "30deg"
    rotationPerSecond: "15deg"
    autoRotateDelay: 3000
```

**Model Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoRotate` | boolean | false | Enable automatic rotation |
| `cameraControls` | boolean | true | Allow user camera control |
| `ar` | boolean | false | Enable AR viewing on supported devices |
| `exposureCompensation` | number | 1 | Lighting brightness adjustment |
| `shadowIntensity` | number | 1 | Shadow strength (0-2) |
| `shadowSoftness` | number | 1 | Shadow blur amount (0-2) |
| `interactionPrompt` | string | "auto" | "auto", "when-focused", "none" |
| `loading` | string | "lazy" | "auto", "lazy", "eager" |
| `cameraOrbit` | string | "0deg 75deg 105%" | Desktop camera position (azimuth elevation distance) |
| `mobileCameraOrbit` | string | same as `cameraOrbit` | Mobile camera position (optional override) |
| `fieldOfView` | string | "auto" | Camera field of view (e.g., "30deg") |
| `minCameraOrbit` | string | "auto" | Minimum camera constraints |
| `maxCameraOrbit` | string | "auto auto [distance]" | Maximum camera constraints (auto-generated) |
| `minFieldOfView` | string | "auto" | Minimum zoom constraint |
| `maxFieldOfView` | string | "auto" | Maximum zoom constraint |
| `rotationPerSecond` | string | "20deg" | Auto-rotation speed |
| `autoRotateDelay` | number | 3000 | Delay before auto-rotation starts (ms) |

**Responsive Layout Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `aspectRatio` | string | "16:10" | Desktop aspect ratio (width:height) |
| `mobileAspectRatio` | string | same as `aspectRatio` | Mobile aspect ratio override |

**Responsive Camera System:**
The ModelViewer automatically provides responsive camera positioning:
- **Device Detection**: Automatically switches between desktop and mobile camera positions at 768px breakpoint
- **Camera Orbits**: Use `cameraOrbit` for desktop, `mobileCameraOrbit` for mobile-specific positioning
- **Auto Constraints**: `maxCameraOrbit` is automatically generated as "auto auto [distance]" to prevent over-zooming
- **Aspect Ratios**: Desktop and mobile can have different aspect ratios for optimal viewing

**Camera Positioning Examples:**
- **Desktop focused**: `cameraOrbit: "0deg 75deg 0.8m"`, `mobileCameraOrbit: "0deg 85deg 1.2m"`
- **Wide desktop view**: `cameraOrbit: "0deg 60deg 2m"`, `mobileCameraOrbit: "0deg 70deg 1.5m"`
- **Top-down desktop**: `cameraOrbit: "0deg 30deg 1.5m"`, `mobileCameraOrbit: "0deg 45deg 1.8m"`
- **Side view**: `cameraOrbit: "90deg 90deg 1.5m"`, `mobileCameraOrbit: "90deg 80deg 1.8m"`

**Aspect Ratio Examples:**
- **Widescreen**: `aspectRatio: "16:9"`, `mobileAspectRatio: "16:9"`
- **Desktop wide, mobile square**: `aspectRatio: "16:10"`, `mobileAspectRatio: "1:1"`
- **Classic proportions**: `aspectRatio: "4:3"`, `mobileAspectRatio: "4:3"`
- **Ultra-wide**: `aspectRatio: "21:9"`, `mobileAspectRatio: "16:9"`

**Model Features:**
- **Interactive Controls**: Mouse/touch orbit, zoom, and pan
- **Auto-rotation**: Configurable automatic model rotation
- **AR Support**: View models in augmented reality on compatible mobile devices
- **Progressive Loading**: Poster images while models load
- **Environmental Lighting**: Realistic lighting and shadows
- **Performance Optimized**: Hardware acceleration, adaptive quality
- **Accessibility**: Screen reader support and keyboard navigation
- **File Formats**: GLTF (.gltf) and GLB (.glb) 3D models

**AR Requirements:**
- **iOS**: iPhone 6s+ with iOS 11+ and Safari/Chrome
- **Android**: ARCore-compatible device with Chrome 67+
- **Connection**: HTTPS required for AR functionality
- **Model Size**: Under 10MB recommended for AR

**Performance Tips:**
- Use slower `rotationPerSecond` (15deg or 10deg) for smoother animation
- Lower `shadowIntensity` to 0.5 or 0 for better performance
- Use `loading: "eager"` for small models to avoid delays
- Keep models under 5MB for optimal performance

### 5. Nested Section Columns
```yaml
- type: "sections"
  sections:
    - columns:
      - type: "content"
        content: "Nested content here"
      - type: "gallery"
        gallery: [...]
```

## Layout Patterns

### Two-Column Layout (50/50)
**MDX (Recommended):**
```mdx
<ModularSection columns={[
  { 
    type: "content", 
    title: "Description",
    content: "Text content on the left side..." 
  },
  { 
    type: "gallery", 
    gallery: [
      { src: "./visual.png", alt: "Supporting visual" }
    ]
  }
]} />
```

**YAML (Legacy):**
```yaml
sections:
  - columns:
    - type: "content"
      title: "Description"
      content: |
        Text content on the left side
    - type: "gallery"
      gallery:
        - src: "./visual.png"
          alt: "Supporting visual"
```

### Three-Column Layout (33/33/33)
**MDX (Recommended):**
```mdx
<ModularSection columns={[
  { type: "content", content: "Left column" },
  { type: "gallery", gallery: [...] },
  { type: "content", content: "Right column" }
]} />
```

### Model with Description Layout
**MDX (Recommended):**
```mdx
<ModularSection 
  columns={[
    { 
      type: "content", 
      title: "Technical Details",
      content: "Detailed specifications..." 
    },
    { 
      type: "model", 
      modelSrc: "./robot.glb",
      modelOptions: { autoRotate: true }
    }
  ]}
  cameraOrbit="45deg 75deg 1.2m"
  fieldOfView="30deg"
/>
```

### Four-Column Layout (25/25/25/25)
```yaml
sections:
  - columns:
    - type: "image"
      src: "./icon1.png"
      alt: "Feature 1"
    - type: "image" 
      src: "./icon2.png"
      alt: "Feature 2"
    - type: "image"
      src: "./icon3.png"
      alt: "Feature 3"
    - type: "image"
      src: "./icon4.png"
      alt: "Feature 4"
```

**Responsive Behavior:**
- **Mobile**: All columns stack vertically for optimal experience
- **Tablet**: 2-column layouts maintained, 3+ columns may stack
- **Desktop**: Full multi-column layouts display side-by-side

## Project Versions System

Track project evolution through multiple iterations using file-based versioning with rich MDX content and interactive components.

### File-Based Version Architecture

The modern approach uses separate MDX files for each version, providing maximum flexibility:

```
src/content/projects/project-name/
├── index.mdx              # Main project file
├── v1.mdx                 # Version 1 content
├── v2.mdx                 # Version 2 content  
├── v3.mdx                 # Version 3 content
├── images/                # Shared project images
├── 3Dmodels/             # Project 3D models
└── cover.png             # Project thumbnail
```

### ProjectVersionsSection Component

The `ProjectVersionsSection` component automatically detects and displays version files as interactive tabs:

```mdx
import ProjectVersionsSection from '../../../components/ProjectVersionsSection.astro';

<ProjectVersionsSection 
  sectionTitle="Design Iterations"
  titleDepth={0}
  tabSize="lg"
  tabStyle="bordered"
  className="mt-12"
/>
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `projectSlug` | string | auto-detected | Project identifier (auto-detected from URL) |
| `className` | string | `''` | Additional CSS classes |
| `sectionTitle` | string | `'Evolution Timeline'` | Section heading text |
| `showTitle` | boolean | `true` | Whether to show the section title |
| `titleDepth` | number | `1` | Title hierarchy (0=h2/text-3xl, 1=h3/text-2xl, etc.) |
| `titleSpacing` | string | `'1.5rem'` | Space between title and tabs |
| `contentSpacing` | string | `'2rem'` | Space between tabs and content |
| `tabSize` | string | `'lg'` | Tab size: 'sm', 'md', 'lg', 'xl' |
| `tabStyle` | string | `'boxed'` | Tab style: 'boxed', 'bordered', 'lifted' |
| `tabWidth` | string | - | Custom tab width override |
| `tabHeight` | string | - | Custom tab height override |
| `tabPadding` | string | - | Custom tab padding override |
| `fontSize` | string | - | Custom tab font size override |

### Tab Style Options

**Boxed (Default)**: Clean, simple tabs with background color
```mdx
<ProjectVersionsSection tabStyle="boxed" />
```

**Bordered**: Outlined tabs with transparent background
```mdx
<ProjectVersionsSection tabStyle="bordered" />
```

**Lifted**: Elevated tabs with shadow and border
```mdx
<ProjectVersionsSection tabStyle="lifted" />
```

### Version File Structure

Each version file (e.g., `v1.mdx`, `v2.mdx`) contains full MDX content with frontmatter:

```mdx
---
title: "Version 2.0 - Advanced Control"
description: "Complete redesign with stepper motors and precision control"
startDate: "2023-06"
status: "completed"
---

import ModularSection from '../../../components/ModularSection.astro';
import robotModel from './3Dmodels/v2-robot.glb';

## Major Improvements

This version introduced several key enhancements...

<ModularSection 
  columns={[
    {
      type: "content", 
      width: 60,
      content: `**Key Features:**
      - Stepper motor precision
      - Feedback control systems
      - Advanced trajectory planning`
    },
    {
      type: "model",
      width: 40,
      modelSrc: robotModel,
      modelOptions: { autoRotate: true }
    }
  ]}
  spacing="compact"
/>
```

### Theme Integration

The version tabs automatically adapt to your DaisyUI theme colors:
- **Light mode (corporate)**: `#0082ce` - Professional blue
- **Dark mode (business)**: `#1c4e7f` - Darker blue for contrast

Tab colors match the primary badge colors used throughout the site for consistency.

### Mobile Responsiveness

- Tabs automatically stack and resize on mobile devices
- Touch-friendly interaction with proper spacing
- Maintains accessibility across all screen sizes

### Best Practices

1. **Naming Convention**: Use `v1.mdx`, `v2.mdx`, `v3.mdx` for sequential versions
2. **Content Organization**: Keep each version focused on specific improvements
3. **Asset Management**: Store version-specific assets in appropriate subdirectories
4. **Progressive Enhancement**: Start with simple content and enhance with components
5. **Consistent Styling**: Use consistent ModularSection patterns across versions
      - "Integrated with MoveIt!"
    learnings:
      - "ROS learning curve was steeper than expected"
      - "Precise calibration critical for accuracy"
    gallery:
      - src: "./v3-setup.png"
        alt: "ROS integration setup"
        caption: "Control system architecture"
      - src: "./v3-interface.png"
        alt: "Control interface"
        caption: "Custom ROS control GUI"
    galleryOptions:
      size: "large"
      autoplay: true
      autoplayInterval: 5000
```

### Versions with Modular Sections

```yaml
versions:
  - version: "v4.0"
    title: "AI-Powered Operation"
    description: "Machine learning for autonomous task execution"
    startDate: "2024-06"
    status: "planned"
    sections:
      - columns:
        - type: "content"
          title: "Neural Network Architecture"
          content: |
            Implementation details of the AI system using TensorFlow
            and custom training data collected from manual operations.
        - type: "gallery"
          gallery:
            - src: "./ai-diagram.png"
              alt: "Neural network architecture"
            - src: "./training-data.png"
              alt: "Training data visualization"
      - columns:
        - type: "content"
          title: "Training Process"
          content: |
            The training process involves collecting demonstration data
            and using supervised learning techniques.
```

### Version Display Features

- **Tabbed Interface**: Easy navigation between versions with active state indicators
- **Responsive Layout**: Adapts to screen size with proper stacking
- **Rich Content**: Full section support within versions
- **Progress Tracking**: Visual status indicators for each version
- **Flexible Galleries**: Per-version image collections with custom options
- **Legacy Support**: Backward compatibility with simple content/images arrays

## Competition & Metrics System

Comprehensive tracking system for project competitions and custom metrics, ideal for combat robotics, sports projects, and competitive engineering endeavors.

### Project Metrics

Define custom specifications and measurements for your projects:

```yaml
metrics:
  sectionTitle: "Robot Specifications"  # Custom section title
  customFields:
    - label: "Fighting Weight"
      value: "3.0 lbs"
    - label: "Weapon Tip Speed"
      value: "8,000+ RPM"
    - label: "Build Cost"
      value: "$600-900"
    - label: "Design Iterations"
      value: 4
    - label: "Current Version"
      value: "v3.2"
```

**Metrics Features:**
- **Flexible Labels**: Use any label text for custom project data
- **Mixed Data Types**: Support for strings, numbers, and formatted values
- **Grid Layout**: Automatic responsive grid display
- **Custom Sections**: Override default "Project Stats" title

### Competition History

Track individual competition entries with detailed results:

```yaml
competitions:
  - name: "RCL Nationals 2025"
    date: "2025-01"
    placement: "Quarterfinals"
    record: "3-1"
    url: "/posts/event-recap-rcl-nationals-2025/"
  - name: "EVAC Cactus Clash 2024"
    date: "2024-11"
    placement: 1
    record: "4-0"
  - name: "ARC Roborumble 2024"
    date: "2024-09"
    placement: 3
    record: "3-2"
```

**Competition Entry Fields:**
- `name`: Competition/tournament name (required)
- `date`: Competition date in YYYY-MM format (required)
- `placement`: Finish position - number (1, 2, 3) or string ("Quarterfinals", "Champion")
- `record`: Win-loss record (e.g., "3-1", "4-0") - optional
- `url`: Link to event recap, blog post, or external results - optional

**Placement Badge Colors:**
- **1st Place / Champion**: Gold (badge-warning)
- **2nd Place**: Green (badge-success)  
- **3rd Place**: Bronze (badge-accent)
- **Other Placements**: Blue (badge-info)

### Competition Statistics

Display aggregate statistics with highlighting:

```yaml
competitionStats:
  sectionTitle: "Combat Record"
  customStats:
    - label: "Events Entered"
      value: 4
    - label: "Fight Record"
      value: "12-4"
    - label: "Success Rate"
      value: "75%"
      highlight: true
      color: "success"
    - label: "Best Tournament Finish"
      value: "Champion"
      highlight: true
      color: "warning"
    - label: "Favorite Opponent"
      value: "Spinning Disks"
    - label: "Nemesis"
      value: "Horizontal Spinners"
```

**Statistics Features:**
- **Custom Labels**: Any statistic label and value
- **Highlighting**: Optional highlighting with color themes
- **Flexible Display**: Responsive wrapping layout
- **Color Options**: "success", "warning", "error", "info", etc.

### Competition Display Options

Control how competitions are displayed:

```yaml
competitionsOptions:
  sectionTitle: "Tournament History"  # Custom section title
  maxDisplay: 0                       # 0 = show all, N = limit to N entries
```

**Display Features:**
- **Entry Limiting**: Show only recent competitions or display all
- **Clickable Links**: Tournament names become links when URL provided
- **Responsive Design**: Automatic layout adaptation
- **Count Indicators**: Shows "And X more competitions..." when limited

### Interactive Features

**Tournament Links:**
- White text with solid underline for linked tournaments
- Subtle blue hover effect for interactive feedback
- Opens in new tab with proper security attributes
- Seamless integration with event recaps and blog posts

**Badge Styling:**
- Consistent rounded badges across light and dark themes
- Color-coded placement indicators
- Outline record badges for secondary information
- Responsive sizing and spacing

## Gallery System

Advanced React-based image carousel component with touch support, accessibility features, and performance optimizations. The gallery system has been recently optimized for better user experience and maintainability.

### Gallery Configuration

```yaml
gallery:
  - src: "./image1.png"
    alt: "Required alt text for accessibility"
    caption: "Optional caption displayed over image"
  - src: "./image2.png"
    alt: "Another image description"
    caption: "Another caption"
galleryOptions:
  size: "medium"           # Size preset or custom pixel width
  autoplay: false          # Enable automatic slideshow
  autoplayInterval: 4000   # Milliseconds between slides
  showThumbnails: true     # Show thumbnail navigation (replaces indicators)
```

### Size Options

#### Preset Sizes
- `"small"`: 448px max width (max-w-md)
- `"medium"`: 672px max width (max-w-2xl) - default
- `"large"`: 896px max width (max-w-4xl)
- `"full"`: 100% width (w-full)

#### Custom Numeric Sizes
```yaml
galleryOptions:
  size: 600  # Custom 600px max width (200-1200px range)
```

### Gallery Features

#### Navigation & Interaction
- **Thumbnail Navigation**: Visual thumbnail strip with ring highlights for active image
- **Touch/Swipe Support**: Native mobile gestures with proper autoplay integration
- **Keyboard Navigation**: Arrow keys, Space (play/pause), Home/End keys
- **Mouse Navigation**: Click thumbnails and navigation arrows
- **Responsive Controls**: Auto-pause/resume on user interaction

#### User Experience
- **Smart Autoplay**: Only resumes if it was actually playing before user interaction
- **Visual Feedback**: Active thumbnails highlighted with primary color ring
- **Hover Controls**: Navigation arrows and play/pause appear on hover
- **Focus Management**: Proper keyboard focus handling with outline removal
- **Compact Layout**: Autoplay controls positioned next to slide counter

#### Accessibility
- **ARIA Labels**: Comprehensive screen reader support
- **Semantic HTML**: Proper role attributes and structure
- **Keyboard Accessible**: Full keyboard navigation support
- **Alt Text**: Required for all images
- **Focus Indicators**: Visible focus states for accessibility

## Gallery Features

### Navigation Methods
- **Thumbnails**: Primary navigation with visual highlights
- **Arrow Controls**: Hover to show previous/next navigation
- **Keyboard Navigation**: `←/→` to navigate, `Space` to pause/play, `Home/End` for first/last
- **Touch/Swipe**: Mobile-optimized swipe gestures
- **Autoplay Controls**: Smart pause/resume functionality

### Performance Features
- **Lazy Loading**: Off-screen images load only when needed
- **Optimized Transitions**: Smooth 800ms slide animations
- **Memory Management**: Proper cleanup of intervals and observers
- **Responsive Images**: Automatic sizing optimization for different viewports

### Visual Features
- **Captions**: Overlay text with gradient backgrounds
- **Thumbnails**: Scrollable thumbnail navigation strip
- **Progress Counter**: Current slide indicator (1 of N)
- **Play/Pause Button**: Visual autoplay controls
- **Focus States**: Clear visual feedback for keyboard navigation

## Responsive Design

### Breakpoint Behavior

**Mobile (< 768px):**
- All columns stack vertically
- Full-width galleries and models
- Touch-optimized interactions
- Simplified navigation

**Tablet (768px - 1024px):**
- 2-column layouts maintained
- 3+ columns may stack or adapt
- Hybrid touch/mouse support
- Responsive gallery sizing

**Desktop (> 1024px):**
- Full multi-column layouts
- Side-by-side content presentation
- Hover interactions enabled
- Keyboard shortcuts available

### Column Stacking Rules

1. **4 columns** → 2x2 grid (tablet) → 1 column (mobile)
2. **3 columns** → 2+1 layout (tablet) → 1 column (mobile)  
3. **2 columns** → Maintained (tablet) → 1 column (mobile)
4. **1 column** → Maintained across all breakpoints

## Content Strategy Examples

### 1. Simple Project (Markdown)

For straightforward projects without complex layouts:

```yaml
---
title: "LED Matrix Display"
description: "Arduino-based scrolling text display"
cover: "./cover.png"
startDate: "2024-01"
status: "completed"
tags: ["arduino", "electronics", "display"]
githubUrl: "https://github.com/user/led-matrix"
---

This project creates a scrolling LED matrix display using an Arduino Uno and MAX7219 driver chips.

## Features
- 32x8 LED matrix display
- Scrolling text messages
- Variable speed control
- Serial input interface

## Implementation
The display uses a daisy-chained configuration of MAX7219 chips to control the LED matrix efficiently.
```

### 2. Complex Project (MDX)

For projects requiring detailed layouts and interactivity:

```mdx
---
title: "Autonomous Rover"
description: "Computer vision-enabled autonomous navigation robot"
cover: "./cover.png"
startDate: "2023-06"
status: "in-progress"
featured: true
tags: ["robotics", "computer-vision", "raspberry-pi"]
---

# Autonomous Navigation Rover

This rover uses computer vision and LIDAR to navigate complex environments without human intervention.

<ModularSection columns={[
  { 
    type: "content", 
    title: "Project Overview",
    content: `
This autonomous rover combines multiple sensors and AI algorithms to create a robust navigation system that can handle various terrain types and obstacles.

**Key Technologies:**
- Computer vision for object detection
- LIDAR for precise distance mapping  
- Machine learning for path planning
- Real-time sensor fusion
    `
  },
  { 
    type: "gallery", 
    title: "Rover Development",
    gallery: [
      { src: "./rover-overview.png", alt: "Complete rover assembly", caption: "Finished rover with all sensors mounted" },
      { src: "./rover-sensors.png", alt: "Sensor layout diagram", caption: "LIDAR and camera positioning" },
      { src: "./field-testing.jpg", alt: "Field testing", caption: "Testing autonomous navigation outdoors" }
    ],
    galleryOptions: { size: "medium", autoplay: true, autoplayInterval: 5000 }
  }
]} />

## Technical Architecture

<ModularSection columns={[
  { 
    type: "content", 
    title: "Hardware Stack",
    content: `
### Computing Platform
- **Raspberry Pi 4** (main compute)
- **Arduino Nano** (motor control)
- **NVIDIA Jetson Nano** (AI inference)

### Sensors
- **RPLiDAR A1** (360° navigation)
- **USB cameras** (stereo vision)
- **IMU** (orientation tracking)
- **GPS module** (global positioning)

### Power System
- **12V LiPo battery** (main power)
- **5V regulator** (Pi and sensors)
- **Battery management** (charge monitoring)
    `
  },
  { 
    type: "sections",
    sections: [
      {
        columns: [
          { 
            type: "gallery",
            title: "Component Layout",
            gallery: [
              { src: "./electronics.png", alt: "Electronics layout", caption: "Modular electronics design" },
              { src: "./wiring.png", alt: "Wiring diagram", caption: "System interconnections" }
            ]
          },
          { 
            type: "content",
            content: "The modular design allows for easy component upgrades and maintenance. Each subsystem can be tested independently."
          }
        ]
      }
    ]
  }
]} />

The rover represents months of research into autonomous navigation algorithms and real-world robotics implementation.
```

### 3. Interactive 3D Showcase (MDX)

For mechanical designs and CAD models:

```mdx
---
title: "Precision 6-DOF Robot Arm"
description: "High-precision robotic arm with custom gripper design"
cover: "./cover.png"
startDate: "2023-06"
status: "completed"
tags: ["robotics", "mechanical-design", "3d-printing", "cad"]
---

# Precision Robot Arm

High-precision robotic arm featuring custom-designed joints and specialized gripper for delicate manipulation tasks.

<ModularSection 
  columns={[
    { 
      type: "content", 
      title: "Design Overview",
      content: `
## Key Features
- **6 degrees of freedom** for full manipulation capability
- **0.1mm positioning accuracy** with closed-loop control
- **Custom servo-driven joints** with planetary gear reduction
- **Interchangeable end effectors** for various tasks

## Specifications
- **Reach**: 850mm horizontal
- **Payload**: 2kg maximum
- **Repeatability**: ±0.1mm
- **Speed**: 50mm/s maximum linear velocity
      `
    },
    { 
      type: "model", 
      title: "Interactive 3D Model",
      modelSrc: "./robot-arm-assembly.glb",
      alt: "Interactive 3D model of the complete robot arm assembly",
      poster: "./robot-arm-preview.jpg",
      caption: "Drag to rotate • Scroll to zoom • Double-click to center",
      modelOptions: {
        autoRotate: true,
        cameraControls: true,
        ar: true,
        size: "large",
        exposureCompensation: 1.2,
        shadowIntensity: 0.8,
        interactionPrompt: "auto"
      }
    }
  ]}
  cameraOrbit="45deg 75deg 1.2m"
  fieldOfView="30deg"
/>

## Gripper Mechanism

<ModularSection columns={[
  { 
    type: "model", 
    title: "Gripper Detail",
    modelSrc: "./gripper-mechanism.glb",
    alt: "Detailed view of the custom gripper mechanism",
    poster: "./gripper-preview.jpg",
    modelOptions: {
      autoRotate: false,
      cameraControls: true,
      size: "medium",
      cameraOrbit: "0deg 90deg 0.5m",
      fieldOfView: "25deg"
    }
  },
  { 
    type: "content", 
    title: "Gripper Specifications",
    content: `
### Parallel Jaw Design

The gripper uses a parallel jaw mechanism with integrated force feedback sensors for precise control of delicate objects.

**Performance:**
- **Grip force**: 0-50N adjustable
- **Jaw opening**: 0-80mm range
- **Position accuracy**: ±0.05mm
- **Force resolution**: 0.1N

**Materials:**
- Aluminum 6061-T6 frame
- Stainless steel contact surfaces  
- Custom 3D printed soft-jaw inserts
    `
  }
]} />

Comprehensive documentation of a precision robotics project with fully interactive 3D models.
```

### 4. Header Gallery Project

Replace cover image with carousel for immediate visual impact:

```yaml
---
title: "Smart Home Automation"
description: "IoT-based home automation with custom sensors"
gallery:
  - src: "./dashboard.png"
    alt: "Control dashboard"
    caption: "Web-based control interface"
  - src: "./sensors.png"
    alt: "Custom sensors"
    caption: "ESP32-based sensor nodes"
  - src: "./installation.png"
    alt: "Installation"
    caption: "Sensors installed throughout home"
  - src: "./mobile-app.png"
    alt: "Mobile application"
    caption: "iOS/Android control app"
startDate: "2024-03"
status: "completed"
tags: ["iot", "home-automation", "esp32", "web-development"]
---

Complete home automation system with custom IoT sensors, responsive web dashboard, and native mobile control applications.
```

### 5. Competitive Robotics Project (MDX)

Full competition tracking with metrics and tournament history:

```mdx
---
title: "spinny boiii - 3lb Combat Robot"
description: "A competitive beetleweight combat robot with an egg-beater drum weapon"
startDate: "2020-02"
status: "in-progress"
tags: ["spinny boiii", "combat robotics", "cnc machining", "3d printing", "rc control systems"]
cover: "./images/cover.jpg"
metrics:
  sectionTitle: "Robot Specifications"
  customFields:
    - label: "Fighting Weight"
      value: "3.0 lbs"
    - label: "Weapon Tip Speed"
      value: "8,000+ RPM"
    - label: "Build Cost"
      value: "$600-900"
    - label: "Design Iterations"
      value: 4
    - label: "Current Version"
      value: "v3.2"
    - label: "Drive Motors"
      value: "2x Fingertech Silver Spark"
    - label: "Weapon Motor"
      value: "Propdrive 2836"
competitions:
  - name: "RCL Nationals 2025"
    date: "2025-01"
    placement: "Quarterfinals"
    record: "3-1"
    url: "/posts/event-recap-rcl-nationals-2025/"
  - name: "EVAC Cactus Clash 2024"
    date: "2024-11"
    placement: 1
    record: "4-0"
  - name: "ARC Roborumble 2024"
    date: "2024-09"
    placement: 3
    record: "3-2"
  - name: "Desert Bot Battles 2024"
    date: "2024-06"
    placement: "Round of 16"
    record: "2-1"
competitionStats:
  sectionTitle: "Combat Record"
  customStats:
    - label: "Events Entered"
      value: 4
    - label: "Fight Record"
      value: "12-4"
    - label: "Success Rate"
      value: "75%"
      highlight: true
      color: "success"
    - label: "Best Tournament Finish"
      value: "Champion"
      highlight: true
      color: "warning"
    - label: "Favorite Opponent"
      value: "Spinning Disks"
    - label: "Nemesis"
      value: "Horizontal Spinners"
competitionsOptions:
  sectionTitle: "Tournament History"
  maxDisplay: 0
gallery:
  - src: "./images/cover.jpg"
    caption: "Latest iteration of spinny boiii, with a custom CNC-machined weapon and bulky TPU armor"
  - src: "./images/insides.jpg"
    caption: "Internal electronics layout with motors, motor controllers, RC receiver, battery, and power distribution"
  - src: "./images/vsZ3phyr1.jpg"
    caption: "spinny boiii stands his ground against Z3phyr at RCL Nationals 2025"
  - src: "./images/vsZ3phyr2.jpg"
    caption: "Winning the face-to-face engagement with a shower of sparks!"
galleryOptions:
  size: 750
  autoplay: true
  autoplayInterval: 5000
  showThumbnails: true
---

import ModularSection from '../../../components/ModularSection.astro';
import spinnyBoiiiModel from './3Dmodels/spinny_boiii_v3.glb';

spinny boiii is my first serious attempt at building a competitive beetleweight (3-pound) combat robot. The project combines mechanical engineering, electronics design, and manufacturing to create a robot capable of surviving and winning in combat robot competitions.

<ModularSection columns={[
  {
    type: "content",
    title: "Project Overview",
    content: `spinny boiii is a 3-pound beetleweight combat robot designed for vertical spinning disk combat.
    Built with CNC-machined aluminum frame and 3D-printed components, it features a powerful
    brushless motor driving a hardened steel spinning disk at high RPM.`
  },
  {
    type: "model",
    title: "3D Model",
    modelSrc: spinnyBoiiiModel,
    alt: "Interactive 3D model of spinny boiii combat robot",
    modelOptions: {
      autoRotate: true,
      cameraControls: true,
      size: "large"
    }
  }
]} />
```

## File Organization

### Recommended Structure

```
src/content/
├── posts/
│   └── post-name/
│       ├── index.md|mdx      # Post content
│       ├── images/           # Organized assets
│       │   ├── cover.jpg     # Cover image
│       │   ├── photo1.png    # Content images
│       │   └── diagram.webp  # Additional images
│       └── models/           # 3D assets (if needed)
│           └── demo.glb      # 3D models
└── projects/
    └── project-name/
        ├── index.md|mdx      # Project content  
        ├── images/           # Image assets
        │   ├── cover.png     # Project card image
        │   ├── v1-build.jpg  # Progress photos
        │   └── technical.svg # Diagrams & schematics
        └── 3Dmodels/         # 3D assets
            ├── final.glb     # Current version
            └── prototype.glb # Earlier iterations
```

### Asset Guidelines

- **Co-locate assets**: Keep images and models with their content in organized subfolders
- **Use MDX imports**: Import assets for better validation and optimization  
- **Organize by type**: Use `images/` and `3Dmodels/` (or `models/`) subfolders
- **Use .webp**: For cover images when possible (better compression)
- **Use .glb**: For 3D models (smaller than .gltf)
- **Descriptive naming**: Use clear, descriptive filenames (e.g., `v2-assembly.jpg`)
- **Optimize sizes**: Keep models under 5MB, compress images appropriately
- **Cover image naming**: Use `cover.jpg/png/webp` for consistency

## Best Practices

### Content Strategy

1. **Start Simple**: Begin with basic structure, add complexity as needed
2. **Choose the Right Format**: Use `.md` for simple content, `.mdx` for complex layouts
3. **Logical Flow**: Order sections from overview → details → implementation
4. **Visual Balance**: Mix text, images, and interactive elements
5. **Progressive Disclosure**: Overview first, details in sections/versions

### Performance 

1. **Image Optimization**: Use appropriate formats and sizes
2. **Model Optimization**: Keep 3D models under 5MB for best performance
3. **Lazy Loading**: Leverage automatic lazy loading for galleries and models
4. **Mobile First**: Prioritize mobile experience and touch interactions

### Accessibility

1. **Semantic HTML**: Proper heading hierarchy and landmarks
2. **Alt Text**: Detailed descriptions for all images and models
3. **Keyboard Navigation**: All interactive elements accessible via keyboard
4. **Color Contrast**: Ensure sufficient contrast in both light/dark themes
5. **Screen Readers**: ARIA labels and descriptions where needed

This comprehensive system enables rich, flexible content creation while maintaining excellent performance and accessibility across all devices and user needs.
