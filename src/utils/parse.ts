export function parseToNumber(str: string): number {
  const parsed = Number(str);
  return isNaN(parsed) ? 0 : parsed;
}
