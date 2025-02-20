import * as cheerio from 'cheerio';

export function judgePsnineHtmlError($: cheerio.CheerioAPI) {
  const isError = $('h2.title2').text() === '玩脱了';
  if (isError) {
    return '当前游戏不存在或者服务错误，请稍后再试';
  }
  return null;
}
