/**
 * 检查两个字符串数组是否有共同的元素。
 * @param arr1 - 第一个字符串数组。
 * @param arr2 - 第二个字符串数组。
 * @returns 如果两个数组有共同的元素，则返回 true；否则返回 false。
 */
export function hasCommonString(arr1: string[], arr2: string[]) {
  const set1 = new Set(arr1);
  return arr2.some((item) => set1.has(item));
}
