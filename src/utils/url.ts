/**
 * 构建一个带有查询参数的 URL。
 * @param baseUrl - 基础 URL。
 * @param params - 包含查询参数的对象，键为参数名，值为参数值。
 * @returns - 包含查询参数的完整 URL。
 */
export function buildUrl(
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join('&');

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
