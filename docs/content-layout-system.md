# Content Layout System Documentation

## Overview

This documentation covers the complete content and layout system for Matt Nolan's portfolio website. The system provides flexible, responsive layouts for both simple blog posts and complex engineering project documentation.

### Key Features

- **Flexible Content Architecture**: Support for posts and projects with different complexity levels
- **Modular Section System**: Mix text, images, galleries, and nested layouts
- **Project Versioning**: Track project evolution through multiple iterations
- **Advanced Gallery System**: Touch-friendly carousels with accessibility features
- **Responsive Design**: Mobile-first approach with DaisyUI dark/light themes
- **TypeScript Schema Validation**: Type-safe content with automatic validation

## Content Types

### 1. Posts (Blog Content)

Simple content structure for blog posts about robotics, astronomy, and engineering topics.

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

**Basic Project Structure:**
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
---

Your main project description and content here.
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
| `tags` | array | | Technology/topic tags |
| `githubUrl` | url | | Project repository link |
| `liveUrl` | url | | Live demo/deployment link |
| `gallery` | array | | Header gallery (replaces cover) |
| `sections` | array | | Modular content sections |
| `versionsTitle` | string | | Custom versions section title |
| `versions` | array | | Project version iterations |

## Modular Section System

The core of the layout system is the modular section architecture that supports complex, responsive layouts with up to 4 columns per section and unlimited nesting depth.

### Basic Section Structure

```yaml
sections:
  - columns:
    - type: "content"
      title: "Section Title"
      content: |
        Markdown content here
    - type: "gallery"
      title: "Images"
      gallery:
        - src: "./image1.png"
          alt: "Description"
          caption: "Optional caption"
```

### Column Types

#### 1. Content Columns
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
- Full markdown rendering with `marked` library
- Automatic heading level adjustment based on nesting depth
- Responsive typography with `prose` classes
- Dark mode compatible styling

#### 2. Gallery Columns
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
- Touch/swipe support for mobile devices
- Keyboard navigation (←/→, Space, Home/End)
- Thumbnail navigation with visual feedback
- Lazy loading for performance
- ARIA accessibility labels
- Responsive autoplay controls
- Customizable sizing and behavior

#### 3. Single Image Columns
```yaml
- type: "image"
  src: "./diagram.png"
  alt: "System architecture diagram"
  caption: "Optional caption"
```

**Features:**
- Optimized image loading
- Responsive sizing
- Caption support with styling
- Accessibility compliance

#### 4. Nested Section Columns
```yaml
- type: "sections"
  sections:
    - columns:
      - type: "content"
        content: "Nested content here"
      - type: "gallery"
        gallery: [...]
```

**Nested Features:**
- Unlimited nesting depth
- Automatic indentation and visual hierarchy
- Responsive column stacking
- Consistent spacing and typography

### Layout Patterns

#### Two-Column Layout (50/50)
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

#### Three-Column Layout (33/33/33)
```yaml
sections:
  - columns:
    - type: "content"
      content: "Left column"
    - type: "gallery"
      gallery: [...]
    - type: "content"
      content: "Right column"
```

#### Four-Column Layout (25/25/25/25)
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

#### Asymmetric Layouts
The system automatically handles responsive behavior - columns stack vertically on smaller screens while maintaining the intended layout on desktop.

## Project Versions System

Track project evolution through multiple iterations with rich documentation, galleries, and nested sections for each version.

### Version Schema Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | ✓ | Version identifier (e.g., "v1", "2.0") |
| `title` | string | ✓ | Version name/title |
| `description` | string | ✓ | Brief version description |
| `startDate` | date/string | ✓ | Development start date |
| `endDate` | date/string | | Completion date |
| `status` | enum | | "completed", "in-progress", "planned" |
| `githubUrl` | url | | Version-specific repository link |
| `liveUrl` | url | | Version-specific demo link |
| `achievements` | array | | Key accomplishments |
| `learnings` | array | | Insights gained |
| `content` | string | | Legacy markdown content |
| `images` | array | | Legacy image array |
| `gallery` | array | | Version gallery |
| `galleryOptions` | object | | Gallery configuration |
| `sections` | array | | Modular sections |

### Basic Version Structure

```yaml
versions:
  - version: "v2.0"
    title: "Advanced Control System"
    description: "Upgraded to stepper motors with precise positioning"
    startDate: "2023-06"
    endDate: "2023-12"
    status: "completed"
    githubUrl: "https://github.com/user/project/tree/v2"
    
  - version: "v1.0"
    title: "Basic Prototype"
    description: "Initial servo-based design"
    startDate: "2023-01"
    endDate: "2023-05"
    status: "completed"
```

### Enhanced Versions with Rich Content

```yaml
versions:
  - version: "v3.0"
    title: "ROS Integration"
    description: "Professional-grade control with ROS framework"
    startDate: "2024-01"
    status: "in-progress"
    achievements:
      - "Implemented ROS control nodes"
      - "Added trajectory planning"
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

#### Performance
- **Lazy Loading**: Images load as needed for better performance
- **Optimized Transitions**: Smooth 800ms animations
- **Memory Management**: Proper cleanup of intervals and observers
- **Responsive Images**: Automatic sizing hints for different viewports

#### Performance
- **Lazy Loading**: Off-screen images load only when needed
- **Eager Loading**: First image loads immediately
- **Optimized Rendering**: Efficient slide transitions
- **Responsive Images**: Automatic size optimization

#### Visual Features
- **Captions**: Overlay text with gradient background
- **Thumbnails**: Scrollable thumbnail navigation
- **Indicators**: Dot navigation with active states
- **Progress**: Current slide counter
- **Play/Pause**: Visual autoplay controls

## Responsive Design

### Breakpoint Behavior

#### Mobile (< 768px)
- All columns stack vertically
- Full-width galleries
- Simplified navigation
- Touch-optimized interactions

#### Tablet (768px - 1024px)
- 2-column layouts maintained
- 3+ columns may stack
- Responsive gallery sizing
- Hybrid touch/mouse support

#### Desktop (> 1024px)
- Full multi-column layouts
- Side-by-side content
- Hover interactions
- Keyboard shortcuts visible

### Column Stacking Rules

1. **4 columns** → 2x2 grid (tablet) → 1 column (mobile)
2. **3 columns** → 2+1 layout (tablet) → 1 column (mobile)
3. **2 columns** → Maintained (tablet) → 1 column (mobile)
4. **1 column** → Maintained across all breakpoints

## Content Strategy Examples

### 1. Simple Project Structure

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

### 2. Multi-Section Project Layout

For projects requiring detailed documentation:

```yaml
---
title: "Autonomous Rover"
description: "Computer vision-enabled autonomous navigation robot"
cover: "./cover.png"
startDate: "2023-06"
status: "in-progress"
featured: true
tags: ["robotics", "computer-vision", "raspberry-pi"]
sections:
  - columns:
    - type: "content"
      title: "Project Overview"
      content: |
        This autonomous rover uses computer vision and LIDAR
        to navigate complex environments without human intervention.
        
        The project combines multiple sensors and AI algorithms
        to create a robust navigation system.
    - type: "gallery"
      gallery:
        - src: "./rover-overview.png"
          alt: "Rover overview"
          caption: "Complete rover assembly"
        - src: "./rover-sensors.png"
          alt: "Sensor layout"
          caption: "LIDAR and camera positioning"
  
  - columns:
    - type: "content"
      title: "Technical Architecture"
      content: |
        ### Hardware Stack
        - Raspberry Pi 4 (main compute)
        - Arduino Nano (motor control)
        - RPLiDAR A1 (navigation)
        - USB camera (computer vision)
        - 12V battery system
        
        ### Software Stack
        - Python 3.9+ (main application)
        - OpenCV (computer vision)
        - ROS Noetic (robotics framework)
        - TensorFlow Lite (ML inference)
        
    - type: "sections"
      sections:
        - columns:
          - type: "gallery"
            title: "Component Layout"
            gallery:
              - src: "./electronics.png"
                alt: "Electronics layout"
                caption: "Modular electronics design"
              - src: "./wiring.png"
                alt: "Wiring diagram"
                caption: "System interconnections"
          - type: "content"
            content: |
              The modular design allows for easy component
              upgrades and maintenance. Each subsystem can
              be tested independently.
---

The rover represents the culmination of several months of research into autonomous navigation algorithms and real-world robotics implementation.
```

### 3. Versioned Project Evolution

For projects with multiple development iterations:

```yaml
---
title: "6-DOF Robot Arm"
description: "Multi-version robotic arm exploring different control approaches"
cover: "./cover.png"
startDate: "2023-01"
status: "in-progress"
featured: true
versionsTitle: "Development Phases"
sections:
  - columns:
    - type: "content"
      title: "Project Evolution"
      content: |
        This project spans 18 months of iterative development,
        with each version building upon lessons learned from
        the previous iteration.
    - type: "gallery"
      gallery:
        - src: "./evolution.png"
          alt: "Project evolution timeline"
          caption: "From servo prototype to AI-powered system"

versions:
  - version: "v3.0"
    title: "ROS Integration"
    description: "Professional control system with MoveIt! planning"
    startDate: "2024-01"
    status: "in-progress"
    achievements:
      - "Integrated ROS Noetic framework"
      - "Implemented MoveIt! motion planning"
      - "Added collision detection system"
      - "Created custom URDF model"
    learnings:
      - "ROS ecosystem requires significant learning investment"
      - "URDF modeling critical for accurate simulation"
      - "Motion planning dramatically improves safety"
    sections:
      - columns:
        - type: "content"
          title: "Control Architecture"
          content: |
            The ROS-based control system provides professional-grade
            capabilities for complex manipulation tasks.
            
            ### Key Components
            - Joint state publisher
            - Motion planning interface
            - Collision checking
            - Trajectory execution
            
        - type: "gallery"
          gallery:
            - src: "./ros-architecture.png"
              alt: "ROS control architecture"
              caption: "Node graph showing system components"
            - src: "./moveit-planning.png"
              alt: "MoveIt! motion planning"
              caption: "Path planning visualization"
          galleryOptions:
            size: "medium"
            autoplay: true
            autoplayInterval: 6000
              
  - version: "v2.0"
    title: "Stepper Motor Upgrade"
    description: "Precision control with stepper motors and encoders"
    startDate: "2023-06"
    endDate: "2023-12"
    status: "completed"
    achievements:
      - "Replaced all servos with NEMA 17 steppers"
      - "Added rotary encoders for feedback"
      - "Implemented PID control loops"
    learnings:
      - "Stepper motors provide much better repeatability"
      - "Closed-loop control essential for precision"
      - "Gear reduction critical for torque requirements"
    gallery:
      - src: "./v2-assembly.png"
        alt: "V2 stepper motor assembly"
        caption: "NEMA 17 steppers with planetary gearboxes"
      - src: "./v2-control-board.png"
        alt: "Custom control board"
        caption: "Arduino-based stepper drivers"
    galleryOptions:
      size: "medium"
      autoplay: false
      showThumbnails: true
      
  - version: "v1.0"
    title: "Servo Prototype"
    description: "Initial proof-of-concept with hobby servos"
    startDate: "2023-01"
    endDate: "2023-05"
    status: "completed"
    achievements:
      - "Functional 6-DOF kinematics"
      - "Basic inverse kinematics solver"
      - "Serial control interface"
    learnings:
      - "Servo precision insufficient for fine manipulation"
      - "Gear backlash causes positioning errors"
      - "Need for closed-loop control systems"
      - "Weight distribution affects stability"
    content: |
      The initial prototype used standard hobby servos and
      3D-printed joints. While functional, it revealed several
      limitations that guided the next iteration.
---

This robot arm project explores different control methodologies through 
iterative design improvements over 18 months of development.
```

### 4. Header Gallery Usage

Replace the cover image with a gallery for immediate visual impact:

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
    caption: "Installed throughout the home"
  - src: "./mobile-app.png"
    alt: "Mobile application"
    caption: "iOS/Android control app"
startDate: "2024-03"
status: "completed"
tags: ["iot", "home-automation", "esp32", "web-development"]
---

Complete home automation system with custom sensors, web dashboard, and mobile control applications.
```

## Page Layout Flow

Understanding how content is rendered on the final page:

```
┌─────────────────────────────────────┐
│ PROJECT HEADER                      │
│ ├─ Gallery OR Cover Image           │  ← Hero visual
│ ├─ Title, Description, Metadata     │  ← Project info
│ ├─ Tags, Status, Dates              │  ← Metadata
│ └─ GitHub/Live Links                │  ← Action buttons
├─────────────────────────────────────┤
│ MAIN CONTENT (Markdown)             │  ← Project description
│ ├─ Standard markdown rendering      │
│ └─ Full typography support          │
├─────────────────────────────────────┤
│ MODULAR SECTIONS                    │  ← Custom layouts
│ ├─ Section 1 (1-4 columns)          │
│ ├─ Section 2 (nested sections)      │
│ └─ Section N (mixed content)        │
├─────────────────────────────────────┤
│ PROJECT VERSIONS                    │  ← Version timeline
│ ├─ Version navigation tabs          │
│ ├─ Active version content           │
│ ├─ Version galleries/sections       │
│ └─ Achievements/learnings           │
├─────────────────────────────────────┤
│ RELATED PROJECTS                    │  ← Tag-based suggestions
│ └─ Project cards with previews      │
└─────────────────────────────────────┘
```

## Best Practices

### Content Organization

1. **Start Simple**: Begin with basic structure, add complexity as needed
2. **Logical Flow**: Order sections from overview → details → implementation
3. **Visual Balance**: Mix text and images for engaging layouts
4. **Scannable Content**: Use headings and lists for easy scanning
5. **Progressive Disclosure**: Show overview first, details in sections/versions

### Performance Considerations

1. **Image Optimization**: Use WebP format when possible (Astro should do this for you, but double check!), with appropriate sizes
2. **Lazy Loading**: Galleries automatically implement lazy loading
3. **Progressive Enhancement**: Core content loads first, enhancements follow
4. **Mobile Experience**: Prioritize mobile-friendly layouts and touch interactions
5. **Bundle Size**: Keep galleries and interactions in separate chunks

### SEO and Discoverability

1. **Descriptive Titles**: Clear, searchable project names
2. **Meta Descriptions**: Concise 160-character descriptions with key terms
3. **Relevant Tags**: Use consistent, descriptive tags across projects
4. **Structured Content**: Proper heading hierarchy (h1 → h2 → h3)
5. **Image Alt Text**: Detailed descriptions for screen readers and SEO

### Accessibility

1. **Semantic HTML**: Use proper heading structure and landmarks
2. **Keyboard Navigation**: All interactive elements keyboard accessible
3. **Screen Readers**: ARIA labels and descriptions where needed
4. **Color Contrast**: Ensure sufficient contrast in both themes
5. **Focus Management**: Clear focus indicators and logical tab order

## Technical Implementation

### Component Architecture

- **Layout.astro**: Main page wrapper with metadata and SEO
- **ModularSection.astro**: Handles section rendering with column layouts
- **ProjectGallery.tsx**: React gallery component with interactions
- **RecursiveSection.astro**: Manages unlimited nesting depth
- **NestedSection.astro**: Alternative nested section renderer

### Schema Validation

All content is validated against TypeScript schemas ensuring:
- **Type Safety**: Compile-time error detection
- **Required Fields**: Automatic validation of mandatory content
- **Consistent Structure**: Enforced schema across all content
- **Evolution Support**: Backward compatibility with schema changes

### Responsive Implementation

- **CSS Grid**: Flexible column layouts with `grid-template-columns`
- **TailwindCSS**: Mobile-first breakpoints and responsive utilities
- **DaisyUI**: Consistent theming across light/dark modes
- **Container Queries**: Component-level responsive behavior

### State Management

- **Keen Slider**: Gallery state management and touch interactions
- **React Hooks**: Component state for autoplay and navigation
- **Event Handling**: Custom events for version tab changes
- **Performance**: Optimized re-renders and memory management

## Migration and Maintenance

### Content Migration

When updating existing content:

1. **Backup Current Content**: Git history provides version control
2. **Update Schema First**: Modify `src/content/config.ts` if needed
3. **Gradual Migration**: Update content incrementally, not all at once
4. **Test Thoroughly**: Verify both development and production builds
5. **Monitor Performance**: Check bundle size and loading times

### Schema Evolution

When adding new features:

1. **Backward Compatibility**: Ensure existing content continues to work
2. **Optional Fields**: New features should be optional by default
3. **Migration Guides**: Document changes for content creators
4. **Version Control**: Tag schema changes for rollback capability

### Performance Monitoring

Regular checks for:

1. **Bundle Size**: Monitor JavaScript and CSS bundle growth
2. **Image Optimization**: Ensure images are properly compressed
3. **Loading Times**: Test on various devices and connections
4. **Accessibility**: Regular accessibility audits
5. **SEO Performance**: Monitor search engine indexing and ranking

This documentation provides a comprehensive guide to the content layout system, enabling rich, flexible content creation while maintaining performance and accessibility standards.
