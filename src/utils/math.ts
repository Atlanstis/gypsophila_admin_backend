/**
 * 将一个数字四舍五入到指定的小数位数。
 *
 * @param number - 要四舍五入的数字。
 * @param decimalPlaces - 要保留的小数位数，默认为 2。
 * @returns 四舍五入后的数字。
 */
export function roundToDecimal(number: number, decimalPlaces = 2) {
  if (decimalPlaces < 0) decimalPlaces = 0;
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(number * factor) / factor;
}
