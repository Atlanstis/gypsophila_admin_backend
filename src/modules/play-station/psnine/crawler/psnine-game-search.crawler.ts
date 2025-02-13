import { buildUrl } from 'src/utils';
import * as cheerio from 'cheerio';
import { PsnineGame } from '../class';

export class PsnineGameSearchCrawler {
  private url: string;
  private $: cheerio.CheerioAPI;
  private error?: string;
  private result: {
    list: PsnineGame[];
    total: number;
  };

  constructor(title: string, page?: number) {
    this.url = buildUrl('https://psnine.com/psngame', { title, page });
  }

  private async load() {
    let htmlText: string;
    try {
      const res = await fetch(this.url);
      htmlText = await res.text();
    } catch (e) {
      this.error = e.message;
      return;
    }
    this.$ = cheerio.load(htmlText);
    this.judgeError();
  }

  private async judgeError() {
    const isError = this.$('h2.title2').text() === '玩脱了';
    if (isError) {
      this.error = '当前游戏不存在或者服务错误，请稍后再试';
    }
  }

  async exec() {
    await this.load();
    if (this.error) return;
    const { $ } = this;
    const $list = $('table tbody').find('tr');
    const list = $list
      .map(function (i, el) {
        const game = new PsnineGame();
        const $tds = $(el).find('td');
        $tds.each(function (tdI, tdEl) {
          if (tdI === 0) {
            /** 缩略图 */
            game.setThumbnail($(tdEl).find('img'));
            /** url、id */
            game.setUrlAndId($(tdEl).find('a'));
          } else if (tdI === 1) {
            const $title = $(tdEl).find('a');
            /** 游戏名称 */
            game.setName($title);
            /** 版本 */
            const $next = $title.next();
            game.setVersion($next.is('em') ? $next : null);
            /** 奖杯数量 */
            game.setTrophyNum($(tdEl).find('em'));
            /** 上线平台 */
            game.setPlatforms($(tdEl).children('span'), $);
          } else if (tdI === 2) {
            /** 完美难度 */
            game.setPerfectDifficulty($(tdEl).find('span'));
            /** 完美率 */
            game.setPerfectRate($(tdEl).find('em'));
          } else if (tdI === 3) {
            /** 游玩人数 */
            game.setPlayers($(tdEl));
          }
        });
        return game;
      })
      .toArray();
    const totalText = Number($('.page .h-p').text().replace('条', ''));
    const total = isNaN(totalText) ? 0 : totalText;
    this.result = {
      list,
      total,
    };
  }

  getResult() {
    return {
      error: this.error,
      data: this.result,
    };
  }
}
