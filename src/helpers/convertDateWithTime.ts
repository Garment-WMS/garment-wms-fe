export const convertDateWithTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);

    // Format date and time
    const formattedDate = date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const formattedTime = date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return `${formattedTime}, ${formattedDate}`;
  } catch {
    return 'Invalid date';
  }
};
