import * as cheerio from 'cheerio';
import { getTrophyNumFromEl } from '..';

export class PsnineTrophyGroupCrawler {
  private trophyGroupCrawler: Psnine.TrophyGroupCrawler;

  constructor() {
    this.trophyGroupCrawler = {};
  }

  /** 设置名称 */
  setName(name?: string) {
    this.trophyGroupCrawler.name = name;
    return this;
  }

  /** 设置缩略图 */
  setThumbnail(thumbnail?: string) {
    this.trophyGroupCrawler.thumbnail = thumbnail;
    return this;
  }

  /** 设置奖杯数量 */
  setTrophyNum($el: cheerio.Cheerio<cheerio.Element>) {
    const { platinum, gold, silver, bronze } = getTrophyNumFromEl($el);
    this.trophyGroupCrawler.platinum = platinum;
    this.trophyGroupCrawler.gold = gold;
    this.trophyGroupCrawler.silver = silver;
    this.trophyGroupCrawler.bronze = bronze;
    return this;
  }

  setTrophies(trophies: Psnine.TrophyCrawler[]) {
    this.trophyGroupCrawler.trophies = trophies;
  }

  build() {
    return this.trophyGroupCrawler;
  }
}
