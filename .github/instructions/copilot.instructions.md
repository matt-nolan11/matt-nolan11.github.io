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