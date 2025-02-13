/**
 * 从 URL 中提取最后一个数字作为 ID
 * @param {string} url - 要解析的 URL 字符串
 * @returns {number | null} - 从 URL 中提取的最后一个数字作为 ID，如果提取失败则返回 null
 * @example extractLastIdFromUrl('https://example.com/123/456/37646?me=true'); // 返回 37646
 * @example extractLastIdFromUrl('https://example.com/path/to/56789'); // 返回 56789
 * @example extractLastIdFromUrl('https://example.com/path/to?param=123'); // 返回 null
 */
export function extractLastIdFromUrl(url: string): number | null {
  // 去除 URL 中的查询参数（? 及其后面的内容）
  const sanitizedUrl = url.split('?')[0];
  // 匹配 URL 中的所有数字
  const numbers = sanitizedUrl.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    // 提取最后一个数字并转换为数字类型
    const lastNumber = parseInt(numbers[numbers.length - 1], 10);
    // 检查是否为有效的正整数
    if (!isNaN(lastNumber) && lastNumber > 0) {
      return lastNumber;
    }
  }
  // 如果未找到匹配或 ID 无效，返回 null
  return null;
}
