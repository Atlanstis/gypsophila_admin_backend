import * as cheerio from 'cheerio';
import { PsnineGame, type PerfectDifficulty, PsTrophyGroup, PsnineTrophy } from '../class';
import { getIdFromUrl, getPlatformsFromEl, getTrophyNumFromEl, getVersionFromEl } from './field';

/** 获取详情基本信息 */
export function getDetailBaseInfo(id: number, url: string, $: cheerio.CheerioAPI) {
  const game = new PsnineGame();
  /** id */
  game.id = id;
  /** url */
  game.url = url;
  const $mainBox = $('.main .box');
  const $boxFirst = $mainBox.first();
  const $img = $boxFirst.find('img');
  /** 缩略图 */
  game.thumbnail = $img.attr('src');
  /** 游戏原名 */
  game.originName = $img.attr('alt');
  /** 上线平台 */
  let $next = $img.next();
  game.platforms = getPlatformsFromEl($next, $);
  /** 版本 */
  game.version = getVersionFromEl($next);
  /** 奖杯数量 */
  $next = $next.next();
  game.trophyNum = getTrophyNumFromEl($next);
  /** 游玩人数 */
  game.players = Number($next.text().split('　')[1].replace('人玩过', ''));
  /** 完美难度 */
  $next = $next.next();
  game.perfectDiffucuity = $next.text() as PerfectDifficulty;
  /** 完美率 */
  $next = $next.next();
  game.perfectRate = Number($next.text().replace('%完美', ''));
  return game;
}

/** 获取详情奖杯组信息 */
export function getDetailTrophyGroups($: cheerio.CheerioAPI) {
  const $trophyGroup = $('table.list');
  const trophyGroup = $trophyGroup
    .map((i, el) => sortDetailTrophyGroup($(el), i, $))
    .toArray<PsTrophyGroup>();
  return trophyGroup;
}

/** 整理获取详情奖杯组信息 */
function sortDetailTrophyGroup(
  $el: cheerio.Cheerio<cheerio.Element>,
  i: number,
  $: cheerio.CheerioAPI,
) {
  const trophyGroup = new PsTrophyGroup();
  /** 是否 DLC */
  trophyGroup.isDLC = i !== 0;
  const $title = $el.find('tr').first();
  /** 奖杯组缩略图 */
  trophyGroup.thumbnail = $title.find('img').attr('src');
  /** 奖杯组名称 */
  trophyGroup.name = $title.find('p').text();
  /** 奖杯组奖杯数量 */
  const $trophyNum = $title.find('em');
  trophyGroup.trophyNum = getTrophyNumFromEl($trophyNum);
  const $trophies = $el.find('tr').slice(1);
  trophyGroup.trophies = $trophies
    .map((ti, tEl) => sortDetailTrophy($(tEl), $))
    .toArray<PsnineTrophy>();
  return trophyGroup;
}

/** 整理获取详情奖杯信息 */
function sortDetailTrophy($el: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI) {
  const trophy = new PsnineTrophy();
  const $children = $el.children();
  $children.each(function (ci, childEl) {
    if (ci === 0) {
      /** 奖杯类型 */
      const className = $(childEl).attr('class');
      const map = {
        t1: 'platinum',
        t2: 'gold',
        t3: 'silver',
        t4: 'bronze',
      };
      trophy.trophyType = map[className];
      /** 奖杯缩略图 */
      trophy.thumbnail = $(childEl).find('img').attr('src');
      /** psnine 奖杯 Id */
      trophy.psnineId = getIdFromUrl($(childEl).find('a').attr('href'));
    } else if (ci === 1) {
      /** 奖杯描述 */
      trophy.description = $(childEl).find('.text-gray').text();
      /** 奖杯顺序 */
      trophy.order = Number($(childEl).find('.h-p').text().substring(1));
      /** 奖杯名称 */
      trophy.name = $(childEl).find('a').text();
      /** 提示数量 */
      const $tipNum = $(childEl).find('.alert-success');
      if ($tipNum.length > 0) {
        const text = $(childEl).find('.alert-success').text().replace(' Tips', '');
        trophy.tipNums = Number(text);
      } else {
        trophy.tipNums = 0;
      }
    } else if (ci === 2) {
      /** 奖杯完成率 */
      $(childEl).find('em').remove('em');
      trophy.complateRate = Number($(childEl).text().replace('%', ''));
    }
  });
  return trophy;
}
