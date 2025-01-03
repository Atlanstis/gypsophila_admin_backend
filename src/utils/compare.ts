/**
 * 判断两个数字数组是否相同（不考虑顺序）
 * @param {number[]} arr1 - 第一个数字数组
 * @param {number[]} arr2 - 第二个数字数组
 * @returns {boolean} - 如果两个数组相同（不考虑顺序），则返回true，否则返回false
 */
export function areArraysEqualUnordered(arr1: number[], arr2: number[]) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  const sortedArr1 = [...arr1].sort((a, b) => a - b);
  const sortedArr2 = [...arr2].sort((a, b) => a - b);
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }
  return true;
}
