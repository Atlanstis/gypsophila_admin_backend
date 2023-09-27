import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PsGame } from 'src/entities/ps-game.entity';
import { getElFromUrl } from 'src/utils/cheerio';
import { Platform, PsTrophy, PsTrophyGroup, PsnineGame } from '../classes/psnine-game';
import { getTrophyNumFromEl, getIdFromUrl } from './helpers';

@Injectable()
export class PsnineService {
  @InjectRepository(PsGame)
  private readonly psGameRepository: Repository<PsGame>;

  /**
   * 获取 PSNINE 上的游戏列表
   * @param page 页码
   * @returns 游戏数据
   */
  async getGameList(page: number) {
    const url = `https://psnine.com/psnid/kiceous/psngame?page=${page}`;
    const $ = await getElFromUrl(url);
    const $page = $('.page').first();
    const totalText = $page.find('.disabled').text().replace('条', '');
    const total = totalText ? Number(totalText) : 0;
    const pages = $page.find('li').length - 1;
    const games = $('table.list')
      .find('tr')
      .map(function (i, el) {
        const game = new PsnineGame();
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
            game.name = $(childEl).find('a').text();
            const $platforms = $(childEl).find('span');
            game.platforms = $platforms
              .map(function (pi, pEl) {
                return $(pEl).text();
              })
              .toArray() as Platform[];
            game.lastTrophyTime = $(childEl).find('small').text();
          }
          if (ci === 2) {
            $(childEl).find('em').remove('em');
            game.usedTime = $(childEl).text();
          }
          if (ci === 3) {
            game.difficulty = $(childEl).find('span').text();
            let perfectRate = $(childEl).find('em').text();
            perfectRate = perfectRate.substring(0, perfectRate.length - 3);
            game.perfectRate = perfectRate ? Number(perfectRate) : 0;
          }
          if (ci === 4) {
            let progress = $(childEl).find('.progress div').text();
            progress = progress.substring(0, progress.length - 1);
            game.progress = progress ? Number(progress) : 0;
            game.trophyGot = {
              platinum: getTrophyNumFromEl($(childEl), '.text-platinum'),
              gold: getTrophyNumFromEl($(childEl), '.text-gold'),
              silver: getTrophyNumFromEl($(childEl), '.text-silver'),
              bronze: getTrophyNumFromEl($(childEl), '.text-bronze'),
            };
          }
        });
        return game;
      })
      .toArray();
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
  async getTrophy(gameId: number) {
    const url = `https://psnine.com/psngame/${gameId}?psnid=kiceous`;
    const $ = await getElFromUrl(url);
    const $trophyGroup = $('table.list');
    const trophyGroup = $trophyGroup
      .map(function (i, el) {
        const trophyGroup = new PsTrophyGroup();
        trophyGroup.gameId = gameId;
        trophyGroup.isDLC = i !== 0;
        const $title = $(el).find('tr').first();
        trophyGroup.thumbnail = $title.find('img').attr('src');
        trophyGroup.name = $title.find('p').text();
        const $trophyNum = $title.find('em');
        trophyGroup.trophyNum = {
          platinum: getTrophyNumFromEl($trophyNum, '.text-platinum'),
          gold: getTrophyNumFromEl($trophyNum, '.text-gold'),
          silver: getTrophyNumFromEl($trophyNum, '.text-silver'),
          bronze: getTrophyNumFromEl($trophyNum, '.text-bronze'),
        };
        const $trophies = $(el).find('tr').slice(1);
        trophyGroup.trophies = $trophies
          .map(function (ti, tEl) {
            const trophy = new PsTrophy();
            const $children = $(tEl).children();
            $children.each(function (ci, childEl) {
              if (ci === 0) {
                const className = $(childEl).attr('class');
                const map = {
                  t1: 'platinum',
                  t2: 'gold',
                  t3: 'silver',
                  t4: 'bronze',
                };
                trophy.trophyType = map[className];
                trophy.thumbnail = $(childEl).find('img').attr('src');
                trophy.trophyId = getIdFromUrl($(childEl).find('a').attr('href'));
              } else if (ci === 1) {
                trophy.description = $(childEl).find('.text-gray').text();
                trophy.order = Number($(childEl).find('.h-p').text().substring(1));
                trophy.name = $(childEl).find('a').text();
              } else if (ci === 2) {
                const $time = $(childEl).find('em');
                trophy.isComplete = !!$time.length;
                if (trophy.isComplete) {
                  const year = $time.attr('tips').slice(0, 4);
                  const timeText = $time.text().trim();
                  const day = timeText.slice(0, 5);
                  const time = timeText.slice(5);
                  trophy.completeTime = `${year} ${day} ${time}`;
                } else {
                  trophy.completeTime = '';
                }
              }
            });
            return trophy;
          })
          .toArray();
        return trophyGroup;
      })
      .toArray();
    return trophyGroup;
  }
}
