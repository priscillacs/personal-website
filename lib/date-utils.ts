/**
 * Format a date string to a more readable format
 * @param {string} dateString - Date string in ISO format (e.g., "2023-01-01")
 * @returns {string} Formatted date string (e.g., "January 1, 2023")
 */
export function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return dateString;

  // Use a fixed format with explicit parts instead of relying on Intl.DateTimeFormat
  const month = date.getMonth() + 1; // getMonth() is 0-indexed
  const day = date.getDate();
  const year = date.getFullYear();

  // Format as M/D/YYYY for consistency
  return `${month}/${day}/${year}`;
}

/**
 * Format a date to relative time (e.g., "2 days ago")
 * @param {string} dateString - Date string in ISO format
 * @returns {string} Relative time string
 */
export function getRelativeTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  if (isNaN(date.getTime())) return dateString;

  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  // If older than a week, return the formatted date
  return formatDate(dateString);
}
