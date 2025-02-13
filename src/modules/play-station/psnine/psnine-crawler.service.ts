import { Injectable } from '@nestjs/common';
import { getElFromUrl } from 'src/utils';
import {
  getGameBaseInfo,
  getGameTrophyGroups,
  // getGameBaseInfo,
  judgeGameExist,
  PsnineProfileGameCrawler,
} from './helpers';

@Injectable()
export class PsnineCrawlerService {
  /**
   * 根据 PSN ID 获取用户基本信息
   * @param psnId psnId
   */
  async getProfileDetail(psnId: string) {
    const url = `https://psnine.com/psnid/${psnId}`;
    const $ = await getElFromUrl(url);
    return {
      psnId,
      avatar: $('.psnzz .avabig').attr('src') || '',
    };
  }

  /**
   * 根据 PSN ID 获取用户的游戏列表
   * @param psnId PSN ID
   * @param page 页码
   */
  async getProfileGameList(psnId: string, page: number) {
    const url = `https://psnine.com/psnid/${psnId}/psngame?page=${page}`;
    const $ = await getElFromUrl(url);
    const $page = $('.page').first();
    const totalText = $page.find('.disabled.h-p').text().replace('条', '');
    const totalNumber = totalText ? Number(totalText) : 0;
    const total = isNaN(totalNumber) ? 0 : totalNumber;
    const games = $('table.list')
      .find('tr')
      .map(function (i, el) {
        const game = new PsnineProfileGameCrawler();
        const $children = $(el).children();
        $children.each(function (ci, childEl) {
          if (ci === 0) {
            /** url */
            game.setUrlAndId($(childEl).find('a').attr('href'));
            const $img = $(childEl).find('img');
            /** 缩略图 */
            const thumbnail = $img.attr('src');
            /** 游戏原名 */
            const originName = $img.attr('alt');
            game.setThumbnail(thumbnail).setOriginName(originName);
          }
          if (ci === 1) {
            const $title = $(childEl).find('a');
            /** 游戏名称 */
            game.setName($title.text());
            /** 版本 */
            const $next = $title.next();
            game.setVersion($next);
            /** 平台 */
            game.setPlatforms($(childEl), $);
          }
          if (ci === 3) {
            /** 完美难度 */
            const perfectDifficulty = $(childEl)
              .find('span')
              .text() as Psnine.PerfectDifficulty;
            game.setPerfectDifficulty(perfectDifficulty);
            /** 完美率 */
            let perfectRate = $(childEl).find('em').text();
            perfectRate = perfectRate.substring(0, perfectRate.length - 3);
            game.setPerfectRate(perfectRate);
          }
          if (ci === 4) {
            /** 完成进度 */
            let progress = $(childEl).find('.progress div').text();
            progress = progress.substring(0, progress.length - 1);
            game.setProgress(progress ? Number(progress) : 0);
            /** 获得奖杯数 */
            game.setTrophyGot($(childEl));
          }
        });
        return game.build();
      })
      .toArray();
    return {
      total,
      list: games,
    };
  }

  /**
   * 根据游戏 ID 获取游戏详情，如传入 PSN ID 则同步获取获得奖杯的信息
   * @param gameId 游戏ID
   * @param psnId PSN ID
   */
  async getGameDetail(gameId: number, psnId?: string) {
    const gameUrl = `https://psnine.com/psngame/${gameId}`;
    const url = `${gameUrl}${psnId ? `?psnid=${psnId}` : ''}`;
    const $ = await getElFromUrl(url);
    /** 判断游戏是否存在 */
    judgeGameExist($);
    /** 基本信息 */
    const gameCrawler = getGameBaseInfo(gameId, gameUrl, $);
    /** 奖杯信息 */
    const trophyGroupCrawler = getGameTrophyGroups($);
    return { gameCrawler, trophyGroupCrawler };
  }
}
