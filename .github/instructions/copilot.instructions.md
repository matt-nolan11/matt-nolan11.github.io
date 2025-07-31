---
applyTo: '**'
---
Coding standards, domain knowledge, and preferences that AI should follow.

# Agent Guidelines

## General Development
- **Always use Conventional Commits** format.
- **Always use Vitest v3** for testing React components.  
- **Always use JSDoc** style comments to document functions and types thoroughly.  
- **Always use functional components** in React.  
- **Prefer Generics in TypeScript** to avoid the `any` type, where pragmatic.  
- **Leverage the latest features** of React 19.x
- **Use TailwindCSS v4** and **DaisyUI v5** when styling your frontend components. 
- **Always provide completed, functioning code**—avoid partial commits that break builds.  
- **Always use Markdown/MDX** for content pages.
- **Use existing patterns** in the codebase when implementing new features unless otherwise specified.

## Site-Specific Context
- This is **Matt Nolan's personal portfolio and blog** about robotics and making
- Built with **Astro v5** using a custom theme based on the StarGarden theme
- **Default theme**: "business" (dark mode) - maintain this as the default experience
- **Content focus**: Robotics, making, engineering projects, and professional portfolio
- **Dual license**: Code (MIT), Content & Assets (CC BY-NC 4.0)
- **Framework features**: Uses Astro's content collections, MDX, and component islands

## Content Structure & Collections
- **Two main content types**: Posts (`src/content/posts/`) and Projects (`src/content/projects/`)
- **Content collections**: Defined in `src/content/config.ts` with strict Zod schemas
- **Modular content system**: Posts and projects use a flexible section/column layout system
- **Column types**: content, gallery, image, model (3D), sections (nested)
- **Frontmatter standards**: Each content type has specific required and optional fields

## Component Architecture
- **Astro components**: Used for static content and page layouts (`.astro` files)
- **React components**: Used for interactive elements (`.tsx` files)
- **Key components**:
  - `ModularSection.astro` - Renders flexible content sections
  - `ProjectGallery.tsx` - Displays image galleries with carousel functionality
  - `ModelViewer.tsx` - 3D model viewer using @google/model-viewer
  - `TagList.tsx` - Tag display and filtering component
  - `ThemeToggle.astro` - Theme switching functionality

## Content Guidelines
- **Blog posts** should go in `src/content/posts/` with proper frontmatter and MDX format
- **Projects** should go in `src/content/projects/` with proper frontmatter and MDX format
- **Images** should be optimized and placed in content co-located folders (e.g., `src/content/posts/post-name/images/`)
- **SEO** is important - always include proper meta descriptions and titles using astro-seo
- **Accessibility** matters - use semantic HTML and proper alt text
- **3D Models**: Use `.glb` format, place in content folders, reference in model columns

## Theme & Styling
- **Dark mode first** - ensure all new components work well in dark theme
- **DaisyUI themes**: "business" (dark) ↔ "corporate" (light)
- **Responsive design** - mobile-first approach with Tailwind breakpoints
- **Performance** - optimize images, minimize bundle size
- **Design system**: Use DaisyUI components with consistent spacing and typography
- **Rounded containers** - Apply consistent border radius using `rounded-xl` for cards

## Content Schema & Structure
- **Flexible schemas** - Use optional fields and unions to allow content evolution
- **Version support** - Projects can have versioned development with status tracking
- **Tag consistency** - Maintain unified tag vocabulary across posts and projects
- **Customizable headers** - Allow hiding/customizing section headers via frontmatter
- **Rich content types** - Support both simple strings and full Markdown for descriptions
- **Nested sections** - Support complex layouts with nested section/column structures

## UX & Navigation Patterns
- **Visual hierarchy** - Use consistent card layouts and typography scales
- **Active state feedback** - Clearly highlight active tabs, filters, and navigation items
- **Smooth transitions** - Use CSS transitions for hover, focus, and state changes
- **Rounded containers** - Apply consistent border radius to grouped UI elements
- **Accessible interactions** - Ensure keyboard navigation and screen reader support
- **Project cards** - Use consistent badges for status (completed, in-progress, etc.)

## Code Organization & Refactoring
- **Read before editing** - Always understand existing code patterns before making changes
- **Schema-driven development** - Update content schemas first, then components
- **Incremental validation** - Test changes in small increments rather than large refactors
- **Pattern consistency** - Extract reusable patterns into components and utilities
- **Component composition** - Prefer composition over inheritance, use props for customization
- **Type safety** - Leverage TypeScript and Zod schemas for strict type checking

## Content Management
- **Frontmatter standards** - Maintain consistent field naming and typing per content collection schema
- **Asset organization** - Keep images and content co-located for maintainability
- **Version naming** - Use clear, descriptive names for project versions
- **Markdown quality** - Ensure proper heading hierarchy and semantic structure
- **Gallery support** - Use the built-in gallery column type for image collections

## Development Workflow
- **Context gathering** - Use semantic search and file reading to understand codebase
- **Error validation** - Check for errors after edits and fix promptly
- **Theme testing** - Verify changes work in both light and dark modes
- **Responsive testing** - Ensure layouts work across device sizes
- **Content collection awareness** - Understand how Astro content collections work when adding new fields
- **MDX components** - Import components at the top of MDX files when needed for custom layouts

## Testing
- **Unit tests** - Use Vitest for React component testing
- **Component testing** - Test key interactive components like galleries and model viewers
- **Layout testing** - Verify responsive behavior across different screen sizes
- **Theme testing** - Ensure components work in both business (dark) and corporate (light) themes