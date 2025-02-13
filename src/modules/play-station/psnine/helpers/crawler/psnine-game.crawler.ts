import * as cheerio from 'cheerio';
import { getPlatformsFromEl, getTrophyNumFromEl, getVersionFromEl } from '..';
import { extractLastIdFromUrl } from 'src/utils';

export class PsnineGameCrawler {
  protected gameCrawler: Psnine.GameCrawler;

  constructor() {
    this.gameCrawler = {};
  }

  setName(name?: string) {
    this.gameCrawler.name = name ?? '';
    return this;
  }

  setOriginName(originName?: string) {
    this.gameCrawler.originName = originName ?? '';
    return this;
  }

  setPlatforms($el: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI) {
    this.gameCrawler.platforms = getPlatformsFromEl($el, $);
    return this;
  }

  setThumbnail(thumbnail?: string) {
    this.gameCrawler.thumbnail = thumbnail ?? '';
    return this;
  }

  setUrlAndId(url?: string) {
    if (!url) return;
    this.gameCrawler.url = url;
    const id = extractLastIdFromUrl(url);
    if (id) this.gameCrawler.id = id;
    return this;
  }

  setVersion($el: cheerio.Cheerio<cheerio.Element>) {
    this.gameCrawler.version = $el.is('em') ? getVersionFromEl($el) : [];
    return this;
  }

  setPerfectDifficulty(perfectDifficulty: Psnine.PerfectDifficulty) {
    this.gameCrawler.perfectDifficulty = perfectDifficulty;
    return this;
  }

  setPerfectRate(perfectRate?: string) {
    this.gameCrawler.perfectRate = perfectRate ? Number(perfectRate) : 0;
    return this;
  }

  setTrophy($el: cheerio.Cheerio<cheerio.Element>) {
    const { platinum, gold, silver, bronze } = getTrophyNumFromEl($el);
    this.gameCrawler.platinum = platinum;
    this.gameCrawler.gold = gold;
    this.gameCrawler.silver = silver;
    this.gameCrawler.bronze = bronze;
    return this;
  }

  build() {
    return this.gameCrawler;
  }
}
