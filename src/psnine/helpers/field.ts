import * as cheerio from 'cheerio';
import BigNumber from 'bignumber.js';
import * as dayjs from 'dayjs';
import { type TrophyNum, type Platform } from '../class';

/** 获取奖杯数 */
export function getTrophyNumFromEl($el: cheerio.Cheerio<cheerio.Element>): TrophyNum {
  return {
    platinum: getTrophyNumFromClassName($el, '.text-platinum'),
    gold: getTrophyNumFromClassName($el, '.text-gold'),
    silver: getTrophyNumFromClassName($el, '.text-silver'),
    bronze: getTrophyNumFromClassName($el, '.text-bronze'),
  };
}

/**
 * 根据类名从 Element 中获取奖杯数
 */
export function getTrophyNumFromClassName(
  $el: cheerio.Cheerio<cheerio.Element>,
  classNanme: string,
) {
  const num = $el.find(classNanme).text().substring(1);
  return num ? Number(num) : 0;
}

/**
 * 从 url 地址中获取 id
 * 满足以下格式的可获取:
 * 例: https://psnine.com/topic/37646
 */
export function getIdFromUrl(url: string) {
  if (url.indexOf('?')) {
    url = url.split('?')[0];
  }
  const id = url.split('/').pop();
  return id ? Number(id) : 0;
}

/** 获取上线平台信息 */
export function getPlatformsFromEl($el: cheerio.Cheerio<cheerio.Element>, $) {
  return $el
    .children('span')
    .toArray()
    .map((el) => $(el).text() as Platform);
}

/** 获取版本信息 */
export function getVersionFromEl($el: cheerio.Cheerio<cheerio.Element>) {
  return $el
    .find('em')
    .text()
    .split('\n')
    .filter((v) => v)
    .map((v) => v.trim());
}

/**
 * 将文本字符串转换为秒
 * @param str 文本
 * @description 例如：'3秒' -> 3; '3分钟' -> 180
 * @returns 秒数
 */
export function getSecordsFromText(str: string) {
  let secords = 0;
  function bigCalc(num: number) {
    return Number(new BigNumber(num).toFixed(0));
  }
  const actions: [(str: string) => RegExpMatchArray, (num: string) => number][] = [
    [(str: string) => str.match(/(\d+\.?\d*)秒/), (num: string) => bigCalc(Number(num) * 1)],
    [(str: string) => str.match(/(\d+\.?\d*)分钟/), (num: string) => bigCalc(Number(num) * 60)],
    [(str: string) => str.match(/(\d+\.?\d*)小时/), (num: string) => bigCalc(Number(num) * 3600)],
    [
      (str: string) => str.match(/(\d+\.?\d*)天/),
      (num: string) => bigCalc(Number(num) * 24 * 3600),
    ],
    [
      (str: string) => str.match(/(\d+\.?\d*)个月/),
      (num: string) => bigCalc(Number(num) * 24 * 3600 * 30),
    ],
    [
      (str: string) => str.match(/(\d+\.?\d*)年/),
      (num: string) => bigCalc(Number(num) * 24 * 3600 * 365),
    ],
  ];
  actions.some((action) => {
    const [matchFn, coverFn] = action;
    const result = matchFn(str);
    if (result) {
      secords = coverFn(result[1]);
      return true;
    } else {
      return false;
    }
  });
  return secords;
}

/**
 * 转换发布时间格式，将 12 小时制，转成 24小时制
 * @description 将 23-03-29 4:34 pm 转换成 2023-03-29 04:34
 * @param time 转换前的格式
 * @returns 转换后的格式
 */
export function coverCompletionTime(time: string) {
  return dayjs(`20${time}`, 'YYYY-MM-DD hh:mm a').format('YYYY-MM-DD HH:mm');
}
