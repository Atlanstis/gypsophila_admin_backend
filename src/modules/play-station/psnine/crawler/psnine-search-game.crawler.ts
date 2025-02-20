import { buildUrl, parseToNumber } from 'src/utils';
import * as cheerio from 'cheerio';
import { BaseCrawler } from './base-crawler';
import {
  extractThumbnail,
  extractUrlAndId,
  judgePsnineHtmlError,
  extractName,
  extractVersion,
  extractTrophyNum,
  extractPlatforms,
  extractPerfectDifficulty,
  extractPerfectRate,
  extractPlayers,
} from '../utils';

type Result = ResCommon.TableData<Psnine.SearchGameItem>;

export class PsnineSearchGameCrawler extends BaseCrawler<Result> {
  constructor(title: string, page?: number) {
    super(buildUrl('https://psnine.com/psngame', { title, page }));
  }

  protected parse($: cheerio.CheerioAPI) {
    const $list = $('table tbody').find('tr');
    const list = $list
      .map(function (i, el) {
        const game: Partial<Psnine.SearchGameItem> = {};
        $(el)
          .find('td')
          .each(function (tdI, tdEl) {
            if (tdI === 0) {
              /** 缩略图 */
              game.thumbnail = extractThumbnail($(tdEl).find('img'));
              /** url、id */
              const { url, id } = extractUrlAndId($(tdEl).find('a'));
              game.url = url;
              if (id) game.id = id;
            } else if (tdI === 1) {
              const $title = $(tdEl).find('a');
              /** 游戏名称 */
              game.name = extractName($title);
              /** 版本 */
              const $next = $title.next();
              game.version = extractVersion($next.is('em') ? $next : null);
              /** 奖杯数量 */
              const { platinum, gold, silver, bronze } = extractTrophyNum(
                $(tdEl).find('em'),
              );
              game.platinum = platinum;
              game.gold = gold;
              game.silver = silver;
              game.bronze = bronze;
              /** 上线平台 */
              game.platforms = extractPlatforms($(tdEl).children('span'), $);
            } else if (tdI === 2) {
              /** 完美难度 */
              game.perfectDifficulty = extractPerfectDifficulty(
                $(tdEl).find('span'),
              );
              /** 完美率 */
              game.perfectRate = extractPerfectRate($(tdEl).find('em'));
            } else if (tdI === 3) {
              /** 游玩人数 */
              game.players = extractPlayers($(tdEl));
            }
          });
        return game;
      })
      .toArray() as Psnine.SearchGameItem[];
    const total = parseToNumber($('.page .h-p').text().replace('条', ''));
    return {
      total,
      list,
    };
  }

  protected isHtmlError($: cheerio.CheerioAPI) {
    return judgePsnineHtmlError($);
  }
}
