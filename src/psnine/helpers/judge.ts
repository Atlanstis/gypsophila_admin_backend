import * as cheerio from 'cheerio';
import { BusinessException } from 'src/core';

/**
 * 判断请求的 gameId 是否能获取到对应内容
 * @param $el Cheerio Element 对象
 * @returns 是否存在
 */
export function judgeGameExist($: cheerio.CheerioAPI) {
  const isExist = $('h2.title2').text() !== '玩脱了';
  if (!isExist) {
    throw new BusinessException('当前游戏不存在或者服务错误，请稍后再试');
  }
}
