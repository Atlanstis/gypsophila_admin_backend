import * as dayjs from 'dayjs';

/** 日期格式：年-月-日 */
export const YYYY_MM_DD = 'YYYY-MM-DD';

/** 日期格式：年-月-日 时:分：秒 */
export const YYYY_MM_DD_HH_mm_ss = 'YYYY-MM-DD HH:mm:ss';
/**
 * 获取当前时间所在 pattern 下的开始时间
 * @param pattrn 格式
 * @returns Date 日期
 */
export function startOfNowDate(pattrn: dayjs.OpUnitType = 'day') {
  return startOfDate(new Date(), pattrn);
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

export function startOfDate(date: Date, pattrn: dayjs.OpUnitType = 'day') {
  return dayjs(date).startOf(pattrn).toDate();
}

export function addDay(num: number) {
  return dayjs().add(num, 'day').toDate();
}

export function isValidDate(
  dateString?: string,
  format = YYYY_MM_DD_HH_mm_ss,
): dateString is string {
  if (!dateString) return false;
  // 使用 dayjs 解析字符串，并指定格式
  const date = dayjs(dateString, format);
  // 检查解析结果是否有效
  return date.isValid();
}
