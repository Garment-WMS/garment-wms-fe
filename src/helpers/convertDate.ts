/**
 * Converts an ISO date string to Vietnamese date format (dd/MM/yyyy).
 * @param {string} isoString - The ISO date string to be converted.
 * @returns {string} - The formatted date string in Vietnamese view.
 */
export function convertDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('vi-VN');
}
