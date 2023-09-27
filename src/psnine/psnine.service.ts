import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as cheerio from 'cheerio';
import { PsGame } from 'src/entities/ps-game.entity';
import { Platform, PsnineGame } from '../classes/psnine-game';
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
    let htmlText: string;
    try {
      const res = await fetch(url);
      htmlText = await res.text();
    } catch (e) {
      throw new HttpException('PSNINE 网址请求失败', 500);
    }
    const $ = cheerio.load(htmlText);
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
}
