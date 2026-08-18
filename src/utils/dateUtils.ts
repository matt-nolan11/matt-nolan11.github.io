/**
 * Utility functions for handling project dates in different formats
 */

/**
 * Formats a date that can be either a Date object or a YYYY-MM string
 * @param date - Date object or YYYY-MM string
 * @param format - 'full' for full date display, 'short' for month/year only
 * @returns Formatted date string
 */
export function formatProjectDate(date: Date | string, format: 'full' | 'short' = 'full'): string {
  if (typeof date === 'string') {
    // Handle YYYY-MM format
    const [year, month] = date.split('-');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[parseInt(month) - 1];
    return `${monthName} ${year}`;
  } else {
    // Handle full Date object
    if (format === 'short') {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' });
    } else {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
    }
  }
}

/**
 * Gets a sortable date value from either a Date object or YYYY-MM string
 * @param date - Date object or YYYY-MM string
 * @returns Date object for sorting
 */
export function getSortableDate(date: Date | string): Date {
  if (typeof date === 'string') {
    // For YYYY-MM format, use the first day of the month for sorting
    return new Date(`${date}-01`);
  }
  return date;
}

