import type { CollectionEntry } from 'astro:content';
import { getSortableDate } from './dateUtils';

/**
 * Gets featured projects for the homepage display
 * @param projects - Array of all projects
 * @param maxCount - Maximum number of projects to return (default: 6)
 * @returns Array of projects for homepage display
 */
export function getFeaturedProjects(
  projects: CollectionEntry<'projects'>[],
  maxCount: number = 6
): CollectionEntry<'projects'>[] {
  // Get manually featured projects first
  const featuredProjects = projects
    .filter(project => !project.data.draft && project.data.featured)
    .sort((a, b) => {
      // Sort featured projects by most recent date
      const aDate = a.data.endDate || a.data.startDate;
      const bDate = b.data.endDate || b.data.startDate;
      return getSortableDate(bDate).getTime() - getSortableDate(aDate).getTime();
    });

  // If we have fewer than maxCount featured projects, fill with recent non-featured ones
  const recentProjects = projects
    .filter(project => !project.data.draft && !project.data.featured)
    .sort((a, b) => {
      const aDate = a.data.endDate || a.data.startDate;
      const bDate = b.data.endDate || b.data.startDate;
      return getSortableDate(bDate).getTime() - getSortableDate(aDate).getTime();
    });

  // Combine featured + recent to get up to maxCount projects total
  return [
    ...featuredProjects,
    ...recentProjects.slice(0, Math.max(0, maxCount - featuredProjects.length))
  ];
}
