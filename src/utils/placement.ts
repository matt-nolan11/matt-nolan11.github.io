/**
 * Competition placement formatting, shared by any component that shows a
 * result badge (Summary's tournament list, VideoPlaylists cards).
 *
 * Kept in one place so the colour mapping cannot drift between them — a 1st
 * place should look identical wherever it appears on the site.
 */

/** DaisyUI badge class for a placement value. */
export function placementBadgeClass(placement: number | string): string {
  const p = typeof placement === 'number' ? placement : placement.toLowerCase();
  if (p === 1 || (typeof p === 'string' && (p.includes('1st') || p.includes('champion')))) return 'badge-warning';
  if (p === 2 || (typeof p === 'string' && p.includes('2nd'))) return 'badge-silver';
  if (p === 3 || (typeof p === 'string' && p.includes('3rd'))) return 'badge-accent';
  return 'badge-info';
}

/** Formats a numeric placement into ordinal text; strings pass through. */
export function formatPlacement(placement: number | string): string {
  if (typeof placement === 'string') return placement;
  if (placement === 1) return '1st';
  if (placement === 2) return '2nd';
  if (placement === 3) return '3rd';
  return `${placement}th`;
}
