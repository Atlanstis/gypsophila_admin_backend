import { Injectable } from '@nestjs/common';
import { getElFromUrl } from 'src/utils/cheerio';
import {
  type PerfectDifficulty,
  type Platform,
  PsnineSearchGame,
  PsnineGameTopic,
  PsnineGameRank,
  PsnineSyncGame,
} from './class';
import {
  getDetailTrophyGroups,
  getIdFromUrl,
  getDetailBaseInfo,
  getTrophyNumFromEl,
  judgeGameExist,
  getSecordsFromText,
  coverCompletionTime,
} from './helpers';
import { BusinessException } from 'src/core';

@Injectable()
export class PsnineService {
  /**
   * 获取 psnId 已在 PSNINE 上同步过的游戏列表
   * @param psnId psnId
   * @param page 页码
   * @returns 游戏数据
   */
  async getPsnineUserGame(psnId: string, page: number) {
    const url = `https://psnine.com/psnid/${psnId}/psngame?page=${page}`;
    const $ = await getElFromUrl(url);
    const $page = $('.page').first();
    const totalText = $page.find('.disabled').text().replace('条', '');
    const total = totalText ? Number(totalText) : 0;
    const pages = $page.find('li').length - 1;
    const games = $('table.list')
      .find('tr')
      .map(function (i, el) {
        const game = new PsnineSyncGame();
        const $children = $(el).children();
        $children.each(function (ci, childEl) {
          if (ci === 0) {
            game.url = $(childEl).find('a').attr('href');
            game.id = getIdFromUrl(game.url);
            const $img = $(childEl).find('img');
            game.thumbnail = $img.attr('src');
            game.originName = $img.attr('alt');
          }
          if (ci === 1) {
            const $title = $(childEl).find('a');
            /** 游戏名称 */
            game.name = $title.text();
            /** 版本 */
            const $next = $title.next();
            game.version = $next.is('em')
              ? $next
                  .text()
                  .split('\n')
                  .filter((v) => v)
                  .map((v) => v.trim())
              : [];
            const $platforms = $(childEl).find('span');
            game.platforms = $platforms
              .map(function (pi, pEl) {
                return $(pEl).text() as Platform;
              })
              .toArray<Platform>();
            game.lastTrophyTime = $(childEl).find('small').text();
          }
          if (ci === 2) {
            $(childEl).find('em').remove('em');
            game.usedTime = $(childEl).text();
          }
          if (ci === 3) {
            game.perfectDiffucuity = $(childEl).find('span').text() as PerfectDifficulty;
            let perfectRate = $(childEl).find('em').text();
            perfectRate = perfectRate.substring(0, perfectRate.length - 3);
            game.perfectRate = perfectRate ? Number(perfectRate) : 0;
          }
          if (ci === 4) {
            let progress = $(childEl).find('.progress div').text();
            progress = progress.substring(0, progress.length - 1);
            game.progress = progress ? Number(progress) : 0;
            game.trophyGot = getTrophyNumFromEl($(childEl));
          }
        });
        return game;
      })
      .toArray<PsnineSyncGame>();
    return {
      total,
      pages,
      list: games,
    };
  }

  /**
   * 获取奖杯信息
   * @param gameId 游戏 id
   * @returns 奖杯信息
   */
  // async getGameTrophy(gameId: number) {
  //   const url = `https://psnine.com/psngame/${gameId}?psnid=kiceous`;
  //   const $ = await getElFromUrl(url);
  //   const $trophyGroup = $('table.list');
  //   const trophyGroup = $trophyGroup
  //     .map(function (i, el) {
  //       const trophyGroup = new PsTrophyGroup();
  //       trophyGroup.gameId = gameId;
  //       trophyGroup.isDLC = i !== 0;
  //       const $title = $(el).find('tr').first();
  //       trophyGroup.thumbnail = $title.find('img').attr('src');
  //       trophyGroup.name = $title.find('p').text();
  //       const $trophyNum = $title.find('em');
  //       trophyGroup.trophyNum = getTrophyNumFromEl($trophyNum);
  //       const $trophies = $(el).find('tr').slice(1);
  //       trophyGroup.trophies = $trophies
  //         .map(function (ti, tEl) {
  //           const trophy = new PsTrophy();
  //           const $children = $(tEl).children();
  //           $children.each(function (ci, childEl) {
  //             if (ci === 0) {
  //               const className = $(childEl).attr('class');
  //               const map = {
  //                 t1: 'platinum',
  //                 t2: 'gold',
  //                 t3: 'silver',
  //                 t4: 'bronze',
  //               };
  //               trophy.trophyType = map[className];
  //               trophy.thumbnail = $(childEl).find('img').attr('src');
  //               trophy.trophyId = getIdFromUrl($(childEl).find('a').attr('href'));
  //             } else if (ci === 1) {
  //               trophy.description = $(childEl).find('.text-gray').text();
  //               trophy.order = Number($(childEl).find('.h-p').text().substring(1));
  //               trophy.name = $(childEl).find('a').text();
  //             } else if (ci === 2) {
  //               const $time = $(childEl).find('em');
  //               trophy.isComplete = !!$time.length;
  //               if (trophy.isComplete) {
  //                 const year = $time.attr('tips').slice(0, 4);
  //                 const timeText = $time.text().trim();
  //                 const day = timeText.slice(0, 5);
  //                 const time = timeText.slice(5);
  //                 trophy.completeTime = `${year} ${day} ${time}`;
  //               } else {
  //                 trophy.completeTime = '';
  //               }
  //             }
  //           });
  //           return trophy;
  //         })
  //         .toArray<PsTrophy>();
  //       return trophyGroup;
  //     })
  //     .toArray<PsTrophyGroup>();
  //   return trophyGroup;
  // }

  /**
   * 获取游戏主题
   * @param gameId 游戏 id
   * @returns 游戏主题信息
   */
  async getGameTopic(gameId: number) {
    const url = `https://psnine.com/psngame/${gameId}/topic`;
    const $ = await getElFromUrl(url);
    /** 判断游戏是否存在 */
    judgeGameExist($);
    const $TopicList = $('.box .list li');
    const list = $TopicList
      .map(function (i, el) {
        const topic = new PsnineGameTopic();
        topic.title = $(el).find('.title a').text();
        topic.url = $(el).find('.title a').attr('href');
        topic.id = getIdFromUrl(topic.url);
        const $meta = $(el).find('.meta');
        $meta.find('a').remove();
        const publicationTime = $meta
          .text()
          .replace(/\n|[ ]+/g, '')
          .trim();
        topic.publicationTime = `${publicationTime.slice(0, 10)} ${publicationTime.slice(10, 15)}`;
        topic.discussTimes = Number($(el).find('.rep.r').text());
        return topic;
      })
      .toArray<PsnineGameTopic>();
    const totalText = $('.page .disabled a').text().replace('条', '');
    return {
      list,
      total: Number(totalText),
    };
  }

  /**
   * 获取游戏游玩排名信息
   * @param id 游戏 id
   * @param page 页码
   * @returns 排名信息
   */
  async getGameRank(id: number, page: number) {
    let url = `https://psnine.com/psngame/${id}/rank`;
    if (page) {
      url += `?page=${page}`;
    }
    const $ = await getElFromUrl(url);
    /** 判断游戏是否存在 */
    judgeGameExist($);
    const $ranks = $('table.list').find('tr');
    const list = $ranks
      .map(function (i, el) {
        const psGameRank = new PsnineGameRank();
        const $tds = $(el).find('td');
        $tds.each(function (tdI, tdEl) {
          if (tdI === 0) {
            /** 排名顺序 */
            psGameRank.index = Number($(tdEl).find('strong').text());
          } else if (tdI === 2) {
            /** 完成时间 */
            psGameRank.completionTime = coverCompletionTime($(tdEl).find('em').text());
          } else if (tdI === 3) {
            /** 使用时间 */
            $(tdEl).find('em').remove('em');
            const usedTime = $(tdEl).text();
            psGameRank.usedTime = usedTime;
            if (usedTime) {
              psGameRank.usedSecords = getSecordsFromText(usedTime);
            }
          } else if (tdI === 4) {
            /** 完成进度 */
            psGameRank.completionRate = Number($(tdEl).find('.progress').text().replace('%', ''));
          }
        });
        return psGameRank;
      })
      .toArray<PsnineGameRank>();
    const total = Number($('.page .disabled.h-p').text().replace('条', ''));
    return {
      list,
      total,
    };
  }

  /**
   * PSNINE 游戏搜索
   * @param keyword 搜索关键字
   * @param page 查询页码
   * @returns 页面数据
   */
  async gameSearch(keyword: string, page?: number) {
    let url = `https://psnine.com/psngame?title=${keyword}`;
    if (page) {
      url += `&page=${page}`;
    }
    const $ = await getElFromUrl(url);
    const $list = $('table tbody').find('tr');
    const list = $list
      .map(function (i, el) {
        const game = new PsnineSearchGame();
        const $tds = $(el).find('td');
        $tds.each(function (tdI, tdEl) {
          if (tdI === 0) {
            /** 缩略图 */
            game.thumbnail = $(tdEl).find('img').attr('src');
            /** url */
            game.url = $(tdEl).find('a').attr('href');
            /** id */
            game.id = getIdFromUrl(game.url);
          } else if (tdI === 1) {
            const $title = $(tdEl).find('a');
            /** 游戏名称 */
            game.name = $title.text();
            /** 版本 */
            const $next = $title.next();
            game.version = $next.is('em')
              ? $next
                  .text()
                  .split('\n')
                  .filter((v) => v)
                  .map((v) => v.trim())
              : [];
            /** 奖杯数量 */
            game.trophyNum = getTrophyNumFromEl($(tdEl).find('em'));
            game.platforms = $(tdEl)
              .children('span')
              .toArray()
              .map((el) => $(el).text() as Platform);
          } else if (tdI === 2) {
            /** 完美难度 */
            game.perfectDiffucuity = $(tdEl).find('span').text() as PerfectDifficulty;
            /** 完美率 */
            game.perfectRate = Number($(tdEl).find('em').text().replace('%完美', ''));
          } else if (tdI === 3) {
            /** 游玩人数 */
            game.players = Number($(tdEl).text().replace('人玩过', ''));
          }
        });
        return game;
      })
      .toArray<PsnineSearchGame>();
    const total = Number($('.page .h-p').text().replace('条', ''));
    return {
      list,
      total,
    };
  }

  /**
   * PSNINE 游戏详情
   * @param id psnine 游戏 ID
   */
  async gameDetail(id: number) {
    const url = `https://psnine.com/psngame/${id}`;
    const $ = await getElFromUrl(url);
    /** 判断游戏是否存在 */
    judgeGameExist($);
    /** 基本信息 */
    const game = getDetailBaseInfo(id, url, $);
    /** 奖杯信息 */
    game.trophyGroup = getDetailTrophyGroups($);
    return game;
  }

  /**
   * 根据 psnId 获取用户基本信息
   * @param psnId psnId
   */
  async getProfileDetail(psnId: string) {
    const url = `https://psnine.com/psnid/${psnId}`;
    try {
      const $ = await getElFromUrl(url);
      return {
        psnId,
        avatar: $('.psnzz .avabig').attr('src'),
      };
    } catch {
      throw new BusinessException('当前 psnId 不存在');
    }
  }
}
