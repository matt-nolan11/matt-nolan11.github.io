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
- **Always use Markdown** for posts.
- **Use existing patterns** in the codebase when implementing new features unless otherwise specified.

## Site-Specific Context
- This is **Matt Nolan's personal portfolio and blog** about robotics and making
- Built with **Astro** using the StarGarden theme
- **Default theme**: "business" (dark mode) - maintain this as the default experience
- **Content focus**: Robotics, making, engineering projects, and professional portfolio
- **Dual license**: Code (MIT), Content & Assets (CC BY-NC 4.0)

## Content Guidelines
- **Blog posts** should go in `src/content/posts/` with proper frontmatter
- **Images** should be optimized and placed in appropriate asset folders
- **SEO** is important - always include proper meta descriptions and titles
- **Accessibility** matters - use semantic HTML and proper alt text

## Theme & Styling
- **Dark mode first** - ensure all new components work well in dark theme
- **DaisyUI themes**: "business" (dark) ↔ "corporate" (light)
- **Responsive design** - mobile-first approach with Tailwind breakpoints
- **Performance** - optimize images, minimize bundle size

## Content Schema & Structure
- **Flexible schemas** - use optional fields and unions to allow content evolution
- **Version support** - implement versioned content with clear navigation patterns
- **Tag consistency** - maintain unified tag vocabulary across posts and projects
- **Customizable headers** - allow hiding/customizing section headers via frontmatter
- **Rich content types** - support both simple strings and full Markdown for descriptions

## UX & Navigation Patterns
- **Visual hierarchy** - use consistent card layouts and typography scales
- **Active state feedback** - clearly highlight active tabs, filters, and navigation items
- **Smooth transitions** - use CSS transitions for hover, focus, and state changes
- **Rounded containers** - apply consistent border radius to grouped UI elements
- **Accessible interactions** - ensure keyboard navigation and screen reader support

## Code Organization & Refactoring
- **Read before editing** - always understand existing code patterns before making changes
- **Schema-driven development** - update content schemas first, then components
- **Incremental validation** - test changes in small increments rather than large refactors
- **Tool reliability** - use multiple approaches (CSS classes + inline styles) for critical styling
- **Pattern consistency** - extract reusable patterns into components and utilities

## Content Management
- **Frontmatter standards** - maintain consistent field naming and typing
- **Asset organization** - keep images and content co-located for maintainability
- **Version naming** - use clear, descriptive names for project versions
- **Markdown quality** - ensure proper heading hierarchy and semantic structure

## Development Workflow
- **Context gathering** - use semantic search and file reading to understand codebase
- **Error validation** - check for errors after edits and fix promptly
- **Theme testing** - verify changes work in both light and dark modes
- **Responsive testing** - ensure layouts work across device sizes