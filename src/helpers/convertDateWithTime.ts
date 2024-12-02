export const convertDateWithTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);

    // Format date and time
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return `${formattedTime}, ${formattedDate}`;
  } catch {
    return 'Invalid date';
  }
};
