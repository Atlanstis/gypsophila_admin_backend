import { buildUrl, parseToNumber } from 'src/utils';
import * as cheerio from 'cheerio';
import { BaseCrawler } from './base-crawler';
import { judgePsnineHtmlError } from '../utils';
import {
  extractUrlAndId,
  extractThumbnail,
  extractOriginName,
  extractName,
  extractVersion,
  extractPlatforms,
  extractPerfectDifficulty,
  extractPerfectRate,
  extractProgress,
  extractTrophyNum,
} from '../utils/extract';

type Result = ResCommon.TableData<Psnine.ProfileGameItem>;

export class PsnineProfileGameListCrawler extends BaseCrawler<Result> {
  constructor(psnId: string, page?: number) {
    super(buildUrl(`https://psnine.com/psnid/${psnId}/psngame`, { page }));
  }

  protected parse($: cheerio.CheerioAPI) {
    const $page = $('.page').first();
    const total = parseToNumber(
      $page.find('.disabled.h-p').text().replace('条', ''),
    );
    const list = $('table.list')
      .find('tr')
      .map(function (i, el) {
        const game: Partial<Psnine.ProfileGameItem> = {};
        const $children = $(el).children();
        $children.each(function (ci, childEl) {
          if (ci === 0) {
            const $url = $(childEl).find('a');
            const $img = $(childEl).find('img');
            const { url, id } = extractUrlAndId($url);
            game.url = url;
            if (id) {
              game.id = id;
            }
            game.thumbnail = extractThumbnail($img);
            game.originName = extractOriginName($img);
          }
          if (ci === 1) {
            const $title = $(childEl).find('a');
            /** 游戏名称 */
            game.name = extractName($title);
            /** 版本 */
            const $next = $title.next();
            game.version = extractVersion($next.is('em') ? $next : null);
            /** 平台 */
            game.platforms = extractPlatforms($(childEl).children('span'), $);
          }
          if (ci === 3) {
            /** 完美难度 */
            game.perfectDifficulty = extractPerfectDifficulty(
              $(childEl).find('span'),
            );
            /** 完美率 */
            game.perfectRate = extractPerfectRate($(childEl).find('em'));
          }
          if (ci === 4) {
            /** 完成进度 */
            game.progress = extractProgress($(childEl).find('.progress div'));
            /** 获得奖杯数 */
            /** 奖杯数量 */
            const { platinum, gold, silver, bronze } = extractTrophyNum(
              $(childEl).find('small.h-p'),
            );
            game.platinum = platinum;
            game.gold = gold;
            game.silver = silver;
            game.bronze = bronze;
          }
        });
        return game;
      })
      .toArray() as Psnine.ProfileGameItem[];
    return {
      total,
      list,
    };
  }

  protected isHtmlError($: cheerio.CheerioAPI) {
    return judgePsnineHtmlError($);
  }
}
