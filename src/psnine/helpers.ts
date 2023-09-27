import * as cheerio from 'cheerio';

/**
 * 从 Element 中获取奖杯数
 */
export function getTrophyNumFromEl($el: cheerio.Cheerio<cheerio.Element>, classNanme: string) {
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
