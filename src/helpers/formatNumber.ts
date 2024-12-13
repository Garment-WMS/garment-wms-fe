export function formatNumber(value: number | null | undefined): string {
  if (value == null) {
    return 'N/A';
  }
  return value.toLocaleString('en-GB');
}
