/**
 * Converts an ISO date string to Vietnamese date format (dd/MM/yyyy).
 * @param {string} isoString - The ISO date string to be converted.
 * @returns {string} - The formatted date string in Vietnamese view.
 */
export function convertDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero, months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
