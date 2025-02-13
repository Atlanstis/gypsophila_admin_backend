import * as cheerio from 'cheerio';
import { BusinessException } from 'src/core';
import {
  PsnineGameCrawler,
  PsnineTrophyCrawler,
  PsnineTrophyGroupCrawler,
} from './crawler';

export * from './crawler';

/** 获取上线平台信息 */
export function getPlatformsFromEl(
  $el: cheerio.Cheerio<cheerio.Element>,
  $: cheerio.CheerioAPI,
): PlayStation.Platform[] {
  return $el
    .children('span')
    .toArray()
    .map((el) => $(el).text() as PlayStation.Platform);
}

/** 获取版本信息 */
export function getVersionFromEl($el: cheerio.Cheerio<cheerio.Element>) {
  return $el
    .text()
    .split('\n')
    .filter((v) => v)
    .map((v) => v.trim());
}

/** 获取奖杯数 */
export function getTrophyNumFromEl(
  $el: cheerio.Cheerio<cheerio.Element>,
): PlayStation.TrophyNum {
  return {
    platinum: getTrophyNumFromClassName($el, '.text-platinum'),
    gold: getTrophyNumFromClassName($el, '.text-gold'),
    silver: getTrophyNumFromClassName($el, '.text-silver'),
    bronze: getTrophyNumFromClassName($el, '.text-bronze'),
  };
}

/**
 * 根据类名从 Element 中获取奖杯数
 */
export function getTrophyNumFromClassName(
  $el: cheerio.Cheerio<cheerio.Element>,
  classNanme: string,
) {
  const num = $el.find(classNanme).text().substring(1);
  return num ? Number(num) : 0;
}

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

/** 获取游戏基本信息 */
export function getGameBaseInfo(
  id: number,
  url: string,
  $: cheerio.CheerioAPI,
) {
  const game = new PsnineGameCrawler();
  /** url */
  game.setUrlAndId(url);
  const $mainBox = $('.main .box');
  const $boxFirst = $mainBox.first();
  const $img = $boxFirst.find('img');
  /** 缩略图 */
  game.setThumbnail($img.attr('src'));
  /** 游戏原名 */
  game.setOriginName($img.attr('alt'));
  /** 上线平台 */
  const $next = $img.next();
  game.setPlatforms($next, $);
  /** 版本 */
  game.setVersion($next.find('em'));
  /** 游戏名称 */
  $next.find('span').remove();
  $next.find('em').remove();
  const name = $next.text();
  const regex = /《(.*?)》/;
  const match = name.match(regex);
  if (match) {
    game.setName(match[1]);
  }
  /** 奖杯数量 */
  const $trophy = $next.next();
  game.setTrophy($trophy);
  /** 完美难度 */
  const $perfectDifficulty = $trophy.next();
  game.setPerfectDifficulty(
    $perfectDifficulty.text() as Psnine.PerfectDifficulty,
  );
  /** 完美率 */
  const $perfectRate = $perfectDifficulty.next();
  game.setPerfectRate($perfectRate.text().replace('%完美', ''));
  return game.build();
}

/** 获取游戏奖杯组信息 */
export function getGameTrophyGroups($: cheerio.CheerioAPI) {
  const $trophyGroup = $('table.list');
  const trophyGroup = $trophyGroup
    .map((i, el) => sortTrophyGroup($(el), $))
    .toArray();
  return trophyGroup;
}

/** 整理获取详情奖杯组信息 */
function sortTrophyGroup(
  $el: cheerio.Cheerio<cheerio.Element>,
  $: cheerio.CheerioAPI,
) {
  const trophyGroup = new PsnineTrophyGroupCrawler();
  const $title = $el.find('tr').first();
  /** 奖杯组缩略图 */
  trophyGroup.setThumbnail($title.find('img').attr('src'));
  /** 奖杯组名称 */
  trophyGroup.setName($title.find('p').text());
  /** 奖杯组奖杯数量 */
  const $trophyNum = $title.find('em');
  trophyGroup.setTrophyNum($trophyNum);
  const $trophies = $el.find('tr').slice(1);
  const trophies = $trophies
    .map((ti, tEl) => sortDetailTrophy($(tEl), $))
    .toArray();
  trophyGroup.setTrophies(trophies);
  return trophyGroup.build();
}

/** 整理获取详情奖杯信息 */
function sortDetailTrophy(
  $el: cheerio.Cheerio<cheerio.Element>,
  $: cheerio.CheerioAPI,
) {
  const trophy = new PsnineTrophyCrawler();
  const $children = $el.children();
  // 根据不同的长度执行不同的处理函数
  let arr: ((
    $: cheerio.CheerioAPI,
    trophy: PsnineTrophyCrawler,
    childEl: cheerio.Element,
  ) => void)[] = [];
  if ($children.length === 3) {
    arr = [trophyDetailTd0Sort, trophyDetailTd1Sort, trophyDetailTd3Sort];
  } else if ($children.length === 4) {
    arr = [
      trophyDetailTd0Sort,
      trophyDetailTd1Sort,
      trophyDetailTd2Sort,
      trophyDetailTd3Sort,
    ];
  }
  $children.each(function (ci, childEl) {
    arr[ci]($, trophy, childEl);
  });
  return trophy.build();
}

const trophyDetailTd0Sort = (
  $: cheerio.CheerioAPI,
  trophy: PsnineTrophyCrawler,
  childEl: cheerio.Element,
) => {
  trophy.setType(childEl, $).setThumbnail(childEl, $).setUrlAndId(childEl, $);
};

const trophyDetailTd1Sort = (
  $: cheerio.CheerioAPI,
  trophy: PsnineTrophyCrawler,
  childEl: cheerio.Element,
) => {
  trophy
    .setDescription(childEl, $)
    .setOrder(childEl, $)
    .setName(childEl, $)
    .setTipNum(childEl, $);
};

const trophyDetailTd2Sort = (
  $: cheerio.CheerioAPI,
  trophy: PsnineTrophyCrawler,
  childEl: cheerio.Element,
) => {
  trophy.setCompleteTime(childEl, $);
};

const trophyDetailTd3Sort = (
  $: cheerio.CheerioAPI,
  trophy: PsnineTrophyCrawler,
  childEl: cheerio.Element,
) => {
  trophy.setCompleteRate(childEl, $);
};
