/**
 * Shared content-collection helpers.
 *
 * isMainEntry       – filters out version files (v1.mdx, etc.), keeping only index.mdx
 * sortProjectsOngoingFirst – ongoing projects first (by start date), then completed (by end date)
 */
import type { CollectionEntry } from 'astro:content';
import { getSortableDate } from './dateUtils';

function normalizeEntryId(id: string): string {
  return id.replace(/\\/g, '/');
}

/**
 * Returns a stable route slug for content entries across Astro versions/loaders.
 */
export function getEntrySlug(
  entry: { id: string },
): string {
  return normalizeEntryId(entry.id)
    .replace(/\/index(\.mdx?|\.md)?$/, '')
    .replace(/\.(mdx?|md)$/, '');
}

/** Returns true for the routable index file of a project (index.mdx / index.md). */
export function isMainEntry(entry: CollectionEntry<'projects'>): boolean {
  const normalizedId = normalizeEntryId(entry.id);

  // With Astro loaders, index.mdx often resolves to just the directory slug (no slash).
  if (!normalizedId.includes('/')) return true;

  const fileName = normalizedId.split('/').pop();
  const baseName = fileName?.replace(/\.(mdx?|md)$/, '');
  return baseName === 'index';
}

/**
 * Sort projects: ongoing (no endDate) first by most-recent startDate,
 * then completed by most-recent endDate.
 */
export function sortProjectsOngoingFirst<T extends CollectionEntry<'projects'>>(
  projects: T[],
): T[] {
  return [...projects].sort((a, b) => {
    const aHasEnd = !!a.data.endDate;
    const bHasEnd = !!b.data.endDate;
    if (!aHasEnd && bHasEnd) return -1;
    if (aHasEnd && !bHasEnd) return 1;
    if (!aHasEnd && !bHasEnd) {
      return (
        getSortableDate(b.data.startDate ?? new Date(0)).getTime() -
        getSortableDate(a.data.startDate ?? new Date(0)).getTime()
      );
    }
    return (
      getSortableDate(b.data.endDate ?? new Date(0)).getTime() -
      getSortableDate(a.data.endDate ?? new Date(0)).getTime()
    );
  });
}
