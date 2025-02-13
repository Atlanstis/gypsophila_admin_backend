import * as cheerio from 'cheerio';
import { extractLastIdFromUrl, parseToNumber } from 'src/utils';

export class PsnineGame implements PsnineM.Game {
  id: number;
  url: string;
  name: string;
  originName: string;
  thumbnail: string;
  platforms: PlayStation.Platform[];
  perfectDifficulty: PsnineM.PerfectDifficulty;
  perfectRate: number;
  players: number;
  version: string[];
  platinum: number;
  gold: number;
  silver: number;
  bronze: number;

  setUrlAndId($el: cheerio.Cheerio<cheerio.Element>) {
    this.url = $el.attr('href') || '';
    if (this.url) {
      const id = extractLastIdFromUrl(this.url);
      if (id) this.id = id;
    }
    return this;
  }

  setName($el: cheerio.Cheerio<cheerio.Element>) {
    this.name = $el.text() || '';
    return this;
  }

  setThumbnail($el: cheerio.Cheerio<cheerio.Element>) {
    this.thumbnail = $el.attr('src') || '';
    return this;
  }

  setPerfectDifficulty($el: cheerio.Cheerio<cheerio.Element>) {
    this.perfectDifficulty = $el.text() as PsnineM.PerfectDifficulty;
    return this;
  }

  setPerfectRate($el: cheerio.Cheerio<cheerio.Element>) {
    this.perfectRate = parseToNumber($el.text().replace('%完美', ''));
    return this;
  }

  setPlayers($el: cheerio.Cheerio<cheerio.Element>) {
    this.players = parseToNumber($el.text().replace('人玩过', ''));
    return this;
  }

  setVersion($el: Util.Nullable<cheerio.Cheerio<cheerio.Element>>) {
    this.version = $el
      ? $el
          .text()
          .split('\n')
          .filter((v) => v)
          .map((v) => v.trim())
      : [];
    return this;
  }

  setPlatforms($el: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI) {
    this.platforms = $el
      .toArray()
      .map((el) => $(el).text() as PlayStation.Platform);
  }

  setTrophyNum($el: cheerio.Cheerio<cheerio.Element>) {
    const { platinum, gold, silver, bronze } = getTrophyNumFromEl($el);
    this.platinum = platinum;
    this.gold = gold;
    this.silver = silver;
    this.bronze = bronze;
  }
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
  return parseToNumber($el.find(classNanme).text().substring(1));
}
