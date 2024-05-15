/**
 * 返回指定位数的小数
 * @param number 处理前的数字
 * @param decimalPlaces 小数位数
 * @returns 指定位数的小数
 */
export function roundToDecimal(number: number, decimalPlaces = 2) {
  if (decimalPlaces < 0) {
    throw new Error('小数位数不能为负数');
  }
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(number * factor) / factor;
}
