// Type declarations for Astro.locals.
//
// Astro ships App.Locals as an empty interface for each project to widen. Until
// this augmentation existed, both ends of the frontmatter-tag hand-off were
// ts(2339) errors: the write in src/pages/projects/[slug].astro and the read in
// src/components/ModularSection.astro. The build never cared — `astro build`
// strips types without checking them — so the errors only ever surfaced in the
// editor and in `astro check`.
declare namespace App {
  interface Locals {
    /**
     * Tags from the current project's frontmatter, so Summary can render them
     * without every page passing them down by hand. Set in
     * src/pages/projects/[slug].astro; optional because it is the only route
     * that sets it — anything else reading it will correctly see undefined.
     */
    frontmatterTags?: string[];
  }
}
