import * as cheerio from 'cheerio';
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
