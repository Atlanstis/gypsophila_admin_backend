import * as dayjs from 'dayjs';

export const YYYY_MM_DD = 'YYYY-MM-DD';

/**
 * 获取当前时间所在 pattern 下的开始时间
 * @param pattrn 格式
 * @returns Date 日期
 */
export function startOfNowDate(pattrn: dayjs.OpUnitType = 'day') {
  return dayjs().startOf(pattrn).toDate();
}

/**
 * 获取当前时间所在 pattern 下的结束时间
 * @param pattrn 格式
 * @returns Date 日期
 */
export function endOfNowDate(pattrn: dayjs.OpUnitType = 'day') {
  return dayjs().endOf(pattrn).toDate();
}

export function nowDate() {
  return dayjs().toDate();
}
