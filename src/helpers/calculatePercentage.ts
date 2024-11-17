export function calculatePercentage(value: number, total: number) {
  const result = ((value / total) * 100)
  if(isNaN(Number(result)) || result == 0) {
    return 0;
  }
  return result.toFixed(2);
}