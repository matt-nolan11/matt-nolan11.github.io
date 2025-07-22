import type { CollectionEntry } from 'astro:content';
import { getSortableDate } from './dateUtils';

/**
 * Gets featured projects for the homepage display
 * @param projects - Array of all projects
 * @param maxCount - Maximum number of projects to return (default: 6)
 * @returns Array of projects for homepage display
 *
 * Projects with `featured: true` in frontmatter are prioritized. If fewer than maxCount are manually featured,
 * the remaining slots are filled with the most recent non-featured projects.
 */
export function getFeaturedProjects(
  projects: CollectionEntry<'projects'>[],
  maxCount: number = 6
): CollectionEntry<'projects'>[] {
  // Collect all featured projects with their order
  const featured = projects.filter(p => !p.data.draft && p.data.featured === true);
  const manualOrder: Array<{ project: CollectionEntry<'projects'>; order: number }> = [];
  const usedOrders = new Set<number>();
  for (const p of featured) {
    if (typeof p.data.featuredOrder === 'number') {
      if (p.data.featuredOrder < 1 || p.data.featuredOrder > maxCount) {
        throw new Error(`Project '${p.data.title}' has featuredOrder ${p.data.featuredOrder}, which is out of bounds (1-${maxCount}).`);
      }
      if (usedOrders.has(p.data.featuredOrder)) {
        throw new Error(`Duplicate featuredOrder ${p.data.featuredOrder} found for project '${p.data.title}'. Each featuredOrder must be unique.`);
      }
      usedOrders.add(p.data.featuredOrder);
      manualOrder.push({ project: p, order: p.data.featuredOrder });
    }
  }

  // Sort manualOrder by order
  manualOrder.sort((a, b) => a.order - b.order);

  // Fill in the featured array at the specified positions (1-based)
  const slots: Array<CollectionEntry<'projects'> | undefined> = Array(maxCount).fill(undefined);
  for (const { project, order } of manualOrder) {
    slots[order - 1] = project;
  }

  // Get remaining featured projects (without featuredOrder), sorted by most recent date
  const unorderedFeatured = featured
    .filter(p => typeof p.data.featuredOrder !== 'number')
    .sort((a, b) => {
      const aDate = a.data.endDate || a.data.startDate;
      const bDate = b.data.endDate || b.data.startDate;
      return getSortableDate(bDate).getTime() - getSortableDate(aDate).getTime();
    });

  // Fill empty slots with unordered featured projects
  let unorderedIdx = 0;
  for (let i = 0; i < maxCount; i++) {
    if (!slots[i] && unorderedIdx < unorderedFeatured.length) {
      slots[i] = unorderedFeatured[unorderedIdx++];
    }
  }

  // Get recent non-featured projects
  const recentProjects = projects
    .filter(p => !p.data.draft && p.data.featured !== true)
    .sort((a, b) => {
      const aDate = a.data.endDate || a.data.startDate;
      const bDate = b.data.endDate || b.data.startDate;
      return getSortableDate(bDate).getTime() - getSortableDate(aDate).getTime();
    });

  // Fill any remaining empty slots with recent non-featured projects
  let recentIdx = 0;
  for (let i = 0; i < maxCount; i++) {
    if (!slots[i] && recentIdx < recentProjects.length) {
      slots[i] = recentProjects[recentIdx++];
    }
  }

  // Return the filled slots, filtering out any undefined (shouldn't happen)
  return slots.filter(Boolean).slice(0, maxCount) as CollectionEntry<'projects'>[];
}
