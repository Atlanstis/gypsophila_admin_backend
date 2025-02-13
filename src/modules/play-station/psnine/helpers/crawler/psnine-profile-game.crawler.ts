import * as cheerio from 'cheerio';
import { getTrophyNumFromEl } from '..';
import { PsnineGameCrawler } from './psnine-game.crawler';

export class PsnineProfileGameCrawler extends PsnineGameCrawler {
  protected gameCrawler: Psnine.ProfileGameCrawler;

  constructor() {
    super();
  }

  setProgress(progress: number) {
    this.gameCrawler.progress = progress;
    return this;
  }

  setTrophyGot($el: cheerio.Cheerio<cheerio.Element>) {
    this.gameCrawler.trophyGot = getTrophyNumFromEl($el);
  }

  build() {
    return this.gameCrawler;
  }
}
