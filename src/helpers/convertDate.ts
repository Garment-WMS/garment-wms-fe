/**
 * Converts an ISO date string to Vietnamese date format (dd/MM/yyyy).
 * @param {string} isoString - The ISO date string to be converted.
 * @returns {string} - The formatted date string in Vietnamese view.
 */
export function convertDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString('vi-VN');
}
