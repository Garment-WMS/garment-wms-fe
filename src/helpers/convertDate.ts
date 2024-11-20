/**
 * Converts an ISO date string to Vietnamese date format (dd/MM/yyyy).
 * @param {string} isoString - The ISO date string to be converted.
 * @returns {string} - The formatted date string in Vietnamese view.
 */
export function convertDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('vi-VN');
}

export function formatDateTimeToDDMMYYYYHHMM(dateString: string): string {
  const date = new Date(dateString);

  // Extract day, month, year, hours, and minutes
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}