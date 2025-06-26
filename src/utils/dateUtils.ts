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
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } else {
      return date.toLocaleDateString();
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

/**
 * Calculates duration between two dates (handles mixed formats)
 * @param startDate - Start date (Date object or YYYY-MM string)
 * @param endDate - End date (Date object or YYYY-MM string)
 * @returns Human-readable duration string
 */
export function calculateDuration(startDate: Date | string, endDate: Date | string): string {
  const start = getSortableDate(startDate);
  const end = getSortableDate(endDate);
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // If either date is month-only, calculate in months
  if (typeof startDate === 'string' || typeof endDate === 'string') {
    const months = Math.round(diffDays / 30);
    if (months === 0) return '< 1 month';
    return `${months} month${months > 1 ? 's' : ''}`;
  }
  
  // For exact dates, calculate more precisely
  const months = Math.floor(diffDays / 30);
  const days = diffDays % 30;
  
  if (months === 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (days === 0) {
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    return `${months} month${months > 1 ? 's' : ''} ${days} day${days > 1 ? 's' : ''}`;
  }
}
