# Project Gallery Implementation

## Overview

This implementation provides a comprehensive gallery system for project pages with multiple placement options:

- **Main Project Galleries**: Header-level galleries for project overview
- **Version-Specific Galleries**: Individual galleries for each project version  
- **Inline Galleries**: Flexible content sections mixing markdown and galleries
- **Advanced Features**: Swipe, autoplay, keyboard navigation, accessibility

## Gallery Types

### 1. Main Project Gallery
Appears in the project header, with flexible positioning options:

```yaml
---
title: "Your Project"
cover: "./cover.png"
gallery:
  - src: "./image1.png"
    alt: "Description"
    caption: "Optional caption"
galleryPosition: "replace-cover"  # Position option (see below)
galleryTitle: "Custom Gallery Title"  # Optional custom title
---
```

#### Gallery Position Options

**`replace-cover` (Default)**
- Gallery replaces the cover image in the project header
- Appears in left side of header layout alongside project info
- Best for: Hero galleries that showcase the project immediately

**`after-content`**
- Gallery appears as dedicated section after main content
- Full-width layout with prominent section styling
- Best for: Comprehensive galleries that supplement written content

**`before-versions`** 
- Gallery appears just before the project versions section
- Bridges main content and version details
- Best for: Overview galleries showing project evolution

**`dedicated-section`**
- Gallery appears as standalone section with enhanced styling
- Centered layout with background styling for emphasis
- Best for: Galleries that deserve prominent, featured placement

#### Example Configurations

**Hero Gallery (Header):**
```yaml
galleryPosition: "replace-cover"
gallery:
  - src: "./hero1.png"
    alt: "Project overview"
  - src: "./hero2.png" 
    alt: "Different angle"
```

**Process Documentation (After Content):**
```yaml
galleryPosition: "after-content"
galleryTitle: "Development Process"
gallery:
  - src: "./step1.png"
    alt: "Step 1"
    caption: "Initial design"
  - src: "./step2.png"
    alt: "Step 2" 
    caption: "Prototyping"
```

**Evolution Overview (Before Versions):**
```yaml
galleryPosition: "before-versions"
galleryTitle: "Project Evolution"
gallery:
  - src: "./v1-summary.png"
    alt: "Version 1"
  - src: "./v2-summary.png"
    alt: "Version 2"
```

**Featured Gallery (Dedicated Section):**
```yaml
galleryPosition: "dedicated-section"
galleryTitle: "Key Results"
gallery:
  - src: "./result1.png"
    alt: "Performance test"
  - src: "./result2.png"
    alt: "Field testing"
```

#### Page Layout Flow

Here's how galleries appear in the page structure based on position:

```
┌─────────────────────────────────────┐
│ PROJECT HEADER                      │
│ ├─ Gallery (replace-cover)          │  ← Hero gallery
│ ├─ Project Info                     │
│ └─ Action Links                     │
├─────────────────────────────────────┤
│ PROJECT CONTENT (Markdown)          │
│ ├─ Sectioned Content               │  ← Mixed content & galleries
│ └─ More content...                  │
├─────────────────────────────────────┤
│ Gallery (after-content)            │  ← Process/detail gallery
├─────────────────────────────────────┤
│ Gallery (dedicated-section)        │  ← Featured gallery
├─────────────────────────────────────┤
│ Gallery (before-versions)          │  ← Evolution overview
├─────────────────────────────────────┤
│ PROJECT VERSIONS                    │
│ ├─ Version 1 (with gallery)       │  ← Version-specific
│ ├─ Version 2 (with gallery)       │
│ └─ Version 3                       │
├─────────────────────────────────────┤
│ RELATED CONTENT                     │
└─────────────────────────────────────┘
```

### 2. Version-Specific Galleries
Each project version can have its own gallery with customizable options:

```yaml
versions:
  - version: "v2.0"
    title: "Advanced Control System"
    gallery:
      - src: "./v2-assembly.png"
        alt: "V2 Assembly"
        caption: "Upgraded servo motors and control board"
      - src: "./v2-detail.png"
        alt: "Detail View"
        caption: "Improved joint mechanism"
    galleryOptions:
      size: large        # small, medium, large, full
      autoplay: true
      autoplayInterval: 3000
      showThumbnails: true
      showIndicators: true
      
  - version: "v1.0"
    title: "Basic Prototype"
    gallery:
      - src: "./v1-prototype.png"
        alt: "V1 Prototype"
    galleryOptions:
      size: small       # Smaller gallery for this version
      autoplay: false
```

#### Version Gallery Size Options:
- **`small`**: Quarter-width gallery (lg:w-1/4)
- **`medium`**: One-third width gallery (lg:w-1/3) - default
- **`large`**: Half-width gallery (lg:w-1/2)  
- **`full`**: Full-width layout with gallery below content

### 3. Inline Galleries (Sectioned Content)
Create flexible layouts mixing markdown content and galleries using the `sections` array:

```yaml
---
title: "Your Project"
cover: "./cover.png"
sections:
  - type: content
    title: "Introduction"
    content: |
      This is some markdown content that appears first.
      
      You can write multiple paragraphs, use **bold text**, 
      *italics*, and all other markdown features.
      
  - type: gallery
    title: "Early Prototypes"
    gallery:
      - src: "./image1.png"
        alt: "First prototype"
        caption: "Our initial design"
      - src: "./image2.png"  
        alt: "Second prototype"
        caption: "Improved version"
    galleryOptions:
      size: medium
      autoplay: false
      showThumbnails: true
      
  - type: content
    content: |
      After seeing the early prototypes, we decided to make 
      some major improvements. Here's what we learned:
      
      - The design needed better ergonomics
      - We had to optimize for manufacturing costs
      - User feedback was crucial
      
  - type: gallery
    title: "Final Results"
    gallery:
      - src: "./final1.png"
        alt: "Final product"
      - src: "./final2.png"
        alt: "Final product in use"
    galleryOptions:
      size: large
      autoplay: true
      autoplayInterval: 3000
---

<!-- This main content appears first, before any sections -->
This project was an exciting journey from concept to completion.
```

## Sectioned Content Usage

### Content Sections
```yaml
- type: content
  title: "Optional Section Title"  # Optional
  content: |
    Markdown content goes here.
    
    - Supports lists
    - **Bold** and *italic* text
    - Links and other markdown features
```

### Gallery Sections  
```yaml
- type: gallery
  title: "Gallery Title"  # Optional
  gallery:
    - src: "./image1.png"
      alt: "Required alt text"
      caption: "Optional caption"
  galleryOptions:  # All optional
    size: medium  # small, medium, large, full OR custom pixel width (200-1200)
    autoplay: false
    autoplayInterval: 4000
    showThumbnails: true
    showIndicators: true
```

### Gallery Options

#### Size Options
- **Preset sizes**: 
  - `"small"` - max-w-md (448px max width)
  - `"medium"` - max-w-2xl (672px max width) 
  - `"large"` - max-w-4xl (896px max width)
  - `"full"` - w-full (100% width)
- **Custom numeric sizing**: Any number between 200-1200 (pixel width)
  - Example: `size: 600` sets max-width to 600px
  - Example: `size: 950` sets max-width to 950px

#### Other Options
- `autoplay`: Enable/disable automatic slideshow (default: false)
- `autoplayInterval`: Milliseconds between slides (default: 4000)
- `showThumbnails`: Show thumbnail navigation (default: true)
- `showIndicators`: Show dot indicators (default: true)

#### Size Examples
```yaml
# Preset sizing
galleryOptions:
  size: large

# Custom numeric sizing  
galleryOptions:
  size: 750

# Small custom gallery
galleryOptions:
  size: 400
  showThumbnails: false

### Examples

**Alternating Content and Galleries:**
```yaml
sections:
  - type: content
    title: "Design Phase"
    content: |
      We started with sketches and CAD models...
      
  - type: gallery
    title: "Design Process"
    gallery:
      - src: "./sketch.png"
        alt: "Initial sketch"
      - src: "./cad.png"
        alt: "CAD model"
    galleryOptions:
      size: medium
      
  - type: content
    title: "Implementation"
    content: |
      Moving from design to implementation required...
      
  - type: gallery
    title: "Build Process"
    gallery:
      - src: "./parts.png"
        alt: "Components"
      - src: "./assembly.png"
        alt: "Assembly process"
    galleryOptions:
      size: large
      autoplay: true
```

**Multiple Galleries with Different Styling:**
```yaml
sections:
  - type: gallery
    title: "Overview"
    gallery:
      - src: "./hero.png"
        alt: "Hero shot"
    galleryOptions:
      size: full
      showThumbnails: false
      showIndicators: false
      
  - type: content
    content: |
      Detailed explanation here...
      
  - type: gallery
    title: "Technical Details"
    gallery:
      - src: "./detail1.png"
        alt: "Detail view 1"
      - src: "./detail2.png" 
        alt: "Detail view 2"
      - src: "./detail3.png"
        alt: "Detail view 3"
    galleryOptions:
      size: small
      autoplay: false
```

## 4. Advanced Layout Options

The gallery system now supports advanced layout options that allow for sophisticated combinations of text and images:

### 4.1 Gallery Layout Types

#### `layout: 'default'` (Default)
Standard gallery display - full width within its container.

#### `layout: 'side-by-side'` 
Gallery and content appear side-by-side in a two-column layout.

```yaml
sections:
  - type: gallery
    title: "Design Process"
    content: |
      The initial design phase involved extensive research into servo motor
      specifications and mechanical constraints. We needed to balance
      precision with cost-effectiveness.
    gallery:
      - src: "./design1.png"
        alt: "Initial sketches"
      - src: "./design2.png"
        alt: "CAD models"
    galleryOptions:
      layout: side-by-side
      size: medium
```

#### `layout: 'wrapped'`
Gallery floats alongside content, allowing text to wrap around it.

```yaml
galleryOptions:
  layout: wrapped
  float: left          # left, right, or center
  size: 300           # Custom pixel size works best for wrapped
```

#### `layout: 'stacked'`
Content appears above the gallery in a stacked layout.

```yaml
galleryOptions:
  layout: stacked
  size: large
```

### 4.2 Float Positioning Control

For both `side-by-side` and `wrapped` layouts, you can control which side the gallery appears on using the `float` option:

#### Available Float Options
- **`float: 'left'`** - Gallery appears on the left side
- **`float: 'right'`** - Gallery appears on the right side  
- **`float: 'center'`** - Gallery appears centered (for wrapped layout)

#### Side-by-Side Layout Examples

**Gallery on Left, Content on Right (default):**
```yaml
sections:
  - type: gallery
    title: "Development Process"
    content: |
      The development process involved multiple iterations and testing phases.
      Each iteration brought us closer to the final design specifications.
    gallery:
      - src: "./process1.png"
        alt: "Development phase 1"
      - src: "./process2.png"
        alt: "Development phase 2"
    galleryOptions:
      layout: side-by-side
      float: left          # Gallery on left (default)
      size: medium
```

**Gallery on Right, Content on Left:**
```yaml
sections:
  - type: gallery
    title: "Testing Results"
    content: |
      Our testing phase revealed several important insights about the
      system's performance under various operating conditions.
    gallery:
      - src: "./test1.png"
        alt: "Test setup"
      - src: "./test2.png"
        alt: "Results visualization"
    galleryOptions:
      layout: side-by-side
      float: right         # Gallery on right
      size: medium
```

#### Wrapped Layout Examples

**Gallery Wrapped Left:**
```yaml
versions:
  - version: "v2.0"
    title: "Advanced Features"
    gallery:
      - src: "./v2-feature1.png"
        alt: "New control interface"
      - src: "./v2-feature2.png"
        alt: "Improved mechanics"
    galleryOptions:
      layout: wrapped
      float: left          # Gallery floats left, text wraps around right
      size: 350
      autoplay: true
    content: |
      This version introduced several breakthrough features that significantly
      improved the system's capabilities. The new control interface provided
      much more intuitive operation, while the mechanical improvements
      increased precision by an order of magnitude.
      
      The integrated feedback system allowed for real-time monitoring and
      adjustment of all operational parameters. This was particularly
      important for maintaining stability during complex maneuvers.
```

**Gallery Wrapped Right:**
```yaml
versions:
  - version: "v3.0"
    title: "Professional Integration"
    gallery:
      - src: "./v3-integration.png"
        alt: "ROS integration"
      - src: "./v3-interface.png"
        alt: "Professional interface"
    galleryOptions:
      layout: wrapped
      float: right         # Gallery floats right, text wraps around left
      size: 400
      showThumbnails: true
    content: |
      The transition to professional-grade systems required a complete
      architectural redesign. We integrated ROS (Robot Operating System)
      to provide industry-standard capabilities and ensure compatibility
      with existing automation frameworks.
      
      This integration opened up possibilities for advanced features like
      trajectory planning, collision avoidance, and multi-robot coordination.
```

#### Version Gallery Layout Control

You can also control layout positioning for version-specific galleries:

```yaml
versions:
  - version: "v4.0"
    title: "AI-Powered Operation"
    gallery:
      - src: "./ai-training.png"
        alt: "Neural network training"
      - src: "./ai-results.png"
        alt: "Autonomous operation"
    galleryOptions:
      layout: side-by-side
      float: right         # Gallery on right side of version content
      size: large
      autoplay: false
    content: |
      The latest iteration incorporates machine learning for autonomous
      operation and task adaptation...
```

#### Responsive Behavior

All layout options are responsive:
- **Desktop (lg+)**: Full side-by-side or wrapped behavior
- **Tablet (md)**: May stack vertically depending on content length
- **Mobile (sm)**: Always stacks vertically for optimal readability

#### Layout Combination Examples

**Mixed Layout Section:**
```yaml
sections:
  - type: gallery
    title: "Overview"
    gallery:
      - src: "./overview.png"
        alt: "System overview"
    galleryOptions:
      layout: default      # Full width overview
      size: full
      
  - type: gallery
    title: "Technical Details"
    content: |
      Detailed technical specifications and performance metrics.
    gallery:
      - src: "./specs1.png"
        alt: "Performance charts"
      - src: "./specs2.png"
        alt: "Technical drawings"
    galleryOptions:
      layout: side-by-side
      float: left          # Technical gallery on left
      size: medium
      
  - type: gallery
    title: "User Interface"
    content: |
      The intuitive interface design prioritizes ease of use while
      maintaining access to advanced features for power users.
    gallery:
      - src: "./ui1.png"
        alt: "Main interface"
      - src: "./ui2.png"
        alt: "Advanced settings"
    galleryOptions:
      layout: wrapped
      float: right         # UI gallery wrapped right
      size: 350
```

## Use Cases

### Gallery Positioning Strategies

**Use `replace-cover` when:**
- You have multiple compelling hero images
- The project is visually driven (robotics, mechanical designs)
- You want immediate visual impact

**Use `after-content` when:**
- Gallery supplements detailed technical content
- You want readers to understand context before seeing images
- Gallery shows implementation details or results

**Use `before-versions` when:**
- Project has multiple versions and you want to show evolution
- Gallery provides overview before diving into version specifics
- You want to highlight the progression story

**Use `dedicated-section` when:**
- Gallery deserves special emphasis (awards, publications, etc.)
- Images represent key achievements or breakthroughs
- You want the gallery to stand out visually

**Use `sections` array when:**
- You need complex layouts mixing content and galleries
- You want galleries interspersed with explanatory text
- You need maximum flexibility in content organization

### Content Strategy Examples

### 1. Process Documentation (Using Sections)
Show step-by-step assembly or development process:

```yaml
sections:
  - type: content
    title: "Assembly Overview"
    content: |
      The construction involved several key phases that required careful planning.
      
  - type: gallery
    title: "Construction Phases"
    gallery:
      - src: "./phase1.png"
        alt: "Phase 1"
        caption: "Initial frame assembly"
      - src: "./phase2.png"
        alt: "Phase 2" 
        caption: "Electronics integration"
      - src: "./phase3.png"
        alt: "Phase 3"
        caption: "Final testing"
    galleryOptions:
      autoplay: true
      size: medium
```

### 2. Before/After Comparisons
```yaml
sections:
  - type: content
    title: "Design Evolution"
    content: |
      The design went through several iterations before reaching the final form.
      
  - type: gallery
    title: "Design Comparison"
    gallery:
      - src: "./before.png"
        alt: "Original design"
        caption: "Initial concept"
      - src: "./after.png"
        alt: "Final design"
        caption: "Refined implementation"
    galleryOptions:
      size: large
      showThumbnails: false
```

### 3. Technical Details
```yaml
sections:
  - type: content
    title: "Circuit Board Design"
    content: |
      The electronics required a custom PCB design with careful attention to signal routing.
      
  - type: gallery
    title: "Electronics Design"
    gallery:
      - src: "./schematic.png"
        alt: "Circuit schematic"
      - src: "./pcb-top.png"
        alt: "PCB top layer"
      - src: "./pcb-bottom.png"
        alt: "PCB bottom layer"
    galleryOptions:
      showThumbnails: true
      size: medium
```

## Advanced Features

### Accessibility
- Full ARIA support
- Keyboard navigation (←/→, Space, Home/End)
- Screen reader announcements
- Focus management

### Performance
- Lazy loading for off-screen images
- Eager loading for first image
- Optimized for mobile devices

### Styling
- Dark mode compatible
- Responsive design
- DaisyUI integration
- Smooth animations

## Migration Guide

### From Simple Images to Sectioned Galleries
**Before:**
```markdown
![Assembly process](./assembly.png)

Some text here.

![Final result](./final.png)
```

**After:**
```yaml
sections:
  - type: gallery
    gallery:
      - src: "./assembly.png"
        alt: "Assembly process"
    galleryOptions:
      size: medium
      
  - type: content
    content: |
      Some text here.
      
  - type: gallery
    gallery:
      - src: "./final.png"
        alt: "Final result"
```

### From Version Images to Galleries
**Before:**
```yaml
versions:
  - version: "v1.0"
    images:
      - "./v1-img1.png"
      - "./v1-img2.png"
```

**After:**
```yaml
versions:
  - version: "v1.0"
    gallery:
      - src: "./v1-img1.png"
        alt: "V1 Assembly"
        caption: "Initial prototype"
      - src: "./v1-img2.png"  
        alt: "V1 Testing"
        caption: "Performance validation"
```

## Future Enhancements

- Lightbox/fullscreen mode
- Video support in galleries
- Image comparison sliders
- Batch image optimization
- Gallery templates
- Custom transition effects
