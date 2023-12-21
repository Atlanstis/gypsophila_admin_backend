import * as cheerio from 'cheerio';
import type { TrophyNum } from './class';

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
 * 从 url 地址中，获取游戏 id
 */
export function getIdFromUrl(url: string) {
  if (url.indexOf('?')) {
    url = url.split('?')[0];
  }
  const id = url.split('/').pop();
  return id ? Number(id) : 0;
}
