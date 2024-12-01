export function convertTitleToTitleCase(role: string | undefined | null): string {
  if (!role || typeof role !== 'string') {
    return 'N/A';
  }

  return role
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
